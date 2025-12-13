import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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
  selector: 'app-expense-create',
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
  templateUrl: './expense-create.component.html',
  styleUrl: './expense-create.component.css'
})
export class ExpenseCreateComponent {
  private readonly expenseService = inject(ExpenseService);
  private readonly expenseTypeService = inject(ExpenseTypeService);
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
    expenseTypeId: new FormControl<number | null>(null, {
      validators: [Validators.required]
    }),
    propertyId: new FormControl<number | null>(null, {
      validators: [Validators.required]
    }),
    notes: new FormControl('', {
      validators: [Validators.maxLength(250)]
    })
  });

  expenseTypes: ExpenseType[] = [];
  loadingTypes = false;
  submitting = false;

  constructor() {
    this.form.patchValue({ expenseDate: new Date().toISOString().split('T')[0] });
    this.loadExpenseTypes();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const payload = this.preparePayload(this.form.getRawValue());

    this.expenseService
      .create(payload)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: () => {
          this.submitting = false;
          this.snackBar.open('Expense created successfully.', 'Close', { duration: 3000 });
          this.router.navigate(['/expenses']);
        },
        error: () => {
          this.submitting = false;
          this.snackBar.open('Saving expense failed. Try again.', 'Dismiss', { duration: 3000 });
        }
      });
  }

  cancel(): void {
    this.router.navigate(['/expenses']);
  }

  private loadExpenseTypes(): void {
    this.loadingTypes = true;
    this.expenseTypeService
      .list()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (types) => {
          this.expenseTypes = types;
          this.loadingTypes = false;
        },
        error: () => {
          this.loadingTypes = false;
          this.snackBar.open('Unable to load expense types.', 'Dismiss', { duration: 3000 });
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
