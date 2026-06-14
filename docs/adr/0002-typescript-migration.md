# ADR-0002: Incremental TypeScript Migration

## Status
Accepted

## Context
The frontend was originally written in JavaScript (React class components, Redux). Type safety is needed for maintainability, especially around the WASM `Image` API boundary.

## Decision
Migrate incrementally to TypeScript:

1. `tsconfig.json` with `strict: true`
2. Webpack resolves `.ts`/`.tsx` before `.js`
3. Both `ts-loader` (for `.ts`/`.tsx`) and `babel-loader` with `@babel/preset-typescript` (for remaining `.js`) run in parallel
4. Shared types in `src/types.ts`; WASM declarations in `src/declarations.d.ts`
5. Delete duplicate `.js` files when a `.ts`/`.tsx` counterpart exists

### Migration priority
1. Core infrastructure: `store.ts`, `App.tsx`, `imgObj.ts`, `types.ts` ✅
2. Layout components: `Header/`, `SubHeader/` ✅ (partial)
3. Remaining tool pane and canvas handlers (in progress)

## Consequences

### Positive
- Compile-time checks on Redux state and WASM method signatures
- Better IDE support for contributors
- No big-bang rewrite — app stays shippable throughout

### Negative
- Temporary dual-loader webpack config
- Some `any` casts remain at the WASM boundary until generated types are used

## Alternatives considered
- **Full rewrite to TypeScript**: Too risky for a single PR
- **Stay on JavaScript + JSDoc**: Weaker guarantees, doesn't catch WASM misuse
