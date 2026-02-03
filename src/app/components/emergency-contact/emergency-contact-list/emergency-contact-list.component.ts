import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';

import { TenantEmergencyContact } from '../../../core/models/tenant-emergency-contact.model';
import { TenantEmergencyContactService } from '../../../core/services/tenant-emergency-contact.service';

@Component({
  selector: 'app-emergency-contact-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './emergency-contact-list.component.html',
  styleUrl: './emergency-contact-list.component.css'
})
export class EmergencyContactListComponent {
  private readonly snackBar = inject(MatSnackBar);
  private readonly contactService = inject(TenantEmergencyContactService);

  readonly displayedColumns = ['id', 'phone', 'actions'];
  contacts: TenantEmergencyContact[] = [];
  loading = true;
  errorMessage?: string;

  constructor() {
    this.loadContacts();
  }

  private loadContacts(): void {
    this.loading = true;
    this.errorMessage = undefined;

    this.contactService
      .list()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (contacts) => {
          this.contacts = contacts;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.errorMessage = 'Unable to load emergency contacts. Please retry.';
          this.snackBar.open('Fetching emergency contacts failed. Try again shortly.', 'Dismiss', {
            duration: 4000
          });
        }
      });
  }
}
