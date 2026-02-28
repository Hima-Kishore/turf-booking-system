export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export type EmailTemplate =
  | "booking-confirmed"
  | "booking-cancelled"
  | "booking-reminder"
  | "review-received"
  | "welcome";

export interface BookingEmailData {
  userName: string;
  userEmail: string;
  turfName: string;
  courtName: string;
  sport: string;
  date: string;          
  startTime: string; 
  endTime: string;  
  totalAmount: number;
  bookingId: string;
  city: string;
  address: string;
  cancellationDeadline?: string; 
}

export interface ReviewEmailData {
  ownerName: string;
  ownerEmail: string;
  turfName: string;
  reviewerName: string;
  rating: number;
  comment: string;
  courtName: string;
}

export interface WelcomeEmailData {
  userName: string;
  userEmail: string;
}