import { Routes } from '@angular/router';

import { ExpenseCreateComponent } from './components/expense/expense-create/expense-create.component';
import { ExpenseEditComponent } from './components/expense/expense-edit/expense-edit.component';
import { ExpenseListComponent } from './components/expense/expense-list/expense-list.component';
import { ExpensesTypeCreateComponent } from './components/expenses-type/expenses-type-create/expenses-type-create.component';
import { ExpensesTypeEditComponent } from './components/expenses-type/expenses-type-edit/expenses-type-edit.component';
import { ExpensesTypeListComponent } from './components/expenses-type/expenses-type-list/expenses-type-list.component';
import { EmergencyContactCreateComponent } from './components/emergency-contact/emergency-contact-create/emergency-contact-create.component';
import { EmergencyContactEditComponent } from './components/emergency-contact/emergency-contact-edit/emergency-contact-edit.component';
import { EmergencyContactListComponent } from './components/emergency-contact/emergency-contact-list/emergency-contact-list.component';
import { IncomeCreateComponent } from './components/income/income-create/income-create.component';
import { IncomeEditComponent } from './components/income/income-edit/income-edit.component';
import { IncomeListComponent } from './components/income/income-list/income-list.component';
import { LeaseCreateComponent } from './components/lease/lease-create/lease-create.component';
import { LeaseEditComponent } from './components/lease/lease-edit/lease-edit.component';
import { LeaseListComponent } from './components/lease/lease-list/lease-list.component';
import { PropertyCreateComponent } from './components/property/property-create/property-create.component';
import { PropertyEditComponent } from './components/property/property-edit/property-edit.component';
import { PropertyListComponent } from './components/property/property-list/property-list.component';
import { TenantCreateComponent } from './components/tenant/tenant-create/tenant-create.component';
import { TenantEditComponent } from './components/tenant/tenant-edit/tenant-edit.component';
import { TenantListComponent } from './components/tenant/tenant-list/tenant-list.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { UnauthorizedComponent } from './components/auth/unauthorized/unauthorized.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './core/guards/auth.guard';
import { UserRole } from './core/models/user.model';

export const routes: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'home', component: HomeComponent, title: 'Dashboard', canActivate: [authGuard] },
	{ path: 'login', component: LoginComponent, title: 'Login' },
	{ path: 'signup', component: SignupComponent, title: 'Sign Up' },
	{ path: 'forgot-password', component: ForgotPasswordComponent, title: 'Forgot Password' },
	{ path: 'unauthorized', component: UnauthorizedComponent, title: 'Unauthorized' },
	{ path: 'property', component: PropertyListComponent, title: 'Properties', canActivate: [authGuard], data: { role: UserRole.OWNER } },
	{ path: 'property/create', component: PropertyCreateComponent, title: 'Create Property', canActivate: [authGuard], data: { role: UserRole.OWNER } },
	{ path: 'property/:id/edit', component: PropertyEditComponent, title: 'Edit Property', canActivate: [authGuard], data: { role: UserRole.OWNER } },
	{ path: 'income', component: IncomeListComponent, title: 'Income', canActivate: [authGuard] },
	{ path: 'income/create', component: IncomeCreateComponent, title: 'Record Income', canActivate: [authGuard], data: { role: UserRole.OWNER } },
	{ path: 'income/:id/edit', component: IncomeEditComponent, title: 'Edit Income', canActivate: [authGuard], data: { role: UserRole.OWNER } },
	{ path: 'expenses', component: ExpenseListComponent, title: 'Expenses', canActivate: [authGuard] },
	{ path: 'expenses/create', component: ExpenseCreateComponent, title: 'Create Expense', canActivate: [authGuard], data: { role: UserRole.OWNER } },
	{ path: 'expenses/:id/edit', component: ExpenseEditComponent, title: 'Edit Expense', canActivate: [authGuard], data: { role: UserRole.OWNER } },
	{ path: 'expense-types', component: ExpensesTypeListComponent, title: 'Expense Types', canActivate: [authGuard], data: { role: UserRole.OWNER } },
	{ path: 'expense-types/create', component: ExpensesTypeCreateComponent, title: 'Create Expense Type', canActivate: [authGuard], data: { role: UserRole.OWNER } },
	{ path: 'expense-types/:id/edit', component: ExpensesTypeEditComponent, title: 'Edit Expense Type', canActivate: [authGuard], data: { role: UserRole.OWNER } },
	{ path: 'lease', component: LeaseListComponent, title: 'Leases', canActivate: [authGuard] },
	{ path: 'lease/create', component: LeaseCreateComponent, title: 'Create Lease', canActivate: [authGuard], data: { role: UserRole.OWNER } },
	{ path: 'lease/:id/edit', component: LeaseEditComponent, title: 'Edit Lease', canActivate: [authGuard], data: { role: UserRole.OWNER } },
	{ path: 'tenant', component: TenantListComponent, title: 'Tenants', canActivate: [authGuard] },
	{ path: 'tenant/create', component: TenantCreateComponent, title: 'Create Tenant', canActivate: [authGuard], data: { role: UserRole.OWNER } },
	{ path: 'tenant/:id/edit', component: TenantEditComponent, title: 'Edit Tenant', canActivate: [authGuard], data: { role: UserRole.OWNER } },
	{ path: 'emergency-contact', component: EmergencyContactListComponent, title: 'Emergency Contacts', canActivate: [authGuard] },
	{ path: 'emergency-contact/create', component: EmergencyContactCreateComponent, title: 'Create Emergency Contact', canActivate: [authGuard] },
	{ path: 'emergency-contact/:id/edit', component: EmergencyContactEditComponent, title: 'Edit Emergency Contact', canActivate: [authGuard] },
	{ path: '**', redirectTo: 'login' }
];
