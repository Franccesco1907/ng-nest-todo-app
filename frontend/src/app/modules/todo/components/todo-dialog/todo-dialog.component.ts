import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ITodo } from '../../../../core/models';
import { MaterialStandaloneModules } from '../../../../shared/ui';

@Component({
  selector: 'app-todo-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialStandaloneModules],
  templateUrl: './todo-dialog.component.html',
  styleUrl: './todo-dialog.component.scss'
})
export class TodoDialogComponent {
  todo: ITodo;
  todoForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<TodoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: string, todo: ITodo },
  ) {
    this.todo = { ...data.todo };
    this.todoForm = new FormGroup({
      title: new FormControl(this.todo.title, [Validators.required, Validators.minLength(3)]),
      description: new FormControl(this.todo.description, [Validators.required]),
      isCompleted: new FormControl(this.todo.isCompleted)
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    if (this.todoForm.invalid) {
      this.todoForm.markAllAsTouched();
      return;
    }

    this.todo = { ...this.todo, ...this.todoForm.value };
    this.dialogRef.close(this.todo);
  }

  getErrorMessage(controlName: string): string {
    const control = this.todoForm.get(controlName);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('minlength')) {
      return `You should have at least ${control.errors?.['minlength'].requiredLength} characters`;
    }
    return '';
  }
}
