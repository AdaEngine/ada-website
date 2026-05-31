import { WASI, File, OpenFile, ConsoleStdout, PreopenDirectory, Directory } from "./browser-wasi-shim/dist/index.js";
import { createInstantiator } from "./bridge-js.js";
import { SwiftRuntime } from "./runtime.mjs";

const loader = document.getElementById("ada-loader");
const loaderStatus = document.getElementById("ada-loader-status");
const loaderProgress = document.getElementById("ada-loader-progress");
const loaderPercent = document.getElementById("ada-loader-percent");
let lastProgress = 0;

function updateLoader(progress, status, options = {}) {
  const nextProgress = Math.max(lastProgress, Math.min(100, Math.round(progress)));
  lastProgress = nextProgress;
  if (loaderStatus && status) loaderStatus.textContent = status;
  if (loaderProgress) {
    loaderProgress.dataset.indeterminate = options.indeterminate ? "true" : "false";
    loaderProgress.style.width = `${Math.max(4, nextProgress)}%`;
  }
  if (loaderPercent) loaderPercent.textContent = `${nextProgress}%`;
}

function hideLoader() {
  updateLoader(100, "Launching…");
  requestAnimationFrame(() => {
    loader?.setAttribute("data-state", "hidden");
    setTimeout(() => loader?.remove(), 320);
  });
}

function failLoader(error) {
  console.error(error);
  loader?.setAttribute("data-state", "error");
  updateLoader(100, "Failed to start. See console for details.");
}

async function fetchArrayBufferWithProgress(url, start, end, status) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  const contentLength = Number(response.headers.get("content-length"));
  if (!response.body || !Number.isFinite(contentLength) || contentLength <= 0) {
    updateLoader(start, status, { indeterminate: true });
    const buffer = await response.arrayBuffer();
    updateLoader(end, status);
    return buffer;
  }

  const reader = response.body.getReader();
  const chunks = [];
  let received = 0;
  updateLoader(start, status);
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.byteLength;
    updateLoader(start + ((end - start) * received / contentLength), status);
  }

  const bytes = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  updateLoader(end, status);
  return bytes.buffer;
}

async function run() {
  updateLoader(2, "Loading WebAssembly…", { indeterminate: true });
  const wasmURL = new URL("./WGSLExample.wasm", import.meta.url);
  const wasmBytes = await fetchArrayBufferWithProgress(wasmURL, 5, 48, "Loading WebAssembly…");
  updateLoader(52, "Preparing Swift runtime…");
  const swift = new SwiftRuntime();

  if (!navigator.gpu) {
    throw new Error("WebGPU is not supported in this browser.");
  }
  updateLoader(58, "Requesting WebGPU adapter…");
  const adapter = await navigator.gpu.requestAdapter({ powerPreference: "high-performance" });
  if (!adapter) {
    throw new Error("Failed to acquire WebGPU adapter.");
  }
  const optionalFeatures = ["float32-filterable"];
  const requiredFeatures = optionalFeatures.filter((feature) => adapter.features.has(feature));
  updateLoader(64, "Creating WebGPU device…");
  const device = await adapter.requestDevice({ requiredFeatures });
  globalThis.__adaWebGPUAdapter = adapter;
  globalThis.__adaWebGPUDevice = device;

  async function makeResourcePreopenDirectories() {
    updateLoader(68, "Loading resources…");
    const response = await fetch(new URL("./ada-resource-manifest.json", import.meta.url));
    const manifest = response.ok ? await response.json() : [];
    installResourceFetchResolver(manifest);
    const root = new Map();

    let loadedResources = 0;
    for (const entry of manifest) {
      const parts = entry.path.split("/").filter(Boolean);
      let directory = root;
      for (const part of parts.slice(0, -1)) {
        let child = directory.get(part);
        if (!(child instanceof Map)) {
          child = new Map();
          directory.set(part, child);
        }
        directory = child;
      }

      const bytes = new Uint8Array(await (await fetch(new URL(entry.url, import.meta.url))).arrayBuffer());
      directory.set(parts[parts.length - 1], new File(bytes, { readonly: true }));
      loadedResources += 1;
      updateLoader(68 + (manifest.length > 0 ? (10 * loadedResources / manifest.length) : 10), "Loading resources…");
    }

    const materialize = (map) => new Directory(
      [...map.entries()].map(([name, value]) => [name, value instanceof Map ? materialize(value) : value])
    );
    const rootEntries = () => [...root.entries()].map(([name, value]) => [name, value instanceof Map ? materialize(value) : value]);
    return [
      new PreopenDirectory("/", rootEntries()),
      new PreopenDirectory(".", rootEntries()),
    ];
  }

  function installResourceFetchResolver(manifest) {
    const originalFetch = globalThis.fetch?.bind(globalThis);
    if (!originalFetch || globalThis.__adaResourceFetchResolverInstalled) return;

    const resourceURLsByPath = new Map();
    for (const entry of manifest) {
      if (!entry || typeof entry.path !== "string" || typeof entry.url !== "string") continue;
      const resourceURL = new URL(entry.url, import.meta.url).href;
      const relativePath = entry.path.replace(/^\/+/, "");
      resourceURLsByPath.set(entry.path, resourceURL);
      resourceURLsByPath.set(relativePath, resourceURL);
      resourceURLsByPath.set(`/${relativePath}`, resourceURL);
      resourceURLsByPath.set(`./${relativePath}`, resourceURL);
    }

    const resolveResourceURL = (input) => {
      const rawURL = typeof input === "string" || input instanceof URL ? String(input) : input?.url;
      if (!rawURL) return null;
      if (resourceURLsByPath.has(rawURL)) return resourceURLsByPath.get(rawURL);
      const pathname = new URL(rawURL, import.meta.url).pathname.replace(/^\/+/, "");
      if (resourceURLsByPath.has(pathname)) return resourceURLsByPath.get(pathname);
      for (const [resourcePath, resourceURL] of resourceURLsByPath) {
        if (pathname.endsWith(resourcePath.replace(/^\/+/, ""))) return resourceURL;
      }
      return null;
    };

    globalThis.fetch = (input, init) => {
      const resourceURL = resolveResourceURL(input);
      if (resourceURL) {
        return originalFetch(resourceURL, init);
      }
      return originalFetch(input, init);
    };
    globalThis.__adaResourceFetchResolverInstalled = true;
  }

  const resourcePreopens = await makeResourcePreopenDirectories();
  updateLoader(82, "Configuring WASI…");
  const wasi = new WASI(["WGSLExample.wasm"], [], [
    new OpenFile(new File([])),
    ConsoleStdout.lineBuffered((line) => console.log(line)),
    ConsoleStdout.lineBuffered((line) => console.warn(line)),
    ...resourcePreopens,
  ], { debug: false });
  const importObject = {
    wasi_snapshot_preview1: wasi.wasiImport,
    javascript_kit: swift.wasmImports,
  };
  updateLoader(86, "Preparing JavaScript bridge…");
  const bridgeJS = await createInstantiator({}, swift);
  bridgeJS.addImports(importObject, {});
  let wasmInstance;
  const i64Stack = [];
  const typedArrayStack = [];
  const typedArrayConstructors = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array];
  importObject.bjs.swift_js_push_i64 ??= (value) => {
    i64Stack.push(value);
  };
  importObject.bjs.swift_js_pop_i64 ??= () => i64Stack.pop();
  importObject.bjs.swift_js_push_typed_array ??= (kind, pointer, count) => {
    const constructor = typedArrayConstructors[kind];
    const byteLength = count * constructor.BYTES_PER_ELEMENT;
    const copy = wasmInstance.exports.memory.buffer.slice(pointer, pointer + byteLength);
    typedArrayStack.push(Array.from(new constructor(copy)));
  };

  updateLoader(90, "Instantiating WebAssembly…", { indeterminate: true });
  const { instance } = await WebAssembly.instantiate(wasmBytes, importObject);
  wasmInstance = instance;

  updateLoader(96, "Starting AdaEngine…");
  swift.setInstance(instance);
  bridgeJS.setInstance(instance);
  bridgeJS.createExports(instance);
  wasi.initialize(instance);
  swift.main();
  hideLoader();
}

run().catch(failLoader);