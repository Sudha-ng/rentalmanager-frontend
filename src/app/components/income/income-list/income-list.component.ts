import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';

import { Income } from '../../../core/models/income.model';
import { IncomeService } from '../../../core/services/income.service';

@Component({
  selector: 'app-income-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './income-list.component.html',
  styleUrl: './income-list.component.css'
})
export class IncomeListComponent {
  private readonly snackBar = inject(MatSnackBar);
  private readonly incomeService = inject(IncomeService);

  readonly displayedColumns = ['id', 'salary', 'actions'];
  incomes: Income[] = [];
  loading = true;
  errorMessage?: string;

  constructor() {
    this.loadIncome();
  }

  private loadIncome(): void {
    this.loading = true;
    this.errorMessage = undefined;

    this.incomeService
      .list()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (incomes) => {
          this.incomes = incomes;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.errorMessage = 'Unable to load income entries. Please retry.';
          this.snackBar.open('Fetching income entries failed. Try again shortly.', 'Dismiss', {
            duration: 4000
          });
        }
      });
  }
}
