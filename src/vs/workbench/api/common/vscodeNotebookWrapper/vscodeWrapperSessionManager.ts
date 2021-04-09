/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as azdata from 'azdata';
// import * as vscode from 'vscode';

export class VSCodeWrapperSessionManager implements azdata.nb.SessionManager {

	constructor() {

	}

	public get isReady(): boolean {
		return false;
	}
	public get ready(): Thenable<void> {
		return Promise.reject('Method not implemented.');
	}
	public get specs(): azdata.nb.IAllKernels {
		return undefined;
	}

	public startNew(options: azdata.nb.ISessionOptions): Thenable<azdata.nb.ISession> {
		throw new Error('Method not implemented.');
	}
	public shutdown(id: string): Thenable<void> {
		throw new Error('Method not implemented.');
	}
	public shutdownAll(): Thenable<void> {
		throw new Error('Method not implemented.');
	}
	public dispose(): void {
		throw new Error('Method not implemented.');
	}
}
