export type AppointmentStatus = 'pending' | 'checked-in' | 'completed' | 'cancelled';
export interface Appointment {
  id: string;
  clientName: string;
  treatment: string;
  date: Date;
  therapist: string;
  status: AppointmentStatus;
}
export interface BillingDetails {
  productCost: number;
  serviceCost: number;
  returns: number;
  backbar: number;
  tips: number;
  numberOfTickets: number;
  total: number;
}