/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as azdata from 'azdata';
import * as vscode from 'vscode';
import { VSCodeWrapperNotebookManager } from 'vs/workbench/api/common/vscodeNotebookWrapper/vscodeWrapperNotebookManager';

/**
 * This class is used as a shim between the VSCode notebook APIs and the ADS ones.
 * It takes a NotebookContentProvider and a NotebookKernelProvider, and wraps them
 * in NotebookProvider APIs.
 */
export class VSCodeWrapperNotebookProvider implements azdata.nb.NotebookProvider {
	private readonly _notebookManager: VSCodeWrapperNotebookManager;

	constructor(private readonly _providerId: string) {
		this._notebookManager = new VSCodeWrapperNotebookManager();
	}

	public setNotebookContentProvider(notebookType: string, provider: vscode.NotebookContentProvider, options?: vscode.NotebookDocumentContentOptions): void {
		this._notebookManager.setNotebookContentProvider(notebookType, provider, options);
	}

	public setNotebookKernelProvider(selector: vscode.NotebookDocumentFilter, provider: vscode.NotebookKernelProvider): void {
		this._notebookManager.setNotebookKernelProvider(selector, provider);
	}

	public get providerId(): string {
		return this._providerId;
	}

	public get standardKernels(): azdata.nb.IStandardKernel[] {
		return []; // This property is deprecated, so returning an empty array here is intentional.
	}

	public getNotebookManager(notebookUri: vscode.Uri): Thenable<azdata.nb.NotebookManager> {
		return Promise.resolve(this._notebookManager);
	}

	public handleNotebookClosed(notebookUri: vscode.Uri): void {
		throw new Error('Method not implemented.');
	}
}
