<!-- Project-specific Copilot instructions: concise, actionable guidance for AI coding agents -->
# stencil-wc — AI Coding Assistant Guide

These notes give targeted, discoverable guidance so an AI coding agent can be productive quickly in this repo.

1) Big picture / architecture
- This is an Angular 20 application (app: `stencil-wc`) plus a small library `projects/opencv-ng` that provides an OpenCV-based Edge API.
- App entry: `src/main.ts` bootstraps `src/app/app.ts` (standalone component style). UI features live under `src/app/features/*` (e.g. `workbench`, `algorithms/*`).
- State & processing: `src/app/core/state/image-state.ts` is the single application service that holds the currently loaded image, exposes derived signals/resources (grayscale, edge masks) and delegates heavy work to the `EDGE_API` service from the `opencv-ng` library.
- Library boundary: `projects/opencv-ng` exports the EDGE_API injection token and a browser implementation `CvEdgeApi` that depends on an `OPENCV` provider (see `provide-opencv` / `opencv.loader.ts`). The app injects `EDGE_API` via DI (see `ImageStateService`).

2) Key integration points & patterns
- Dependency injection tokens: `projects/opencv-ng/src/lib/common/edge.token.ts` defines `EDGE_API`. Use this token when needing image processing functions.
- Provider factories: `projects/opencv-ng/src/lib/impl/provide-edge-api.ts` exposes `provideEdgeApiBrowser()` which wires `EDGE_API` to `CvEdgeApi`. `projects/opencv-ng/src/lib/opencv.loader.ts` asynchronously loads `@techstark/opencv-js`.
- Memory management: OpenCV mats are manually created/deleted in `CvEdgeApi` (e.g. `setSource`, per-algo helpers). When modifying or adding code that allocates mats, follow the same try/finally delete pattern to avoid memory leaks.
- Signals/resources: `ImageStateService` uses Angular signals and `resource()` for async-derived data (see `grayRes`, `edgeMaskRes`). When adding computed/async state keep dependencies minimal: return a compact payload (e.g. width/height + small param object) so the resource loader can be stable and cache-friendly.

3) Project-specific conventions
- Standalone components are used (Angular standalone APIs). See `@Component({ imports: [...] })` patterns in `src/app/*` and `projects/opencv-ng` components.
- Styling: SCSS is the default; component styles use `.scss` and `angular.json` sets `inlineStyleLanguage: 'scss'`.
- File I/O: images are loaded into ImageData via a hidden canvas in `ImageStateService.loadFile()`; downstream code expects ImageData with RGBA ordering.
- Minimal payloads for resources: resources in `ImageStateService` purposely return small, stable objects for params (e.g. `{ algo, p, w, h }`) — preserve this shape when extending.

4) Build / test / run (developer workflows)
- Local dev server: npm scripts via `package.json`:
  - Start dev server: `npm start` (runs `ng serve`).
  - Build: `npm run build` (`ng build`).
  - Watch build: `npm run watch`.
  - Tests: `npm test` (`ng test`, Karma + Jasmine). Projects include a library build config under `angular.json` for `opencv-ng`.
- When editing `projects/opencv-ng`, you can build/test it via the workspace Angular CLI (the root `ng build` will include the app and library according to targets in `angular.json`).

5) Common change patterns and pitfalls (from reading the code)
- When changing edge algorithms in `CvEdgeApi`:
  - Keep the public shape of `computeEdgeMask` return value: `{ data: Uint8Array, width, height }`.
  - Use `try { ... } finally { mat.delete(); }` for each Mat allocation.
  - Use `cv` functions consistently; some polyfills like `magnitude` vs `cartToPolar` are conditionally used — maintain compatibility checks.
- When adding new UI components that use image processing:
  - Inject `ImageStateService` and either call `imageState.cannyMaskRes(...)` or `edgeMaskRes(...)` to get resource-backed masks.
  - Avoid direct access to OpenCV inside UI components; prefer using the `EDGE_API` abstraction.

6) Files to read for examples
- App boot: `src/main.ts`, `src/app/app.ts`
- State & resources: `src/app/core/state/image-state.ts`
- UI example: `src/app/features/workbench/workbench.ts`, `src/app/features/algorithms/canny/canny.ts`
- Library boundary & DI: `projects/opencv-ng/src/lib/common/edge.token.ts`, `projects/opencv-ng/src/lib/impl/cv-edge-api.service.ts`, `projects/opencv-ng/src/lib/impl/provide-edge-api.ts`, `projects/opencv-ng/src/lib/opencv.loader.ts`

7) Edges for AI: useful directives when editing
- Preserve DI tokens and provider functions (`EDGE_API`, `provideEdgeApiBrowser`) — changing names breaks the DI wiring across the app and library.
- Keep ImageData RGBA ordering and unit types (Uint8ClampedArray / Uint8Array) consistent.
- For performance-sensitive changes: prefer moving heavy computation into `projects/opencv-ng` and expose a minimal async API rather than doing heavy work in components.

8) Quick examples
- Use EDGE_API in services/components:

  const api = inject(EDGE_API) as EdgeApi;
  await api.setSource(imageData);
  const mask = await api.computeEdgeMask('canny', { low: 50, high: 150 });

- Provide the browser edge API at app bootstrap (example already used in library providers):

  // see `projects/opencv-ng/src/lib/impl/provide-edge-api.ts`

9) What I didn't find / gotchas
- No repo-level agent docs or `.github/copilot-instructions.md` existed prior to this file. There are READMEs (`README.md`) but they are generic Angular CLI output. I did not find automated scripts for publishing `opencv-ng` separately.
- If you expect the app to wire the OPENCV provider automatically, confirm where `provideEdgeApiBrowser()` is invoked in the app provider tree; if absent, the app currently relies on default tree-shakable providers (the library marks `CvEdgeApi` as `providedIn: 'root'`).

If any of this is incomplete or you want the file to be more prescriptive (code-mod templates, quick-fix snippets, or stricter style rules), tell me which sections to expand and I'll iterate.


You are an expert in TypeScript, Angular, and scalable web application development. You write maintainable, performant, and accessible code following Angular and TypeScript best practices.
## TypeScript Best Practices
- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain
## Angular Best Practices
- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.
## Components
- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
## State Management
- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead
## Templates
- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
## Services
- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection