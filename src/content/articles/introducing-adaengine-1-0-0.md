---
title: "AdaEngine 1.0.0: From an Engine to a Game Development Environment"
slug: "introducing-adaengine-1-0-0"
description: "A new Ada Studio with AI agents and A2UI, AdaScript with AOT, native Android support, multiplayer, expanded 3D rendering, and Ada Cloud — what is new in AdaEngine 1.0.0."
date: "2026-10-11"
author: "SpectralDragon"
tags:
  - release
image: images/articles/ada-engine-release-1-0-0-visionos-designed.png
published: true
featured: true
---

![AdaEngine 1.0.0 release cover](images/articles/ada-engine-release-1-0-0-visionos-designed.png "AdaEngine 1.0.0 — Ada Studio in a spatial workspace.")

We are introducing **AdaEngine 1.0.0**, a major update to our open-source game engine built with Swift.

Our first public release established the foundation: ECS, rendering, scenes, assets, physics, audio, and AdaUI. Since then, we have been working to bring these capabilities together into a practical game development workflow.

Version 1.0.0 introduces a new Ada Studio with AI agents and interactive A2UI tools, significantly expands AdaScript, and adds native Android support, multiplayer, more advanced 3D rendering, and cloud infrastructure for sharing user-created games.

The journey from a first scene to a game you can share now runs through a connected set of tools.

## The new Ada Studio

The biggest addition is **Ada Studio**, a development environment for AdaEngine. It brings together project management, code, scenes, assets, interfaces, and game execution.

Studio supports both Swift and AdaScript projects. Its shared interface is built with AdaUI: we use our own UI framework for an everyday development tool and improve it through real workloads.

![Ada Studio desktop](images/studio/desktop.png "Ada Studio brings code, scenes, and development tools into one workspace.")

### Editor Mode

Editor Mode provides a workspace with a project navigator, document tabs, a scene viewport, and an Inspector.

You can create and edit 2D and 3D scenes, manage entity hierarchies, add components, and configure cameras, lighting, physics, and materials. Move, Scale, and Rotate tools let you work directly in the viewport, while Undo and Redo make experimentation easier.

The workspace can be split into two panes: keep code beside a scene, or edit several documents at once.

### Agent Mode

Desktop Studio now includes **Agent Mode**, a dedicated interface for developing with an AI agent.

Conversations and their results sit at the center of this mode. You can switch sessions, share selected code and images with an agent, open changed files, and return to the regular editor.

Both modes share the same documents and project state, making it easy to move between discussing a task and editing it yourself.

On macOS, Studio connects to external agents through the **Agent Client Protocol (ACP)**. Its catalog discovers installed agents and offers compatible adapters for Codex and Claude Code; it also recognizes Gemini CLI, OpenCode, GitHub Copilot, and Sloppy ACP. Compatible distributions can be installed and connected from Studio. Authentication stays with the selected agent.

Conversations are saved with the project. Switching sessions preserves drafts, attachments, and selected context, while a running task remains associated with its original conversation. An agent's changes can be opened in the regular editor and reviewed as a diff. Each project window runs one agent task at a time.

Agent Mode and the regular chat in Editor Mode share the same tools. The interface changes how the workspace is organized; available actions depend on the capabilities of the current host.

![Agent Mode in Ada Studio](showcases/adaengine-1-0-0/agent-mode.png "Agent Mode: project sessions, context, and a document workspace.")

### Tilemap Editor and assets

Studio now has a built-in tilemap editor with painting, erasing, layers, a tile palette, zoom, and panning.

The tileset editor configures tile sources and their geometry. For 2D lighting, you can define light-occlusion polygons and override them for individual map cells.

Studio also includes a texture atlas editor, image previews, and GLB/glTF import. A model can be opened in a 3D preview, an animation clip selected, and the model placed in a scene.

![Tilemap Editor](showcases/adaengine-1-0-0/tilemap-editor.png "Editing the Medieval Arena map: canvas, layers, and tile palette.")

### Code Editor and debugging

The code editor supports syntax highlighting for Swift, AdaScript, YAML, and GLSL, along with completion, hints, definition navigation, and diagnostics. Search works within a file or across the project.

Swift projects on macOS have integrated **LLDB** support: breakpoints, stepping, threads, call stacks, variables, watches, and a command console.

AdaScript supports diagnostics, execution in Play, and hot reload. Full execution debugging for AdaScript remains a future step.

## AI agents: from an idea to a working scene

Studio agents work with the project itself: code, scenes, assets, settings, and execution results. On desktop, these capabilities are exposed through editor tools and MCP; on mobile, they are provided by the embedded agent runtime.

### Project context and engine knowledge

An agent can read the project structure, retrieve exact API and component descriptions, find documentation, and open examples. Reference material ships with Studio and is available offline.

This helps the agent use existing engine features and work with actual component fields. Scene tools support reading and structured changes, with document revision checks and Undo.

### Images, tiles, and 3D assets

Images can be attached to a conversation as visual references. Mobile Studio also supports pasting images and annotating screenshots to communicate a desired result or a problem more precisely.

Agent tools cover several parts of asset preparation:

- Creating procedural textures: solid colors, gradients, checkerboards, noise, and flat normal maps.
- Generating and editing images when an image provider is configured.
- Reading, editing, and packing texture atlases.
- Creating tilesets and editing tilemap layers and cells.
- Validating and importing GLB/glTF files, and inspecting model structure, materials, skeletons, and animation clips.
- Changing PBR parameters and assigning textures to model materials.
- Searching online reference material and downloading assets into the project for subsequent validation.

The available tools depend on the platform. Importing and configuring an existing 3D model is supported; rig creation and skeletal keyframe editing require separate tools.

### Game development harness

We added the built-in **`ada-game-builder`** workflow to help an agent move through the full development cycle, from a game mechanic to a result that can be checked.

It covers scenes and scripts, assets, desktop and touch controls, HUDs, restarting the game, and verification. For longer tasks, the workflow uses project notes about design and progress to preserve decisions between sessions.

Studio ships with skills for 3D assets, materials, animations, and UI forms. An agent can find and read the relevant instructions as it works. Mobile Studio can also import custom Markdown skills and store persistent instructions.

### Checking results and fixing errors

An agent can start builds, read diagnostics and logs, validate scenes, and run isolated simulations. Mobile simulation lets it supply keyboard input, advance a game by several frames, and inspect entity positions and component values.

Visible Play and completed GPU-frame capture are available for visual checks. On mobile, the agent can send a captured frame to a configured vision model for analysis. Desktop tools also expose CPU metrics and profiler recordings for embedded game sessions.

Builds, simulation, and visible execution check different aspects of a project. Logic checks help find behavioral errors; rendering, audio, networking, and touch interaction need to be checked in Play.

### Mobile agents and background tasks

On iPhone and iPad, the agent runs inside Studio and uses tools scoped to the current project. You can select a provider and model, configure step limits and repair attempts after a failed check, and choose whether Play opens automatically.

On iOS/iPadOS 26, user-started tasks can continue in the background through the system's continued processing mechanism. An activity shows the current phase, duration, and errors. The system controls available background time; Play rendering and frame capture require the app to be open.

## A2UI: interactive tools inside the chat

**A2UI** lets an agent respond with an interactive interface. The agent describes a form declaratively, and Studio renders it with native AdaUI components inside the conversation. Elements can appear incrementally as the response arrives.

Our forms catalog includes text, rows, columns, buttons, input fields, toggles, selectors, and numeric sliders. Values are bound to the form's data model. Required fields and allowed ranges are validated locally: errors appear beside the inputs, and an invalid form cannot be submitted.

::video[Native A2UI controls](showcases/adaengine-1-0-0/a2ui-controls.mp4 "A2UI in Studio: an NPC role selector, dialog toggle, and slider. The form uses demonstration data; the video shows local controls." poster="showcases/adaengine-1-0-0/a2ui-controls.png")

### From a form to a game interface

For example, you can ask an agent to prepare an NPC configuration form with a name, behavior parameters, and dialog options. When you submit the form, its values return to the original session, and the agent continues with your choices.

A generated UI preview can be opened with **Open in UI Designer**. Studio creates a regular `.ui` project asset that you can edit visually or in YAML, save, and include in your game. Export preserves native components, bindings, current values, and form validation. Button actions connect to application logic through the usual AdaUI mechanisms.

On iPhone, **Open UI Source** opens the exported asset in the file editor. This hands the interface over to the project; later manual Designer changes are not automatically sent back to the agent.

![An A2UI form in UI Designer](showcases/adaengine-1-0-0/ui-designer-npc.png "NPCProfile.ui: a form exported from A2UI and opened in the regular UI Designer.")

### Scene tools

A chat card can become a small editor tool. An agent might create an NPC placement card with a copy count and spacing, or a color card with a system color picker and an Apply button.

Supported local actions run directly in Studio without another model request. Cards can duplicate an entity subtree, change a registered color field, or apply several scene edits in one transaction.

Studio checks the scene revision before applying an edit. If the document changed independently, a stale card asks for refreshed data. Desktop changes enter the regular Undo/Redo history; an iPhone card stores the information needed to undo its latest application. These changes affect the scene being edited; an already running Play session must be restarted.

### Native UI on desktop and iPhone

The same cards are available in macOS ACP chat and embedded iPhone chat. Their state and entered values are saved with the session. Form submissions return to the conversation that created them and preserve the current message draft.

Inside the engine, the integration is provided by **`AdaA2UI`**, an A2UI v0.9.1 adapter with its own forms catalog. It can be added to AdaUI applications and connected to an agent through event callbacks. Interactive responses can therefore become part of your own development tools as well as Studio.

## Studio on desktop and mobile

Desktop Studio provides a workspace with multiple panes, build tools, debugging, and Git integration.

Mobile Studio is adapted for iPhone and iPad. On iPhone, project navigation, files, code, scenes, Play, and chat have dedicated screens. iPad offers a wider workspace.

AdaScript projects can be edited and run in the embedded runtime on a mobile device, making phones and tablets useful for prototyping and testing touch controls.

![Ada Studio mobile](images/studio/mobile-play-device.png "Checking a game in Play on iPhone.")

### Ada Player

**Ada Player** lets you send a supported project from Studio to another device for testing.

Studio discovers Players on the local network, connects through a pairing code, transfers the project, and receives execution messages. This shortens the path between changing a game and checking it on a device.

### visionOS and spatial applications

Version 1.0.0 introduces a foundation for immersive visionOS applications.

AdaEngine can render a world in a fully immersive space, use separate projections for each eye, and support spatial interaction with objects. Compatible devices can use foveated rendering.

AdaUI panels can be placed in spatial windows through the native host. The [Immersive Garden](https://github.com/AdaEngine/Ada/tree/main/Demos/ImmersiveGarden) example combines a game world with control tools. This is a foundation for spatial applications; a full Studio port to visionOS and a general XR export path are still ahead.

## AdaScript: a language for game logic

**AdaScript** is a scripting language integrated with AdaEngine and Ada Studio. It lets you write game logic, define components and systems, attach behavior to entities, and use engine APIs.

The language uses `.ada` files and supports functions, classes, structs, collections, and asynchronous operations. It is dynamically typed by default; strict type checking can be enabled for individual files or an entire project.

### Project structure and the .ada directory

An AdaScript project is a regular directory containing source files, assets, and configuration. Scripts with the `.ada` extension live in `Sources/`, while the hidden `.ada/` directory stores project settings and Studio's working data.

A small game project might look like this:

```text title="MyGame/"
MyGame/
├── .ada/
│   └── project.json
├── Sources/
│   ├── PlayerController.ada
│   ├── Health.ada
│   ├── GameRules.ada
│   └── HealthRegeneration.ada
└── Assets/
    ├── Scenes/
    │   └── Main.ascn
    ├── Maps/
    │   └── Level.tilemap
    ├── Tiles/
    │   └── Level.tileset
    ├── Textures/
    │   └── Player.png
    └── UI/
        └── HUD.ui
```

`Sources/` contains game logic: systems, components, resources, and scriptable behavior. `Assets/` contains scenes, images, models, audio, tilemaps, and UI assets. These directory paths can be changed in project settings.

The main configuration file is **`.ada/project.json`**. It defines the project name, build system, file locations, entry point, runtime plugins, and other settings. Here is a configuration for a 2D game:

```json title=".ada/project.json"
{
  "schemaVersion": 3,
  "project": {
    "name": "MyGame"
  },
  "build": {
    "system": "adascript"
  },
  "paths": {
    "sources": "Sources",
    "assets": "Assets",
    "resourceRoots": ["Assets"]
  },
  "runtime": {
    "moduleName": "MyGame",
    "entry": {
      "scene": "Assets/Scenes/Main.ascn"
    },
    "plugins": {
      "preset": "game2d",
      "presetVersion": 1
    }
  },
  "editor": {
    "startupScene": "Assets/Scenes/Main.ascn"
  }
}
```

`build.system` selects the AdaScript path. `paths` defines source and asset locations, `runtime.entry.scene` selects the game's initial scene, and `runtime.plugins` controls the available engine features. The `game2d` and `game3d` presets can be extended through `enable` and `disable`. `editor.startupScene` specifies a fallback scene for execution inside the editor.

The same file stores named input actions in `inputActions`, launch parameters, and runtime window settings. The main fields are available through **Project Settings**, so everyday configuration can be done in Studio's interface.

Additional files and directories appear inside `.ada/` as you work:

- `workspace/` — open-document state and project agent sessions.
- `chat-ui/` — additional A2UI card state and undo data in mobile Studio.
- `libraries.lock.json` — AdaScript dependencies pinned to exact Git commits.
- `libraries/` — the installed source files of those libraries.
- `cli-build/` — the build cache created by the CLI.
- `android-signing/` — development-signing keys for Android APKs, created during export.
- `publication-images/` — the cover and screenshots selected for publishing from Studio.

The relevant tools create these directories as needed. `project.json` describes the game, while `workspace/` and `cli-build/` support editing and builds. A library lockfile can be saved to restore pinned versions on another computer; keeping `libraries/` alongside it lets you share a project with dependencies already installed for offline work.

In a portable AdaScript project, Studio's host provides the application lifecycle, so a separate `main()` and `Package.swift` are not needed. Swift projects additionally use `Package.swift` and connect AdaScript through a build plugin. Exports go to `Exports/macOS`, `Exports/Web`, or `Exports/Android` by default.

### Annotations

Annotations connect AdaScript declarations to the engine:

- `@system` registers an ECS system.
- `@component` and `@resource` describe game data.
- `@query` and `@res` provide access to components and resources.
- `@scriptable` attaches behavior to an entity.
- `@export` makes behavior fields persistent and editable in the Inspector.
- `@tool` declares a Studio tool with its own `.ui` panel and editor actions.
- Network annotations describe commands, RPCs, and replicated components.

### What id means in annotations

`id` is a declaration's stable name in the engine. In `@component(id: "game.health")`, for example, `game.health` identifies the Health component type. That type can be attached to many entities, each with its own health values and numeric `entity.id`.

Identifiers are used for registration, Swift-side data lookup, scriptable behavior persistence, system ordering, and network schemas. An explicit `id` lets you rename a class in source code while keeping its external identity. Changing the ID itself requires updating references and accounting for previously saved data.

The `game.` prefix is a useful naming convention. It does not create a language namespace. A library can choose its own prefix, such as `combat.health`, to avoid collisions with game declarations.

A `@system` ID defaults to the class name; an explicit ID is useful for `@after` and `@before`. An ID is required for `@scriptable`, `@tool`, and network declarations such as `@network_command`, `@rpc`, and `@replicated_component`. Where supported, `version` separately describes the declaration or schema version. Identifiers must be unique within their respective registry.

### Entity data: @component

A component stores data for an individual entity. Each character can have its own current and maximum health:

```adascript title="Health.ada"
@component(id: "game.health")
struct Health {
    @export var current = 100.0;
    @export var maximum = 100.0;
}
```

### Entity behavior: @scriptable

`@scriptable` describes behavior that can be attached to an entity in a scene. This example moves a character horizontally, with `speed` exposed in Studio's Inspector:

```adascript title="PlayerController.ada"
@scriptable(id: "game.player-controller")
class PlayerController {
    @export var speed = 5.0;

    @component(required: true)
    var transform: Transform;

    @res
    var input: Input;

    func update(context) {
        var right = input.getActionStrength("MoveRight");
        var left = input.getActionStrength("MoveLeft");
        var direction = right - left;
        var distance = direction * speed * context.deltaTime;

        var position = transform.position;
        position[0] += distance;
        transform.position = position;
    }
}
```

`@component(required: true)` binds the property to the Transform of the entity the script is attached to. `@res` provides the current world's Input resource. The `MoveLeft` and `MoveRight` actions are configured in **Project Settings → Input Bindings**; this example requires the Input plugin to be enabled.

`@scriptable` supports `ready(context)`, `update(context)`, `fixedUpdate(context)`, `event(events, context)`, and `destroy(context)`. `ready` runs when behavior is attached, and `destroy` runs when it is removed. Asynchronous tasks can wait for asset loading, the next frame, or a timer while remaining associated with the game object's lifecycle.

### Shared world settings: @resource and @res

A resource stores shared world data. For example, health regeneration speed can be moved from individual characters into game rules:

```adascript title="GameRules.ada"
@resource(id: "game.rules", autoInsert: true)
struct GameRules {
    @export var healthRegenPerSecond = 5.0;
}
```

In a SwiftPM project, `AdaScriptBuildPlugin` generates backing types for components and resources. `autoInsert: true` inserts the resource into the world before systems are installed. A system or scriptable behavior can then access it with `@res var rules: GameRules;`.

### Systems and scheduling: @system

`@system` registers a class as an ECS system. Its `update(context)` method is called by the selected **scheduler**, a stage in the world's system execution cycle. The `scheduler` parameter selects that stage, and `context.deltaTime` provides its current time step.

The standard cycle includes:

- `startup` — initialization once on the scheduler runner's first update; it runs again when the world is restarted.
- `preUpdate` — the stage before the main update.
- `update` — the main game logic stage and the default when `scheduler` is omitted.
- `postUpdate` — the stage after the main update.

A startup system can create an entity with components from our project:

```adascript title="GameSetup.ada"
@system(scheduler: "startup", id: "game.setup")
class GameSetup {
    func update(context) {
        context.world.spawn([Transform(), Health()]);
    }
}
```

Even in `startup`, the system entry point is named `update(context)`. The class constructor creates the script instance; the startup system gets access to the game world and performs initial setup. The HealthRegeneration system below uses `update` and executes its logic whenever that stage runs.

Ordering can be expressed with `@after` and `@before`, using another system's ID:

```adascript title="System ordering"
@after(id: "game.health-regeneration")
@system(scheduler: "update", id: "game.health-observer")
class HealthObserver {
    func update(context) {
        // Logic that runs after HealthRegeneration.
    }
}
```

Both systems must belong to the same AdaScript module and scheduler. Unknown IDs, self-dependencies, and cycles are rejected during validation. Additional schedulers can be set up on the Swift side of the host. The `fixedUpdate(context)` callback on `@scriptable` belongs to the behavior lifecycle; it is a separate mechanism from these standard stages.

### Working with many entities: @query

A system accesses matching entities through `@query`. Here it updates every Health component using the shared GameRules resource from the previous example:

```adascript title="HealthRegeneration.ada"
@system(scheduler: "update", id: "game.health-regeneration")
class HealthRegeneration {
    @query(Health)
    var characters;

    @res
    var rules: GameRules;

    func update(context) {
        var amount = rules.healthRegenPerSecond
            * context.deltaTime;

        for (var entity in characters) {
            if (entity.health.current < entity.health.maximum) {
                var next = entity.health.current + amount;

                if (next > entity.health.maximum) {
                    next = entity.health.maximum;
                }

                entity.health.current = next;
            }
        }
    }
}
```

`@system` registers the system with the scheduler, while `@query(Health)` selects active entities with a Health component. Inside the loop, the component is available as `entity.health`; writing a field updates ECS storage. This is useful for shared logic that processes many objects.

A query can fetch several components and apply filters. If the project registers Player and Frozen components, a system can declare this query:

```adascript title="A query with filters"
@query(Health, Transform, with: Player, without: Frozen)
var players;
```

Its rows expose `entity.health` and `entity.transform`. Filters check component presence: the query includes entities with Player that do not have Frozen. Query row data is valid during the current iteration; keep the values you need between system updates rather than retaining row references.

### Asynchronous logic: async/await

AdaScript can express a sequence of operations with **`async func`** and **`await`**. Waiting suspends that task while the game continues updating. A regular callback starts such a function with `Tasks.start(...)`:

```adascript title="DelayedAnnouncement.ada"
async func announceLater() {
    await Time.sleep(1.0);
    System.print("One game-time second passed");

    await Tasks.nextFrame();
    System.print("The next frame is ready");
}

@system(id: "game.announcement")
class AnnouncementSystem {
    var started = false;

    func update(context) {
        if (!started) {
            started = true;
            Tasks.start(announceLater());
        }
    }
}
```

`Time.sleep` uses scheduler game time and stops advancing when the scheduler is paused. `Time.sleepRealTime` uses a monotonic clock; the task still resumes at a dispatch point in the scripting runtime. `Tasks.nextFrame` waits for the next frame. `Tasks.start` returns a handle with `status()` and `cancel()`.

Asynchronous operations are also available for assets. Loading an image returns a result that can be checked after `await`:

```adascript title="Asynchronous asset loading"
async func loadPlayerTexture() {
    var result = await Assets.loadAsync(
        "@res://Textures/Player.png"
    );

    if (result.isSuccess()) {
        System.print("Player texture is ready");
    } else {
        System.print(result.message());
    }
}
```

Start this function with `Tasks.start(loadPlayerTexture())` as well. Operations that can fail expose `isSuccess()`, `value()`, `errorCode()`, and `message()`. Saves provides asynchronous persistence operations, and `Tasks.promise()` can connect a wait to the result of another callback.

The `update(context)` methods and `@scriptable` callbacks remain synchronous; they start a separate async function. Contexts, query rows, resource views, and commands are valid only within the callback. Pass independent values into a task, such as a number, a string, or a copy of the data you need. Types whose lifetime is tied to a callback can be marked `@nonsendable`; the runtime also checks transferred values. Continuations execute in the serialized scripting runtime, rather than on a background I/O thread.

### Accessing AdaScript data from Swift

In a SwiftPM project, `AdaScriptBuildPlugin` generates backing types for AdaScript components and resources, and the generated plugin registers them with the engine. The names of those Swift types are an internal generation detail. Integrations should use the declaration name or its stable ID, such as `Health` or `game.health`.

After installing `AdaScriptPluginsGenerated()`, a component can be retrieved from the same world by ID and its reflected fields read. Here, `world` is the game World and `playerID` identifies an existing entity with Health:

```swift title="Reading Health from Swift"
import AdaECS

if let component = world.getComponent(
    named: "game.health", from: playerID
), let descriptor = ComponentReflectionRegistry.descriptor(
    named: String(reflecting: type(of: component))
) {
    let fields = descriptor.readPayload(from: component)
    if case .double(let current)? = fields["current"] {
        print("Health:", current)
    }
}
```

Similarly, `world.getResource(named: "game.rules")` returns a registered resource as `any Resource`. The scripting bridge provides an SPI for reading a specific field of a generated resource:

```swift title="Reading GameRules from Swift — SPI"
@_spi(Scripting) import AdaECS

if let resourceType = RuntimeTypeRegistry.resourceType(
    named: "game.rules"
), let descriptor = RuntimeResourceReflectionRegistry
    .descriptor(for: resourceType),
   let field = descriptor.fields.first(where: {
       $0.key == "healthRegenPerSecond"
   }),
   case .double(let rate)? = world.readResourceField(
       type: resourceType, field: field
   ) {
    print("Regeneration per second:", rate)
}
```

The SPI supports scripting bridge integrations and can change separately from the public API. Read data during a coordinated world access phase, such as a Swift system that declares access to the relevant data. The resulting values can be passed to Swift UI code or other game logic.

Runtime-defined components in the portable runtime and AOT use a world-local schema and payload. They can be read without knowing the generated Swift type:

```swift title="A runtime component from Swift"
import AdaECS

if let schema = world.runtimeComponentDescriptor(
    named: "game.health"
), let health = world.getRuntimeComponent(
    schema.componentID, from: playerID
), let index = schema.fields.firstIndex(where: {
    $0.key == "current"
}) {
    print(health.values[index])
}
```

In native AOT, scalar resources declared by the compiled module are stored in the public `AdaScriptNativeResources` resource container. Its `values` is indexed first by resource ID, then by field name:

```swift title="A native AOT resource from Swift"
import AdaECS
import AdaScripting

let rules = world.getResource(AdaScriptNativeResources.self)
let rate = rules?.values["game.rules"]?["healthRegenPerSecond"]
print(rate as Any)
```

This last path applies to builds with native AOT support. If data is originally declared in Swift, it can be retrieved through regular typed ECS APIs, while AdaScript binds the same data with `@query`, `@component`, and `@res`. Choose the API that matches how your project registers its data.

### Studio tools: @tool

Studio on macOS lets you create **custom tools in AdaScript**: add a panel to the right sidebar, bind its controls to script fields, and perform actions on the open scene. `@tool` describes the tool, `.ui` defines its interface, and AdaScript methods implement its behavior.

Tools live beside the game in a dedicated project directory:

```text title="Tool module"
Tools/
└── LevelHelper/
    ├── LevelHelper.ada
    └── LevelHelper.ui
```

Each directory directly inside `Tools/` forms a module. Its `.ada` files and relative imports are compiled together. The reserved `Tools/` directory is excluded from game script loading: the tool runs in the editor rather than becoming a game system.

For example, **Level Helper** creates a row of entities with Transform. Its annotation defines a stable ID, name, version, API version, and document permissions; `activate(editor)` registers the panel:

```adascript title="LevelHelper.ada"
@tool(
    id: "studio.level-helper",
    name: "Level Helper",
    version: "1.0.0",
    api: 1,
    platforms: ["macos"],
    permissions: [
        "editor.documents.read",
        "editor.documents.write"
    ]
)
class LevelHelper {
    @export var count = 3.0;
    @export var status = "Open a scene, then Generate.";

    func activate(editor) {
        editor.addPanel(
            id: "level-helper",
            title: "Level Helper",
            location: "right",
            ui: "LevelHelper.ui"
        );
    }

    func generate(editor) {
        if (editor.scenePath == "") {
            status = "Open a scene first.";
            return;
        }

        var total = Math.clamp(count, 1.0, 32.0);
        var i = 0;
        while (i < total) {
            editor.createEntity(
                name: "Generated " + (i + 1),
                x: i * 48.0,
                y: 0.0
            );
            i += 1;
        }
        status = "Generated " + total + " entities.";
    }
}
```

The `LevelHelper.ui` path is resolved relative to the declaring `.ada` file and must remain inside the module. In Studio API 1, a tool can register up to eight right-sidebar panels with unique IDs. The host removes them when the tool is disabled or its project closes; the script can additionally implement `deactivate()` if needed.

The interface uses the regular `.ui` format and can be edited in UI Designer. Our example needs a slider, a button, and a result label:

```yaml title="LevelHelper.ui"
format: ada.ui
schemaVersion: 1
inputs:
  - name: count
    type: number
    defaultValue: 3
  - name: status
    type: string
    defaultValue: Ready
actions:
  - name: generate
root:
  id: level-helper
  type: VStack
  arguments:
    spacing: {value: 12}
  children:
    - id: count
      type: Slider
      arguments:
        value: {binding: count}
        min: {value: 1}
        max: {value: 32}
        step: {value: 1}
    - id: generate
      type: Button
      arguments:
        title: {value: Generate}
      actions:
        action: generate
    - id: status
      type: Text
      arguments:
        text: {binding: status}
```

Each input binds to an `@export` field with the same name and a compatible type. Strings, booleans, integers, and floating-point numbers are supported. The panel starts with the script instance's values; `.ui` `defaultValue` fields are used for Designer previews. Before an action, control values are copied to the tool's fields, and after it finishes, values are copied back to the interface. The `generate` action calls `func generate(editor)`; tool callbacks are synchronous.

**Scene changes are applied as one batch.** `editor.createEntity(...)` stages entities, and Studio applies them only after the callback succeeds. In this example, one Generate creates the entire row, one Undo removes it, Redo restores it, and regular Save persists the scene. If the callback fails or the original scene has changed, the staged batch is not applied. `editor.scenePath`, `editor.sceneRevision`, and `editor.entityCount` are also available; an action can create up to 256 entities.

**Studio manages enablement and access.** Tools are disabled by default. The wrench button opens Studio Tools; before running code or displaying `.ui`, Studio asks you to review permissions and choose **Allow and Enable**. Versions, enablement, and access settings live in **Settings → Project → Studio Tools**. **Revoke Access** immediately removes panels and cancels pending actions. Consent is stored locally for each project; changes to the source location, API, platforms, or requested permissions require consent again.

The current runtime implements `editor.documents.read` and `editor.documents.write`. The static schema can describe a wider permission set, but this host does not yet expose network, process, clipboard, or workspace file APIs.

**Reload lets you refine a tool without closing the project.** A valid `.ui` reload preserves entered values. A successful script reload replaces its instance and registrations; an invalid script or interface keeps the previous working version active and reports diagnostics. The runtime bounds callback execution time, loops, memory, and recursion.

This layer is available **on macOS**. iPadOS support, command, menu, and formatter registration, async callbacks, and marketplace distribution remain future steps. Panels use `.ui`.

The [Studio Tools documentation](https://github.com/AdaEngine/Ada/blob/main/Editor/Documentation/StudioTools.md) covers lifecycle, bindings, scene access, and reload. You can copy the [complete Level Helper example](https://github.com/AdaEngine/Ada/tree/main/Editor/Documentation/Examples/StudioTools/LevelHelper) into your project's `Tools/LevelHelper/` directory.

### AdaScript addons: reusable libraries

Game logic can be packaged as an **AdaScript addon**, a library of functions, ECS systems, and scriptable behavior. Shared damage logic, inventory systems, or a character controller can be reused across games.

A library lives in a separate repository. Its root contains `ada-library.json`, which describes its identifier, version, source files, and dependencies:

```text title="CombatAddon/"
CombatAddon/
├── ada-library.json
└── Sources/
    └── Damage.ada
```

```json title="ada-library.json"
{
  "schemaVersion": 1,
  "id": "example.combat",
  "version": "1.0.0",
  "api": 1,
  "sources": ["Sources/Damage.ada"],
  "dependencies": []
}
```

`sources` lists all library source files, including imported helper files. For example, `Damage.ada` might contain this function:

```adascript title="CombatAddon/Sources/Damage.ada"
func applyDamage(current, damage) {
    var remaining = current - damage;
    if (remaining < 0) {
        return 0;
    }
    return remaining;
}
```

In Studio, open **Settings → Project → AdaScript Libraries**, enter a public GitHub repository and a tag or commit, then select **Install / Update**. Rebuild the game or restart Play after installation. The current provider supports public GitHub repositories.

A function from an installed addon can be imported by library ID, independently of where the game script is located:

```adascript title="Importing into a game"
import { applyDamage }
    from "@example.combat/Sources/Damage";

var health = applyDamage(100.0, 25.0); // 75
```

Library `@system` and `@scriptable` declarations participate in normal game module registration. Required engine features are enabled through Runtime Settings. Libraries share the game's module, so their classes, functions, and annotation IDs must have unique names.

Installation stores source files in `.ada/libraries/` and exact Git commits in `.ada/libraries.lock.json`. Libraries can have their own dependencies, also pinned to specific commits. **Restore Locked Libraries** restores the same set on another computer. Builds and execution use installed sources and do not download libraries automatically.

For a fully offline project, keep both the lockfile and `.ada/libraries/`. In a SwiftPM game, `AdaScriptBuildPlugin` includes addon sources in the build alongside game scripts. Libraries make it easier to share reusable logic while keeping dependencies reproducible.

### Hot reload

Studio can update supported AdaScript game logic during execution. If a new script version contains an error, the previous version continues running.

This shortens the feedback loop for behavior changes. Data schema changes and other incompatible edits may require restarting the game.

### The new AOT compiler

The release includes an **experimental AOT path** for AdaScript.

Supported code is compiled ahead of time into native code. The path covers ECS integration, scriptable object lifecycles, and asynchronous coroutine tasks.

Studio uses it to export AdaScript projects to macOS, Web, and Android. AOT is currently limited to a supported subset of the language; unsupported constructs produce explicit errors.

## Native Android support

AdaEngine now has a native Android host. Game code runs in Swift, and rendering uses WebGPU through Swan/Dawn over Vulkan.

Standalone Studio on macOS can select Android as a run target, discover a device or emulator, build an APK, install it, and launch the game. Studio can also start a configured Android Virtual Device.

Export supports AdaScript AOT and compatible Swift AdaEngine projects. The current workflow creates development-signed APKs; producing an AAB and publishing to Google Play require a separate process.

![Android Build & Export](showcases/adaengine-1-0-0/android-build-export.png "Configuring the Android SDK, NDK, and JDK in Studio before export and launch.")

## Networking and multiplayer

The new **AdaMultiplayer** module provides infrastructure for local and internet multiplayer.

It includes a host-authoritative model, replication of registered ECS components, typed commands and RPCs, and interpolation of received state.

Transport is separate from game logic. You can use a local connection, the Ada Cloud relay, or a custom transport implementation. AdaScript provides annotations for network data and commands.

This keeps the game model in ECS while making the data shared between participants explicit.

### A replicated component: player state

In AdaScript, a network component is declared with `@replicated_component`. It already acts as an ECS component, so an additional `@component` annotation is unnecessary. Here is a small example of movement along one axis:

```adascript
@replicated_component(
    id: "game.network-player",
    version: 1,
    authority: "host",
    visibility: "all_peers"
)
struct NetworkPlayer {
    @network_field(1) var peer = "";
    @network_field(2, interpolate: "linear") var x = 0.0;
    @network_field(3) var health = 100;
    @local var animationTime = 0.0;
}
```

The host stores authoritative state and sends `peer`, `x`, and `health` to participants. Linear interpolation is enabled for the numeric `x` coordinate. `animationTime` stays local, so each client can use it for its own character animation.

`id` identifies the component's network schema. The numbers in `@network_field(1)`, `(2)`, and `(3)` identify fields within that schema. They are stable protocol tags, rather than array indices: preserve a field's tag when renaming it. Compatible builds must agree on `id`, `version`, field tags, and types.

On the host, a component can be created with a regular ECS command inside a system callback, passing the ID of the participant who owns the player:

```adascript
context.world.spawn([
    NetworkPlayer(peer: session.localPeerID)
]);
```

Here, `session` is the `AdaScriptMultiplayerState` resource. For a remote player, the host passes that participant's peer ID instead of `session.localPeerID`. The generated creation path for the replicated component adds a replication marker to the entity; no manually assembled snapshot is needed.

### Working with a component and declaring an RPC

A peer sends movement intent, and the host calculates the new coordinate. The `receiveMove` method is declared as an RPC. Its body records input separately for each sender, which is then applied to the corresponding component through `@query`:

```adascript
@system(scheduler: "update", id: "game.network-movement")
class NetworkMovementSystem {
    @res var input: Input;
    @res var multiplayer: Multiplayer;
    @res var session: AdaScriptMultiplayerState;
    @query(NetworkPlayer) var players;

    var movementByPeer = [:];

    @rpc(
        id: "game.move-player",
        version: 1,
        direction: "peer_to_host",
        delivery: "unreliable_sequenced",
        channel: "input"
    )
    func receiveMove(@network_field(1) moveX = 0.0) {
        // The transport provides source; the sender cannot supply it.
        if (moveX < -1.0) moveX = -1.0;
        if (moveX > 1.0) moveX = 1.0;
        movementByPeer[source] = moveX;
    }

    func update(context) {
        var moveX = input.getActionStrength("MoveRight")
            - input.getActionStrength("MoveLeft");

        if (session.role == "peer") {
            multiplayer.send(receiveMove(moveX));
            return;
        }
        if (session.role != "host") return;

        // Apply the host player's local input directly.
        movementByPeer[session.localPeerID] = moveX;

        for (var row in players) {
            var movement = movementByPeer[row.networkPlayer.peer];
            if (movement == null) continue;

            // A regular write to the ECS component on the host.
            row.networkPlayer.x += movement * 175.0 * context.deltaTime;
        }
    }
}
```

Calling `receiveMove(moveX)` constructs a typed command; `multiplayer.send(...)` queues it for transmission. The body of `receiveMove` executes **on the receiver before `update`**, with `source` holding the sender ID supplied by the transport. The body is not automatically called on the sending client. The example therefore handles the host's own input directly.

We match `source` to the `NetworkPlayer.peer` assigned by the host when creating the player. A client controls its own character without selecting someone else's entity through the payload. Input is clamped to −1 through 1; speed and the resulting coordinate are determined by the host. Once `row.networkPlayer.x` is updated, replication delivers the state to participants.

`peer_to_host` specifies the RPC direction. `unreliable_sequenced` suits continuously refreshed input: the next packet replaces a lost one, and stale packets are discarded. Commands that require guaranteed delivery and ordering use `reliable_ordered`. Like components, RPCs have stable `id`, `version`, and parameter tags.

The example assumes the multiplayer runtime is enabled, `MoveRight` / `MoveLeft` actions are configured, and the host creates players as they join the session. It is a foundation for movement logic; a game also needs to clear input on disconnects or timeouts and remove players who leave.

Read more in the documentation:

- [AdaScript: multiplayer schemas and RPCs](https://github.com/AdaEngine/Ada/blob/main/Sources/AdaScripting/AdaScripting.docc/AdaScriptLanguage.md#multiplayer-schemas) — declarations, command transmission, and receiver-side method execution.
- [AdaMultiplayer: runtime setup and transports](https://github.com/AdaEngine/Ada/blob/main/Sources/AdaMultiplayer/AdaMultiplayer.docc/AdaMultiplayer.md) — plugin configuration, entity replication, and network sessions in Swift.

![Medieval Arena](showcases/adaengine-1-0-0/medieval-arena.png "Medieval Arena: a 2D AdaScript game with network gameplay logic.")

## New AdaUI features

AdaUI has grown alongside Studio.

The animation system now includes transactions, `withAnimation`, binding animation, and selected-value changes. Navigation, tabs, sheets, and full-screen presentations have built-in transitions.

We also improved text handling, selection, writing directions, clipping, and interface updates.

A major addition is the **visual UI Designer**. Interfaces can be built as `.ui` assets, with editable hierarchies, properties, and modifiers, plus inputs, actions, and bindings. UI elements can bind to exported fields of gameplay behavior.

AdaUI is used in both games and Studio itself, continuously testing the framework against complex interfaces.

::video[AdaUI Kanban](showcases/adaengine-1-0-0/adaui-kanban.mp4 "AdaUI in practice: an interactive Kanban board. Recording from the engine's demo gallery." poster="showcases/adaengine-1-0-0/adaui-kanban.png")

## 2D improvements

Our 2D work focused on level creation and rendering correctness.

Tilemaps now have a complete workflow in Studio: tilesets, palettes, layers, map editing, and geometry configuration for lighting and shadows.

For sprites, we improved batching, size handling, and culling updates. Texture atlas tools are now part of the editor's asset workflow, making graphics easier to prepare and use.

::video[Sprite rendering](showcases/adaengine-1-0-0/sprite-rendering.mp4 "A 2D example from the engine's demo gallery, with many sprites in one game world." poster="showcases/adaengine-1-0-0/sprite-rendering.png")

## A major 3D update

AdaEngine's 3D capabilities have expanded substantially.

![Skeletal Garden](images/studio/skeletal-garden.png "Skeletal Garden: animated characters, materials, lighting, and a 3D game world.")

![Skeletal Garden overview](showcases/adaengine-1-0-0/garden-overview.png "Skeletal Garden: terrain, vegetation, and the central character area.")

### Box3D physics

We added integration with [Box3D](https://github.com/erincatto/box3d), a library for three-dimensional rigid-body physics.

The engine now has 3D bodies, collision shapes, and a character controller. Skeletal Garden uses them for movement, collisions, jumping, and terrain traversal.

::video[3D physics demonstration](showcases/adaengine-1-0-0/physics-3d.mp4 "Interacting 3D objects: a recording from the engine's archived demo gallery." poster="showcases/adaengine-1-0-0/physics-3d.png")

### Models and animation

GLB/glTF support covers model hierarchies, PBR materials, skeletons, and animation clips. GPU skinning and independent animation playback for model instances have been added.

Animation graphs support clip blending, additive layers, bone masks, and animation events. They can be edited and previewed in Studio.

### Lighting and effects

PBR rendering, image-based lighting, local lights, and shadows continue to develop.

We added cascaded directional shadows, **SSAO**, FXAA, and per-camera environment settings. SSAO adds depth where objects meet, while IBL uses the environment for lighting and reflections.

Move the slider to compare actual frames of the same scene with SSAO disabled and enabled.

::compare[SSAO: contact shadows in Skeletal Garden](showcases/adaengine-1-0-0/garden-no-ssao.png showcases/adaengine-1-0-0/garden-ssao.png "Without SSAO" "SSAO")

### MetalFX

Supported Metal devices can use spatial upscaling and temporal reconstruction through **MetalFX**.

The temporal path uses frame history and motion vectors from the camera, objects, and skeletal animation. UI is composited after image reconstruction and retains the output resolution.

::compare[MetalFX: spatial and temporal reconstruction, macOS / Metal](showcases/adaengine-1-0-0/garden-metalfx-spatial.png showcases/adaengine-1-0-0/garden-metalfx-temporal.png "Spatial" "Temporal")

These static frames are useful for inspecting detail. Temporal reconstruction quality in motion and rendering cost require separate measurements.

### WebGPU

WebGPU continues to develop as a portable graphics backend for AdaEngine. It is used for Web targets and by the native Android host over Vulkan.

Effect availability depends on the platform and backend capabilities.

![Skeletal Garden on WebGPU](showcases/adaengine-1-0-0/garden-webgpu.png "A Skeletal Garden frame from a native WebGPU run.")

## Performance

We reworked important ECS paths: entity creation, component composition changes, and query iteration. This included reducing unnecessary copies, ARC operations, and allocations, as well as correcting component lifetimes.

A local Release benchmark operating on **4,000 entities** produced these median CPU times:

- **Entity creation:** 179.18 ms → 4.43 ms.
- **Component insertion and removal:** 592.45 ms → 20.23 ms.
- **InsertCoW workload:** 299.37 ms → 10.13 ms.

These are before-and-after measurements of a specific ECS storage optimization. They were taken on Apple arm64 with Swift 6.2.4 in Release, using three warmups and 30 measured samples. They describe those workloads, rather than an overall FPS improvement or a comparison of every feature across releases. [Methodology and full results](https://github.com/AdaEngine/Ada/blob/main/Documentation/Performance/ECSStorageInPlace.md).

Studio also gained a **Performance panel and Timeline**: CPU update time, entity count, process memory, ECS system durations, and an event history with Chrome Trace export. This helps locate causes of delays while developing a game.

![Performance Timeline](showcases/adaengine-1-0-0/performance-timeline.png "A recorded CPU Timeline: world updates, ECS, and render graph nodes.")

## Ada Cloud and user-created games

**Ada Cloud** expands the ways games can be distributed.

UGC supports persistent versions, fixed files and metadata, moderation, and publication history. Each new version is reviewed separately, while the currently approved game remains available until its update is approved.

Community in Studio lets you discover games, read descriptions, view screenshots, and run supported AdaScript publications in the embedded player. Compatible multiplayer games offer Solo, Host, and room-code joining.

[Ada Store](https://store.adaengine.org/store) is also growing as a catalog of assets, scripts, templates, and tools. It complements the game library with materials for building your own projects.

## Automation through the CLI

Standalone Studio on macOS includes the **`adastudio` CLI**.

This is an important part of working with **AI agents**. An agent needs a way to check its changes: read project configuration, find script errors, and produce a build. The CLI provides that path through the terminal without opening a Studio window or connecting to its embedded chat. The same commands work for manual use and CI.

The CLI uses Studio's own project validator, AdaScript builder, and exporter. An agent works with saved files and receives results in a format suited to automation:

- `doctor` checks for the Build SDK and build tools.
- `project inspect` reads project configuration and structure without rewriting metadata.
- `validate` checks AdaScript, the entry scene, and runtime bindings.
- `build` packages an AdaScript game as a macOS application.
- `export` creates a supported build for macOS, Web, or Android.

For example, an agent can check a project and build it after making corrections:

```bash title="Validating and building an AdaScript project"
STUDIO="/Applications/Ada Studio.app/Contents/MacOS/adastudio"

"$STUDIO" doctor --format json
"$STUDIO" project inspect --project ./MyGame --format json
"$STUDIO" validate --project ./MyGame --format json

"$STUDIO" build --project ./MyGame \
  --target macos --configuration release \
  --output ./Build/MyGame --format json
```

With `--format json`, stdout contains one report with `ok`, `exitCode`, `diagnostics`, and paths to `artifacts`. Tool logs go separately to stderr. Diagnostics include an error code, message, and, when the compiler supplies them, a file, line, and column. An agent can locate the problem, make a correction, and repeat the check. Exit codes distinguish an invalid project from a missing toolchain or a build failure.

This creates a repeatable **edit → validate → fix → build** cycle. In CI, it helps check changes before human review and preserve artifacts for later execution. A successful `validate` checks code and configuration; gameplay, rendering, and controls are checked separately in simulation and visible Play. For SwiftPM projects, this command validates metadata and layout; the actual scope is reported in `details.validationScope`.

### Comparison with Unity CLI

The approach will be familiar to Unity developers: the editor supports batch-mode automation, and the modern **Unity CLI** offers `unity build`, `unity test`, and `unity run`, along with JSON output. A macOS game build can be expressed like this:

```bash title="Unity CLI example"
unity build ./MyUnityGame --target StandaloneOSX \
  --output-path ./Build/MyUnityGame.app --format json
```

Unity CLI launches the required editor in batch mode; builds can use the built-in path, a Build Profile, or a custom C# method. In Ada Studio, validation and export commands are bundled with the standalone app and use its project pipeline without starting the windowed runtime. In both cases, agents benefit from explicit commands, structured results, and repeatable operations. [Unity CLI documentation](https://github.com/Unity-Technologies/skills/blob/main/skills/unity-cli/references/build-run-test.md), [Unity batch mode](https://docs.unity.com/en-us/engine/6000.3/manual/building-and-publishing/build-command-line).

Commands and current capabilities are described in the [Ada Studio CLI documentation](https://github.com/AdaEngine/Ada/blob/main/Editor/Documentation/CLI.md). Builds require the relevant platform tools; Web export additionally uses a compatible Swift WebAssembly SDK.

## Let's make games

AdaEngine remains an open-source Swift project under the MIT license.

Version 1.0.0 brings together the engine, visual tools, scripting language, AI workflows, and distribution infrastructure. For us, it is a significant step toward an environment where it is easy to experiment, build games, and share them.

Explore the [examples](/demos), try [Studio](/studio), and join [AdaEngine on GitHub](https://github.com/AdaEngine/Ada) through code, documentation, games, and feedback.

**Let's make games with Swift and AdaScript.**
