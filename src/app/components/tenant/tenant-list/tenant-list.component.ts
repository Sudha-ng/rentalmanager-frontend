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

import { Tenant } from '../../../core/models/tenant.model';
import { TenantService } from '../../../core/services/tenant.service';

@Component({
  selector: 'app-tenant-list',
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
  templateUrl: './tenant-list.component.html',
  styleUrl: './tenant-list.component.css'
})
export class TenantListComponent {
  private readonly snackBar = inject(MatSnackBar);
  private readonly tenantService = inject(TenantService);

  readonly displayedColumns = ['id', 'name', 'actions'];
  tenants: Tenant[] = [];
  loading = true;
  errorMessage?: string;

  constructor() {
    this.loadTenants();
  }

  private loadTenants(): void {
    this.loading = true;
    this.errorMessage = undefined;

    this.tenantService
      .list()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (tenants) => {
          this.tenants = tenants;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.errorMessage = 'Unable to load tenants. Please retry.';
          this.snackBar.open('Fetching tenants failed. Try again shortly.', 'Dismiss', {
            duration: 4000
          });
        }
      });
  }
}
