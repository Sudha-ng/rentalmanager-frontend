import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { LoginPayload, UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData: LoginPayload = {
    username: '',
    password: ''
  };

  errorMessage = '';
  isLoading = false;
  showPassword = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.redirectBasedOnRole();
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (!this.loginData.username || !this.loginData.password) {
      this.errorMessage = 'Please enter both username and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.redirectBasedOnRole();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Login error:', error);
        
        // Better error messages based on error type
        if (error.status === 0) {
          this.errorMessage = 'Cannot connect to server. Please ensure the backend is running on http://localhost:8090';
        } else if (error.status === 404) {
          this.errorMessage = 'Login endpoint not found. Check backend API configuration.';
        } else if (error.status === 401) {
          this.errorMessage = 'Invalid username or password';
        } else {
          this.errorMessage = error.error?.message || 'Login failed. Please try again.';
        }
      }
    });
  }

  private redirectBasedOnRole(): void {
    // Redirect all users to home dashboard after login
    this.router.navigate(['/home']);
  }
}
