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
		let cells = this.convertCellContentsToCells(notebookUri, notebook.cells, notebook?.metadata?.language_info?.name);
		return {
			uri: notebookUri,
			version: undefined,
			fileName: path.basename(notebookUri.fsPath),
			viewType: this._providerId,
			isDirty: undefined,
			isUntitled: notebookUri.scheme === Schemas.untitled,
			cells: cells,
			contentOptions: this._options,
			metadata: new vscode.NotebookDocumentMetadata(),
			save(): Promise<boolean> {
				return Promise.resolve(true);
			}
		};
	}

	private convertCellContentsToCells(notebookUri: vscode.Uri, cellContents: azdata.nb.ICellContents[], language: string): vscode.NotebookCell[] {
		let cellCount = 0;
		return cellContents.map(content => {
			return {
				index: cellCount++,
				notebook: undefined, // Not used
				uri: notebookUri,
				cellKind: content.cell_type === CellTypes.Code ? vscode.NotebookCellKind.Code : vscode.NotebookCellKind.Markdown,
				document: this.convertSourceTextToDocument(content.source),
				language: language,
				outputs: this.convertCellOutputs(content.outputs),
				metadata: new vscode.NotebookCellMetadata()
			};
		});
	}

	private convertCellOutputs(outputs: azdata.nb.ICellOutput[]): vscode.NotebookCellOutput[] {
		if (!outputs) {
			return [];
		}
		return outputs.map<vscode.NotebookCellOutput>(output => {
			let convertedMetadata: Record<string, any> = undefined;
			if (output.metadata?.azdata_chartOptions) {
				convertedMetadata = {};
				convertedMetadata['azdata_chartOptions'] = output.metadata?.azdata_chartOptions;
			}
			switch (output.output_type) {
				case 'execute_result':
					// let executeResult = output as azdata.nb.IExecuteResult;
					return new vscode.NotebookCellOutput(
						[],
						undefined, // Not used
						convertedMetadata
					);
				case 'display_data':
					// let displayData = output as azdata.nb.IDisplayData;
					return new vscode.NotebookCellOutput(
						[],
						undefined, // Not used
						convertedMetadata
					);
				case 'stream':
					// let streamResult = output as azdata.nb.IStreamResult;
					return new vscode.NotebookCellOutput(
						[],
						undefined, // Not used
						convertedMetadata
					);
				case 'error':
					// let errorResult = output as azdata.nb.IErrorResult;
					return new vscode.NotebookCellOutput(
						[new vscode.NotebookCellOutputItem(undefined, undefined, undefined)],
						undefined, // Not used
						convertedMetadata
					);
				case 'update_display_data':
					// let updateDisplayData = output as azdata.nb.IUpdateDisplayData;
					return new vscode.NotebookCellOutput(
						[],
						undefined, // Not used
						convertedMetadata
					);
				default:
					throw new Error(`Unsupported output type: ${output.output_type}`);
			}
		});
	}

	private convertSourceTextToDocument(source: string | string[]): vscode.TextDocument {
		return undefined;
	}
}
