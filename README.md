# @ntangled/kit

A lightweight, zero-dependency utility for TypeScript. Works seamlessly in **Node.js**, **Bun** and the **Browser**.

> Disclaimer: This is my first "serious" npm lib. There will be typos, bad formulated paragraphs and more - and you are more than welcome to notify me.

## Features

- **Universal**: Works in any environment (Node, Bun, Deno, Browsers).

- **Dual-Build**: Ships with ESM and CommonJS support.

- **Type-Safe**: Full TypeScript support with inference for both sync and async functions.

- **Tiny**: Zero dependencies and minimal footprint.

## Installation

```bash
npm install @ntangled/kit
```

```bash
yarn add @ntangled/kit
```

```bash
bun add @ntangled/kit
```

```bash
pnpm install @ntangled/kit
```

## Documentation

### `s` (Safe)

A lightweight utility for **Go-style error handling** in TypeScript.

Stop nesting your code in `try/catch` blocks. Use `w` (wrap) and `x` (execute) to handle errors as values.

#### Usage

You can import the core utilities from the main entry point or directly from the `safe` subpath. Combine this with `Guard clauses` (_fast exist_) and your error handling becomes much easier.

> Guard clauses are awesome and makes the code more readable and easier to extend. It is not a library but a design pattern you can learn in less than a minute.

```ts
import { x, w } from '@ntangled/kit/safe';
// or
import { s } from '@ntangled/kit';
```

#### Simple Example

```ts
import { x } from '@ntangled/kit/safe';

const foo = () => {
	const [error, value] = x(() => 'Hello safe' as const);

	/*
		type error is : {} | null
		{} meaning everything sinde an error can be every thing

		type value is : null | 'Hello safe'
	*/

	if (error !== null) return console.error(error);

	/*
		type error is : null
		type value is : 'Hello safe'
	*/

	console.log(result.foo); // 'bar'
};

foo();
```

> Note on conditions: The `error` must explicitly be match to not `null` because of the type system.

> Note on return: The early return `Guard clause` is what make the type system work.

If the function you call doesn't return anything you can simply just omit the second entry (`value`). The error will still be return so you can handle it.

#### `x` (Execute)

Executes a function immediately and returns a `[error, result]` tuple.

**Synchronous**

```ts
const [error, result] = x(() => JSON.parse('{"foo": "bar"}'));

if (error !== null) return console.error(error);
console.log(result.foo); // 'bar'
```

**Asynchronous**

```ts
const [fetchErr, response] = await x(() => fetch('https://api.example.com'));
if (fetchErr) {
	// Handle network error
}
```

#### `w` (Wrap)

Wraps a function and returns a new version of that function that always returns a `[error, result]` tuple. This is perfect for defining "safe" versions of existing functions.

Wrapping is useful for functions that already are defined like core JavaScript functions like `JSON.parse`, third-party libraries or your own functions if they already are used and rewriting them is hard do to the other implementations.

```ts
const safeJsonParse = w(JSON.parse);

const [err, data] = safeJsonParse('invalid json');
// err is now a SyntaxError instead of throwing
```

#### Handling Errors

If you have a function that can trow multiple different errors and you want to handle them accordingly you can use the `instanceof` operator. By using this operator TypeScript knows the type within the scope so you can work with its properties.

```ts
import { x, NullError } from '@ntangled/kit/safe';

const foo () => {
	const [error] = x(bar); // bar is just a random function name

	if (error !== null) {
		// in this scope we know error exits

		if (error instanceof NullError) return console.error('A null was thrown');
		if (error instanceof TypeError) return console.error('A TypeError was thrown');
		// ...

		return console.error('A unknown error was thrown');
	}

	// if there is no error you can safely continue your code here...
}
```

**Making a custom error**

Making custom errors can be useful. With this you can add properties to the error and then access them after using the `instanceof` operator.

```ts
export class ValueError extends Error {
	constructor(message: string, value: string) {
		super(message);
		this.name = 'ValueError';

		//  this is a custom value added when the error is thrown
		this.value = value;

		// this makes the instanceof work
		Object.setPrototypeOf(this, ValueError.prototype);
	}
}

// usage
throw new ValueError('message arg', 'value arg');
```

#### Handling `null` Errors

If your code throws `null` (which is technically possible in JS), this library catches it and returns a specific `NullError` class to ensure your error variable is always an actual object.

```ts
import { NullError } from '@ntangled/kit/safe';

const [error] = x(() => {
	throw null;
});

console.log(error instanceof NullError); // true
```

#### Why use this?

Standard `try/catch` blocks create extra indentation and scope-lock your variables:

**The old way:**

```ts
let data;

try {
	data = JSON.parse(str);
} catch (error) {
	// handle error
}

console.log(data); // data is available here, but the code is messy
```

**The `safe` way:**

```ts
const [error, data] = x(() => JSON.parse(str));
if (error) return handle(error);

console.log(data); // Clean, flat, and type-safe
```
