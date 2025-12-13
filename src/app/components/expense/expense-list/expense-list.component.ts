import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { debounceTime } from 'rxjs/operators';

import { Expense } from '../../../core/models/expense.model';
import { ExpenseType } from '../../../core/models/expense-type.model';
import { ExpenseService } from '../../../core/services/expense.service';
import { ExpenseTypeService } from '../../../core/services/expense-type.service';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  templateUrl: './expense-list.component.html',
  styleUrl: './expense-list.component.css'
})
export class ExpenseListComponent {
  private readonly expenseService = inject(ExpenseService);
  private readonly expenseTypeService = inject(ExpenseTypeService);
  private readonly snackBar = inject(MatSnackBar);

  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly typeFilterControl = new FormControl<number | null>(null);

  readonly displayedColumns = ['description', 'type', 'property', 'amount', 'date', 'actions'];
  expenses: Expense[] = [];
  expenseTypes: ExpenseType[] = [];
  loading = false;
  errorMessage?: string;
  private readonly typeNameById = new Map<number, string>();

  constructor() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), takeUntilDestroyed())
      .subscribe(() => this.loadExpenses());

    this.typeFilterControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.loadExpenses());

    this.loadExpenseTypes();
    this.loadExpenses();
  }

  clearFilters(): void {
    this.searchControl.setValue('', { emitEvent: false });
    this.typeFilterControl.setValue(null, { emitEvent: false });
    this.loadExpenses();
  }

  trackByExpenseId(_: number, expense: Expense): number | undefined {
    return expense.id;
  }

  resolveTypeName(expense: Expense): string {
    return (
      expense.expenseTypeName ||
      this.typeNameById.get(expense.expenseTypeId) ||
      '—'
    );
  }

  private loadExpenseTypes(): void {
    this.expenseTypeService
      .list()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (types) => {
          this.expenseTypes = types;
          this.typeNameById.clear();
          types.forEach((type) => {
            if (type.id !== undefined) {
              this.typeNameById.set(type.id, type.typeName);
            }
          });
        },
        error: () =>
          this.snackBar.open('Unable to load expense types right now.', 'Dismiss', {
            duration: 4000
          })
      });
  }

  private loadExpenses(): void {
    this.loading = true;
    this.errorMessage = undefined;

    this.expenseService
      .list({
        search: this.searchControl.value || undefined,
        expenseTypeId: this.typeFilterControl.value ?? undefined
      })
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (expenses) => {
          this.expenses = expenses;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.errorMessage = 'Unable to load expenses. Please retry.';
          this.snackBar.open('Fetching expenses failed. Try again shortly.', 'Dismiss', {
            duration: 4000
          });
        }
      });
  }
}
