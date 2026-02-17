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

// Overload for async callback
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

// Overload for async callback
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
