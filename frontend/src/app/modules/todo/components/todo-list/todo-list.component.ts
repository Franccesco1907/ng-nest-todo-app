import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { Component, DestroyRef, effect, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ITodo } from '../../../../core/models';
import { NotificationService, TodoService } from '../../../../core/services';
import { MaterialStandaloneModules } from '../../../../shared/ui';
import { TodoDialogComponent } from '../todo-dialog/todo-dialog.component';
import { MatTableResponsiveModule } from '../../../../shared/directives/mat-table-responsive.module';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [DatePipe, MaterialStandaloneModules, MatTableResponsiveModule],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
})
export class TodoListComponent {
  readonly todos = input<ITodo[]>([]);
  readonly loading = input<boolean>(false);
  readonly selectionChanged = output<string[]>();
  readonly todoEdited = output<void>();
  readonly todoDeleted = output<void>();

  private readonly destroyRef = inject(DestroyRef);

  displayedColumns: string[] = ['select', 'title', 'description', 'createdAt', 'isCompleted', 'actions'];
  dataSource = new MatTableDataSource<ITodo>([]);
  selection = new SelectionModel<ITodo>(true, []);

  constructor(
    public dialog: MatDialog,
    private readonly todoService: TodoService,
    private readonly notificationService: NotificationService,
  ) {
    effect(() => {
      this.dataSource.data = this.todos();
      this.selection.clear();
    });

    this.selection.changed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.emitSelectedIds());
  }

  isAllSelected(): boolean {
    return this.selection.selected.length === this.dataSource.data.length
      && this.dataSource.data.length > 0;
  }

  toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  editTodo(todo: ITodo): void {
    const dialogRef = this.dialog.open(TodoDialogComponent, {
      width: '500px',
      data: { mode: 'edit', todo }
    });

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result: ITodo) => {
        if (result) {
          const { id, createdAt, updatedAt, deletedAt, userId, ...updatedData } = result;
          this.todoService.updateTodo(id, updatedData)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () => {
                this.notificationService.showSuccess(`Todo edited successfully!`);
                this.todoEdited.emit();
              },
              error: () => {
                this.notificationService.showError(`The todo could not be updated`);
              }
            });
        }
      });
  }

  deleteTodo(todo: ITodo): void {
    this.todoService.deleteTodo(todo.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
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
