
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchAppointments, AppointmentData } from '@/services/cmsService';
import AppointmentList from './AppointmentList';

const AppointmentsSection: React.FC = () => {
  const { 
    data: appointments = [],
    isLoading: appointmentsLoading,
    refetch: refetchAppointments
  } = useQuery<AppointmentData[]>({
    queryKey: ['appointments'],
    queryFn: fetchAppointments
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointment Requests</CardTitle>
        <CardDescription>Manage and respond to customer appointment requests.</CardDescription>
      </CardHeader>
      <CardContent>
        {appointmentsLoading ? (
          <div className="text-center py-8">Loading appointments...</div>
        ) : (
          <AppointmentList 
            appointments={appointments} 
            refetchAppointments={refetchAppointments} 
          />
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentsSection;
