import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, Plus, Edit, Trash2, Save, Wrench, ArrowUp, ArrowDown, Info, ImageIcon, Upload, X } from 'lucide-react';
import { ServiceCard, ServicesBanner } from '@/types/payload-types';
import {
  fetchServiceCards,
  addServiceCard,
  updateServiceCard,
  deleteServiceCard
} from '@/services/serviceCardService';
import { fetchServicesBanner, updateServicesBanner } from '@/services/servicesBannerService';
import { storage, STORAGE_BUCKET_ID } from '@/lib/appwrite';

export const ServicesManager: React.FC = () => {
  const [services, setServices] = useState<ServiceCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceCard | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Omit<ServiceCard, '$id'>>({
    title: '',
    description: '',
    icon: '',
    link_url: '',
    order_index: 0
  });
  const [showBannerSection, setShowBannerSection] = useState(false);
  const [bannerData, setBannerData] = useState<ServicesBanner>({
    title: '',
    subtitle: '',
    background_image: '',
  });
  const [backgroundImageFile, setBackgroundImageFile] = useState<File | null>(null);
  const [backgroundImagePreview, setBackgroundImagePreview] = useState<string>('');
  const [isSavingBanner, setIsSavingBanner] = useState(false);

  useEffect(() => {
    loadServices();
    loadBannerData();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const servicesData = await fetchServiceCards();
      setServices(servicesData);
      toast.success('Services loaded successfully');
    } catch (error) {
      console.error('Error loading services:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    setSaving(true);
    try {
      if (editingService) {
        await updateServiceCard({ $id: editingService.$id, ...formData });
        toast.success('Service updated successfully');
      } else {
        await addServiceCard({ ...formData, order_index: services.length });
        toast.success('Service created successfully');
      }

      await loadServices();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error('Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (service: ServiceCard) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description || '',
      icon: service.icon || '',
      link_url: service.link_url || '',
      order_index: service.order_index || 0
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (serviceId: string) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await deleteServiceCard(serviceId);
      toast.success('Service deleted successfully');
      await loadServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Failed to delete service');
    }
  };

  const handleReorder = async (serviceId: string, direction: 'up' | 'down') => {
    const serviceIndex = services.findIndex(s => s.$id === serviceId);
    if (serviceIndex === -1) return;

    const serviceToMove = services[serviceIndex];
    const targetIndex = direction === 'up' ? serviceIndex - 1 : serviceIndex + 1;

    if (targetIndex < 0 || targetIndex >= services.length) return;

    const otherService = services[targetIndex];

    try {
      // Swap order indices
      await updateServiceCard({ $id: serviceToMove.$id, order_index: otherService.order_index });
      await updateServiceCard({ $id: otherService.$id, order_index: serviceToMove.order_index });

      await loadServices();
      toast.success('Service order updated');
    } catch (error) {
      console.error('Error reordering service:', error);
      toast.error('Failed to reorder service');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      icon: '',
      link_url: '',
      order_index: services.length
    });
    setEditingService(null);
  };

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const loadBannerData = async () => {
    try {
      const data = await fetchServicesBanner();
      if (data) {
        setBannerData(data);
        if (data.background_image) {
          try {
            const imageUrl = storage.getFilePreview(STORAGE_BUCKET_ID, data.background_image);
            setBackgroundImagePreview(imageUrl.href);
          } catch (error) {
            console.error('Error loading background image:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error loading banner data:', error);
    }
  };

  const handleBannerInputChange = (field: keyof ServicesBanner, value: string) => {
    setBannerData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackgroundImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBannerImage = () => {
    setBackgroundImageFile(null);
    setBackgroundImagePreview('');
    setBannerData(prev => ({
      ...prev,
      background_image: ''
    }));
  };

  const handleSaveBanner = async () => {
    if (!bannerData.title.trim()) {
      toast.error('Banner title is required');
      return;
    }

    setIsSavingBanner(true);
    try {
      const success = await updateServicesBanner({
        title: bannerData.title,
        subtitle: bannerData.subtitle || '',
        background_image_url: bannerData.background_image,
        background_image_file: backgroundImageFile,
      });

      if (success) {
        toast.success('Services banner updated successfully');
        await loadBannerData();
        setBackgroundImageFile(null);
      } else {
        toast.error('Failed to update services banner');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSavingBanner(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading services...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Wrench className="h-6 w-6" />
            Services
          </h2>
          <p className="text-muted-foreground">
            Manage your service offerings and their display order
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingService ? 'Edit Service' : 'Add New Service'}
              </DialogTitle>
              <DialogDescription>
                {editingService
                  ? 'Update the service information below.'
                  : 'Fill in the details for the new service.'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter service title"
                  maxLength={255}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter service description"
                  maxLength={500}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Icon</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => handleInputChange('icon', e.target.value)}
                  placeholder="e.g., solar-panel, wrench, home"
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link_url">Link URL</Label>
                <Input
                  id="link_url"
                  value={formData.link_url}
                  onChange={(e) => handleInputChange('link_url', e.target.value)}
                  placeholder="Enter link URL (optional)"
                  maxLength={255}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order_index">Display Order</Label>
                <Input
                  id="order_index"
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => handleInputChange('order_index', parseInt(e.target.value) || 0)}
                  placeholder="Enter display order"
                  min={0}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {editingService ? 'Update' : 'Create'}
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Banner Management Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Services Page Banner</CardTitle>
              <CardDescription>
                Manage the banner section displayed at the top of the Services page
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowBannerSection(!showBannerSection)}
            >
              {showBannerSection ? 'Hide' : 'Show'} Banner Settings
            </Button>
          </div>
        </CardHeader>
        {showBannerSection && (
          <CardContent className="space-y-6">
            {/* Banner Content Form */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Banner Content</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="banner-title">Title *</Label>
                  <Input
                    id="banner-title"
                    value={bannerData.title}
                    onChange={(e) => handleBannerInputChange('title', e.target.value)}
                    placeholder="Enter banner title"
                    maxLength={255}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="banner-subtitle">Subtitle</Label>
                  <Input
                    id="banner-subtitle"
                    value={bannerData.subtitle || ''}
                    onChange={(e) => handleBannerInputChange('subtitle', e.target.value)}
                    placeholder="Enter banner subtitle"
                    maxLength={500}
                  />
                </div>
              </div>




            </div>

            <Separator />

            {/* Background Image */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Background Image</h3>

              <div className="space-y-4">
                {/* Current Image Preview */}
                {backgroundImagePreview && (
                  <div className="relative">
                    <img
                      src={backgroundImagePreview}
                      alt="Background preview"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={removeBannerImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label htmlFor="banner-background-image">Upload New Image</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="banner-background-image"
                      type="file"
                      accept="image/*"
                      onChange={handleBannerImageChange}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('banner-background-image')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Browse
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Recommended size: 1920x600px. Max file size: 5MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <Button
                onClick={handleSaveBanner}
                disabled={isSavingBanner}
                className="min-w-[120px]"
              >
                {isSavingBanner ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  'Save Banner'
                )}
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Service Cards</CardTitle>
          <CardDescription>
            {services.length} service{services.length !== 1 ? 's' : ''} configured
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Icon</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service, index) => (
                <TableRow key={service.$id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {service.order_index}
                      </Badge>
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReorder(service.$id!, 'up')}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReorder(service.$id!, 'down')}
                          disabled={index === services.length - 1}
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {service.title}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs text-sm text-muted-foreground truncate">
                      {service.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {service.icon || 'None'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(service)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(service.$id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {services.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Wrench className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <p>No services added yet.</p>
              <p>Click "Add Service" to create your service offerings.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
