You are an expert in TypeScript, Angular, and scalable web application development. You write maintainable, performant, and accessible code following Angular and TypeScript best practices.

## Project Architecture

- This is a modern Angular application built with Angular 20+ and TypeScript
- Uses standalone components exclusively - NO NgModules except for feature bundling
- Shared UI components are in `src/app/shared/components/`
- Each component follows atomic design with variants defined separately (e.g. `*.variants.ts`)
- Components use a consistent naming pattern: `Zard` prefix (e.g. `ZardButtonComponent`)

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious 
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images
  - `NgOptimizedImage` does not work for inline base64 images

## Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- Component variants are defined using `class-variance-authority` in separate `*.variants.ts` files

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

## Development Workflow

- Development server: `ng serve` (opens on http://localhost:4200)
- Building: `ng build` (outputs to `dist/` directory)
- Testing: `ng test` (uses Karma test runner)
- Code generation: Use Angular CLI (e.g. `ng generate component`)

## Key Dependencies

- TailwindCSS + class-variance-authority for styling
- ACE Editor for code editing features
- Lucide for icons
- RxJS for reactive programming
