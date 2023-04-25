import { ProductEntry } from "./product-entry";

export class ProductEntryHeader {
  public id!: string;
  public code!: string;
  public employeeId!: string;
  public suppliedId!: string;
  public productsEntry!: ProductEntry[];
  public transactionType!: string;
  public active!: boolean;
}
