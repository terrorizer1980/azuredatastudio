/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as azdata from 'azdata';
import * as vscode from 'vscode';
import { Schemas } from 'vs/base/common/network';
import * as path from 'vs/base/common/path';
import { CellTypes } from 'sql/workbench/services/notebook/common/contracts';

export class VSCodeWrapperContentManager implements azdata.nb.ContentManager {

	constructor(
		private readonly _providerId: string,
		private readonly _provider: vscode.NotebookContentProvider,
		private readonly _options: vscode.NotebookDocumentContentOptions | undefined) {
	}

	public async getNotebookContents(notebookUri: vscode.Uri): Promise<azdata.nb.INotebookContents> {
		let openContext: vscode.NotebookDocumentOpenContext = {};
		let cancelSource = new vscode.CancellationTokenSource();
		let notebookData = await this._provider.openNotebook(notebookUri, openContext, cancelSource.token);
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
		let cells = this.convertCellContentsToCells(notebookUri, notebook.cells);
		return {
			uri: notebookUri,
			version: undefined,
			fileName: path.basename(notebookUri.fsPath),
			isDirty: undefined,
			isUntitled: notebookUri.scheme === Schemas.untitled,
			isClosed: undefined,
			metadata: new vscode.NotebookDocumentMetadata(),
			viewType: this._providerId,
			cellCount: cells.length,
			cellAt(index: number): vscode.NotebookCell {
				return cells[index];
			},
			getCells(): vscode.NotebookCell[] {
				return cells;
			},
			save(): Thenable<boolean> {
				return Promise.resolve(false);
			}
		};
	}

	private convertCellContentsToCells(notebookUri: vscode.Uri, cellContents: azdata.nb.ICellContents[]): vscode.NotebookCell[] {
		let cellCount = 0;
		return cellContents.map(content => {
			return {
				index: cellCount++,
				notebook: undefined, // Not used
				kind: content.cell_type === CellTypes.Code ? vscode.NotebookCellKind.Code : vscode.NotebookCellKind.Markdown,
				document: this.convertSourceTextToDocument(content.source),
				metadata: new vscode.NotebookCellMetadata(),
				outputs: this.convertCellOutputs(content.outputs),
				latestExecutionSummary: {
					executionOrder: content.execution_count
				}
			};
		});
	}

	private convertCellOutputs(outputs: azdata.nb.ICellOutput[]): vscode.NotebookCellOutput[] {
		if (!outputs) {
			return [];
		}
		return [];
	}

	private convertSourceTextToDocument(source: string | string[]): vscode.TextDocument {
		return undefined;
	}

	/*
	export interface ICellContents {
		cell_type: CellType;
		source: string | string[];
		metadata?: ICellMetadata;
		execution_count?: number;
		outputs?: ICellOutput[];
	}

	export interface NotebookCell {
		readonly index: number;
		readonly notebook: NotebookDocument;
		readonly uri: Uri;
		readonly cellKind: CellKind;
		readonly document: TextDocument;
		readonly language: string;
		outputs: CellOutput[];
		metadata: NotebookCellMetadata;
	}
	*/
}
