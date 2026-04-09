# tauri-plugin-module-federation

A [Tauri](https://tauri.app/) plugin and [Module Federation Runtime](https://module-federation.io/guide/basic/runtime.html) plugin that caches remote modules for offline use.

The Federation Runtime plugin rewrites remote module requests to use the `module-federation://` URI scheme, which is then handled by the Tauri plugin. Files loaded over this URI scheme are cached for serving when fetching from the network fails.

## How it works

1. The host app registers the runtime plugin via `runtimePlugins` in its Module Federation config
2. The plugin intercepts remote module resolution (`afterResolve`) and rewrites entry URLs to `module-federation://<host>/?fullUrl=<original_url>`
3. The Tauri plugin handles the custom URI scheme, fetching from the network and caching the response
4. On subsequent loads, if the network is unavailable, the cached version is served instead

## Project structure

| Directory | Description |
|---|---|
| `tauri-plugin/` | Rust Tauri plugin — handles the `module-federation://` custom protocol and caching |
| `module-federation-plugin/` | JavaScript runtime plugin (`@crabnebula-dev/tauri-module-federation`) — rewrites remote URLs |
| `example/` | Example apps demonstrating the setup |

## Prerequisites

- [Rust](https://www.rust-lang.org/tools/install)
- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/installation)
- [Tauri prerequisites](https://tauri.app/start/prerequisites/)

## Getting started

```sh
pnpm install
cd example && pnpm dev
```

See [`example/README.md`](example/README.md) for more details.
