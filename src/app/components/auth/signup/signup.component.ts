import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { RegisterPayload, UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupData: RegisterPayload = {
    username: '',
    email: '',
    password: '',
    role: UserRole.CUSTOMER,
    firstName: '',
    lastName: '',
    phone: ''
  };

  confirmPassword = '';
  errorMessage = '';
  isLoading = false;
  userRoles = UserRole;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    // Validation
    if (!this.signupData.username || !this.signupData.email || 
        !this.signupData.password || !this.signupData.firstName || 
        !this.signupData.lastName) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    if (this.signupData.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (this.signupData.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.signupData).subscribe({
      next: (response) => {
        this.isLoading = false;
        // Redirect to home dashboard after successful registration
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}
