import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatFormField,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    CommonModule,
    RouterLink,
  ],
  standalone: true,
})
export class SignupComponent {
  signupForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(/^\S+@\S+\.\S+$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          this.passwordsMatchValidator(),
        ],
      ],
    });
  }

  passwordsMatchValidator() {
    return (control: import('@angular/forms').AbstractControl) => {
      if (!this.signupForm) return null;
      const password = this.signupForm.get('password')?.value;
      const confirm = control.value;
      return password === confirm ? null : { passwordsMismatch: true };
    };
  }

  onSubmit() {
    if (this.signupForm.invalid) return;
    this.loading = true;
    this.error = null;
    this.auth.signup(this.signupForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login'], {
          queryParams: { signup: 'success' },
        });
      },
      error: (err) => {
        this.error = err.error?.error || 'Signup failed';
        this.loading = false;
      },
    });
  }
}
