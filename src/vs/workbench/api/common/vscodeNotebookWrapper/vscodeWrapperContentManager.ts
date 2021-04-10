/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as azdata from 'azdata';
import * as vscode from 'vscode';

export class VSCodeWrapperContentManager implements azdata.nb.ContentManager {

	constructor(
		private readonly _providerId: string,
		private readonly _provider: vscode.NotebookContentProvider) {
	}

	public async getNotebookContents(notebookUri: vscode.Uri): Promise<azdata.nb.INotebookContents> {
		let openContext: vscode.NotebookDocumentOpenContext = {};
		let notebookData = await this._provider.openNotebook(notebookUri, openContext);
		return this.convertDataToNotebookContents(notebookData);
	}

	public async save(notebookUri: vscode.Uri, notebook: azdata.nb.INotebookContents): Promise<azdata.nb.INotebookContents> {
		let document = this.convertContentsToNotebookDocument(notebookUri, notebook);
		await this._provider.saveNotebook(document, undefined);
		return notebook;
	}

	private convertDataToNotebookContents(data: vscode.NotebookData): azdata.nb.INotebookContents {
		return undefined;
	}

	private convertContentsToNotebookDocument(notebookUri: vscode.Uri, notebook: azdata.nb.INotebookContents): vscode.NotebookDocument {
		return undefined;
	}
}
