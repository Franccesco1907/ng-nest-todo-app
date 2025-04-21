import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialStandaloneModules } from '../../../../shared/ui';
import { NotificationService } from '../../../../core/services';
import { AuthService } from '../../../../core/services/auth.service';

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

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
  ) { }

  submit() {
    if (this.form.valid) {
      const { email } = this.form.value;
      this.authService.login(email).subscribe({
        next: () => {
          this.notificationService.showSuccess('Welcome to Todo App!');
          this.router.navigate(['/todos']);
        },
        error: (error) => {
          this.notificationService.showError('Error in login');
        }
      })
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
