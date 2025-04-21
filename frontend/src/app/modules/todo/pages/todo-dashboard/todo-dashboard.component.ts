import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { interval, Subject, Subscription, takeUntil } from 'rxjs';
import { ITodo } from '../../../../core/models';
import { NotificationService, TodoService } from '../../../../core/services';
import { MaterialStandaloneModules } from '../../../../shared/ui';
import { TodoDialogComponent } from '../../components/todo-dialog/todo-dialog.component';
import { TodoListComponent } from '../../components/todo-list/todo-list.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-todo-dashboard',
  standalone: true,
  imports: [CommonModule, TodoListComponent, MaterialStandaloneModules],
  templateUrl: './todo-dashboard.component.html',
  styleUrl: './todo-dashboard.component.scss'
})
export class TodoDashboardPageComponent implements OnInit, OnDestroy {
  todos: ITodo[] = [];
  filteredTodos: ITodo[] = [];
  selectedTodoIds: string[] = [];
  haveUncompletedSelected = false;
  showCompleted = false;
  currentTime: Date = new Date();

  private timeSubscription: Subscription | undefined;
  private readonly destroy$ = new Subject<void>();

  constructor(
    public dialog: MatDialog,
    private readonly todoService: TodoService,
    private readonly notificationService: NotificationService,
    private readonly authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.loadTodos();
    this.timeSubscription = interval(1000)
      .subscribe(() => {
        this.currentTime = new Date();
      });
  }

  ngOnDestroy(): void {
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }


  loadTodos(): void {
    this.todoService.getTodos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (todos) => {
          this.todos = todos;
          this.applyFilter();
          this.selectedTodoIds = [];
          this.showCompleted = false;
        },
        error: (error) => {
          console.error('Error loading todos:', error);
          this.notificationService.showError(`The todos could not be loaded`);
        }
      });
  }


  handleSelectionChange(selectedIds: string[]) {
    this.selectedTodoIds = selectedIds;
    this.haveUncompletedSelected = this.todos
      .filter(todo => selectedIds.includes(todo.id))
      .some(todo => !todo.isCompleted);
  }

  markSelectedAsCompleted() {
    if (this.selectedTodoIds.length > 0) {
      this.todoService.markTodosAsCompleted(this.selectedTodoIds)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadTodos()
          },
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
            next: (newTodo) => {
              this.loadTodos()
            },
            error: (error) => {
              console.error('Error creating todo:', error);
              this.notificationService.showError(`The todo could not be created`);
            }
          });
      }
    });
  }

  toggleShowCompleted() {
    this.showCompleted = !this.showCompleted;
    this.applyFilter();
  }

  applyFilter() {
    if (this.showCompleted) {
      this.filteredTodos = this.todos.filter(todo => !todo.isCompleted);
    } else {
      this.filteredTodos = this.todos;
    }
  }

  get isSelectionEmpty(): boolean {
    return this.selectedTodoIds.length === 0;
  }

  logout() {
    this.authService.logout();
  }
}
