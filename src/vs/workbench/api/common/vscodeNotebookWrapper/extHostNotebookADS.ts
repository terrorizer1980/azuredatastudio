/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from 'vs/base/common/cancellation';
import { Emitter, Event } from 'vs/base/common/event';
import { URI, UriComponents } from 'vs/base/common/uri';
import { ExtHostNotebookShape, IMainContext, INotebookCellStatusBarListDto, INotebookDocumentPropertiesChangeData, INotebookDocumentsAndEditorsDelta, INotebookEditorPropertiesChangeData, INotebookEditorViewColumnInfo } from 'vs/workbench/api/common/extHost.protocol';
import { ILogService } from 'vs/platform/log/common/log';
import { ExtHostCommands } from 'vs/workbench/api/common/extHostCommands';
import { ExtHostDocumentsAndEditors } from 'vs/workbench/api/common/extHostDocumentsAndEditors';
import { IExtensionStoragePaths } from 'vs/workbench/api/common/extHostStoragePaths';
import * as extHostTypes from 'vs/workbench/api/common/extHostTypes';
import { WebviewInitData } from 'vs/workbench/api/common/shared/webview';
import { NotebookCellsChangedEventDto, NotebookDataDto } from 'vs/workbench/contrib/notebook/common/notebookCommon';
import * as vscode from 'vscode';
import { MainThreadNotebookShape, SqlMainContext } from 'sql/workbench/api/common/sqlExtHost.protocol';
import { VSCodeWrapperNotebookProvider } from './vscodeWrapperNotebookProvider';
import { VSBuffer } from 'vs/base/common/buffer';

export class ExtHostNotebookController implements ExtHostNotebookShape {
	private readonly _proxy: MainThreadNotebookShape;

	private readonly _providerMap = new Map<string, VSCodeWrapperNotebookProvider>();

	constructor(
		mainContext: IMainContext,
		commands: ExtHostCommands,
		documentsAndEditors: ExtHostDocumentsAndEditors,
		webviewInitData: WebviewInitData,
		logService: ILogService,
		extensionStoragePaths: IExtensionStoragePaths,
	) {
		this._proxy = mainContext.getProxy(SqlMainContext.MainThreadNotebook);
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

	private readonly _onDidChangeCellMetadata = new Emitter<vscode.NotebookCellMetadataChangeEvent>();
	public readonly onDidChangeCellMetadata = this._onDidChangeCellMetadata.event;

	private readonly _onDidChangeNotebookCellExecutionState = new Emitter<vscode.NotebookCellExecutionStateChangeEvent>();
	public readonly onDidChangeNotebookCellExecutionState = this._onDidChangeNotebookCellExecutionState.event;

	// private _onDidChangeActiveNotebookKernel = new Emitter<{ document: vscode.NotebookDocument, kernel: vscode.NotebookKernel | undefined; }>();
	// public readonly onDidChangeActiveNotebookKernel = this._onDidChangeActiveNotebookKernel.event;

	public registerNotebookContentProvider(notebookType: string, provider: vscode.NotebookContentProvider, options?: vscode.NotebookDocumentContentOptions): vscode.Disposable {
		if (!notebookType) {
			throw new Error('Content provider\'s view type was not defined.');
		}

		let wrapperProvider = this._providerMap.get(notebookType);
		if (!wrapperProvider) {
			wrapperProvider = new VSCodeWrapperNotebookProvider(notebookType);
			this._providerMap[notebookType] = wrapperProvider;
		}
		wrapperProvider.setNotebookContentProvider(notebookType, provider, options);

		// TODO: call proxy's registerNotebookKernelProvider method here
		this._proxy.$registerNotebookProvider(undefined, -1);

		return undefined;
	}

	// public registerNotebookKernelProvider(extension: IExtensionDescription, selector: vscode.NotebookDocumentFilter, provider: vscode.NotebookKernelProvider): vscode.Disposable {
	// 	let addNewProvider = (viewType: string) => {
	// 		let wrapperProvider = this._providerMap.get(viewType);
	// 		if (!wrapperProvider) {
	// 			wrapperProvider = new VSCodeWrapperNotebookProvider(viewType);
	// 			this._providerMap[viewType] = wrapperProvider;
	// 		}
	// 		wrapperProvider.setNotebookKernelProvider(selector, provider);
	// 	};

	// 	if (Array.isArray(selector.viewType)) {
	// 		for (let viewType of selector.viewType) {
	// 			addNewProvider(viewType);
	// 		}
	// 	} else if (selector.viewType) {
	// 		addNewProvider(selector.viewType);
	// 	} else {
	// 		throw new Error('Kernel provider\'s view type was not defined.');
	// 	}

	// 	// TODO: call proxy's registerNotebookKernelProvider method here
	// 	this._proxy.$registerNotebookProvider(undefined, -1);

	// 	return undefined;
	// }

	public registerNotebookSerializer(notebookType: string, serializer: vscode.NotebookSerializer, options?: vscode.NotebookDocumentContentOptions): vscode.Disposable {
		throw new Error('Method not implemented.');
	}

	public registerNotebookCellStatusBarItemProvider(selector: vscode.NotebookSelector, provider: vscode.NotebookCellStatusBarItemProvider): vscode.Disposable {
		throw new Error('Method not implemented.');
	}

	public get notebookDocuments(): vscode.NotebookDocument[] {
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

	public get visibleNotebookEditors(): vscode.NotebookEditor[] {
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

	$provideNotebookCellStatusBarItems(handle: number, uri: UriComponents, index: number, token: CancellationToken): Promise<INotebookCellStatusBarListDto> {
		throw new Error('Method not implemented.');
	}
	$releaseNotebookCellStatusBarItems(id: number): void {
		throw new Error('Method not implemented.');
	}
	$openNotebook(viewType: string, uri: UriComponents, backupId: string, untitledDocumentData: VSBuffer, token: CancellationToken): Promise<NotebookDataDto> {
		throw new Error('Method not implemented.');
	}
	$saveNotebook(viewType: string, uri: UriComponents, token: CancellationToken): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	$saveNotebookAs(viewType: string, uri: UriComponents, target: UriComponents, token: CancellationToken): Promise<boolean> {
		throw new Error('Method not implemented.');
	}
	$backupNotebook(viewType: string, uri: UriComponents, cancellation: CancellationToken): Promise<string> {
		throw new Error('Method not implemented.');
	}
	$dataToNotebook(handle: number, data: VSBuffer, token: CancellationToken): Promise<NotebookDataDto> {
		throw new Error('Method not implemented.');
	}
	$notebookToData(handle: number, data: NotebookDataDto, token: CancellationToken): Promise<VSBuffer> {
		throw new Error('Method not implemented.');
	}
	$acceptDocumentAndEditorsDelta(delta: INotebookDocumentsAndEditorsDelta): void {
		throw new Error('Method not implemented.');
	}
	$acceptModelChanged(uriComponents: UriComponents, event: NotebookCellsChangedEventDto, isDirty: boolean): void {
		throw new Error('Method not implemented.');
	}
	$acceptDirtyStateChanged(uriComponents: UriComponents, isDirty: boolean): void {
		throw new Error('Method not implemented.');
	}
	$acceptModelSaved(uriComponents: UriComponents): void {
		throw new Error('Method not implemented.');
	}
	$acceptDocumentPropertiesChanged(uriComponents: UriComponents, data: INotebookDocumentPropertiesChangeData): void {
		throw new Error('Method not implemented.');
	}
	$acceptEditorPropertiesChanged(id: string, data: INotebookEditorPropertiesChangeData): void {
		throw new Error('Method not implemented.');
	}
	$acceptEditorViewColumns(data: INotebookEditorViewColumnInfo): void {
		throw new Error('Method not implemented.');
	}

	//#endregion

	//#region Extra internal methods

	public lookupNotebookDocument(uri: URI): vscode.NotebookDocument | undefined {
		return undefined;
	}

	public createNotebookCellStatusBarItemInternal(cell: vscode.NotebookCell, alignment: extHostTypes.NotebookCellStatusBarAlignment | undefined, priority: number | undefined): vscode.NotebookCellStatusBarItem {
		throw new Error('Method not implemented.');
	}

	public cancelOneNotebookCellExecution(cell: vscode.NotebookCell): void {
		throw new Error('Method not implemented.');
	}

	public getEditorById(editorId: string): vscode.NotebookEditor | undefined {
		throw new Error('Method not implemented.');
	}

	public getIdByEditor(editor: vscode.NotebookEditor): string | undefined {
		throw new Error('Method not implemented.');
	}

	public createNotebookCellExecution(docUri: vscode.Uri, index: number, kernelId: string): vscode.NotebookCellExecutionTask | undefined {
		throw new Error('Method not implemented.');
	}

	//#endregion
}
