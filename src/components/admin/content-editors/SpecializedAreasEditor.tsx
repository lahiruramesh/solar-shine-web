import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Save, Trash2, Upload } from 'lucide-react';
import { fetchSpecializedAreas, updateSpecializedArea, deleteSpecializedArea } from '@/services/specializedAreaService';

const SpecializedAreasEditor: React.FC = () => {
  const queryClient = useQueryClient();
  const [newArea, setNewArea] = useState({ title: '', description: '', image: null as File | null });
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
  
  const { data: areas, isLoading } = useQuery({
    queryKey: ['specializedAreas'],
    queryFn: fetchSpecializedAreas
  });
  
  const updateMutation = useMutation({
    mutationFn: (formData: FormData) => updateSpecializedArea(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specializedAreas'] });
      toast.success('Area updated successfully');
    },
    onError: () => toast.error('Failed to update area')
  });
  
  const addMutation = useMutation({
    mutationFn: (formData: FormData) => {
      return updateSpecializedArea(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specializedAreas'] });
      setNewArea({ title: '', description: '', image: null });
      toast.success('Area added successfully');
      // Clear any preview URLs
      setPreviewUrls({});
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
  
  const handleAddArea = () => {
    if (!newArea.title) {
      toast.error('Title is required');
      return;
    }
    
    const formData = new FormData();
    formData.append('title', newArea.title);
    if (newArea.description) formData.append('description', newArea.description);
    if (newArea.image) formData.append('image', newArea.image);
    
    addMutation.mutate(formData);
  };
  
  const handleUpdateArea = (area: any) => {
    const formData = new FormData();
    formData.append('id', area.id);
    formData.append('title', area.title);
    if (area.description) formData.append('description', area.description);
    
    // Check if we have a new image via the preview URLs
    const fileInput = document.getElementById(`image-${area.id}`) as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files[0]) {
      formData.append('image', fileInput.files[0]);
    }
    
    updateMutation.mutate(formData);
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, areaId?: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newUrl = URL.createObjectURL(file);
      
      if (areaId) {
        // Existing area image update
        setPreviewUrls(prev => ({
          ...prev,
          [areaId]: newUrl
        }));
      } else {
        // New area image
        setNewArea(prev => ({ ...prev, image: file }));
        setPreviewUrls(prev => ({
          ...prev,
          newArea: newUrl
        }));
      }
    }
  };
  
  if (isLoading) {
    return <div className="flex justify-center p-6">Loading specialized areas...</div>;
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Specialized Areas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {areas?.map((area: any) => (
              <div key={area.id} className="border rounded-lg p-5 space-y-4">
                <div>
                  <Label htmlFor={`title-${area.id}`}>Title</Label>
                  <Input 
                    id={`title-${area.id}`}
                    defaultValue={area.title} 
                    onChange={(e) => { area.title = e.target.value; }}
                  />
                </div>
                
                <div>
                  <Label htmlFor={`description-${area.id}`}>Description</Label>
                  <Textarea 
                    id={`description-${area.id}`}
                    defaultValue={area.description || ''} 
                    onChange={(e) => { area.description = e.target.value; }}
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor={`image-${area.id}`}>Image</Label>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="w-24 h-24 border rounded-md overflow-hidden">
                      <img 
                        src={previewUrls[area.id] || area.image || '/placeholder.svg'} 
                        alt={area.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <Input
                        id={`image-${area.id}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, area.id)}
                        className="max-w-xs"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Recommended size: 800x600px
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    variant="default" 
                    onClick={() => handleUpdateArea(area)}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                  
                  <Button 
                    variant="destructive"
                    onClick={() => deleteMutation.mutate(area.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Area
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Add New Specialized Area</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="new-area-title">Title</Label>
                  <Input 
                    id="new-area-title"
                    value={newArea.title} 
                    onChange={(e) => setNewArea({...newArea, title: e.target.value})}
                    placeholder="Residential Solar"
                  />
                </div>
                
                <div>
                  <Label htmlFor="new-area-description">Description</Label>
                  <Textarea 
                    id="new-area-description"
                    value={newArea.description} 
                    onChange={(e) => setNewArea({...newArea, description: e.target.value})}
                    placeholder="Custom solar solutions for homeowners..."
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="new-area-image">Image</Label>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="w-24 h-24 border rounded-md overflow-hidden">
                      <img 
                        src={previewUrls.newArea || '/placeholder.svg'} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <Input
                        id="new-area-image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e)}
                        className="max-w-xs"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Recommended size: 800x600px
                      </p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleAddArea}
                  className="mt-2"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Area
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpecializedAreasEditor;
