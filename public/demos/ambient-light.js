const ambientSampler = document.createElement("canvas");
ambientSampler.width = 1;
ambientSampler.height = 1;

const ambientContext = ambientSampler.getContext("2d", { willReadFrequently: true });
const targetOrigin = window.location.origin === "null" ? "*" : window.location.origin;
let ambientColor = { red: 34, green: 211, blue: 238 };
let failedReads = 0;
let lastGpuTexture = null;
let lastGpuCanvas = null;
let lastGpuFormat = "";
let lastGpuSampleAt = 0;
let gpuSamplePending = false;

function postAmbientColor(red, green, blue) {
  ambientColor = {
    red: Math.round(ambientColor.red * 0.7 + red * 0.3),
    green: Math.round(ambientColor.green * 0.7 + green * 0.3),
    blue: Math.round(ambientColor.blue * 0.7 + blue * 0.3),
  };

  window.parent?.postMessage(
    {
      type: "ada-demo-ambient",
      color: [ambientColor.red, ambientColor.green, ambientColor.blue],
      source: window.location.pathname,
    },
    targetOrigin,
  );
}

function sampleAmbientColor() {
  const canvas = document.querySelector("canvas");
  if (!ambientContext || !canvas || canvas.width <= 0 || canvas.height <= 0) {
    window.setTimeout(sampleAmbientColor, 250);
    return;
  }

  try {
    const sampleX = Math.max(0, Math.floor(canvas.width * 0.5));
    const sampleY = Math.max(0, Math.floor(canvas.height * 0.42));
    ambientContext.clearRect(0, 0, 1, 1);
    ambientContext.drawImage(canvas, sampleX, sampleY, 1, 1, 0, 0, 1, 1);

    const [red, green, blue, alpha] = ambientContext.getImageData(0, 0, 1, 1).data;
    if (alpha > 0 && red + green + blue > 8) {
      failedReads = 0;
      postAmbientColor(red, green, blue);
    }
  } catch {
    failedReads += 1;
  }

  window.setTimeout(sampleAmbientColor, failedReads > 6 ? 1200 : 450);
}

function installWebGPUSampler() {
  if (!("GPUCanvasContext" in window) || !("GPUQueue" in window)) return;
  if (!window.GPUTextureUsage || !window.GPUBufferUsage || !window.GPUMapMode) return;

  lastGpuFormat = navigator.gpu?.getPreferredCanvasFormat?.() ?? lastGpuFormat;
  const originalConfigure = window.GPUCanvasContext.prototype.configure;
  const originalGetCurrentTexture = window.GPUCanvasContext.prototype.getCurrentTexture;
  const originalSubmit = window.GPUQueue.prototype.submit;

  window.GPUCanvasContext.prototype.configure = function configureWithCopySource(configuration) {
    lastGpuCanvas = this.canvas;
    lastGpuFormat = configuration?.format ?? lastGpuFormat;
    if (configuration) {
      configuration.usage = (configuration.usage ?? window.GPUTextureUsage.RENDER_ATTACHMENT) | window.GPUTextureUsage.COPY_SRC;
    }
    return originalConfigure.call(this, configuration);
  };

  window.GPUCanvasContext.prototype.getCurrentTexture = function getCurrentTextureForAmbient() {
    const texture = originalGetCurrentTexture.call(this);
    lastGpuCanvas = this.canvas;
    lastGpuTexture = texture;
    return texture;
  };

  window.GPUQueue.prototype.submit = function submitWithAmbientSample(commandBuffers) {
    const device = window.__adaWebGPUDevice;
    const now = performance.now();
    let sampleBuffer = null;
    let nextCommandBuffers = commandBuffers;

    if (
      device &&
      lastGpuTexture &&
      lastGpuCanvas &&
      lastGpuCanvas.width > 0 &&
      lastGpuCanvas.height > 0 &&
      !gpuSamplePending &&
      now - lastGpuSampleAt > 450
    ) {
      try {
        const sampleX = Math.max(0, Math.floor(lastGpuCanvas.width * 0.5));
        const sampleY = Math.max(0, Math.floor(lastGpuCanvas.height * 0.42));
        sampleBuffer = device.createBuffer({
          size: 256,
          usage: window.GPUBufferUsage.COPY_DST | window.GPUBufferUsage.MAP_READ,
        });

        const encoder = device.createCommandEncoder();
        encoder.copyTextureToBuffer(
          { texture: lastGpuTexture, origin: { x: sampleX, y: sampleY } },
          { buffer: sampleBuffer, bytesPerRow: 256, rowsPerImage: 1 },
          { width: 1, height: 1, depthOrArrayLayers: 1 },
        );
        nextCommandBuffers = [...commandBuffers, encoder.finish()];
        gpuSamplePending = true;
        lastGpuSampleAt = now;
      } catch {
        sampleBuffer?.destroy?.();
        sampleBuffer = null;
      }
    }

    const result = originalSubmit.call(this, nextCommandBuffers);

    if (sampleBuffer) {
      sampleBuffer
        .mapAsync(window.GPUMapMode.READ)
        .then(() => {
          const bytes = new Uint8Array(sampleBuffer.getMappedRange());
          const isBgra = !lastGpuFormat || lastGpuFormat.toLowerCase().includes("bgra");
          const red = isBgra ? bytes[2] : bytes[0];
          const green = bytes[1];
          const blue = isBgra ? bytes[0] : bytes[2];
          const alpha = bytes[3];
          if (alpha > 0 && red + green + blue > 8) {
            failedReads = 0;
            postAmbientColor(red, green, blue);
          }
        })
        .catch(() => {
          failedReads += 1;
        })
        .finally(() => {
          sampleBuffer?.unmap?.();
          sampleBuffer?.destroy?.();
          gpuSamplePending = false;
        });
    }

    return result;
  };
}

if (window.parent && window.parent !== window) {
  installWebGPUSampler();
  window.setTimeout(sampleAmbientColor, 500);
}
