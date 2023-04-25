import { ProductEntry } from "./product-entry";

export class ProductEntryHeader {
  public id!: string;
  public code!: string;
  public employeeId!: string;
  public supplierId!: string;
  public transactionType!: string;
  public productsEntry: ProductEntry[] = [];
  public active!: boolean;
}
