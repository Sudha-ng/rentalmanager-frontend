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

import { TenantEmergencyContactPayload } from '../../../core/models/tenant-emergency-contact.model';
import { TenantEmergencyContactService } from '../../../core/services/tenant-emergency-contact.service';

@Component({
  selector: 'app-emergency-contact-edit',
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
  templateUrl: './emergency-contact-edit.component.html',
  styleUrl: './emergency-contact-edit.component.css'
})
export class EmergencyContactEditComponent {
  private readonly contactService = inject(TenantEmergencyContactService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly form = new FormGroup({
    tenantId: new FormControl<number | null>(null, {
      validators: [Validators.min(1)]
    }),
    phone: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(30)]
    })
  });

  submitting = false;
  loadingContact = true;
  private contactId?: number;

  constructor() {
    this.route.paramMap
      .pipe(takeUntilDestroyed())
      .subscribe((params) => {
        const id = Number(params.get('id'));
        if (!Number.isNaN(id)) {
          this.contactId = id;
          this.loadContact();
        }
      });
  }

  submit(): void {
    if (this.form.invalid || !this.contactId) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const payload = this.preparePayload(this.form.getRawValue());

    this.contactService
      .update(this.contactId, payload)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: () => {
          this.submitting = false;
          this.snackBar.open('Emergency contact updated.', 'Close', { duration: 3000 });
          this.router.navigate(['/emergency-contact']);
        },
        error: () => {
          this.submitting = false;
          this.snackBar.open('Updating contact failed. Try again.', 'Dismiss', { duration: 3000 });
        }
      });
  }

  cancel(): void {
    this.router.navigate(['/emergency-contact']);
  }

  private loadContact(): void {
    if (!this.contactId) {
      return;
    }

    this.loadingContact = true;
    this.contactService
      .find(this.contactId)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (contact) => {
          this.form.patchValue({
            tenantId: contact.tenantId ?? null,
            phone: contact.phone
          });
          this.loadingContact = false;
        },
        error: () => {
          this.loadingContact = false;
          this.snackBar.open('Unable to find the selected contact.', 'Dismiss', { duration: 3000 });
          this.router.navigate(['/emergency-contact']);
        }
      });
  }

  private preparePayload(raw: typeof this.form.value): TenantEmergencyContactPayload {
    const tenantId = Number(raw.tenantId);
    return {
      tenantId: Number.isNaN(tenantId) ? null : tenantId,
      phone: raw.phone?.trim() ?? ''
    };
  }
}
