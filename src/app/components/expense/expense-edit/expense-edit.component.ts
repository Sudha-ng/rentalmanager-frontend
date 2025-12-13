import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ExpensePayload } from '../../../core/models/expense.model';
import { ExpenseType } from '../../../core/models/expense-type.model';
import { ExpenseService } from '../../../core/services/expense.service';
import { ExpenseTypeService } from '../../../core/services/expense-type.service';

@Component({
  selector: 'app-expense-edit',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './expense-edit.component.html',
  styleUrl: './expense-edit.component.css'
})
export class ExpenseEditComponent {
  private readonly expenseService = inject(ExpenseService);
  private readonly expenseTypeService = inject(ExpenseTypeService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly form = new FormGroup({
    description: new FormControl('', {
      validators: [Validators.required, Validators.maxLength(120)],
      nonNullable: true
    }),
    amount: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(0.01)]
    }),
    expenseDate: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true
    }),
    expenseTypeId: new FormControl<number | null>(null, { validators: [Validators.required] }),
    propertyId: new FormControl<number | null>(null, { validators: [Validators.required] }),
    notes: new FormControl('', { validators: [Validators.maxLength(250)] })
  });

  expenseTypes: ExpenseType[] = [];
  submitting = false;
  loadingExpense = true;
  private expenseId?: number;

  constructor() {
    this.route.paramMap
      .pipe(takeUntilDestroyed())
      .subscribe((params) => {
        const id = Number(params.get('id'));
        if (!Number.isNaN(id)) {
          this.expenseId = id;
          this.loadExpense();
        }
      });

    this.loadExpenseTypes();
  }

  submit(): void {
    if (this.form.invalid || !this.expenseId) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const payload = this.preparePayload(this.form.getRawValue());

    this.expenseService
      .update(this.expenseId, payload)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: () => {
          this.submitting = false;
          this.snackBar.open('Expense updated.', 'Close', { duration: 3000 });
          this.router.navigate(['/expenses']);
        },
        error: () => {
          this.submitting = false;
          this.snackBar.open('Updating expense failed. Try again.', 'Dismiss', { duration: 3000 });
        }
      });
  }

  cancel(): void {
    this.router.navigate(['/expenses']);
  }

  private loadExpenseTypes(): void {
    this.expenseTypeService
      .list()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (types) => (this.expenseTypes = types),
        error: () =>
          this.snackBar.open('Unable to load expense types.', 'Dismiss', {
            duration: 3000
          })
      });
  }

  private loadExpense(): void {
    if (!this.expenseId) {
      return;
    }

    this.loadingExpense = true;
    this.expenseService
      .find(this.expenseId)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (expense) => {
          this.form.patchValue({
            description: expense.description,
            amount: expense.amount,
            expenseDate: expense.expenseDate?.substring(0, 10),
            expenseTypeId: expense.expenseTypeId,
            propertyId: expense.propertyId,
            notes: expense.notes || ''
          });
          this.loadingExpense = false;
        },
        error: () => {
          this.loadingExpense = false;
          this.snackBar.open('Unable to find the selected expense.', 'Dismiss', { duration: 3000 });
          this.router.navigate(['/expenses']);
        }
      });
  }

  private preparePayload(raw: typeof this.form.value): ExpensePayload {
    return {
      description: raw.description?.trim() ?? '',
      amount: Number(raw.amount) || 0,
      expenseDate: raw.expenseDate ?? new Date().toISOString(),
      expenseTypeId: Number(raw.expenseTypeId),
      propertyId: Number(raw.propertyId),
      notes: raw.notes?.trim() || undefined
    } as ExpensePayload;
  }
}
