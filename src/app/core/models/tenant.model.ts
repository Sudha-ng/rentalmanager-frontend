export interface Tenant {
  id?: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export type TenantPayload = Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>;
