import { NonNull } from './types';

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
 * Safely executes an async callback, returning a tuple of [error, result].
 * Never throws; errors are returned as the first tuple element.
 *
 * @template Callback
 * @param {Callback} callback - An async function to execute.
 * @returns {Promise<[NonNull|null, Awaited<ReturnType<Callback>>|null]>} Tuple: [error, result].
 * @example
 *   const [err, data] = await px(async () => await fetchData());
 */
export const px = async <Callback extends () => unknown>(callback: Callback) => {
	try {
		const result = await callback();
		return [null, result] as [null, Awaited<ReturnType<Callback>>];
	} catch (error) {
		if (error === null) return [new NullError() as NonNull, null] as const;
		return [error as NonNull, null] as const;
	}
};

/**
 * Safely executes a synchronous callback, returning a tuple of [error, result].
 * Never throws; errors are returned as the first tuple element.
 *
 * @template Callback
 * @param {Callback} callback - A synchronous function to execute.
 * @returns {[NonNull|null, ReturnType<Callback>|null]} Tuple: [error, result].
 * @example
 *   const [err, value] = rx(() => computeValue());
 */
export const rx = <Callback extends () => unknown>(callback: Callback) => {
	try {
		const result = callback();
		return [null, result] as [null, ReturnType<Callback>];
	} catch (error) {
		if (error === null) return [new NullError() as NonNull, null] as const;
		return [error as NonNull, null] as const;
	}
};

/**
 * Wraps an async function to always return a tuple of [error, result].
 * Returned function never throws; errors are returned as the first tuple element.
 *
 * @template Callback
 * @param {Callback} callback - An async function to wrap.
 * @returns {(...params: Parameters<Callback>) => Promise<[NonNull|null, Awaited<ReturnType<Callback>>|null]>}
 *   Wrapped function returning [error, result].
 * @example
 *   const safeFetch = pw(fetchData);
 *   const [err, data] = await safeFetch(arg1, arg2);
 */
export const pw = <Callback extends (...params: any[]) => unknown>(callback: Callback) => {
	return async (...params: Parameters<Callback>) => {
		try {
			const result = await callback(...params);
			return [null, result] as [null, Awaited<ReturnType<Callback>>];
		} catch (error) {
			if (error === null) return [new NullError() as NonNull, null] as const;
			return [error as NonNull, null] as const;
		}
	};
};

/**
 * Wraps a synchronous function to always return a tuple of [error, result].
 * Returned function never throws; errors are returned as the first tuple element.
 *
 * @template Callback
 * @param {Callback} callback - A synchronous function to wrap.
 * @returns {(...params: Parameters<Callback>) => [NonNull|null, ReturnType<Callback>|null]}
 *   Wrapped function returning [error, result].
 * @example
 *   const safeCompute = rw(computeValue);
 *   const [err, value] = safeCompute(arg1, arg2);
 */
export const rw = <Callback extends (...params: any[]) => unknown>(callback: Callback) => {
	return (...params: Parameters<Callback>) => {
		try {
			const result = callback(...params);
			return [null, result] as [null, ReturnType<Callback>];
		} catch (error) {
			if (error === null) return [new NullError() as NonNull, null] as const;
			return [error as NonNull, null] as const;
		}
	};
};
