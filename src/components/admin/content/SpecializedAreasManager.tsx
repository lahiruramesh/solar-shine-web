import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Target, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface SpecializedArea {
  $id?: string;
  title: string;
  description: string;
  image: string;
  order: number;
}

export const SpecializedAreasManager: React.FC = () => {
  const [specializedAreas, setSpecializedAreas] = useState<SpecializedArea[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<SpecializedArea | null>(null);
  const [newArea, setNewArea] = useState<SpecializedArea>({
    title: '',
    description: '',
    image: '',
    order: 1
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');

  useEffect(() => {
    loadSpecializedAreas();
  }, []);

  const loadSpecializedAreas = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement actual API call
      const mockAreas: SpecializedArea[] = [
        {
          $id: '1',
          title: 'Residential Solar',
          description: 'Complete solar solutions for homes, from rooftop installations to energy storage systems.',
          image: '/placeholder.svg',
          order: 1
        },
        {
          $id: '2',
          title: 'Commercial Solar',
          description: 'Large-scale solar installations for businesses, reducing operational costs and carbon footprint.',
          image: '/placeholder.svg',
          order: 2
        },
        {
          $id: '3',
          title: 'Solar Maintenance',
          description: 'Professional cleaning, inspection, and maintenance services to keep your solar panels at peak performance.',
          image: '/placeholder.svg',
          order: 3
        }
      ];
      setSpecializedAreas(mockAreas);
      toast.success('Specialized areas loaded successfully');
    } catch (error) {
      console.error('Error loading specialized areas:', error);
      toast.error('Failed to load specialized areas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddArea = async () => {
    if (!newArea.title.trim() || !newArea.description.trim()) {
      toast.error('Title and description are required');
      return;
    }

    setIsSaving(true);
    try {
      // TODO: Implement actual API call with image upload
      const area = { 
        ...newArea, 
        $id: Date.now().toString(),
        order: specializedAreas.length + 1,
        image: imageFile ? URL.createObjectURL(imageFile) : '/placeholder.svg'
      };
      setSpecializedAreas([...specializedAreas, area]);
      setNewArea({
        title: '',
        description: '',
        image: '',
        order: 1
      });
      setImageFile(null);
      setPreviewImage('');
      setIsAddDialogOpen(false);
      toast.success('Specialized area added successfully');
    } catch (error) {
      console.error('Error adding specialized area:', error);
      toast.error('Failed to add specialized area');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditArea = async () => {
    if (!editingArea || !editingArea.title.trim() || !editingArea.description.trim()) {
      toast.error('Title and description are required');
      return;
    }

    setIsSaving(true);
    try {
      // TODO: Implement actual API call
      setSpecializedAreas(specializedAreas.map(area => 
        area.$id === editingArea.$id ? editingArea : area
      ));
      setEditingArea(null);
      setIsEditDialogOpen(false);
      toast.success('Specialized area updated successfully');
    } catch (error) {
      console.error('Error updating specialized area:', error);
      toast.error('Failed to update specialized area');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteArea = async (id: string) => {
    setIsSaving(true);
    try {
      // TODO: Implement actual API call
      setSpecializedAreas(specializedAreas.filter(area => area.$id !== id));
      toast.success('Specialized area deleted successfully');
    } catch (error) {
      console.error('Error deleting specialized area:', error);
      toast.error('Failed to delete specialized area');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const openEditDialog = (area: SpecializedArea) => {
    setEditingArea({ ...area });
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading specialized areas...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Target className="h-6 w-6" />
            Specialized Areas Manager
          </h2>
          <p className="text-muted-foreground">
            Manage your company's specialized service areas
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Specialized Area
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Specialized Area</DialogTitle>
              <DialogDescription>
                Add a new specialized service area
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-title">Title *</Label>
                <Input
                  id="new-title"
                  value={newArea.title}
                  onChange={(e) => setNewArea({ ...newArea, title: e.target.value })}
                  placeholder="Residential Solar"
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-description">Description *</Label>
                <Textarea
                  id="new-description"
                  value={newArea.description}
                  onChange={(e) => setNewArea({ ...newArea, description: e.target.value })}
                  placeholder="Describe this specialized area..."
                  rows={4}
                  maxLength={500}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-image">Image</Label>
                <Input
                  id="new-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
              </div>
              {previewImage && (
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div className="border rounded-lg overflow-hidden">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddArea} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Area'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {specializedAreas.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8 text-muted-foreground">
              No specialized areas found. Add your first specialized area to get started.
            </CardContent>
          </Card>
        ) : (
          specializedAreas.map((area) => (
            <Card key={area.$id}>
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <img
                      src={area.image || '/placeholder.svg'}
                      alt={area.title}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="text-xl font-semibold">{area.title}</h3>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(area)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Specialized Area</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{area.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteArea(area.$id!)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{area.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Specialized Area</DialogTitle>
            <DialogDescription>
              Update the specialized area details
            </DialogDescription>
          </DialogHeader>
          {editingArea && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  value={editingArea.title}
                  onChange={(e) => setEditingArea({ ...editingArea, title: e.target.value })}
                  placeholder="Residential Solar"
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description *</Label>
                <Textarea
                  id="edit-description"
                  value={editingArea.description}
                  onChange={(e) => setEditingArea({ ...editingArea, description: e.target.value })}
                  placeholder="Describe this specialized area..."
                  rows={4}
                  maxLength={500}
                />
              </div>
              <div className="space-y-2">
                <Label>Current Image</Label>
                <div className="border rounded-lg overflow-hidden">
                  <img
                    src={editingArea.image || '/placeholder.svg'}
                    alt={editingArea.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditArea} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Area'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
