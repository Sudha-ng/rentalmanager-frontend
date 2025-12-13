import { Routes } from '@angular/router';

import { ExpenseCreateComponent } from './components/expense/expense-create/expense-create.component';
import { ExpenseEditComponent } from './components/expense/expense-edit/expense-edit.component';
import { ExpenseListComponent } from './components/expense/expense-list/expense-list.component';
import { ExpensesTypeCreateComponent } from './components/expenses-type/expenses-type-create/expenses-type-create.component';
import { ExpensesTypeEditComponent } from './components/expenses-type/expenses-type-edit/expenses-type-edit.component';
import { ExpensesTypeListComponent } from './components/expenses-type/expenses-type-list/expenses-type-list.component';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'expenses' },
	{ path: 'expenses', component: ExpenseListComponent, title: 'Expenses' },
	{ path: 'expenses/create', component: ExpenseCreateComponent, title: 'Create Expense' },
	{ path: 'expenses/:id/edit', component: ExpenseEditComponent, title: 'Edit Expense' },
	{ path: 'expense-types', component: ExpensesTypeListComponent, title: 'Expense Types' },
	{ path: 'expense-types/create', component: ExpensesTypeCreateComponent, title: 'Create Expense Type' },
	{ path: 'expense-types/:id/edit', component: ExpensesTypeEditComponent, title: 'Edit Expense Type' },
	{ path: '**', redirectTo: 'expenses' }
];
