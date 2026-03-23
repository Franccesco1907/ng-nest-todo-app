import { Component, OnDestroy, OnInit, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { interval, Subject, takeUntil } from 'rxjs';
import { ITodo } from '../../../../core/models';
import { NotificationService, TodoService } from '../../../../core/services';
import { MaterialStandaloneModules } from '../../../../shared/ui';
import { TodoDialogComponent } from '../../components/todo-dialog/todo-dialog.component';
import { TodoListComponent } from '../../components/todo-list/todo-list.component';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-todo-dashboard',
  standalone: true,
  imports: [DatePipe, TodoListComponent, MaterialStandaloneModules],
  templateUrl: './todo-dashboard.component.html',
  styleUrl: './todo-dashboard.component.scss'
})
export class TodoDashboardPageComponent implements OnInit, OnDestroy {
  readonly todos = signal<ITodo[]>([]);
  readonly selectedTodoIds = signal<string[]>([]);
  readonly showCompleted = signal(false);
  readonly currentTime = signal(new Date());
  readonly isLoading = signal(false);

  readonly filteredTodos = computed(() =>
    this.showCompleted()
      ? this.todos().filter(t => !t.isCompleted)
      : this.todos()
  );

  readonly haveUncompletedSelected = computed(() =>
    this.todos()
      .filter(t => this.selectedTodoIds().includes(t.id))
      .some(t => !t.isCompleted)
  );

  readonly isSelectionEmpty = computed(() => this.selectedTodoIds().length === 0);

  private readonly destroy$ = new Subject<void>();

  constructor(
    public dialog: MatDialog,
    private readonly todoService: TodoService,
    private readonly notificationService: NotificationService,
    private readonly authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.loadTodos();
    interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.currentTime.set(new Date()));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTodos(): void {
    this.isLoading.set(true);
    this.todoService.getTodos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (todos) => {
          this.todos.set(todos);
          this.selectedTodoIds.set([]);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading todos:', error);
          this.notificationService.showError(`The todos could not be loaded`);
          this.isLoading.set(false);
        }
      });
  }

  handleSelectionChange(selectedIds: string[]) {
    this.selectedTodoIds.set(selectedIds);
  }

  markSelectedAsCompleted() {
    if (this.selectedTodoIds().length > 0) {
      this.todoService.markTodosAsCompleted(this.selectedTodoIds())
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => this.loadTodos(),
          error: (error) => {
            console.error('Error marking todos as completed:', error);
            this.notificationService.showError('Failed to mark todos as completed.');
          }
        });
    }
  }

  addTodo() {
    const dialogRef = this.dialog.open(TodoDialogComponent, {
      width: '500px',
      data: { mode: 'add', todo: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.todoService.createTodo(result)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => this.loadTodos(),
            error: (error) => {
              console.error('Error creating todo:', error);
              this.notificationService.showError(`The todo could not be created`);
            }
          });
      }
    });
  }

  toggleShowCompleted() {
    this.showCompleted.update(v => !v);
  }

  logout() {
    this.authService.logout();
  }
}
