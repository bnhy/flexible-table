import { OnInit, Renderer } from '@angular/core';
import { DropEvent } from 'drag-enabled';
export declare class LockTableComponent implements OnInit {
    private renderer;
    lockedHeaders: any;
    unlockedHeaders: any;
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
    private onaction;
    private onconfigurationchange;
    private lockedTable;
    private unlockedTable;
    scroll(event: any): void;
    constructor(renderer: Renderer);
    ngOnInit(): void;
    evaluatePositioning(): void;
    reconfigure(event: any): void;
    onlock(event: any): void;
    tableAction(event: any): void;
    onDrop(event: DropEvent): void;
}