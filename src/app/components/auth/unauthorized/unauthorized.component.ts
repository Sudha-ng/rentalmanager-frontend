import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="unauthorized-container">
      <div class="unauthorized-content">
        <mat-icon class="unauthorized-icon">block</mat-icon>
        <h1>Access Denied</h1>
        <p>You don't have permission to access this page.</p>
        <p class="hint">This page is restricted to specific user roles.</p>
        <button mat-raised-button color="primary" (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
          Go Back
        </button>
      </div>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 200px);
      padding: 2rem;
    }

    .unauthorized-content {
      text-align: center;
      max-width: 500px;
    }

    .unauthorized-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: #e53e3e;
      margin-bottom: 1rem;
    }

    h1 {
      font-size: 2rem;
      color: #1a202c;
      margin: 1rem 0;
    }

    p {
      color: #4a5568;
      font-size: 1rem;
      margin: 0.5rem 0;
    }

    .hint {
      font-size: 0.9rem;
      color: #718096;
      margin-bottom: 2rem;
    }

    button {
      margin-top: 1rem;
    }
  `]
})
export class UnauthorizedComponent {
  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/expenses']);
  }
}
