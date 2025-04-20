import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { ITodo } from '../../../../core/models';
import { NotificationService, TodoService } from '../../../../core/services';
import { MaterialStandaloneModules } from '../../../../shared/ui';
import { TodoDialogComponent } from '../../components/todo-dialog/todo-dialog.component';
import { TodoListComponent } from '../../components/todo-list/todo-list.component';

@Component({
  selector: 'app-todo-dashboard',
  standalone: true,
  imports: [TodoListComponent, MaterialStandaloneModules],
  templateUrl: './todo-dashboard.component.html',
  styleUrl: './todo-dashboard.component.scss'
})
export class TodoDashboardPageComponent implements OnInit, OnDestroy {
  todos: ITodo[] = [];
  selectedTodoIds: string[] = [];
  private readonly destroy$ = new Subject<void>();

  constructor(
    public dialog: MatDialog,
    private todoService: TodoService,
    private readonly notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.loadTodos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  loadTodos(): void {
    this.todoService.getTodos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (todos) => {
          console.log('todos', todos);
          this.todos = todos;
        },
        error: (error) => {
          console.error('Error loading todos:', error);
          this.notificationService.showError(`The todos could not be loaded`);
        }
      });
  }


  handleSelectionChange(selectedIds: string[]) {
    this.selectedTodoIds = selectedIds;
  }

  markSelectedAsCompleted() {

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
              this.todos.push(newTodo);
              this.todos = [...this.todos];
              this.selectedTodoIds = [];
            },
            error: (error) => {
              console.error('Error creating todo:', error);
              this.notificationService.showError(`The todo could not be created`);
            }
          });
      }
    });
  }

  get isSelectionEmpty(): boolean {
    return this.selectedTodoIds.length === 0;
  }
}
