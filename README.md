# @ntangled/kit

A TypeScript utililty package.

## Safe

The `safe.ts` module provides utility functions for safely executing synchronous and asynchronous code, ensuring that errors are handled gracefully and never thrown. Instead, each function returns a tuple of `[error, result]`, making error handling explicit and consistent.

> [!IMPORTANT]  
> Throwing `null` will result in a NullError in the error entry. Use `instance of NullError` if you expect `null` to be thrown.

### Utilities

- **NullError**: Custom error thrown when a `null` value is encountered where not expected.
- **px**: Safely executes an async callback, returns `[error, result]`.
- **rx**: Safely executes a sync callback, returns `[error, result]`.
- **pw**: Wraps an async function, returns a new function that always returns `[error, result]`.
- **rw**: Wraps a sync function, returns a new function that always returns `[error, result]`.

### Usage

#### px (Promise Executor)

```ts
const [err, data] = await px(async () => await fetchData());
if (err) {
	// handle error
}
```

#### rx (Result Executor)

```ts
const [err, value] = rx(() => computeValue());
if (err) {
	// handle error
}
```

#### pw (Promise Wrapper)

```ts
const safeFetch = pw(fetchData);
const [err, data] = await safeFetch(arg1, arg2);
```

#### rw (Result Wrapper)

```ts
const safeCompute = rw(computeValue);
const [err, value] = safeCompute(arg1, arg2);
```

### Why use Safe utilities?

- Avoids try/catch boilerplate.
- Makes error handling explicit and consistent.
- Works for both sync and async functions.
- Prevents uncaught exceptions and null errors.
