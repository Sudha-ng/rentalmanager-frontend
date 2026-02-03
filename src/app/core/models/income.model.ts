export interface Income {
  id?: number;
  salary: number;
  createdAt?: string;
  updatedAt?: string;
}

export type IncomePayload = Omit<Income, 'id' | 'createdAt' | 'updatedAt'>;
