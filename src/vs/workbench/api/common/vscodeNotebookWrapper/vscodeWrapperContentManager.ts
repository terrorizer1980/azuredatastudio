/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as azdata from 'azdata';
import * as vscode from 'vscode';
import { Schemas } from 'vs/base/common/network';
import * as path from 'vs/base/common/path';

export class VSCodeWrapperContentManager implements azdata.nb.ContentManager {

	constructor(
		private readonly _providerId: string,
		private readonly _provider: vscode.NotebookContentProvider,
		private readonly _options: vscode.NotebookDocumentContentOptions | undefined) {
	}

	public async getNotebookContents(notebookUri: vscode.Uri): Promise<azdata.nb.INotebookContents> {
		let openContext: vscode.NotebookDocumentOpenContext = {};
		let notebookData = await this._provider.openNotebook(notebookUri, openContext);
		return this.convertDataToNotebookContents(notebookData);
	}

	public async save(notebookUri: vscode.Uri, notebook: azdata.nb.INotebookContents): Promise<azdata.nb.INotebookContents> {
		let document = this.convertContentsToNotebookDocument(notebookUri, notebook);
		let cancelSource = new vscode.CancellationTokenSource();
		await this._provider.saveNotebook(document, cancelSource.token);
		return notebook;
	}

	private convertDataToNotebookContents(data: vscode.NotebookData): azdata.nb.INotebookContents {
		return undefined;
	}

	private convertContentsToNotebookDocument(notebookUri: vscode.Uri, notebook: azdata.nb.INotebookContents): vscode.NotebookDocument {
		return {
			uri: notebookUri,
			version: undefined,
			fileName: path.basename(notebookUri.fsPath),
			viewType: this._providerId,
			isDirty: undefined,
			isUntitled: notebookUri.scheme === Schemas.untitled,
			cells: this.convertCellContentsToCells(notebook.cells),
			contentOptions: this._options,
			languages: notebook.metadata.language_info?.name ? [notebook.metadata.language_info?.name] : [],
			metadata: {}
		};
	}

	private convertCellContentsToCells(cellContents: azdata.nb.ICellContents[]): vscode.NotebookCell[] {
		return [];
	}
}
