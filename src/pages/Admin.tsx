
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { fetchAppointments, AppointmentData, fetchSEOData, updateAppointmentStatus } from '@/services/cmsService';
import { toast } from 'sonner';
import { Calendar, Clock, User, Phone, Mail, MessageSquare, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { fetchSEOData as getSEOData, updateSEOData } from '@/services/seoService';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [editingSEO, setEditingSEO] = useState<{pagePath: string, data: any} | null>(null);

  const { 
    data: appointments,
    isLoading: appointmentsLoading,
    refetch: refetchAppointments
  } = useQuery({
    queryKey: ['appointments'],
    queryFn: fetchAppointments
  });

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const success = await updateAppointmentStatus(id, status);
      if (success) {
        toast.success(`Appointment status updated to ${status}`);
        refetchAppointments();
      } else {
        toast.error('Failed to update appointment status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('An error occurred while updating status');
    }
  };

  const handleSEOEdit = async (pagePath: string) => {
    try {
      const seoData = await getSEOData(pagePath);
      if (seoData) {
        setEditingSEO({ pagePath, data: seoData });
      } else {
        toast.error('Failed to fetch SEO data');
      }
    } catch (error) {
      console.error('Error fetching SEO data:', error);
      toast.error('An error occurred while fetching SEO data');
    }
  };

  const handleSEOSave = async () => {
    if (!editingSEO) return;
    
    try {
      const success = await updateSEOData(editingSEO.pagePath, editingSEO.data);
      if (success) {
        toast.success('SEO data updated successfully');
        setEditingSEO(null);
      } else {
        toast.error('Failed to update SEO data');
      }
    } catch (error) {
      console.error('Error updating SEO data:', error);
      toast.error('An error occurred while updating SEO data');
    }
  };

  if (appointmentsLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 pb-12 px-4">
        <div className="container-custom">
          <div className="flex flex-col items-start mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-brand-gray">Manage your website content, appointments, and SEO settings.</p>
          </div>

          <Tabs defaultValue="appointments" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="seo">SEO Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="appointments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Appointment Requests</CardTitle>
                  <CardDescription>Manage and respond to customer appointment requests.</CardDescription>
                </CardHeader>
                <CardContent>
                  {appointments && appointments.length > 0 ? (
                    <div className="space-y-6">
                      {appointments.map((appointment: AppointmentData) => (
                        <Card key={appointment.id} className="overflow-hidden">
                          <div className={`p-1 ${
                            appointment.status === 'confirmed' ? 'bg-green-500' : 
                            appointment.status === 'cancelled' ? 'bg-red-500' : 'bg-amber-500'
                          }`}></div>
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                              <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                  <User className="text-primary mt-1" size={18} />
                                  <div>
                                    <p className="font-semibold">{appointment.name}</p>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-brand-gray">
                                      <span className="flex items-center">
                                        <Mail className="mr-1" size={14} />
                                        {appointment.email}
                                      </span>
                                      <span className="flex items-center">
                                        <Phone className="mr-1" size={14} />
                                        {appointment.phone}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-start gap-3">
                                  <Calendar className="text-primary mt-1" size={18} />
                                  <div>
                                    <p className="font-medium">Appointment Details</p>
                                    <div className="text-sm text-brand-gray">
                                      <p>Service: {appointment.service}</p>
                                      <p>Date: {format(new Date(appointment.date), 'PPP')}</p>
                                      <p>Time: {appointment.time_slot}</p>
                                    </div>
                                  </div>
                                </div>
                                
                                {appointment.message && (
                                  <div className="flex items-start gap-3">
                                    <MessageSquare className="text-primary mt-1" size={18} />
                                    <div>
                                      <p className="font-medium">Additional Information</p>
                                      <p className="text-sm text-brand-gray">{appointment.message}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex flex-col sm:items-end gap-3">
                                <Badge className={`
                                  ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                                    appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                                    'bg-amber-100 text-amber-800'}
                                `}>
                                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                </Badge>
                                
                                <p className="text-xs text-brand-gray">
                                  Requested on {format(new Date(appointment.created_at), 'PPP')}
                                </p>
                                
                                <div className="flex gap-2 mt-2">
                                  {appointment.status !== 'confirmed' && (
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="flex items-center gap-1 text-green-600 border-green-600 hover:bg-green-50"
                                      onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                                    >
                                      <Check size={14} />
                                      Confirm
                                    </Button>
                                  )}
                                  
                                  {appointment.status !== 'cancelled' && (
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="flex items-center gap-1 text-red-600 border-red-600 hover:bg-red-50"
                                      onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                                    >
                                      <X size={14} />
                                      Cancel
                                    </Button>
                                  )}
                                  
                                  {appointment.status !== 'pending' && (
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="flex items-center gap-1"
                                      onClick={() => handleStatusChange(appointment.id, 'pending')}
                                    >
                                      Reset to Pending
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-brand-gray">No appointment requests yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="seo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>SEO Settings</CardTitle>
                  <CardDescription>Manage SEO settings for each page of your website.</CardDescription>
                </CardHeader>
                <CardContent>
                  {editingSEO ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Editing SEO for: {editingSEO.pagePath}</h3>
                      
                      <div className="space-y-4">
                        <div className="grid w-full gap-1.5">
                          <Label htmlFor="title">Page Title</Label>
                          <Input 
                            id="title" 
                            value={editingSEO.data.title} 
                            onChange={(e) => setEditingSEO({
                              ...editingSEO,
                              data: {...editingSEO.data, title: e.target.value}
                            })}
                          />
                          <p className="text-xs text-brand-gray">The title appears in search engine results and browser tabs.</p>
                        </div>
                        
                        <div className="grid w-full gap-1.5">
                          <Label htmlFor="description">Meta Description</Label>
                          <Textarea 
                            id="description" 
                            value={editingSEO.data.description}
                            onChange={(e) => setEditingSEO({
                              ...editingSEO,
                              data: {...editingSEO.data, description: e.target.value}
                            })}
                          />
                          <p className="text-xs text-brand-gray">The description appears in search engine results below the title.</p>
                        </div>
                        
                        <div className="grid w-full gap-1.5">
                          <Label htmlFor="keywords">Keywords</Label>
                          <Input 
                            id="keywords" 
                            value={editingSEO.data.keywords || ''} 
                            onChange={(e) => setEditingSEO({
                              ...editingSEO,
                              data: {...editingSEO.data, keywords: e.target.value}
                            })}
                          />
                          <p className="text-xs text-brand-gray">Comma-separated keywords related to the page content.</p>
                        </div>
                        
                        <div className="grid w-full gap-1.5">
                          <Label htmlFor="ogImage">OG Image URL</Label>
                          <Input 
                            id="ogImage" 
                            value={editingSEO.data.ogImage || ''} 
                            onChange={(e) => setEditingSEO({
                              ...editingSEO,
                              data: {...editingSEO.data, ogImage: e.target.value}
                            })}
                          />
                          <p className="text-xs text-brand-gray">The image that appears when sharing the page on social media.</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setEditingSEO(null)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSEOSave}>
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { path: '/', label: 'Home Page' },
                        { path: '/who-we-are', label: 'About Us Page' },
                        { path: '/what-we-do', label: 'What We Do Page' },
                        { path: '/services', label: 'Services Page' },
                        { path: '/projects', label: 'Projects Page' },
                        { path: '/blog', label: 'Blog Page' },
                        { path: '/contact', label: 'Contact Page' },
                      ].map(page => (
                        <Card key={page.path} className="overflow-hidden">
                          <CardHeader className="p-4">
                            <CardTitle className="text-lg">{page.label}</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleSEOEdit(page.path)}
                            >
                              Edit SEO Settings
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Admin;
