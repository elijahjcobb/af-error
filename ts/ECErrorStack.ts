/**
 *
 * Elijah Cobb
 * elijah@elijahcobb.com
 * https://elijahcobb.com
 *
 *
 * Copyright 2019 Elijah Cobb
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
 * to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
 * OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */

import { ECError } from "./ECError";
import { ECErrorType, ECErrorOriginType } from "./ECErrorTypes";
import { ECArrayList } from "@elijahjcobb/collections";


/**
 * A class representing a collection of ECError instances.
 */
export class ECErrorStack {

	private trace: ECArrayList<ECError> = new ECArrayList<ECError>();

	/**
	 * Tack on a generic error message to this stack instance.
	 * @return {ECErrorStack} The instance.
	 */
	public withGenericError(): ECErrorStack {
		this.addGenericError();
		return this;
	}

	/**
	 * Get the trace of the error stack instance.
	 * @return {ECArrayList<ECError>} An array list of instances of ECError.
	 */
	public getTrace(): ECArrayList<ECError> {

		return this.trace;

	}

	/**
	 * Add an ECError instance to the stack.
	 * @param {ECError} err The error to be added to the stack.
	 */
	public addError(err: ECError): void {

		this.trace.insert(err, 0);

	}

	/**
	 * Create an error from a message and type and add to the error stack.
	 * @param {Error} error An error instance.
	 * @param {ECErrorOriginType} origin The origin of the error.
	 * @param {AFErrorTypes} type The type of the error.
	 */
	public add(origin: ECErrorOriginType, type: ECErrorType, error: Error): void {

		this.addError(new ECError(origin, type, error));

	}

	/**
	 * Add a generic error to the error stack.
	 */
	public addGenericError(): void {

		this.addError(new ECError(ECErrorOriginType.Unhandled, ECErrorType.InternalUnHandled, new Error("Internal server error.")));

	}

	/**
	 * Print the error stack to the console using the console.error() channel.
	 */
	public print(): void {

		let trace: string = "";

		this.trace.forEach((error: ECError) => {

			trace += `ERROR: ${error.getMessage()} (origin: ${error.getOriginString()}, type: ${error.getTypeString()})\n${error.getStackString()}\n`;

		});

		console.error(trace);

	}

	/**
	 * Get the ECError instance at the top of the trace for the client.
	 * @return {ECError} The client facing error.
	 */
	public getErrorForClient(): ECError {

		return this.trace.get(0);

	}

	/**
	 * Create a new ECErrorStack instance.
	 * @return {ECErrorStack} A new instance of ECErrorStack.
	 */
	public static new(): ECErrorStack {

		return new ECErrorStack();

	}

	/**
	 * Create a new ECErrorStack instance that is already populated with an ECError.
	 * @param {ECErrorOriginType} origin The origin of the error.
	 * @param {ECErrorType} type The type of error.
	 * @param {Error} error An error instance.
	 * @return {ECErrorStack} A new ECErrorStack instance.
	 */
	public static newWithMessageAndType(origin: ECErrorOriginType, type: ECErrorType, error: Error): ECErrorStack {

		let stack: ECErrorStack = new ECErrorStack();
		stack.add(origin, type, error);

		return stack;

	}

}