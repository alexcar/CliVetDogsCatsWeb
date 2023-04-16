import { Address } from "./address";

export class Supplier {
  public id!: string;
  public name!: string;
  public trade!: string;
  public contact!: string;
  public email!: string;
  public cnpj!: string;
  public phone!: string;
  public cellPhone!: string;
  public active: boolean = false;
  public address = new Address();
}
