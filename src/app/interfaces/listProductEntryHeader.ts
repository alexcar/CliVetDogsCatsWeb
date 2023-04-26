import { ListProductEntry } from "./list-product-entry";

export interface ListProductEntryHeader {
  id: string;
  code: string;
  employeeName: string;
  supplierId: string;
  supplierName: string;
  transactionTypeId: string;
  transactionType: string;
  date: Date;
  totalValue: number;
  productsEntry: ListProductEntry[];
}
