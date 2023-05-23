import { AnimalReport } from "./animal-report";

export interface TutorReport {
  name: string;
  cpf: string;
  email: string;
  cellPhone: string
  animals: AnimalReport[];
}
