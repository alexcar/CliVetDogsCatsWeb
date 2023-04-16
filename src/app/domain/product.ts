import { Brand } from "./brand";
import { Category } from "./category";

export class Product {
  public id!: string;
  public code!: string;
  public name!: string;
  public description!: string;
  public costValue!: number;
  public profitMargin!: number;
  public saleValue!: number;
  public stockQuantity!: number;
  public categoryId!: string
  public brandId!: string;
  public active: boolean = false;
}
