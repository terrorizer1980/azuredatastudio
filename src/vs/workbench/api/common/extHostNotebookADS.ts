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
import { INotebookDisplayOrder, INotebookKernelInfoDto2, NotebookCellMetadata, NotebookCellsChangedEventDto, NotebookDataDto } from 'vs/workbench/contrib/notebook/common/notebookCommon';
import * as vscode from 'vscode';
import { ExtHostNotebookDocument } from './extHostNotebookDocument';
import { ExtHostNotebookEditor } from './extHostNotebookEditor';

export interface ExtHostNotebookOutputRenderingHandler {
	outputDisplayOrder: INotebookDisplayOrder | undefined;
}

export class ExtHostNotebookController implements ExtHostNotebookShape, ExtHostNotebookOutputRenderingHandler {
	private readonly _onDidChangeNotebookEditorSelection = new Emitter<vscode.NotebookEditorSelectionChangeEvent>();
	readonly onDidChangeNotebookEditorSelection = this._onDidChangeNotebookEditorSelection.event;

	private readonly _onDidChangeNotebookEditorVisibleRanges = new Emitter<vscode.NotebookEditorVisibleRangesChangeEvent>();
	readonly onDidChangeNotebookEditorVisibleRanges = this._onDidChangeNotebookEditorVisibleRanges.event;

	private readonly _onDidChangeNotebookDocumentMetadata = new Emitter<vscode.NotebookDocumentMetadataChangeEvent>();
	readonly onDidChangeNotebookDocumentMetadata = this._onDidChangeNotebookDocumentMetadata.event;

	private readonly _onDidChangeNotebookCells = new Emitter<vscode.NotebookCellsChangeEvent>();
	readonly onDidChangeNotebookCells = this._onDidChangeNotebookCells.event;

	private readonly _onDidChangeCellOutputs = new Emitter<vscode.NotebookCellOutputsChangeEvent>();
	readonly onDidChangeCellOutputs = this._onDidChangeCellOutputs.event;

	private readonly _onDidChangeCellLanguage = new Emitter<vscode.NotebookCellLanguageChangeEvent>();
	readonly onDidChangeCellLanguage = this._onDidChangeCellLanguage.event;

	private readonly _onDidChangeCellMetadata = new Emitter<vscode.NotebookCellMetadataChangeEvent>();
	readonly onDidChangeCellMetadata = this._onDidChangeCellMetadata.event;

	private readonly _onDidChangeActiveNotebookEditor = new Emitter<vscode.NotebookEditor | undefined>();
	readonly onDidChangeActiveNotebookEditor = this._onDidChangeActiveNotebookEditor.event;

	get outputDisplayOrder(): INotebookDisplayOrder | undefined {
		throw new Error('Method not implemented.');
	}

	get activeNotebookEditor(): vscode.NotebookEditor | undefined {
		throw new Error('Method not implemented.');
	}

	private _onDidOpenNotebookDocument = new Emitter<vscode.NotebookDocument>();
	onDidOpenNotebookDocument: Event<vscode.NotebookDocument> = this._onDidOpenNotebookDocument.event;

	private _onDidCloseNotebookDocument = new Emitter<vscode.NotebookDocument>();
	onDidCloseNotebookDocument: Event<vscode.NotebookDocument> = this._onDidCloseNotebookDocument.event;

	private _onDidSaveNotebookDocument = new Emitter<vscode.NotebookDocument>();
	onDidSaveNotebookDocument: Event<vscode.NotebookDocument> = this._onDidSaveNotebookDocument.event;

	visibleNotebookEditors: ExtHostNotebookEditor[] = [];

	private _onDidChangeActiveNotebookKernel = new Emitter<{ document: vscode.NotebookDocument, kernel: vscode.NotebookKernel | undefined; }>();
	onDidChangeActiveNotebookKernel = this._onDidChangeActiveNotebookKernel.event;

	private _onDidChangeVisibleNotebookEditors = new Emitter<vscode.NotebookEditor[]>();
	onDidChangeVisibleNotebookEditors = this._onDidChangeVisibleNotebookEditors.event;

	constructor(
		mainContext: IMainContext,
		commands: ExtHostCommands,
		documentsAndEditors: ExtHostDocumentsAndEditors,
		webviewInitData: WebviewInitData,
		logService: ILogService,
		extensionStoragePaths: IExtensionStoragePaths,
	) {

	}

	get notebookDocuments(): ExtHostNotebookDocument[] {
		throw new Error('Method not implemented.');
	}

	lookupNotebookDocument(uri: URI): ExtHostNotebookDocument | undefined {
		throw new Error('Method not implemented.');
	}

	registerNotebookContentProvider(
		extension: IExtensionDescription,
		viewType: string,
		provider: vscode.NotebookContentProvider,
		options?: {
			transientOutputs: boolean;
			transientMetadata: { [K in keyof NotebookCellMetadata]?: boolean };
			viewOptions?: {
				displayName: string;
				filenamePattern: (vscode.GlobPattern | { include: vscode.GlobPattern; exclude: vscode.GlobPattern })[];
				exclusive?: boolean;
			};
		}
	): vscode.Disposable {
		throw new Error('Method not implemented.');
	}

	registerNotebookKernelProvider(extension: IExtensionDescription, selector: vscode.NotebookDocumentFilter, provider: vscode.NotebookKernelProvider): vscode.Disposable {
		throw new Error('Method not implemented.');
	}

	createNotebookEditorDecorationType(options: vscode.NotebookDecorationRenderOptions): vscode.NotebookEditorDecorationType {
		throw new Error('Method not implemented.');
	}

	async openNotebookDocument(uriComponents: UriComponents, viewType?: string): Promise<vscode.NotebookDocument> {
		throw new Error('Method not implemented.');
	}

	async showNotebookDocument(notebookDocument: vscode.NotebookDocument, options?: vscode.NotebookDocumentShowOptions): Promise<vscode.NotebookEditor> {
		throw new Error('Method not implemented.');
	}

	async $provideNotebookKernels(handle: number, uri: UriComponents, token: CancellationToken): Promise<INotebookKernelInfoDto2[]> {
		throw new Error('Method not implemented.');
	}

	async $resolveNotebookKernel(handle: number, editorId: string, uri: UriComponents, kernelId: string, token: CancellationToken): Promise<void> {
		throw new Error('Method not implemented.');
	}

	async $resolveNotebookData(viewType: string, uri: UriComponents, backupId?: string): Promise<NotebookDataDto> {
		throw new Error('Method not implemented.');
	}

	async $resolveNotebookEditor(viewType: string, uri: UriComponents, editorId: string): Promise<void> {
		throw new Error('Method not implemented.');
	}

	async $executeNotebookKernelFromProvider(handle: number, uri: UriComponents, kernelId: string, cellHandle: number | undefined): Promise<void> {
		throw new Error('Method not implemented.');
	}

	async $cancelNotebookKernelFromProvider(handle: number, uri: UriComponents, kernelId: string, cellHandle: number | undefined): Promise<void> {
		throw new Error('Method not implemented.');
	}

	async $saveNotebook(viewType: string, uri: UriComponents, token: CancellationToken): Promise<boolean> {
		throw new Error('Method not implemented.');
	}

	async $saveNotebookAs(viewType: string, uri: UriComponents, target: UriComponents, token: CancellationToken): Promise<boolean> {
		throw new Error('Method not implemented.');
	}

	async $undoNotebook(viewType: string, uri: UriComponents, editId: number, isDirty: boolean): Promise<void> {
		throw new Error('Method not implemented.');
	}

	async $redoNotebook(viewType: string, uri: UriComponents, editId: number, isDirty: boolean): Promise<void> {
		throw new Error('Method not implemented.');
	}

	async $backup(viewType: string, uri: UriComponents, cancellation: CancellationToken): Promise<string | undefined> {
		throw new Error('Method not implemented.');
	}

	$acceptDisplayOrder(displayOrder: INotebookDisplayOrder): void {
		throw new Error('Method not implemented.');
	}

	$acceptNotebookActiveKernelChange(event: { uri: UriComponents, providerHandle: number | undefined, kernelId: string | undefined; }): void {
		throw new Error('Method not implemented.');
	}

	$onDidReceiveMessage(editorId: string, forRendererType: string | undefined, message: any): void {
		throw new Error('Method not implemented.');
	}

	$acceptModelChanged(uriComponents: UriComponents, event: NotebookCellsChangedEventDto, isDirty: boolean): void {
		throw new Error('Method not implemented.');
	}

	public $acceptModelSaved(uriComponents: UriComponents): void {
		throw new Error('Method not implemented.');
	}

	$acceptEditorPropertiesChanged(id: string, data: INotebookEditorPropertiesChangeData): void {
		throw new Error('Method not implemented.');
	}

	$acceptDocumentPropertiesChanged(uriComponents: UriComponents, data: INotebookDocumentPropertiesChangeData): void {
		throw new Error('Method not implemented.');
	}

	$acceptDocumentAndEditorsDelta(delta: INotebookDocumentsAndEditorsDelta): void {
		throw new Error('Method not implemented.');
	}

	createNotebookCellStatusBarItemInternal(cell: vscode.NotebookCell, alignment: extHostTypes.NotebookCellStatusBarAlignment | undefined, priority: number | undefined): vscode.NotebookCellStatusBarItem {
		throw new Error('Method not implemented.');
	}
}
