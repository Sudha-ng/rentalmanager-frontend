import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ExpenseType } from '../../../core/models/expense-type.model';
import { ExpenseTypeService } from '../../../core/services/expense-type.service';

@Component({
  selector: 'app-expenses-type-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './expenses-type-list.component.html',
  styleUrl: './expenses-type-list.component.css'
})
export class ExpensesTypeListComponent {
  private readonly expenseTypeService = inject(ExpenseTypeService);
  private readonly snackBar = inject(MatSnackBar);

  displayedColumns = ['typeName', 'description', 'updatedAt', 'actions'];
  expenseTypes: ExpenseType[] = [];
  loading = true;

  constructor() {
    this.loadExpenseTypes();
  }

  trackByTypeId(_: number, type: ExpenseType): number | undefined {
    return type.id;
  }

  private loadExpenseTypes(): void {
    this.expenseTypeService
      .list()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (types) => {
          this.expenseTypes = types;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.snackBar.open('Unable to load expense types.', 'Dismiss', { duration: 3000 });
        }
      });
  }
}
