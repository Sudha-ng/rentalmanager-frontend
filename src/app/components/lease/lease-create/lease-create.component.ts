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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { LeasePayload } from '../../../core/models/lease.model';
import { LeaseService } from '../../../core/services/lease.service';

@Component({
  selector: 'app-lease-create',
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
  templateUrl: './lease-create.component.html',
  styleUrl: './lease-create.component.css'
})
export class LeaseCreateComponent {
  private readonly leaseService = inject(LeaseService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly form = new FormGroup({
    leaseMonths: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(1)]
    })
  });

  submitting = false;

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const payload = this.preparePayload(this.form.getRawValue());

    this.leaseService
      .create(payload)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: () => {
          this.submitting = false;
          this.snackBar.open('Lease created.', 'Close', { duration: 3000 });
          this.router.navigate(['/lease']);
        },
        error: () => {
          this.submitting = false;
          this.snackBar.open('Saving lease failed. Try again.', 'Dismiss', { duration: 3000 });
        }
      });
  }

  cancel(): void {
    this.router.navigate(['/lease']);
  }

  private preparePayload(raw: typeof this.form.value): LeasePayload {
    return {
      leaseMonths: Number(raw.leaseMonths) || 0
    };
  }
}
