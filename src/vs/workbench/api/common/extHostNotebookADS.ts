/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from 'vs/base/common/cancellation';
import { Emitter, Event } from 'vs/base/common/event';
import { URI, UriComponents } from 'vs/base/common/uri';
import { IExtensionDescription } from 'vs/platform/extensions/common/extensions';
import { ExtHostNotebookShape, IMainContext, INotebookDocumentPropertiesChangeData, INotebookDocumentsAndEditorsDelta, INotebookEditorPropertiesChangeData } from 'vs/workbench/api/common/extHost.protocol';
import { ILogService } from 'vs/platform/log/common/log';
import { ExtHostCommands } from 'vs/workbench/api/common/extHostCommands';
import { ExtHostDocumentsAndEditors } from 'vs/workbench/api/common/extHostDocumentsAndEditors';
import { IExtensionStoragePaths } from 'vs/workbench/api/common/extHostStoragePaths';
import * as extHostTypes from 'vs/workbench/api/common/extHostTypes';
import { WebviewInitData } from 'vs/workbench/api/common/shared/webview';
import { INotebookDisplayOrder, INotebookKernelInfoDto2, NotebookCellsChangedEventDto, NotebookDataDto } from 'vs/workbench/contrib/notebook/common/notebookCommon';
import * as vscode from 'vscode';
import { ExtHostNotebookDocument } from './extHostNotebookDocument';
import { ExtHostNotebookEditor } from './extHostNotebookEditor';

export interface ExtHostNotebookOutputRenderingHandler {
	outputDisplayOrder: INotebookDisplayOrder | undefined;
}

export class ExtHostNotebookController implements ExtHostNotebookShape, ExtHostNotebookOutputRenderingHandler {
	constructor(
		mainContext: IMainContext,
		commands: ExtHostCommands,
		documentsAndEditors: ExtHostDocumentsAndEditors,
		webviewInitData: WebviewInitData,
		logService: ILogService,
		extensionStoragePaths: IExtensionStoragePaths,
	) {

	}

	//#region vscode.notebook APIs

	private _onDidOpenNotebookDocument = new Emitter<vscode.NotebookDocument>();
	public readonly onDidOpenNotebookDocument: Event<vscode.NotebookDocument> = this._onDidOpenNotebookDocument.event;

	private _onDidCloseNotebookDocument = new Emitter<vscode.NotebookDocument>();
	public readonly onDidCloseNotebookDocument: Event<vscode.NotebookDocument> = this._onDidCloseNotebookDocument.event;

	private _onDidSaveNotebookDocument = new Emitter<vscode.NotebookDocument>();
	public readonly onDidSaveNotebookDocument: Event<vscode.NotebookDocument> = this._onDidSaveNotebookDocument.event;

	private readonly _onDidChangeNotebookDocumentMetadata = new Emitter<vscode.NotebookDocumentMetadataChangeEvent>();
	public readonly onDidChangeNotebookDocumentMetadata = this._onDidChangeNotebookDocumentMetadata.event;

	private readonly _onDidChangeNotebookCells = new Emitter<vscode.NotebookCellsChangeEvent>();
	public readonly onDidChangeNotebookCells = this._onDidChangeNotebookCells.event;

	private readonly _onDidChangeCellOutputs = new Emitter<vscode.NotebookCellOutputsChangeEvent>();
	public readonly onDidChangeCellOutputs = this._onDidChangeCellOutputs.event;

	private readonly _onDidChangeCellLanguage = new Emitter<vscode.NotebookCellLanguageChangeEvent>();
	public readonly onDidChangeCellLanguage = this._onDidChangeCellLanguage.event;

	private readonly _onDidChangeCellMetadata = new Emitter<vscode.NotebookCellMetadataChangeEvent>();
	public readonly onDidChangeCellMetadata = this._onDidChangeCellMetadata.event;

	private _onDidChangeActiveNotebookKernel = new Emitter<{ document: vscode.NotebookDocument, kernel: vscode.NotebookKernel | undefined; }>();
	public readonly onDidChangeActiveNotebookKernel = this._onDidChangeActiveNotebookKernel.event;

	public registerNotebookContentProvider(
		extension: IExtensionDescription,
		viewType: string,
		provider: vscode.NotebookContentProvider,
		options?: vscode.NotebookDocumentContentOptions & {
			viewOptions?: {
				displayName: string;
				filenamePattern: vscode.NotebookFilenamePattern[];
				exclusive?: boolean;
			};
		}
	): vscode.Disposable {
		throw new Error('Method not implemented.');
	}

	public registerNotebookKernelProvider(extension: IExtensionDescription, selector: vscode.NotebookDocumentFilter, provider: vscode.NotebookKernelProvider): vscode.Disposable {
		throw new Error('Method not implemented.');
	}

	public get notebookDocuments(): ExtHostNotebookDocument[] {
		return [];
	}

	public createNotebookEditorDecorationType(options: vscode.NotebookDecorationRenderOptions): vscode.NotebookEditorDecorationType {
		throw new Error('Method not implemented.');
	}

	public async openNotebookDocument(uriComponents: UriComponents, viewType?: string): Promise<vscode.NotebookDocument> {
		throw new Error('Method not implemented.');
	}

	//#endregion

	//#region vscode.window APIs
	public get visibleNotebookEditors(): ExtHostNotebookEditor[] {
		return [];
	}

	private _onDidChangeVisibleNotebookEditors = new Emitter<vscode.NotebookEditor[]>();
	public readonly onDidChangeVisibleNotebookEditors = this._onDidChangeVisibleNotebookEditors.event;

	public get activeNotebookEditor(): vscode.NotebookEditor | undefined {
		throw new Error('Method not implemented.');
	}

	private readonly _onDidChangeActiveNotebookEditor = new Emitter<vscode.NotebookEditor | undefined>();
	public readonly onDidChangeActiveNotebookEditor = this._onDidChangeActiveNotebookEditor.event;

	private readonly _onDidChangeNotebookEditorSelection = new Emitter<vscode.NotebookEditorSelectionChangeEvent>();
	public readonly onDidChangeNotebookEditorSelection = this._onDidChangeNotebookEditorSelection.event;

	private readonly _onDidChangeNotebookEditorVisibleRanges = new Emitter<vscode.NotebookEditorVisibleRangesChangeEvent>();
	public readonly onDidChangeNotebookEditorVisibleRanges = this._onDidChangeNotebookEditorVisibleRanges.event;

	public async showNotebookDocument(notebookDocument: vscode.NotebookDocument, options?: vscode.NotebookDocumentShowOptions): Promise<vscode.NotebookEditor> {
		throw new Error('Method not implemented.');
	}
	//#endregion

	//#region ExtHostNotebookShape

	public async $provideNotebookKernels(handle: number, uri: UriComponents, token: CancellationToken): Promise<INotebookKernelInfoDto2[]> {
		throw new Error('Method not implemented.');
	}

	public async $resolveNotebookKernel(handle: number, editorId: string, uri: UriComponents, kernelId: string, token: CancellationToken): Promise<void> {
		throw new Error('Method not implemented.');
	}

	public async $resolveNotebookData(viewType: string, uri: UriComponents, backupId?: string): Promise<NotebookDataDto> {
		throw new Error('Method not implemented.');
	}

	public async $resolveNotebookEditor(viewType: string, uri: UriComponents, editorId: string): Promise<void> {
		throw new Error('Method not implemented.');
	}

	public async $executeNotebookKernelFromProvider(handle: number, uri: UriComponents, kernelId: string, cellHandle: number | undefined): Promise<void> {
		throw new Error('Method not implemented.');
	}

	public async $cancelNotebookKernelFromProvider(handle: number, uri: UriComponents, kernelId: string, cellHandle: number | undefined): Promise<void> {
		throw new Error('Method not implemented.');
	}

	public async $saveNotebook(viewType: string, uri: UriComponents, token: CancellationToken): Promise<boolean> {
		throw new Error('Method not implemented.');
	}

	public async $saveNotebookAs(viewType: string, uri: UriComponents, target: UriComponents, token: CancellationToken): Promise<boolean> {
		throw new Error('Method not implemented.');
	}

	public async $undoNotebook(viewType: string, uri: UriComponents, editId: number, isDirty: boolean): Promise<void> {
		throw new Error('Method not implemented.');
	}

	public async $redoNotebook(viewType: string, uri: UriComponents, editId: number, isDirty: boolean): Promise<void> {
		throw new Error('Method not implemented.');
	}

	public async $backup(viewType: string, uri: UriComponents, cancellation: CancellationToken): Promise<string | undefined> {
		throw new Error('Method not implemented.');
	}

	public $acceptDisplayOrder(displayOrder: INotebookDisplayOrder): void {
		throw new Error('Method not implemented.');
	}

	public $acceptNotebookActiveKernelChange(event: { uri: UriComponents, providerHandle: number | undefined, kernelId: string | undefined; }): void {
		throw new Error('Method not implemented.');
	}

	public $onDidReceiveMessage(editorId: string, forRendererType: string | undefined, message: any): void {
		throw new Error('Method not implemented.');
	}

	public $acceptModelChanged(uriComponents: UriComponents, event: NotebookCellsChangedEventDto, isDirty: boolean): void {
		throw new Error('Method not implemented.');
	}

	public $acceptModelSaved(uriComponents: UriComponents): void {
		throw new Error('Method not implemented.');
	}

	public $acceptEditorPropertiesChanged(id: string, data: INotebookEditorPropertiesChangeData): void {
		throw new Error('Method not implemented.');
	}

	public $acceptDocumentPropertiesChanged(uriComponents: UriComponents, data: INotebookDocumentPropertiesChangeData): void {
		throw new Error('Method not implemented.');
	}

	public $acceptDocumentAndEditorsDelta(delta: INotebookDocumentsAndEditorsDelta): void {
		throw new Error('Method not implemented.');
	}

	//#endregion

	//#region ExtHostNotebookOutputRenderingHandler

	public get outputDisplayOrder(): INotebookDisplayOrder | undefined {
		throw new Error('Method not implemented.');
	}

	//#endregion

	//#region Extra internal methods

	public lookupNotebookDocument(uri: URI): ExtHostNotebookDocument | undefined {
		return undefined;
	}

	public createNotebookCellStatusBarItemInternal(cell: vscode.NotebookCell, alignment: extHostTypes.NotebookCellStatusBarAlignment | undefined, priority: number | undefined): vscode.NotebookCellStatusBarItem {
		throw new Error('Method not implemented.');
	}

	//#endregion
}
