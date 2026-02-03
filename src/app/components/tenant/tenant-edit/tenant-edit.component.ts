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

import { TenantPayload } from '../../../core/models/tenant.model';
import { TenantService } from '../../../core/services/tenant.service';

@Component({
  selector: 'app-tenant-edit',
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
  templateUrl: './tenant-edit.component.html',
  styleUrl: './tenant-edit.component.css'
})
export class TenantEditComponent {
  private readonly tenantService = inject(TenantService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(120)]
    })
  });

  submitting = false;
  loadingTenant = true;
  private tenantId?: number;

  constructor() {
    this.route.paramMap
      .pipe(takeUntilDestroyed())
      .subscribe((params) => {
        const id = Number(params.get('id'));
        if (!Number.isNaN(id)) {
          this.tenantId = id;
          this.loadTenant();
        }
      });
  }

  submit(): void {
    if (this.form.invalid || !this.tenantId) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const payload = this.preparePayload(this.form.getRawValue());

    this.tenantService
      .update(this.tenantId, payload)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: () => {
          this.submitting = false;
          this.snackBar.open('Tenant updated.', 'Close', { duration: 3000 });
          this.router.navigate(['/tenant']);
        },
        error: () => {
          this.submitting = false;
          this.snackBar.open('Updating tenant failed. Try again.', 'Dismiss', { duration: 3000 });
        }
      });
  }

  cancel(): void {
    this.router.navigate(['/tenant']);
  }

  private loadTenant(): void {
    if (!this.tenantId) {
      return;
    }

    this.loadingTenant = true;
    this.tenantService
      .find(this.tenantId)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (tenant) => {
          this.form.patchValue({ name: tenant.name });
          this.loadingTenant = false;
        },
        error: () => {
          this.loadingTenant = false;
          this.snackBar.open('Unable to find the selected tenant.', 'Dismiss', { duration: 3000 });
          this.router.navigate(['/tenant']);
        }
      });
  }

  private preparePayload(raw: typeof this.form.value): TenantPayload {
    return {
      name: raw.name?.trim() ?? ''
    };
  }
}
