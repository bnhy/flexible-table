import { EventEmitter, OnInit } from "@angular/core";
export interface PaginationInfo {
    contentSize: number;
    pageSize: number;
    maxWidth?: string;
    pages?: number;
    from?: number;
    to?: number;
    currentPage?: number;
    resetSize?: boolean;
}
export declare class PaginationComponent implements OnInit {
    vocabulary: {
        setSize: string;
        firstPage: string;
        lastPage: string;
        previousPage: string;
    };
    info: PaginationInfo;
    onchange: EventEmitter<{}>;
    onready: EventEmitter<{}>;
    ngOnInit(): void;
    setWidth(width: number): void;
    ready(): void;
    selectFirst(): void;
    selectNext(): void;
    selectPrev(): void;
    selectLast(): void;
    changeCurrent(ranger: any): void;
    changeSize(sizer: any): void;
}
