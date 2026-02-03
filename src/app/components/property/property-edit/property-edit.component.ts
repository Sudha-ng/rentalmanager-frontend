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

import { PropertyPayload } from '../../../core/models/property.model';
import { PropertyService } from '../../../core/services/property.service';

@Component({
  selector: 'app-property-edit',
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
  templateUrl: './property-edit.component.html',
  styleUrl: './property-edit.component.css'
})
export class PropertyEditComponent {
  private readonly propertyService = inject(PropertyService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly form = new FormGroup({
    userId: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(1)]
    }),
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(120)]
    }),
    addressLine1: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(255)]
    }),
    addressLine2: new FormControl('', {
      validators: [Validators.maxLength(255)]
    }),
    city: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)]
    }),
    stateProvince: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)]
    }),
    zipPostalCode: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(20)]
    }),
    purchasePrice: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(0)]
    }),
    currentMarketValue: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(0)]
    }),
    status: new FormControl<'active' | 'inactive'>('active', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  submitting = false;
  loadingProperty = true;
  private propertyId?: number;

  constructor() {
    this.route.paramMap
      .pipe(takeUntilDestroyed())
      .subscribe((params) => {
        const id = Number(params.get('id'));
        if (!Number.isNaN(id)) {
          this.propertyId = id;
          this.loadProperty();
        }
      });
  }

  submit(): void {
    if (this.form.invalid || !this.propertyId) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const payload = this.preparePayload(this.form.getRawValue());

    this.propertyService
      .update(this.propertyId, payload)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: () => {
          this.submitting = false;
          this.snackBar.open('Property updated.', 'Close', { duration: 3000 });
          this.router.navigate(['/property']);
        },
        error: () => {
          this.submitting = false;
          this.snackBar.open('Updating property failed. Try again.', 'Dismiss', { duration: 3000 });
        }
      });
  }

  cancel(): void {
    this.router.navigate(['/property']);
  }

  private loadProperty(): void {
    if (!this.propertyId) {
      return;
    }

    this.loadingProperty = true;
    this.propertyService
      .find(this.propertyId)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (property) => {
          this.form.patchValue({
            userId: property.userId ?? null,
            name: property.name,
            addressLine1: property.addressLine1,
            addressLine2: property.addressLine2 || '',
            city: property.city,
            stateProvince: property.stateProvince,
            zipPostalCode: property.zipPostalCode,
            purchasePrice: property.purchasePrice,
            currentMarketValue: property.currentMarketValue,
            status: (property.status || 'inactive') as 'active' | 'inactive'
          });
          this.loadingProperty = false;
        },
        error: () => {
          this.loadingProperty = false;
          this.snackBar.open('Unable to find the selected property.', 'Dismiss', { duration: 3000 });
          this.router.navigate(['/property']);
        }
      });
  }

  private preparePayload(raw: typeof this.form.value): PropertyPayload {
    return {
      userId: Number(raw.userId) || 0,
      name: raw.name?.trim() ?? '',
      addressLine1: raw.addressLine1?.trim() ?? '',
      addressLine2: raw.addressLine2?.trim() || undefined,
      city: raw.city?.trim() ?? '',
      stateProvince: raw.stateProvince?.trim() ?? '',
      zipPostalCode: raw.zipPostalCode?.trim() ?? '',
      purchasePrice: Number(raw.purchasePrice) || 0,
      currentMarketValue: Number(raw.currentMarketValue) || 0,
      status: (raw.status ?? 'active') as 'active' | 'inactive'
    };
  }
}
