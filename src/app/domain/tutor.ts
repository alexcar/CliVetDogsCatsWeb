import { Address } from "./address";

export class Tutor {
  public id!: string;
  public name!: string;
  public cpf!: string;
  public rg!: string;
  public phone!: string;
  public cellPhone!: string;
  public email!: string;
  public dayBirth!: string;
  public monthBirth!: string;
  public dayMonthBirth!: string;
  public comments!: string;
  public active!: boolean;
  public address = new Address();
}
