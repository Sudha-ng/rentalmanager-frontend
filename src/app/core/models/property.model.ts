export interface Property {
  id?: number;
  propertyId?: number;
  userId: number;
  name: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  stateProvince: string;
  zipPostalCode: string;
  purchasePrice: number;
  currentMarketValue: number;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export type PropertyPayload = Omit<Property, 'id' | 'propertyId' | 'createdAt' | 'updatedAt'>;
