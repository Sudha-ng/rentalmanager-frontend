import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { API_BASE_URL } from '../../../core/constants/api.constants';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email = '';
  newPassword = '';
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;
  step: 'email' | 'reset' = 'email';

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  onSubmitEmail(): void {
    if (!this.email) {
      this.errorMessage = 'Please enter your email address';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Send email to backend to verify and get reset token
    this.http.post(`${API_BASE_URL}/auth/forgot-password`, { email: this.email }).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.step = 'reset';
        this.successMessage = 'Email verified! Please enter your new password.';
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Email not found or error occurred';
      }
    });
  }

  onSubmitReset(): void {
    if (!this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'Please enter both password fields';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (this.newPassword.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Send new password to backend
    this.http.post(`${API_BASE_URL}/auth/reset-password`, { 
      email: this.email, 
      newPassword: this.newPassword 
    }).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Password reset successful! Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to reset password. Please try again.';
      }
    });
  }

  goBack(): void {
    if (this.step === 'reset') {
      this.step = 'email';
      this.errorMessage = '';
      this.successMessage = '';
    } else {
      this.router.navigate(['/login']);
    }
  }
}
