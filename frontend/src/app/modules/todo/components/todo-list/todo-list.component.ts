import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { ITodo } from '../../../../core/models';
import { NotificationService, TodoService } from '../../../../core/services';
import { MaterialStandaloneModules } from '../../../../shared/ui';
import { TodoDialogComponent } from '../todo-dialog/todo-dialog.component';
import { MatTableResponsiveModule } from '../../../../shared/directives/mat-table-responsive.module';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, MaterialStandaloneModules, TodoDialogComponent, MatTableResponsiveModule],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
})
export class TodoListComponent implements OnChanges {
  @Input() todos: ITodo[] = [];
  @Output() selectionChanged = new EventEmitter<string[]>();
  @Output() todoEdited = new EventEmitter<void>();
  @Output() todoDeleted = new EventEmitter<void>();
  private readonly destroy$ = new Subject<void>();

  displayedColumns: string[] = ['select', 'title', 'description', 'createdAt', 'isCompleted', 'actions'];
  dataSource = new MatTableDataSource<ITodo>(this.todos);
  selection = new SelectionModel<ITodo>(true, []);

  constructor(
    public dialog: MatDialog,
    private readonly todoService: TodoService,
    private readonly notificationService: NotificationService,
  ) {
    this.selection.changed.subscribe(() => {
      this.emitSelectedIds();
    });
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['todos']) {
      this.dataSource.data = this.todos;
      this.emitSelectedIds();
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  editTodo(todo: ITodo) {
    const dialogRef = this.dialog.open(TodoDialogComponent, {
      width: '500px',
      data: { mode: 'edit', todo }
    });

    dialogRef.afterClosed().subscribe((result: ITodo) => {
      if (result) {
        const { id, createdAt, updatedAt, deletedAt, userId, ...updatedData } = result;
        this.todoService.updateTodo(id, updatedData)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.notificationService.showSuccess(`Todo edited successfully!`);
              this.todoEdited.emit();
            },
            error: (error) => {
              this.notificationService.showError(`The todo could not be updated`);
            }
          })
      }
    });
  }

  deleteTodo(todo: ITodo) {
    this.todoService.deleteTodo(todo.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.showSuccess(`Todo deleted successfully!`);
          this.todoDeleted.emit();
        },
        error: (error) => {
          console.error('Error deleting todo:', error);
          this.notificationService.showError(`The todo could not be deleted`);
        }
      });
  }

  private emitSelectedIds(): void {
    const selectedIds = this.selection.selected.map(todo => todo.id);
    this.selectionChanged.emit(selectedIds);
  }
}
