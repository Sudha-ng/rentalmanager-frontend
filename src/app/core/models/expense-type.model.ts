export interface ExpenseType {
  id?: number;
  typeName: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type ExpenseTypePayload = Omit<ExpenseType, 'id'>;
