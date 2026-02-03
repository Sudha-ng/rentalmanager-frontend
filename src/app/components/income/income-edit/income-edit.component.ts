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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { IncomePayload } from '../../../core/models/income.model';
import { IncomeService } from '../../../core/services/income.service';

@Component({
  selector: 'app-income-edit',
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
  templateUrl: './income-edit.component.html',
  styleUrl: './income-edit.component.css'
})
export class IncomeEditComponent {
  private readonly incomeService = inject(IncomeService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly form = new FormGroup({
    salary: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(0)]
    })
  });

  submitting = false;
  loadingIncome = true;
  private incomeId?: number;

  constructor() {
    this.route.paramMap
      .pipe(takeUntilDestroyed())
      .subscribe((params) => {
        const id = Number(params.get('id'));
        if (!Number.isNaN(id)) {
          this.incomeId = id;
          this.loadIncome();
        }
      });
  }

  submit(): void {
    if (this.form.invalid || !this.incomeId) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const payload = this.preparePayload(this.form.getRawValue());

    this.incomeService
      .update(this.incomeId, payload)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: () => {
          this.submitting = false;
          this.snackBar.open('Income entry updated.', 'Close', { duration: 3000 });
          this.router.navigate(['/income']);
        },
        error: () => {
          this.submitting = false;
          this.snackBar.open('Updating income failed. Try again.', 'Dismiss', { duration: 3000 });
        }
      });
  }

  cancel(): void {
    this.router.navigate(['/income']);
  }

  private loadIncome(): void {
    if (!this.incomeId) {
      return;
    }

    this.loadingIncome = true;
    this.incomeService
      .find(this.incomeId)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (income) => {
          this.form.patchValue({ salary: income.salary });
          this.loadingIncome = false;
        },
        error: () => {
          this.loadingIncome = false;
          this.snackBar.open('Unable to find the selected income entry.', 'Dismiss', { duration: 3000 });
          this.router.navigate(['/income']);
        }
      });
  }

  private preparePayload(raw: typeof this.form.value): IncomePayload {
    return {
      salary: Number(raw.salary) || 0
    };
  }
}
