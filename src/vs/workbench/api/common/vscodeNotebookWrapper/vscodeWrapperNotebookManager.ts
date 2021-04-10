/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as azdata from 'azdata';
import { VSCodeWrapperContentManager } from 'vs/workbench/api/common/vscodeNotebookWrapper/vscodeWrapperContentManager';
import { VSCodeWrapperSessionManager } from 'vs/workbench/api/common/vscodeNotebookWrapper/vscodeWrapperSessionManager';
import * as vscode from 'vscode';

export class VSCodeWrapperNotebookManager implements azdata.nb.NotebookManager {
	private _contentManager: VSCodeWrapperContentManager;
	private _sessionManager: VSCodeWrapperSessionManager;

	public constructor(private readonly _providerId: string) {

	}

	public get contentManager(): azdata.nb.ContentManager {
		return this._contentManager;
	}

	public get sessionManager(): azdata.nb.SessionManager {
		return this._sessionManager;
	}

	public get serverManager(): azdata.nb.ServerManager {
		return undefined; // No server management required for VSCode extension kernels
	}

	public get notebookType(): string {
		return this._providerId;
	}

	public setNotebookContentProvider(notebookType: string, provider: vscode.NotebookContentProvider, options?: vscode.NotebookDocumentContentOptions): void {
		if (this._contentManager) {
			throw new Error('Notebook content provider already defined.');
		}

		if (notebookType !== this._providerId) {
			throw new Error('Content provider does not match the view type for this notebook manager.');
		}

		this._contentManager = new VSCodeWrapperContentManager(this._providerId, provider);
	}

	public setNotebookKernelProvider(selector: vscode.NotebookDocumentFilter, provider: vscode.NotebookKernelProvider): void {
		if (this._sessionManager) {
			throw new Error('Notebook kernel provider already defined.');
		}

		let viewTypeIsArray = Array.isArray(selector.viewType);
		if (viewTypeIsArray && !selector.viewType?.includes(this._providerId)
			|| !viewTypeIsArray && selector.viewType !== this._providerId) {
			throw new Error('Kernel provider does not match the view type for this notebook manager.');
		}

		this._sessionManager = new VSCodeWrapperSessionManager(this._providerId, selector, provider);
	}
}
