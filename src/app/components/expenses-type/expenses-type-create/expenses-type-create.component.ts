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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ExpenseTypePayload } from '../../../core/models/expense-type.model';
import { ExpenseTypeService } from '../../../core/services/expense-type.service';

@Component({
  selector: 'app-expenses-type-create',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule
  ],
  templateUrl: './expenses-type-create.component.html',
  styleUrl: './expenses-type-create.component.css'
})
export class ExpensesTypeCreateComponent {
  private readonly expenseTypeService = inject(ExpenseTypeService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly form = new FormGroup({
    typeName: new FormControl('', {
      validators: [Validators.required, Validators.maxLength(60)],
      nonNullable: true
    }),
    description: new FormControl('', { validators: [Validators.maxLength(250)] })
  });

  submitting = false;

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const payload = this.form.getRawValue() as ExpenseTypePayload;

    this.expenseTypeService
      .create(payload)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: () => {
          this.submitting = false;
          this.snackBar.open('Expense type created.', 'Close', { duration: 3000 });
          this.router.navigate(['/expense-types']);
        },
        error: () => {
          this.submitting = false;
          this.snackBar.open('Unable to save type. Try again.', 'Dismiss', { duration: 3000 });
        }
      });
  }

  cancel(): void {
    this.router.navigate(['/expense-types']);
  }
}
