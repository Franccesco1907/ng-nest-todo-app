import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialStandaloneModules } from '../../../../shared/ui';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, MaterialStandaloneModules, ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {
  @Input() error: string | null = '';
  @Output() submitEM = new EventEmitter();

  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(private router: Router) { }

  submit() {
    if (this.form.valid) {
      console.log(this.form.value);
      this.submitEM.emit(this.form.value);
      this.router.navigate(['/todos']);
    } else {
      this.form.markAllAsTouched();
    }
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }
}
