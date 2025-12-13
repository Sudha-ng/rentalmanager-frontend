export interface Expense {
  id?: number;
  description: string;
  amount: number;
  expenseDate: string;
  expenseTypeId: number;
  propertyId: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  expenseTypeName?: string;
}

export type ExpensePayload = Omit<Expense, 'id' | 'createdAt' | 'updatedAt' | 'expenseTypeName'>;

export interface ExpenseFilter {
  search?: string;
  expenseTypeId?: number | null;
  propertyId?: number | null;
}
