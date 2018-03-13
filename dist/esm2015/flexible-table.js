import { Component, Input, Output, ViewChild, ViewContainerRef, EventEmitter, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { InToPipe, IntoPipeModule } from 'into-pipes';
import { CommonModule } from '@angular/common';
import { DragDropModule } from 'drag-enabled';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @record
 */

class FlexibleTableComponent {
    /**
     * @param {?} intoPipe
     */
    constructor(intoPipe) {
        this.intoPipe = intoPipe;
        this.registeredHeaders = [];
        this.dragging = false;
        this.vocabulary = {
            configureTable: "Configure Table",
            configureColumns: "Configure Columns",
            clickSort: "Click to Sort",
            setSize: "Set Size",
            firstPage: "First",
            lastPage: "Last",
            previousPage: "Previous"
        };
        this.tableClass = 'default-flexible-table';
        this.onaction = new EventEmitter();
        this.onconfigurationchange = new EventEmitter();
    }
    /**
     * @param {?} id
     * @return {?}
     */
    findColumnWithID(id) {
        const /** @type {?} */ list = this.headerColumnElements();
        let /** @type {?} */ column = null;
        for (let /** @type {?} */ i = 0; i < list.length; i++) {
            if (list[i].getAttribute("id") === id) {
                column = list[i];
                break;
            }
        }
        return column;
    }
    /**
     * @param {?} sourceID
     * @param {?} destinationID
     * @return {?}
     */
    swapColumns(sourceID, destinationID) {
        const /** @type {?} */ srcIndex = this.getColumnIndex(sourceID);
        const /** @type {?} */ desIndex = this.getColumnIndex(destinationID);
        if (srcIndex < 0 || desIndex < 0) {
            console.log("invalid drop id", sourceID, destinationID);
            return;
        }
        const /** @type {?} */ sobj = this.headers[srcIndex];
        this.headers[srcIndex] = this.headers[desIndex];
        this.headers[desIndex] = sobj;
        for (let /** @type {?} */ i = 0; i < this.items.length; i++) {
            const /** @type {?} */ row = this.items[i];
            const /** @type {?} */ sobji = row[srcIndex];
            row[srcIndex] = row[desIndex];
            row[desIndex] = sobji;
        }
        this.onconfigurationchange.emit(this.headers);
    }
    /**
     * @param {?} id
     * @return {?}
     */
    getColumnIndex(id) {
        let /** @type {?} */ index = -1;
        for (let /** @type {?} */ i = 0; i < this.headers.length; i++) {
            if (this.headers[i].key === id) {
                index = i;
                break;
            }
        }
        return index;
    }
    /**
     * @param {?} item
     * @param {?} hpath
     * @return {?}
     */
    itemValue(item, hpath) {
        let /** @type {?} */ subitem = item;
        hpath.map((subkey) => {
            if (subitem) {
                subitem = subitem[subkey] ? subitem[subkey] : undefined;
            }
        });
        return subitem ? subitem : "";
    }
    /**
     * @param {?} header
     * @param {?} icon
     * @return {?}
     */
    sort(header, icon) {
        if (header.sortable) {
            for (let /** @type {?} */ i = 0; i < this.headers.length; i++) {
                const /** @type {?} */ h = this.headers[i];
                if (h.key !== header.key) {
                    const /** @type {?} */ item = this.findColumnWithID(h.key);
                    if (item) {
                        item.classList.remove("ascending");
                        item.classList.remove("descending");
                        item.classList.add("sortable");
                    }
                    h.descending = false;
                    h.ascending = false;
                }
            }
            icon.classList.remove("fa-sort");
            if (header.ascending || (!header.ascending && !header.descending)) {
                header.descending = true;
                header.ascending = false;
                icon.classList.remove("fa-sort-asc");
                icon.classList.add("fa-sort-desc");
            }
            else {
                header.descending = false;
                header.ascending = true;
                icon.classList.remove("fa-sort-desc");
                icon.classList.add("fa-sort-asc");
            }
            const /** @type {?} */ hpath = header.key.split(".");
            this.items.sort((a, b) => {
                const /** @type {?} */ v1 = this.itemValue(a, hpath);
                const /** @type {?} */ v2 = this.itemValue(b, hpath);
                if (header.ascending) {
                    return v1 > v2 ? 1 : -1;
                }
                return v1 < v2 ? 1 : -1;
            });
            setTimeout(() => this.onconfigurationchange.emit(this.headers), 2);
        }
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (!this.headers || this.headers.length === 0) {
            this.headers = [];
            this.items[0].map((item) => {
                this.headers.push({ key: item, value: item, sortable: true, present: true });
            });
        }
        if (this.actionKeys) {
            this.actionKeys = this.actionKeys.split(",");
        }
        if (!this.rowDetailer && this.expandable) {
            this.rowDetailer = function (item) {
                return { data: item, headers: [] };
            };
        }
        if (!this.expandable) {
            this.expandable = function (item, showIcon) { return showIcon; };
        }
        if (!this.rowDetailerHeaders) {
            this.rowDetailerHeaders = (item) => [];
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    reconfigure(event) {
        this.onconfigurationchange.emit(event);
    }
    /**
     * @return {?}
     */
    headerColumnElements() {
        return this.table.element.nativeElement.children ?
            this.table.element.nativeElement.children[1].children[0].children : [];
    }
    /**
     * @param {?} id
     * @return {?}
     */
    headerById(id) {
        let /** @type {?} */ h;
        for (const /** @type {?} */ i in this.headers) {
            if (this.headers[i].key === id) {
                h = this.headers[i];
                break;
            }
        }
        return h;
    }
    /**
     * @return {?}
     */
    columnsCount() {
        let /** @type {?} */ count = 0;
        this.headers.map((item) => {
            if (item.present) {
                count++;
            }
        });
        if (this.action) {
            count++;
        }
        return count;
    }
    /**
     * @param {?} event
     * @param {?} item
     * @return {?}
     */
    keydown(event, item) {
        const /** @type {?} */ code = event.which;
        if ((code === 13) || (code === 32)) {
            item.click();
        }
    }
    /**
     * @param {?} item
     * @return {?}
     */
    offScreenMessage(item) {
        let /** @type {?} */ message = this.action;
        this.actionKeys.map((key) => { message = message.replace(key, item[key.substring(1, key.length - 1)]); });
        return message;
    }
    /**
     * @param {?} item
     * @param {?} header
     * @return {?}
     */
    cellContent(item, header) {
        let /** @type {?} */ content = this.itemValue(item, header.key.split("."));
        if (header.format && content !== undefined && content != null) {
            content = this.intoPipe.transform(content, header.format);
        }
        return (content !== undefined && content != null) ? content : '&nbsp;';
    }
    /**
     * @param {?} item
     * @return {?}
     */
    rowDetailerContext(item) {
        return {
            data: item,
            tableInfo: this.tableInfo,
            headers: this.rowDetailerHeaders(item)
        };
    }
    /**
     * @param {?} event
     * @param {?} item
     * @return {?}
     */
    actionClick(event, item) {
        event.stopPropagation();
        if (this.rowDetailer && (this.expandIf || this.expandable(item, false))) {
            if (item.expanded) {
                delete item.expanded;
            }
            else {
                item.expanded = true;
            }
        }
        else {
            this.onaction.emit(item);
        }
        return false;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    dragEnabled(event) {
        return event.medium.dragable;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    dropEnabled(event) {
        return event.destination.medium.dragable;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onDragStart(event) {
        //        this.dragging = true;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onDragEnd(event) {
        //       this.dragging = false;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onDrop(event) {
        this.swapColumns(event.source.medium.key, event.destination.medium.key);
    }
}
FlexibleTableComponent.decorators = [
    { type: Component, args: [{
                selector: 'flexible-table',
                template: `
<div class="flexible-table">
    <table-configuration
        *ngIf="configurable"
        [headers]="headers"
        [title]="vocabulary.configureColumns"
        [action]="vocabulary.configureTable"
        (onchange)="reconfigure($event)"></table-configuration>
    <table [class]="tableClass" #flexible>
        <caption *ngIf="caption" [textContent]="caption"></caption>
        <thead>
            <tr>
                <th scope="col" *ngIf="enableIndexing" id="indexable" class="indexable"></th>
                <ng-template ngFor let-header [ngForOf]="headers">
                    <th scope="col" *ngIf="header.present"
                        [dragEnabled]="dragEnabled.bind(this)"
                        [dropEnabled]="dropEnabled.bind(this)"
                        [medium]="header"
                        (onDragStart)="onDragStart($event)"
                        (onDragEnd)="onDragEnd($event)"
                        (onDrop)="onDrop($event)"
                        [id]="header.key"
                        [attr.width]="header.width ? header.width : null"
                        [attr.tabindex]="header.sortable ? 0 : -1"
						(keydown)="keydown($event, th)" (click)="sort(header, icon)">
                        <span *ngIf="header.sortable" class="off-screen"  [textContent]="vocabulary.clickSort"></span>
                        <span class="title"
                              [class.dragable]="header.dragable"
                              [textContent]="header.value"></span>
                        <span class="icon fa" #icon
                              [class.fa-sort]="header.sortable"
                              [class.fa-sort-asc]="header.assending"
                              [class.fa-sort-desc]="header.desending"></span>
                    </th>
                </ng-template>
                <th scope="col" *ngIf="action" id="actionable" class="actionable"></th>
            </tr>
        </thead>
        <tbody>
            <ng-template ngFor let-item [ngForOf]="items" let-i="index">
                <tr *ngIf="(!pager || (pager && pager.info && i>=pager.info.from && i<=pager.info.to))"
                    (click)="actionClick($event, item)"
                    [class.pointer]="action"
                    [class.expanded]="item.expanded"
                    [class.odd]="i%2">
                    <td scope="row" class="index" *ngIf="enableIndexing">{{i + 1}}</td>
                    <ng-template ngFor let-header [ngForOf]="headers">
                        <td scope="row"
                            *ngIf="header.present"
                            [attr.data-label]="header.value"
                            [innerHTML]="cellContent(item, header)"></td>
                    </ng-template>
                    <td scope="row" *ngIf="action">
                        <a class="actionable"
                            *ngIf="expandable(item, true)"
                            tabindex="0"
                            role="button"
                            style="cursor:pointer"
                            [class.expanded]="item.expanded" #clicker
                            (keydown)="keydown($event, clicker)" (click)="actionClick($event, item)">
                            <span
                                class="icon fa"
                                [class.fa-angle-right]="!rowDetailer"
                                [class.fa-minus-square-o]="rowDetailer && item.expanded"
                                [class.fa-plus-square-o]="rowDetailer && !item.expanded"
                                aria-hidden="true"></span>
                            <span class="off-screen" [textContent]="offScreenMessage(item)"></span>
                        </a>
                    </td>
                </tr>
                <tr *ngIf="(!pager || (pager && pager.info && i>=pager.info.from && i<=pager.info.to)) && rowDetailer && item.expanded" class="detail" [class.odd]="i%2">
                    <td scope="row" class="index" *ngIf="enableIndexing"></td>
                    <td [attr.colspan]="columnsCount()">
                        <ng-container [ngTemplateOutlet]="rowDetailer" [ngTemplateOutletContext]="rowDetailerContext(item)"></ng-container>
                    </td>
                </tr>
            </ng-template>
        </tbody>
    </table>
</div>
<table-pagination [info]="pageInfo" [vocabulary]="vocabulary" #pager></table-pagination>
`,
                styles: [`:host{display:inline-block!important;width:100%}.flexible-table{position:relative;margin:0 auto;display:table;border-spacing:0;border-collapse:collapse}.flexible-table .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}.flexible-table table{margin:1rem auto;padding:0;width:100%;table-layout:fixed;max-width:99%;background-color:transparent;border-collapse:collapse}.flexible-table table caption{background-color:#c3e5e2;border-radius:2px;color:#1b1b1b;caption-side:top;font-size:14px;padding:5px 6px;margin-bottom:15px;text-align:left}.flexible-table table thead{border-top:1px solid #bbb;border-bottom:1px solid #bbb;background-color:#eee}.flexible-table table tr{border:0}.flexible-table table tr.expanded td{font-weight:700;border-bottom:0}.flexible-table table td{padding-left:3px}.flexible-table table td:first-child{padding-left:5px}.flexible-table table td .off-screen{display:block;float:left;height:0;overflow:hidden;text-indent:-99999px;width:0}.flexible-table table td.index{background-color:#eee;border-right:1px solid #bbb}.flexible-table table th{cursor:default;-webkit-user-select:none;-moz-user-select:none;-o-user-select:none;-ms-user-select:none;user-select:none;height:24px;position:relative;white-space:nowrap;font-weight:400;text-transform:uppercase;font-size:14px;padding-top:6px;padding-bottom:6px;text-align:left}.flexible-table table th.drag-over{background-color:#9b9b9b}.flexible-table table th.drag-over .icon,.flexible-table table th.drag-over .title{color:#eee}.flexible-table table th:first-child{padding-left:5px}.flexible-table table th.ascending,.flexible-table table th.descending,.flexible-table table th.sortable{cursor:pointer;height:12px}.flexible-table table th.indexable{width:33px}.flexible-table table th.actionable{width:24px}.flexible-table table th .title{color:#254a4d;display:inline-block;height:20px;white-space:nowrap}.flexible-table table th .dragable{cursor:move}.flexible-table table th .icon{width:22px;display:inline-block;height:20px;color:#254a4d}.flexible-table .fa.fa-angle-right{font-size:18px}.flexible-table table tr.detail td{border-top:0;cursor:default}.flexible-table table tr.expanded td a.expanded{background-position:right 2px}.flexible-table table tbody tr:hover{background-color:#ffeed2}.flexible-table table tbody tr.detail:hover,.flexible-table table tbody tr.detail:hover td table thead tr{background-color:inherit}.flexible-table table tr td a.actionable{display:inline-table;height:32px;vertical-align:middle;width:25px;line-height:30px;color:#254a4d}.flexible-table table tbody tr.detail:hover td:last-child{border-right:0}.flexible-table table tbody tr.detail:hover td:first-child{border-left:0}.flexible-table table tr td{border-bottom:1px solid #b1b3b3;color:#254a5d;font-size:15px;text-transform:capitalize}.flexible-table table tbody tr.pointer{cursor:pointer}.flexible-table table.alert-danger{border:0}.flexible-table table.alert-danger caption{background-color:transparent;font-weight:700;margin-bottom:0}.flexible-table table.alert-danger td{border-bottom:0;display:block}.flexible-table table.alert-danger td:first-child{padding-left:0}.flexible-table table.alert-danger td:last-child{border-bottom:0}.flexible-table table.alert-danger td:before{content:attr(data-label);float:left;font-weight:700;text-transform:uppercase;width:20%}.flexible-table table.alert-danger td a span.icon{width:100%}.flexible-table table.alert-danger thead{border:none;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}.flexible-table table.alert-danger tr{border:2px solid #fff;display:block;margin-bottom:.625em;padding:5px;border-radius:5px}.flexible-table table.alert-danger tr th.actionable{width:inherit}.flexible-table table.alert-danger tr td{border-bottom:0}@media screen and (max-width:600px){.flexible-table table{border:0}.flexible-table table td{border-bottom:0;display:block;text-align:right}.flexible-table table td:first-child{padding-left:0}.flexible-table table td:last-child{border-bottom:0}.flexible-table table td:before{content:attr(data-label);float:left;font-weight:700;text-transform:uppercase}.flexible-table table td a span.icon{width:100%}.flexible-table table thead{border:none;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}.flexible-table table tr{border-bottom:3px solid #ddd;display:block;margin-bottom:.625em}.flexible-table table tr th.actionable{width:inherit}.flexible-table table tr td{border-bottom:0}.flexible-table table.alert-danger td:before{width:inherit}}`]
            },] },
];
/** @nocollapse */
FlexibleTableComponent.ctorParameters = () => [
    { type: InToPipe, },
];
FlexibleTableComponent.propDecorators = {
    "vocabulary": [{ type: Input, args: ["vocabulary",] },],
    "caption": [{ type: Input, args: ["caption",] },],
    "action": [{ type: Input, args: ["action",] },],
    "actionKeys": [{ type: Input, args: ["actionKeys",] },],
    "tableClass": [{ type: Input, args: ["tableClass",] },],
    "headers": [{ type: Input, args: ["headers",] },],
    "items": [{ type: Input, args: ["items",] },],
    "pageInfo": [{ type: Input, args: ["pageInfo",] },],
    "tableInfo": [{ type: Input, args: ["tableInfo",] },],
    "configurable": [{ type: Input, args: ["configurable",] },],
    "enableIndexing": [{ type: Input, args: ["enableIndexing",] },],
    "rowDetailer": [{ type: Input, args: ["rowDetailer",] },],
    "expandable": [{ type: Input, args: ["expandable",] },],
    "expandIf": [{ type: Input, args: ["expandIf",] },],
    "rowDetailerHeaders": [{ type: Input, args: ["rowDetailerHeaders",] },],
    "onaction": [{ type: Output, args: ['onaction',] },],
    "onconfigurationchange": [{ type: Output, args: ['onconfigurationchange',] },],
    "table": [{ type: ViewChild, args: ['flexible', { read: ViewContainerRef },] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @record
 */

class PaginationComponent {
    constructor() {
        this.vocabulary = { setSize: "", firstPage: "", lastPage: "", previousPage: "" };
        this.info = { contentSize: 0, pageSize: 0, maxWidth: "0" };
        this.onchange = new EventEmitter();
        this.onready = new EventEmitter();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (!this.info) {
            this.info = { contentSize: 1000, pageSize: 1000, maxWidth: "0" };
        }
        if (this.info.contentSize && this.info.pageSize) {
            this.info.pages = Math.ceil(this.info.contentSize / this.info.pageSize);
            this.info.from = 0;
            this.info.to = this.info.pageSize - 1;
            this.info.currentPage = 1;
            setTimeout(() => this.ready(), 66);
        }
    }
    /**
     * @param {?} width
     * @return {?}
     */
    setWidth(width) {
        this.info.maxWidth = width + "px";
    }
    /**
     * @return {?}
     */
    ready() {
        this.onready.emit(this);
        this.onchange.emit(this.info);
    }
    /**
     * @return {?}
     */
    selectFirst() {
        if (this.info.currentPage > 1) {
            this.info.from = 0;
            this.info.to = this.info.from + this.info.pageSize - 1;
            this.info.currentPage = 1;
            this.onchange.emit(this.info);
        }
    }
    /**
     * @return {?}
     */
    selectNext() {
        if (this.info.currentPage < this.info.pages) {
            this.info.from = this.info.to + 1;
            this.info.to = this.info.from + this.info.pageSize - 1;
            this.info.currentPage++;
            this.onchange.emit(this.info);
        }
    }
    /**
     * @return {?}
     */
    selectPrev() {
        if (this.info.currentPage > 1) {
            this.info.from -= this.info.pageSize;
            this.info.to = this.info.from + this.info.pageSize - 1;
            this.info.currentPage--;
            this.onchange.emit(this.info);
        }
    }
    /**
     * @return {?}
     */
    selectLast() {
        if (this.info.currentPage < this.info.pages) {
            this.info.from = this.info.pageSize * (this.info.pages - 1);
            this.info.to = this.info.from + this.info.pageSize - 1;
            this.info.currentPage = this.info.pages;
            this.onchange.emit(this.info);
        }
    }
    /**
     * @param {?} ranger
     * @return {?}
     */
    changeCurrent(ranger) {
        const /** @type {?} */ v = parseInt(ranger.value, 10);
        if (this.info.currentPage < v && v > 0 && v < this.info.pages) {
            this.info.from = v * (this.info.pageSize - 1);
            this.info.to = this.info.from + this.info.pageSize - 1;
            this.info.currentPage = v;
            this.onchange.emit(this.info);
        }
        else {
            ranger.value = this.info.currentPage;
        }
    }
    /**
     * @param {?} sizer
     * @return {?}
     */
    changeSize(sizer) {
        const /** @type {?} */ v = parseInt(sizer.value, 10);
        if (this.info.contentSize >= v && v > 1) {
            this.info.pageSize = v;
            this.info.pages = Math.ceil(this.info.contentSize / v);
            this.info.from = 0;
            this.info.to = this.info.pageSize - 1;
            this.info.currentPage = 1;
            this.onchange.emit(this.info);
        }
        else {
            sizer.value = this.info.pageSize;
        }
    }
}
PaginationComponent.decorators = [
    { type: Component, args: [{
                selector: 'table-pagination',
                template: `<div *ngIf="info && info.pages > 1" [style.width]="info.maxWidth" class="table-pagination" #paginationWrapper>
    <div class="fa fa-angle-left"
         (click)="selectPrev()"
         [class.disabled]="info.currentPage==1">
        <span class="prev" [textContent]="vocabulary.previousPage"></span>
    </div>
    <div class="fa fa-angle-double-left"
         (click)="selectFirst()"
         [class.disabled]="info.currentPage==1">
        <span class="first" [textContent]="vocabulary.firstPage"></span>
    </div>
    <div class="current">
        <input  #ranger [value]="info.currentPage" (keydown.Enter)="changeCurrent(ranger)" />
        <span [textContent]="' / ' + info.pages"></span>
	</div>
    <div class="fa fa-angle-double-right"
         (click)="selectLast()"
         [class.disabled]="info.currentPage==info.pages">
        <span class="last" [textContent]="vocabulary.lastPage"></span>
    </div>
    <div class="fa fa-angle-right"
         (click)="selectNext()"
         [class.disabled]="info.currentPage==info.pages">
        <span class="next" [textContent]="vocabulary.nextPage"></span>
    </div>
    <div class="reset-size" *ngIf="info.resetSize">
        <label for="pagination-set-size">
            <span class="off-screen" [textContent]="vocabulary.setSize"></span>
            <input id="pagination-set-size" [value]="info.pageSize" (keydown.Enter)="changeSize(sizer)" #sizer />
        </label>
    </div>
</div>
`,
                styles: [`.table-pagination{-webkit-box-sizing:border-box;box-sizing:border-box;background-color:#fff;border:1px solid #254a5d;border-radius:2px;color:#254a5d;bottom:5px;clear:both;display:-webkit-box;display:-ms-flexbox;display:flex;font-size:1em;height:38px;max-width:100%;margin:0 auto;position:fixed;left:40%;z-index:55}.table-pagination .fa{padding:4px 8px;margin-top:5px}.table-pagination .first,.table-pagination .last,.table-pagination .next,.table-pagination .prev{background-repeat:no-repeat;cursor:pointer;width:auto;display:block;height:39px;text-indent:-99999px;-webkit-box-sizing:border-box;box-sizing:border-box}.table-pagination .reset-size{padding:0;height:35px;border-radius:4px}.table-pagination .reset-size input{border:0;border-left:1px solid #4c5854;height:34px;text-align:center;width:30px;margin-right:2px;margin-left:8px}.table-pagination .current{padding:1px 5px}.table-pagination .current input{padding:0 3px;width:14px;height:35px;border:none;text-align:center}.table-pagination .disabled{opacity:.4}@media screen and (max-width:992px){.table-pagination{left:4px}}`]
            },] },
];
/** @nocollapse */
PaginationComponent.ctorParameters = () => [];
PaginationComponent.propDecorators = {
    "vocabulary": [{ type: Input, args: ["vocabulary",] },],
    "info": [{ type: Input, args: ["info",] },],
    "onchange": [{ type: Output, args: ['onchange',] },],
    "onready": [{ type: Output, args: ['onready',] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class ConfigurationComponent {
    constructor() {
        this.onchange = new EventEmitter();
    }
    /**
     * @param {?} item
     * @param {?} header
     * @return {?}
     */
    reconfigure(item, header) {
        header.present = item.checked;
        this.onchange.emit(this.headers);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    keyup(event) {
        const /** @type {?} */ code = event.which;
        if (code === 13) {
            event.target.click();
        }
    }
}
ConfigurationComponent.decorators = [
    { type: Component, args: [{
                selector: 'table-configuration',
                template: `
<div class="shim"
    [style.display]="showConfigurationView ? 'block':'none'"
    (click)="showConfigurationView = !showConfigurationView"></div>
<a  [attr.tabindex]="0"
    (keyup)="keyup($event)"
    (click)="showConfigurationView = !showConfigurationView">
    <span class="icon fa fa-gear" aria-hidden="true"></span>
    <span class="off-screen" [textContent]="action"></span>
</a>
<ul role="list" [style.display]="showConfigurationView ? 'block':'none'">
    <p [textContent]="title"></p>
    <li  *ngFor="let header of headers" role="listitem">
        <label for="{{header.key ? header.key+'c':'c'}}">
            <input type="checkbox" #checkbox
                    [id]="header.key ? header.key+'c':'c'"
                    [value]="header.key"
                    [checked]="header.present"
                    (keyup)="keyup($event)"
                    (click)="reconfigure(checkbox, header)" />
            <span [textContent]="header.value"></span>
        </label>
    </li>
</ul>
`,
                styles: [`:host{-webkit-box-sizing:border-box;box-sizing:border-box;padding:2px;position:absolute;right:8px;top:18px}:host a{display:block;padding:0;cursor:pointer;z-index:5}:host a .icon{color:#00925b}:host a .off-screen{display:block;text-indent:-9999px;width:0;height:0;overflow:hidden}:host .shim{background-color:rgba(255,255,255,.2);width:100vw;height:100vh;position:fixed;top:0;left:0;z-index:2}:host ul{background-color:#fff;border:1px solid #999;border-radius:4px;display:block;list-style:none;max-height:300px;margin:2px 0;min-width:200px;overflow-y:auto;position:absolute;padding:15px;right:0;-webkit-box-shadow:6px 8px 6px -6px #1b1b1b;box-shadow:6px 8px 6px -6px #1b1b1b;z-index:5}:host ul li{white-space:nowrap}`]
            },] },
];
/** @nocollapse */
ConfigurationComponent.ctorParameters = () => [];
ConfigurationComponent.propDecorators = {
    "title": [{ type: Input, args: ["title",] },],
    "action": [{ type: Input, args: ["action",] },],
    "headers": [{ type: Input, args: ["headers",] },],
    "onchange": [{ type: Output, args: ['onchange',] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class FlexibleTableModule {
}
FlexibleTableModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    DragDropModule,
                    IntoPipeModule
                ],
                declarations: [
                    FlexibleTableComponent,
                    ConfigurationComponent,
                    PaginationComponent
                ],
                exports: [
                    FlexibleTableComponent
                ],
                entryComponents: [],
                providers: [],
                schemas: [CUSTOM_ELEMENTS_SCHEMA]
            },] },
];
/** @nocollapse */
FlexibleTableModule.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { FlexibleTableComponent, FlexibleTableModule, ConfigurationComponent as ɵa, PaginationComponent as ɵb };
//# sourceMappingURL=flexible-table.js.map
