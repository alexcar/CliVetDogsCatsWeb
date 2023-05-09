import { ScheduleProductSelected } from "./schedule-product-selected";
import { ScheduleServiceSelected } from "./schedule-service-selected";
import { ScheduleStatus } from "../interfaces/schedule-status";

export class Schedule {
  public id!: string | null;
  public scheduleDate!: Date;
  public hour!: number;
  public tutorComments!: string;
  public scheduleComments!: string;
  public scheduleStatusId!: string;
  public tutorId!: string;
  public employeeId!: string;
  public animalId!: string;
  public active!: boolean;
  public serviceId!: string;
  public serviceSaleValue!: number;
  public serviceQuantity!: number;
  public serviceTotalValue!: number;
  public productId!: string;
  public productSaleValue!: number;
  public productQuantity!: number;
  public productTotalValue!: number;
  public scheduleStatus: ScheduleStatus[] = [];
  public scheduleServiceSelected?: ScheduleServiceSelected[] = [];
  public scheduleProductSelected?: ScheduleProductSelected[] = [];
}
