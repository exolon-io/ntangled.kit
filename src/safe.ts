export type NonNull = NonNullable<unknown>;

/**
 * @name px
 * @alias safe promise executor
 * @param callback
 */
export const px = async <Callback extends () => unknown>(callback: Callback) => {
	try {
		const result = await callback();
		return [null, result] as [null, Awaited<ReturnType<Callback>>];
	} catch (error) {
		if (error === null) return [new Error('null') as NonNull, null] as const;
		return [error as NonNull, null] as const;
	}
};

/**
 * @name rx
 * @alias safe result executor
 * @param callback
 */
export const rx = <Callback extends () => unknown>(callback: Callback) => {
	try {
		const result = callback();
		return [null, result] as [null, ReturnType<Callback>];
	} catch (error) {
		if (error === null) return [new Error('null') as NonNull, null] as const;
		return [error as NonNull, null] as const;
	}
};

/**
 * @name pw
 * @alias safe promise wrapper
 * @param callback
 */
export const pw = <Callback extends (...params: any[]) => unknown>(callback: Callback) => {
	return async (...params: Parameters<Callback>) => {
		try {
			const result = await callback(...params);
			return [null, result] as [null, Awaited<ReturnType<Callback>>];
		} catch (error) {
			if (error === null) return [new Error('null') as NonNull, null] as const;
			return [error as NonNull, null] as const;
		}
	};
};

/**
 * @name rw
 * @alias safe result wrapper
 * @param callback
 */
export const rw = <Callback extends (...params: any[]) => unknown>(callback: Callback) => {
	return (...params: Parameters<Callback>) => {
		try {
			const result = callback(...params);
			return [null, result] as [null, ReturnType<Callback>];
		} catch (error) {
			if (error === null) return [new Error('null') as NonNull, null] as const;
			return [error as NonNull, null] as const;
		}
	};
};
