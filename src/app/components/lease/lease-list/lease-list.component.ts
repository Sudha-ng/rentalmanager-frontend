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

import { Lease } from '../../../core/models/lease.model';
import { LeaseService } from '../../../core/services/lease.service';

@Component({
  selector: 'app-lease-list',
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
  templateUrl: './lease-list.component.html',
  styleUrl: './lease-list.component.css'
})
export class LeaseListComponent {
  private readonly snackBar = inject(MatSnackBar);
  private readonly leaseService = inject(LeaseService);

  readonly displayedColumns = ['id', 'term', 'actions'];
  leases: Lease[] = [];
  loading = true;
  errorMessage?: string;

  constructor() {
    this.loadLeases();
  }

  private loadLeases(): void {
    this.loading = true;
    this.errorMessage = undefined;

    this.leaseService
      .list()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (leases) => {
          this.leases = leases;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.errorMessage = 'Unable to load leases. Please retry.';
          this.snackBar.open('Fetching leases failed. Try again shortly.', 'Dismiss', {
            duration: 4000
          });
        }
      });
  }
}
