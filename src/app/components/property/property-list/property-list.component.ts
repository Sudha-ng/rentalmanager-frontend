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

import { Property } from '../../../core/models/property.model';
import { PropertyService } from '../../../core/services/property.service';

@Component({
  selector: 'app-property-list',
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
  templateUrl: './property-list.component.html',
  styleUrl: './property-list.component.css'
})
export class PropertyListComponent {
  private readonly snackBar = inject(MatSnackBar);
  private readonly propertyService = inject(PropertyService);

  readonly displayedColumns = ['ids', 'details', 'location', 'financials', 'status', 'actions'];
  properties: Property[] = [];
  loading = true;
  errorMessage?: string;

  constructor() {
    this.loadProperties();
  }

  trackByPropertyId(index: number, property: Property): number {
    return property.id ?? property.propertyId ?? index;
  }

  propertyIdentifier(property: Property): number | undefined {
    return property.id ?? property.propertyId ?? undefined;
  }

  private loadProperties(): void {
    this.loading = true;
    this.errorMessage = undefined;

    this.propertyService
      .list()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (properties) => {
          this.properties = properties;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.errorMessage = 'Unable to load properties. Please retry.';
          this.snackBar.open('Fetching properties failed. Try again shortly.', 'Dismiss', {
            duration: 4000
          });
        }
      });
  }
}
