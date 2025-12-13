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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ExpenseTypePayload } from '../../../core/models/expense-type.model';
import { ExpenseTypeService } from '../../../core/services/expense-type.service';

@Component({
  selector: 'app-expenses-type-edit',
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
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './expenses-type-edit.component.html',
  styleUrl: './expenses-type-edit.component.css'
})
export class ExpensesTypeEditComponent {
  private readonly expenseTypeService = inject(ExpenseTypeService);
  private readonly route = inject(ActivatedRoute);
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
  loading = true;
  private typeId?: number;

  constructor() {
    this.route.paramMap
      .pipe(takeUntilDestroyed())
      .subscribe((params) => {
        const id = Number(params.get('id'));
        if (!Number.isNaN(id)) {
          this.typeId = id;
          this.loadType();
        }
      });
  }

  submit(): void {
    if (this.form.invalid || !this.typeId) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const payload = this.form.getRawValue() as ExpenseTypePayload;

    this.expenseTypeService
      .update(this.typeId, payload)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: () => {
          this.submitting = false;
          this.snackBar.open('Expense type updated.', 'Close', { duration: 3000 });
          this.router.navigate(['/expense-types']);
        },
        error: () => {
          this.submitting = false;
          this.snackBar.open('Unable to update type.', 'Dismiss', { duration: 3000 });
        }
      });
  }

  cancel(): void {
    this.router.navigate(['/expense-types']);
  }

  private loadType(): void {
    if (!this.typeId) {
      return;
    }

    this.loading = true;
    this.expenseTypeService
      .find(this.typeId)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (type) => {
          this.form.patchValue({
            typeName: type.typeName,
            description: type.description || ''
          });
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.snackBar.open('Unable to locate that expense type.', 'Dismiss', { duration: 3000 });
          this.router.navigate(['/expense-types']);
        }
      });
  }
}
