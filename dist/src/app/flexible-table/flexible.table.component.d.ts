import { OnInit } from '@angular/core';
import { DropEvent } from 'drag-enabled';
export declare class FlexibleTableComponent implements OnInit {
    subItems: any;
    subHeaders: any;
    vocabulary: {
        configureTable: string;
        configureColumns: string;
        clickSort: string;
        setSize: string;
        firstPage: string;
        lastPage: string;
        previousPage: string;
    };
    caption: string;
    action: string;
    actionKeys: any;
    tableClass: string;
    headers: any[];
    items: any[];
    pageInfo: any;
    tableInfo: any;
    configurable: boolean;
    enableIndexing: boolean;
    rowDetailer: any;
    expandable: any;
    expandIf: boolean;
    rowDetailerHeaders: any;
    private onaction;
    private onconfigurationchange;
    constructor();
    ngOnInit(): void;
    updateLimits(): void;
    reconfigure(event: any): void;
    onPaginationChange(event: any): void;
    tableAction(event: any): void;
    onDrop(event: DropEvent): void;
}
