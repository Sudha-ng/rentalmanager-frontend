import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { PropertyService } from '../../core/services/property.service';
import { TenantService } from '../../core/services/tenant.service';
import { LeaseService } from '../../core/services/lease.service';
import { User, UserRole } from '../../core/models/user.model';
import { Property } from '../../core/models/property.model';
import { Tenant } from '../../core/models/tenant.model';
import { Lease } from '../../core/models/lease.model';
import { forkJoin } from 'rxjs';

interface DashboardCard {
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
  allowedRoles?: UserRole[];
}

interface SearchResultItem {
  type: 'Property' | 'Tenant' | 'Lease';
  icon: string;
  title: string;
  subtitle: string;
  route: string;
  color: string;
  _score?: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentUser: User | null = null;
  searchQuery: string = '';
  dashboardCards: DashboardCard[] = [
    {
      title: 'Properties',
      description: 'Manage your rental properties',
      icon: '🏠',
      route: '/property',
      color: '#6366f1',
      allowedRoles: [UserRole.OWNER]
    },
    {
      title: 'Tenants',
      description: 'View and manage tenants',
      icon: '👥',
      route: '/tenant',
      color: '#8b5cf6'
    },
    {
      title: 'Leases',
      description: 'Track and manage lease agreements',
      icon: '📝',
      route: '/lease',
      color: '#ec4899'
    },
    {
      title: 'Income',
      description: 'Record and track rental income',
      icon: '💰',
      route: '/income',
      color: '#10b981'
    },
    {
      title: 'Expenses',
      description: 'Monitor property expenses',
      icon: '💸',
      route: '/expenses',
      color: '#f59e0b'
    },
    {
      title: 'Expense Types',
      description: 'Manage expense categories',
      icon: '📊',
      route: '/expense-types',
      color: '#06b6d4',
      allowedRoles: [UserRole.OWNER]
    },
    {
      title: 'Emergency Contacts',
      description: 'Maintain emergency contact information',
      icon: '🚨',
      route: '/emergency-contact',
      color: '#ef4444'
    }
  ];

  filteredCards: DashboardCard[] = [];
  searchResults: SearchResultItem[] = [];
  isSearching = false;
  showSearchResults = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private propertyService: PropertyService,
    private tenantService: TenantService,
    private leaseService: LeaseService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.filterCardsByRole();
  }

  filterCardsByRole(): void {
    if (!this.currentUser) {
      this.filteredCards = [];
      return;
    }

    this.filteredCards = this.dashboardCards.filter(card => {
      if (!card.allowedRoles) {
        return true;
      }
      return card.allowedRoles.includes(this.currentUser!.role);
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  performSearch(): void {
    const query = this.searchQuery.trim();
    if (!query) {
      this.showSearchResults = false;
      this.searchResults = [];
      this.filterCardsByRole();
      return;
    }

    this.isSearching = true;
    this.searchResults = [];

    // Search across properties, tenants, and leases
    forkJoin({
      properties: this.propertyService.list(),
      tenants: this.tenantService.list(),
      leases: this.leaseService.list()
    }).subscribe({
      next: (results) => {
        const normalizedQuery = this.normalizeSearchText(query);

        const properties: Property[] = results.properties ?? [];
        const tenants: Tenant[] = results.tenants ?? [];
        const leases: Lease[] = results.leases ?? [];

        const matchedProperties: SearchResultItem[] = properties
          .filter((prop) => this.matchesProperty(prop, normalizedQuery))
          .map((prop) => this.mapPropertyResult(prop));

        const matchedTenants: SearchResultItem[] = tenants
          .filter((tenant) => this.matchesTenant(tenant, normalizedQuery))
          .map((tenant) => this.mapTenantResult(tenant));

        const matchedLeases: SearchResultItem[] = leases
          .filter((lease) => this.matchesLease(lease, normalizedQuery))
          .map((lease) => this.mapLeaseResult(lease));

        const combined = [...matchedProperties, ...matchedTenants, ...matchedLeases];
        this.searchResults = this.sortResultsByRelevance(combined, normalizedQuery);
        this.showSearchResults = true;
        this.isSearching = false;
      },
      error: (error) => {
        console.error('Search error:', error);
        this.isSearching = false;
        this.searchResults = [];
        this.showSearchResults = true;
      }
    });
  }

  navigateToResult(route: string): void {
    this.router.navigate([route]);
    this.showSearchResults = false;
    this.searchQuery = '';
    this.searchResults = [];
  }

  private normalizeSearchText(value: string): string {
    return (value ?? '').toString().trim().toLowerCase();
  }

  private includesQuery(value: string | number | null | undefined, normalizedQuery: string): boolean {
    if (!normalizedQuery) return true;
    if (value === null || value === undefined) return false;
    return this.normalizeSearchText(String(value)).includes(normalizedQuery);
  }

  private matchesProperty(prop: Property, normalizedQuery: string): boolean {
    return (
      this.includesQuery(prop.name, normalizedQuery) ||
      this.includesQuery(prop.addressLine1, normalizedQuery) ||
      this.includesQuery(prop.addressLine2 ?? '', normalizedQuery) ||
      this.includesQuery(prop.city, normalizedQuery) ||
      this.includesQuery(prop.stateProvince, normalizedQuery) ||
      this.includesQuery(prop.zipPostalCode, normalizedQuery) ||
      this.includesQuery(prop.propertyId ?? '', normalizedQuery)
    );
  }

  private matchesTenant(tenant: Tenant, normalizedQuery: string): boolean {
    return this.includesQuery(tenant.name, normalizedQuery) || this.includesQuery(tenant.id ?? '', normalizedQuery);
  }

  private matchesLease(lease: Lease, normalizedQuery: string): boolean {
    return (
      this.includesQuery(lease.leaseMonths, normalizedQuery) ||
      this.includesQuery(lease.id ?? '', normalizedQuery)
    );
  }

  private mapPropertyResult(prop: Property): SearchResultItem {
    const addressParts = [prop.addressLine1, prop.city, prop.stateProvince, prop.zipPostalCode].filter(Boolean);
    const subtitle = addressParts.join(', ');
    const id = prop.id ?? prop.propertyId;
    return {
      type: 'Property',
      icon: '🏠',
      title: prop.name ?? 'Property',
      subtitle,
      route: typeof id === 'number' ? `/property/${id}/edit` : '/property',
      color: '#6366f1'
    };
  }

  private mapTenantResult(tenant: Tenant): SearchResultItem {
    const id = tenant.id;
    return {
      type: 'Tenant',
      icon: '👤',
      title: tenant.name ?? 'Tenant',
      subtitle: typeof id === 'number' ? `Tenant ID: ${id}` : 'Tenant',
      route: typeof id === 'number' ? `/tenant/${id}/edit` : '/tenant',
      color: '#8b5cf6'
    };
  }

  private mapLeaseResult(lease: Lease): SearchResultItem {
    const id = lease.id;
    const months = lease.leaseMonths;
    return {
      type: 'Lease',
      icon: '📝',
      title: typeof id === 'number' ? `Lease #${id}` : 'Lease',
      subtitle: typeof months === 'number' ? `Duration: ${months} month(s)` : 'Lease',
      route: typeof id === 'number' ? `/lease/${id}/edit` : '/lease',
      color: '#ec4899'
    };
  }

  private scoreText(text: string, normalizedQuery: string): number {
    const normalizedText = this.normalizeSearchText(text);
    if (!normalizedText || !normalizedQuery) return 0;
    if (normalizedText === normalizedQuery) return 100;
    if (normalizedText.startsWith(normalizedQuery)) return 80;
    if (normalizedText.includes(normalizedQuery)) return 50;
    return 0;
  }

  private scoreResult(result: SearchResultItem, normalizedQuery: string): number {
    const titleScore = this.scoreText(result.title, normalizedQuery);
    const subtitleScore = this.scoreText(result.subtitle, normalizedQuery);
    const typeBoost = result.type === 'Property' ? 3 : result.type === 'Tenant' ? 2 : 1;
    return Math.max(titleScore, subtitleScore) * 10 + typeBoost;
  }

  private sortResultsByRelevance(results: SearchResultItem[], normalizedQuery: string): SearchResultItem[] {
    return results
      .map((r) => ({ ...r, _score: this.scoreResult(r, normalizedQuery) }))
      .sort((a, b) => {
        const scoreDiff = (b._score ?? 0) - (a._score ?? 0);
        if (scoreDiff !== 0) return scoreDiff;
        const typeDiff = a.type.localeCompare(b.type);
        if (typeDiff !== 0) return typeDiff;
        return a.title.localeCompare(b.title);
      })
      .map(({ _score, ...rest }) => rest);
  }
}
