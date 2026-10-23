# Ada Playground

There is one public app: the React shell in `AdaEngine/Editor/WebUI`, including
its robot artwork, Games, Create, My projects, editor, assistant and scene/Play.
This repository provides shared Cloud panels, not another catalog or shell.

## Build

Use Node 24+, install both repositories' frontend dependencies, then run
`npm run build:cloud` here. The command builds Cloud panels and WebUI and assembles
`dist-cloud/index.html`, `/studio/` assets and the official authentication artwork.
Set `ADA_PLAYGROUND_SOURCE` to another `AdaEngine/Editor/WebUI` checkout if needed.
`npm run build:panels` builds only the shared account/auth/legal/publication module.
WebUI can consume it through `ADA_CLOUD_PANELS_DIST`.

`npm run dev:cloud` builds and serves that same artifact. The full same-origin API
stack is available through `AdaEngine/Editor/WebUI`'s local launcher on port 8080.
`npm run build` remains the marketing website; `npm run build:console` remains the
operator Console. `npm test` retains routing and Cloud auth/panel contracts.

## URLs

- `/games` and `/games/:id`: public games, details, launch, likes and reports.
- `/create`: project creation, without an intermediate "open Studio" page.
- `/projects` and `/projects/:id`: private workspaces and editor deep links.
- `/account`: existing sign-in, profile, billing and session controls in the app.
- `/publications` and `/publications/:id`: existing page/upload/release controls.
- `/legal/:document`: existing legal documents in the app.

Legacy `/studio/`, `/games/create`, `/cloud` and `/cloud/projects/*` are normalized
by the common app. OAuth/PKCE, native desktop approval, Store callbacks and safe
sign-in continuations retain their precedence. Public browsing does not require
Studio, AI or Cloud Pro admission. Creating/opening a workspace retains server
feature and permission checks. Publication management is linked from My projects.

The editor's private workspace IDs and publication page/release IDs remain separate;
this consolidation neither migrates nor deletes stored data. API contracts,
provider keys, payment policy, preview origin isolation and role checks are unchanged.

The old `src/playground.ts` renderer, its CSS, duplicated art and standalone Cloud
application entry have been retired. Marketing's `/studio` explanation remains on
the marketing host; it is independent of the Cloud host's compatibility alias.
