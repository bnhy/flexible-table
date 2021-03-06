import { OnInit } from '@angular/core';
import { DropEvent } from 'drag-enabled';
import { TableHeadersGenerator } from './components/table-headers-generator';
import { TableViewComponent } from './components/table.component';
export declare class FlexibleTableComponent implements OnInit {
    private generator;
    subHeaders: any;
    vocabulary: {
        printTable: string;
        configureTable: string;
        configureColumns: string;
        clickSort: string;
        setSize: string;
        firstPage: string;
        lastPage: string;
        previousPage: string;
    };
    persistenceId: string;
    persistenceKey: string;
    caption: string;
    action: string;
    actionKeys: any;
    tableClass: string;
    headers: any[];
    items: any[];
    pageInfo: any;
    tableInfo: any;
    configurable: boolean;
    configAddon: any;
    enableIndexing: boolean;
    enableFiltering: boolean;
    rowDetailer: any;
    expandable: any;
    expandIf: boolean;
    filterwhiletyping: boolean;
    rowDetailerHeaders: any;
    private onaction;
    private onCellContentEdit;
    private onconfigurationchange;
    viewTable: TableViewComponent;
    constructor(generator: TableHeadersGenerator);
    ngOnInit(): void;
    updateLimits(): void;
    reconfigure(event: any): void;
    onPaginationChange(event: any): void;
    tableAction(event: any): void;
    onDrop(event: DropEvent): void;
    onCellEdit(event: any): void;
}
