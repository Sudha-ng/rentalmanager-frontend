export interface TenantEmergencyContact {
  id?: number;
  tenantId?: number | null;
  phone: string;
  createdAt?: string;
  updatedAt?: string;
}

export type TenantEmergencyContactPayload = Omit<TenantEmergencyContact, 'id' | 'createdAt' | 'updatedAt'>;
