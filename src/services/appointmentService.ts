import { databases, COLLECTIONS, DATABASE_ID } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';

export interface AppointmentData {
  $id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time_slot: string;
  message?: string;
  status: string;
  $createdAt: string;
}

export interface TimeSlot {
  $id:string;
  date: string;
  time_slot: string;
  is_booked: boolean;
}

export async function fetchAppointments(): Promise<AppointmentData[]> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.APPOINTMENTS,
      [
        Query.orderDesc('date'),
        Query.orderDesc('$createdAt')
      ]
    );
    return response.documents as unknown as AppointmentData[];
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
}

export async function fetchAvailableTimeSlots(date?: string): Promise<TimeSlot[]> {
  try {
    const queries = [Query.equal('is_booked', false)];
    if (date) {
      queries.push(Query.equal('date', date));
    }
    queries.push(Query.orderAsc('date'));

    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.AVAILABLE_TIME_SLOTS,
      queries
    );
    return response.documents as unknown as TimeSlot[];
  } catch (error) {
    console.error('Error fetching available time slots:', error);
    throw error;
  }
}

export async function addAvailableTimeSlot(date: string, timeSlot: string): Promise<boolean> {
    try {
        await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.AVAILABLE_TIME_SLOTS,
            ID.unique(),
            { date, time_slot: timeSlot, is_booked: false }
        );
        return true;
    } catch (error) {
        console.error('Error adding time slot:', error);
        return false;
    }
}

export async function updateAppointmentStatus(id: string, status: string): Promise<boolean> {
    try {
        await databases.updateDocument(
            DATABASE_ID,
            COLLECTIONS.APPOINTMENTS,
            id,
            { status }
        );
        return true;
    } catch (error) {
        console.error('Error updating appointment status:', error);
        return false;
    }
}

export async function deleteAppointment(id: string): Promise<boolean> {
    try {
        await databases.deleteDocument(
            DATABASE_ID,
            COLLECTIONS.APPOINTMENTS,
            id
        );
        return true;
    } catch (error) {
        console.error('Error deleting appointment:', error);
        return false;
    }
}

export async function createAppointment(appointmentData: Omit<AppointmentData, '$id' | '$createdAt' | 'status'>): Promise<AppointmentData> {
    try {
        const response = await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.APPOINTMENTS,
            ID.unique(),
            { ...appointmentData, status: 'pending' }
        );
        return response as unknown as AppointmentData;
    } catch (error) {
        console.error('Error creating appointment:', error);
        throw error;
    }
}
