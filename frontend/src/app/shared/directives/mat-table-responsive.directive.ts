import {
  AfterViewInit,
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2
} from '@angular/core';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { map, mapTo, takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[matTableResponsive]',
})
export class MatTableResponsiveDirective
  implements OnInit, AfterViewInit, OnDestroy {
  private onDestroy$ = new Subject<boolean>();

  private thead: any;
  private tbody: any;

  private theadChanged$ = new BehaviorSubject(true);
  private tbodyChanged$ = new Subject<boolean>();

  private theadObserver = new MutationObserver(() => {
    this.theadChanged$.next(true);
  });
  private tbodyObserver = new MutationObserver(() => {
    this.tbodyChanged$.next(true);
  });

  constructor(private table: ElementRef, private renderer: Renderer2) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.thead = this.table.nativeElement.querySelector('thead');
    this.tbody = this.table.nativeElement.querySelector('tbody');

    this.theadObserver.observe(this.thead, {
      characterData: true,
      subtree: true
    });

    this.tbodyObserver.observe(this.tbody, { childList: true });

    /**
     * Set the "data-column-name" attribute for every body row cell, either on
     * thead row changes (e.g. language changes) or tbody rows changes (add, delete).
     */
    combineLatest([this.theadChanged$, this.tbodyChanged$])
      .pipe(
        mapTo({
          headRow: this.thead?.rows.item(0) || null,
          bodyRows: this.tbody?.rows || []
        }),
        map(({ headRow, bodyRows }) => {
          const columnNames = headRow ? Array.from(headRow.children).map(
            (headerCell: any) => headerCell.textContent ? headerCell.textContent.trim() : ''
          ) : [];
          const rows = Array.from(bodyRows).map((row: any) => Array.from(row.children));
          return { columnNames, rows };
        }),
        takeUntil(this.onDestroy$)
      )
      .subscribe(({ columnNames, rows }) => {
        rows.forEach((row, rowIndex) => {
          const rowCells = Array.from(row);
          rowCells.forEach((cell, cellIndex) => {
            const columnName = columnNames[cellIndex];
            if (cell instanceof HTMLElement && columnName) {
              this.renderer.setAttribute(
                cell,
                'data-column-name',
                columnName.trim()
              );
            }
          });
        });
      });
  }

  ngOnDestroy(): void {
    this.theadObserver.disconnect();
    this.tbodyObserver.disconnect();

    this.onDestroy$.next(true);
  }
}
