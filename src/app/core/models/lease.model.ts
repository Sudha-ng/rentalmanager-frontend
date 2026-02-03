export interface Lease {
  id?: number;
  leaseMonths: number;
  createdAt?: string;
  updatedAt?: string;
}

export type LeasePayload = Omit<Lease, 'id' | 'createdAt' | 'updatedAt'>;
