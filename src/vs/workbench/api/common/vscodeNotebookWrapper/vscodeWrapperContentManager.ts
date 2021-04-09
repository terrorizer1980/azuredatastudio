/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as azdata from 'azdata';
import * as vscode from 'vscode';

export class VSCodeWrapperContentManager implements azdata.nb.ContentManager {

	constructor() {

	}

	public getNotebookContents(notebookUri: vscode.Uri): Thenable<azdata.nb.INotebookContents> {
		throw new Error('Method not implemented.');
	}
	public save(notebookUri: vscode.Uri, notebook: azdata.nb.INotebookContents): Thenable<azdata.nb.INotebookContents> {
		throw new Error('Method not implemented.');
	}

}
