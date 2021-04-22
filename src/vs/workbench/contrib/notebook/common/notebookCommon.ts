/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from 'vs/base/common/event';
import * as glob from 'vs/base/common/glob';
import { URI, UriComponents } from 'vs/base/common/uri';
import * as editorCommon from 'vs/editor/common/editorCommon';
import { Command } from 'vs/editor/common/modes';
import { IAccessibilityInformation } from 'vs/platform/accessibility/common/accessibility';
import { ThemeColor } from 'vs/platform/theme/common/themeService';

export enum CellKind {
	Markdown = 1,
	Code = 2
}

export const NOTEBOOK_DISPLAY_ORDER = [
	'application/json',
	'application/javascript',
	'text/html',
	'image/svg+xml',
	'text/markdown',
	'image/png',
	'image/jpeg',
	'text/plain'
];

export enum NotebookRunState {
	Running = 1,
	Idle = 2
}

export const notebookDocumentMetadataDefaults: Required<NotebookDocumentMetadata> = {
	editable: true,
	runnable: true,
	cellEditable: true,
	cellRunnable: true,
	cellHasExecutionOrder: true,
	displayOrder: NOTEBOOK_DISPLAY_ORDER,
	custom: {},
	runState: NotebookRunState.Idle,
	trusted: true
};

export interface NotebookDocumentMetadata {
	editable: boolean;
	runnable: boolean;
	cellEditable: boolean;
	cellRunnable: boolean;
	cellHasExecutionOrder: boolean;
	displayOrder?: (string | glob.IRelativePattern)[];
	custom?: { [key: string]: unknown };
	runState?: NotebookRunState;
	trusted: boolean;
}

export enum NotebookCellRunState {
	Running = 1,
	Idle = 2,
	Success = 3,
	Error = 4
}

export interface NotebookCellMetadata {
	editable?: boolean;
	runnable?: boolean;
	breakpointMargin?: boolean;
	hasExecutionOrder?: boolean;
	executionOrder?: number;
	statusMessage?: string;
	runState?: NotebookCellRunState;
	runStartTime?: number;
	lastRunDuration?: number;
	inputCollapsed?: boolean;
	outputCollapsed?: boolean;
	custom?: { [key: string]: unknown };
}

export type TransientMetadata = { [K in keyof NotebookCellMetadata]?: boolean };

export interface IOutputItemDto {
	readonly mime: string;
	readonly value: unknown;
	readonly metadata?: Record<string, unknown>;
}

export interface IOutputDto {
	outputs: IOutputItemDto[];
	outputId: string;
	metadata?: Record<string, unknown>;
}

export interface ICellOutput {
	outputs: IOutputItemDto[];
	// metadata?: NotebookCellOutsputMetadata;
	outputId: string;
	onDidChangeData: Event<void>;
	replaceData(items: IOutputItemDto[]): void;
	appendData(items: IOutputItemDto[]): void;
}

export interface ICell {
	readonly uri: URI;
	handle: number;
	language: string;
	cellKind: CellKind;
	outputs: ICellOutput[];
	metadata?: NotebookCellMetadata;
	onDidChangeOutputs?: Event<NotebookCellOutputsSplice[]>;
	onDidChangeLanguage: Event<string>;
	onDidChangeMetadata: Event<void>;
}

export type NotebookCellTextModelSplice<T> = [
	number /* start */,
	number,
	T[]
];

export type NotebookCellOutputsSplice = [
	start: number /* start */,
	deleteCount: number /* delete count */,
	newOutputs: ICellOutput[]
];

export interface IMainCellDto {
	handle: number;
	uri: UriComponents,
	source: string[];
	eol: string;
	language: string;
	cellKind: CellKind;
	outputs: IOutputDto[];
	metadata?: NotebookCellMetadata;
}

export enum NotebookCellsChangeType {
	ModelChange = 1,
	Move = 2,
	CellClearOutput = 3,
	CellsClearOutput = 4,
	ChangeLanguage = 5,
	Initialize = 6,
	ChangeCellMetadata = 7,
	Output = 8,
	OutputItem = 9,
	ChangeCellContent = 10,
	ChangeDocumentMetadata = 11,
	Unknown = 12
}

export interface NotebookCellsInitializeEvent<T> {
	readonly kind: NotebookCellsChangeType.Initialize;
	readonly changes: NotebookCellTextModelSplice<T>[];
}

export interface NotebookCellContentChangeEvent {
	readonly kind: NotebookCellsChangeType.ChangeCellContent;
}

export interface NotebookCellsModelChangedEvent<T> {
	readonly kind: NotebookCellsChangeType.ModelChange;
	readonly changes: NotebookCellTextModelSplice<T>[];
}

export interface NotebookCellsModelMoveEvent<T> {
	readonly kind: NotebookCellsChangeType.Move;
	readonly index: number;
	readonly length: number;
	readonly newIdx: number;
	readonly cells: T[];
}

export interface NotebookOutputChangedEvent {
	readonly kind: NotebookCellsChangeType.Output;
	readonly index: number;
	readonly outputs: IOutputDto[];
}

export interface NotebookOutputItemChangedEvent {
	readonly kind: NotebookCellsChangeType.OutputItem;
	readonly index: number;
	readonly outputId: string;
	readonly outputItems: IOutputItemDto[];
	readonly append: boolean;
}

export interface NotebookCellsChangeLanguageEvent {
	readonly kind: NotebookCellsChangeType.ChangeLanguage;
	readonly index: number;
	readonly language: string;
}

export interface NotebookCellsChangeMetadataEvent {
	readonly kind: NotebookCellsChangeType.ChangeCellMetadata;
	readonly index: number;
	readonly metadata: NotebookCellMetadata | undefined;
}

export interface NotebookDocumentChangeMetadataEvent {
	readonly kind: NotebookCellsChangeType.ChangeDocumentMetadata;
	readonly metadata: NotebookDocumentMetadata | undefined;
}

export interface NotebookDocumentUnknownChangeEvent {
	readonly kind: NotebookCellsChangeType.Unknown;
}

export type NotebookRawContentEventDto = NotebookCellsInitializeEvent<IMainCellDto> | NotebookDocumentChangeMetadataEvent | NotebookCellContentChangeEvent | NotebookCellsModelChangedEvent<IMainCellDto> | NotebookCellsModelMoveEvent<IMainCellDto> | NotebookOutputChangedEvent | NotebookOutputItemChangedEvent | NotebookCellsChangeLanguageEvent | NotebookCellsChangeMetadataEvent | NotebookDocumentUnknownChangeEvent;

export type NotebookCellsChangedEventDto = {
	readonly rawEvents: NotebookRawContentEventDto[];
	readonly versionId: number;
};

export const enum CellEditType {
	Replace = 1,
	Output = 2,
	Metadata = 3,
	CellLanguage = 4,
	DocumentMetadata = 5,
	OutputsSplice = 6,
	Move = 7,
	Unknown = 8,
	CellContent = 9,
	OutputItems = 10
}

export interface ICellDto2 {
	source: string;
	language: string;
	cellKind: CellKind;
	outputs: IOutputDto[];
	metadata?: NotebookCellMetadata;
}

export interface ICellReplaceEdit {
	editType: CellEditType.Replace;
	index: number;
	count: number;
	cells: ICellDto2[];
}

export interface ICellOutputEdit {
	editType: CellEditType.Output;
	index: number;
	outputs: IOutputDto[];
	append?: boolean
}

export interface ICellOutputItemEdit {
	editType: CellEditType.OutputItems;
	index: number;
	outputId: string;
	items: IOutputItemDto[];
	append?: boolean;
}

export interface ICellMetadataEdit {
	editType: CellEditType.Metadata;
	index: number;
	metadata: NotebookCellMetadata;
}


export interface ICellLanguageEdit {
	editType: CellEditType.CellLanguage;
	index: number;
	language: string;
}

export interface IDocumentMetadataEdit {
	editType: CellEditType.DocumentMetadata;
	metadata: NotebookDocumentMetadata;
}

export interface ICellMoveEdit {
	editType: CellEditType.Move;
	index: number;
	length: number;
	newIdx: number;
}

export type ICellEditOperation = ICellReplaceEdit | ICellOutputEdit | ICellMetadataEdit | ICellLanguageEdit | IDocumentMetadataEdit | ICellMoveEdit | ICellOutputItemEdit;

export interface NotebookDataDto {
	readonly cells: ICellDto2[];
	readonly metadata: NotebookDocumentMetadata;
}

/**
 * [start, end]
 */
export interface ICellRange {
	/**
	 * zero based index
	 */
	start: number;

	/**
	 * zero based index
	 */
	end: number;
}

export interface INotebookExclusiveDocumentFilter {
	include?: string | glob.IRelativePattern;
	exclude?: string | glob.IRelativePattern;
}

export interface INotebookDocumentFilter {
	viewType?: string | string[];
	filenamePattern?: string | glob.IRelativePattern | INotebookExclusiveDocumentFilter;
}

export interface INotebookCellStatusBarEntry {
	readonly cellResource: URI;
	readonly alignment: CellStatusbarAlignment;
	readonly priority?: number;
	readonly text: string;
	readonly tooltip: string | undefined;
	readonly command: string | Command | undefined;
	readonly accessibilityInformation?: IAccessibilityInformation;
	readonly visible: boolean;
	readonly opacity?: string;
}

export const enum CellStatusbarAlignment {
	LEFT,
	RIGHT
}

export interface INotebookDecorationRenderOptions {
	backgroundColor?: string | ThemeColor;
	borderColor?: string | ThemeColor;
	top?: editorCommon.IContentDecorationRenderOptions;
}
