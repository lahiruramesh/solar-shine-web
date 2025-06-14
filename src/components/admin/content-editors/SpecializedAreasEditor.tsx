import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Save, Trash2, Upload } from 'lucide-react';
import { fetchSpecializedAreas, updateSpecializedArea, deleteSpecializedArea } from '@/services/cmsService';
import { getImageWithCacheBusting } from '@/services/serviceUtils';
import { SpecializedArea } from '@/types/payload-types';

const SpecializedAreasEditor: React.FC = () => {
  const queryClient = useQueryClient();
  const [newAreaImage, setNewAreaImage] = useState<File | null>(null);
  const [areaImages, setAreaImages] = useState<Record<string, File | null>>({});
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
  
  const [newArea, setNewArea] = useState({ title: '', description: '' });

  const { data: areas = [], isLoading, error } = useQuery<SpecializedArea[]>({
    queryKey: ['specializedAreas'],
    queryFn: fetchSpecializedAreas,
    meta: {
      onError: (err: Error) => {
        console.error('Error fetching specialized areas:', err);
        toast.error('Failed to load specialized areas');
      }
    }
  });

  const updateMutation = useMutation({
    mutationFn: (formData: FormData) => updateSpecializedArea(formData),
    onSuccess: (_, variables) => {
      const id = variables.get('id') as string;
      queryClient.invalidateQueries({ queryKey: ['specializedAreas'] });
      setAreaImages(prev => ({ ...prev, [id]: null }));
      setPreviewUrls(prev => ({ ...prev, [id]: '' }));
      toast.success('Area updated successfully');
    },
    onError: () => toast.error('Failed to update area')
  });

  const addMutation = useMutation({
    mutationFn: (formData: FormData) => updateSpecializedArea(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specializedAreas'] });
      setNewArea({ title: '', description: '' });
      setNewAreaImage(null);
      setPreviewUrls(prev => ({ ...prev, newArea: '' }));
      toast.success('Area added successfully');
    },
    onError: () => toast.error('Failed to add area')
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSpecializedArea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specializedAreas'] });
      toast.success('Area deleted successfully');
    },
    onError: () => toast.error('Failed to delete area')
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, areaId?: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newUrl = URL.createObjectURL(file);
      
      if (areaId) {
        setAreaImages(prev => ({ ...prev, [areaId]: file }));
        setPreviewUrls(prev => ({ ...prev, [areaId]: newUrl }));
      } else {
        setNewAreaImage(file);
        setPreviewUrls(prev => ({ ...prev, newArea: newUrl }));
      }
    }
  };

  const handleUpdateArea = (e: React.FormEvent<HTMLFormElement>, areaId: string) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('id', areaId);
    
    const imageFile = areaImages[areaId];
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    updateMutation.mutate(formData);
  };
  
  const handleAddArea = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (!formData.get('title')) {
      toast.error('Title is required');
      return;
    }
    
    if (newAreaImage) {
      formData.append('image', newAreaImage);
    }
    
    addMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Specialized Areas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(3).fill(null).map((_, i) => (
              <div key={i} className="border rounded-lg p-5">
                <Skeleton className="h-6 w-1/3 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-24 w-full rounded-md mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-10 w-28" />
                  <Skeleton className="h-10 w-28" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Specialized Areas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center">
            <p className="text-red-500 mb-4">Failed to load specialized areas</p>
            <Button 
              onClick={() => queryClient.invalidateQueries({ queryKey: ['specializedAreas'] })}
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Specialized Areas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {areas.map((area) => (
              <form key={area.id} onSubmit={(e) => handleUpdateArea(e, area.id)} className="border rounded-lg p-5 space-y-4">
                <div>
                  <Label htmlFor={`title-${area.id}`}>Title</Label>
                  <Input id={`title-${area.id}`} name="title" defaultValue={area.title} />
                </div>
                <div>
                  <Label htmlFor={`description-${area.id}`}>Description</Label>
                  <Textarea id={`description-${area.id}`} name="description" defaultValue={area.description || ''} rows={3} />
                </div>
                <div>
                  <Label>Image</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <img 
                      key={area.image}
                      src={previewUrls[area.id] || area.image || '/placeholder.svg'} 
                      alt={area.title} 
                      className="w-24 h-24 object-cover rounded-md border"
                    />
                    <div className="flex-1">
                      <Label htmlFor={`image-${area.id}`} className="cursor-pointer bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-md flex items-center gap-2 max-w-max">
                        <Upload size={16} />
                        <span>{areaImages[area.id] ? 'Image Selected' : 'Change Image'}</span>
                      </Label>
                      <Input id={`image-${area.id}`} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, area.id)} />
                      {areaImages[area.id] && <p className="text-sm text-green-600 mt-2">{areaImages[area.id]?.name}</p>}
                      <p className="text-xs text-muted-foreground mt-1">Recommended size: 800x600px</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <Button type="submit"><Save className="mr-2 h-4 w-4" /> Save Changes</Button>
                  <Button variant="destructive" type="button" onClick={() => deleteMutation.mutate(area.id)}><Trash2 className="mr-2 h-4 w-4" /> Delete Area</Button>
                </div>
              </form>
            ))}
            
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Add New Specialized Area</h3>
              <form onSubmit={handleAddArea} className="space-y-4">
                <div>
                  <Label htmlFor="new-area-title">Title</Label>
                  <Input id="new-area-title" name="title" value={newArea.title} onChange={(e) => setNewArea({...newArea, title: e.target.value})} placeholder="Residential Solar" />
                </div>
                <div>
                  <Label htmlFor="new-area-description">Description</Label>
                  <Textarea id="new-area-description" name="description" value={newArea.description} onChange={(e) => setNewArea({...newArea, description: e.target.value})} placeholder="Custom solar solutions for homeowners..." rows={3} />
                </div>
                <div>
                  <Label>Image</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <img src={previewUrls.newArea || '/placeholder.svg'} alt="New area preview" className="w-24 h-24 object-cover rounded-md border" />
                    <div className="flex-1">
                       <Label htmlFor="new-area-image" className="cursor-pointer bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-md flex items-center gap-2 max-w-max">
                        <Upload size={16} />
                        <span>{newAreaImage ? 'Image Selected' : 'Upload Image'}</span>
                      </Label>
                      <Input id="new-area-image" type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e)} />
                      {newAreaImage && <p className="text-sm text-green-600 mt-2">{newAreaImage.name}</p>}
                    </div>
                  </div>
                </div>
                <Button type="submit" className="mt-2"><Plus className="mr-2 h-4 w-4" /> Add Area</Button>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpecializedAreasEditor;
