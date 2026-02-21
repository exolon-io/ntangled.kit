import type { NonNull } from './types';

/**
 * Error thrown when a null value is encountered where not expected.
 * @class NullError
 * @extends Error
 */
export class NullError extends Error {
	constructor() {
		super('null');
		this.name = 'NullError';
		Object.setPrototypeOf(this, NullError.prototype);
	}
}

/**
 * Wraps a callback function (sync or async) and returns a function that executes the callback,
 * capturing errors and returning them in a tuple. For async callbacks, errors are caught and returned
 * as the first element of the tuple, and the resolved value as the second. For sync callbacks, errors
 * are caught and returned similarly.
 *
 * @template Callback - The type of the callback function.
 * @param callback - The callback function to wrap.
 * @returns A function that, when called, returns a tuple: [error, result]. If no error occurs, error is null.
 *          For async callbacks, returns a Promise resolving to the tuple.
 *
 * @example
 * // Synchronous usage
 * const safeAdd = w((a: number, b: number) => a + b);
 * const [err, sum] = safeAdd(1, 2);
 *
 * // Asynchronous usage
 * const safeFetch = w(async (url: string) => fetch(url));
 * const [err, response] = await safeFetch('https://example.com');
 */
export function w<Callback extends (...params: any[]) => Promise<any>>(
	callback: Callback,
): (
	...params: Parameters<Callback>
) => Promise<[NonNull, null] | [null, Awaited<ReturnType<Callback>>]>;
// Overload for sync callback
export function w<Callback extends (...params: any[]) => any>(
	callback: Callback,
): (...params: Parameters<Callback>) => [NonNull, null] | [null, ReturnType<Callback>];

export function w<Callback extends (...params: any[]) => any>(callback: Callback) {
	return (...params: Parameters<Callback>) => {
		try {
			const result = callback(...params);
			if (result && typeof result.then === 'function') {
				// It's a Promise (async)
				return result
					.then((value: any) => [null, value] as [null, Awaited<ReturnType<Callback>>])
					.catch((error: any) => {
						if (error === null) return [new NullError(), null] as [NonNull, null];
						return [error as NonNull, null] as [NonNull, null];
					});
			}
			// Synchronous
			return [null, result as ReturnType<Callback>];
		} catch (error) {
			if (error === null) return [new NullError(), null];
			return [error as NonNull, null];
		}
	};
}

/**
 * Executes a callback function (sync or async) immediately, capturing errors and returning them in a tuple.
 * You can pass an already defined function (e.g. x(foo())) or an anonymous function (e.g. x(() => 'hello world')).
 * Both can be async.
 *
 * @template Callback - The type of the callback function.
 * @param callback - The callback function to execute.
 * @param params - Parameters to pass to the callback function.
 * @returns A tuple: [error, result]. If no error occurs, error is null.
 *          For async callbacks, returns a Promise resolving to the tuple.
 *
 * @example
 * // Synchronous usage with anonymous function
 * const [err, result] = x(() => 'hello world');
 *
 * // Synchronous usage with defined function
 * function foo() { return 42; }
 * const [err, result] = x(foo);
 *
 * // Asynchronous usage with anonymous function
 * const [err, result] = await x(async () => await fetch('https://example.com'));
 *
 * // Asynchronous usage with defined function
 * async function fetchData() { return await fetch('https://example.com'); }
 * const [err, result] = await x(fetchData);
 */
export function x<Callback extends (...params: any[]) => Promise<any>>(
	callback: Callback,
	...params: Parameters<Callback>
): Promise<[NonNull, null] | [null, Awaited<ReturnType<Callback>>]>;
// Overload for sync callback
export function x<Callback extends (...params: any[]) => any>(
	callback: Callback,
	...params: Parameters<Callback>
): [NonNull, null] | [null, ReturnType<Callback>];

export function x<Callback extends (...params: any[]) => any>(
	callback: Callback,
	...params: Parameters<Callback>
) {
	try {
		const result = callback(...params);
		if (result && typeof result.then === 'function') {
			// It's a Promise (async)
			return result
				.then((value: any) => [null, value] as [null, Awaited<ReturnType<Callback>>])
				.catch((error: any) => {
					if (error === null) return [new NullError(), null] as [NonNull, null];
					return [error as NonNull, null] as [NonNull, null];
				});
		}
		// Synchronous
		return [null, result as ReturnType<Callback>];
	} catch (error) {
		if (error === null) return [new NullError(), null];
		return [error as NonNull, null];
	}
}
