import { Address } from "./address";
import { WorkShift } from "./workshift";

export class Employee {

  public id!: string;
  public name!: string;
  public cpf!: string;
  public rg!: string;
  public gender!: string;
  public phone!: string;
  public cellPhone!: string;
  public email!: string;
  public admissionDate!: Date;
  public isVeterinarian: boolean = false;
  public active: boolean = false;
  public address = new Address();
  public workShift = new WorkShift();
}
