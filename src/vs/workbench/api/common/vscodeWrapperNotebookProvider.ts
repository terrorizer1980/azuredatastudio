/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as azdata from 'azdata';
import * as vscode from 'vscode';

/**
 * This class is used as a shim between the VSCode notebook APIs and the ADS ones.
 * It takes a NotebookContentProvider and a NotebookKernelProvider, and wraps them
 * in NotebookProvider APIs.
 */
export class VSCodeWrapperNotebookProvider implements azdata.nb.NotebookProvider {

	private _notebookType: string | undefined;
	private _contentProvider: vscode.NotebookContentProvider | undefined;

	private _kernelDocSelector: vscode.NotebookDocumentFilter | undefined;
	private _kernelProvider: vscode.NotebookKernelProvider | undefined;
	private _contentOptions: vscode.NotebookDocumentContentOptions | undefined;

	constructor() {
	}

	public setNotebookContentProvider(notebookType: string, provider: vscode.NotebookContentProvider, options?: vscode.NotebookDocumentContentOptions): void {
		if (this._contentProvider || this._notebookType) {
			throw new Error('Notebook content provider already defined.');
		}

		if (this._kernelDocSelector) {
			let viewTypeIsArray = Array.isArray(this._kernelDocSelector.viewType);
			if (viewTypeIsArray && !this._kernelDocSelector.viewType?.includes(notebookType)
				|| !viewTypeIsArray && this._kernelDocSelector.viewType !== notebookType) {
				throw new Error('Kernel provider does not match the view type for the registered content provider.');
			}
		}

		this._notebookType = notebookType;
		this._contentProvider = provider;
		this._contentOptions = options;
	}

	public setNotebookKernelProvider(selector: vscode.NotebookDocumentFilter, provider: vscode.NotebookKernelProvider): void {
		if (this._kernelProvider || this._kernelDocSelector) {
			throw new Error('Notebook kernel provider already defined.');
		}

		if (this._notebookType) {
			let viewTypeIsArray = Array.isArray(selector.viewType);
			if (viewTypeIsArray && !selector.viewType?.includes(this._notebookType)
				|| !viewTypeIsArray && selector.viewType !== this._notebookType) {
				throw new Error('Kernel provider does not match the view type for the registered content provider.');
			}
		}

		this._kernelDocSelector = selector;
		this._kernelProvider = provider;
	}

	public get providerId(): string {
		return this._notebookType;
	}

	public get standardKernels(): azdata.nb.IStandardKernel[] {
		return [];
	}

	public getNotebookManager(notebookUri: vscode.Uri): Thenable<azdata.nb.NotebookManager> {
		throw new Error('Method not implemented.');
	}

	public handleNotebookClosed(notebookUri: vscode.Uri): void {
		throw new Error('Method not implemented.');
	}
}
