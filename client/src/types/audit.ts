export interface AuditRecord {
  id: string;
  storeid: string;
  sku: string;
  condition: string;
  quantity: number;
  timestamp: Date; 
}