/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as azdata from 'azdata';
import * as vscode from 'vscode';

export class VSCodeWrapperNotebookManager implements azdata.nb.NotebookManager {
	private _notebookType: string | undefined;
	private _contentProvider: vscode.NotebookContentProvider | undefined;

	private _kernelDocSelector: vscode.NotebookDocumentFilter | undefined;
	private _kernelProvider: vscode.NotebookKernelProvider | undefined;
	private _contentOptions: vscode.NotebookDocumentContentOptions | undefined;

	public constructor() {

	}

	public get contentManager(): azdata.nb.ContentManager {
		return undefined;
	}

	public get sessionManager(): azdata.nb.SessionManager {
		return undefined;
	}

	public get serverManager(): azdata.nb.ServerManager {
		return undefined;
	}

	public get notebookType(): string {
		return this._notebookType;
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
}
