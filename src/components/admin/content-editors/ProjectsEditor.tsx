import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Save, Trash2, Upload } from 'lucide-react';
import { fetchProjects, updateProject, addProject, deleteProject } from '@/services/cmsService';
import { Project } from '@/types/payload-types';

const ProjectsEditor: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [projectImages, setProjectImages] = useState<Record<string, File | null>>({});
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    category: 'Residential',
    client: '',
    completionDate: ''
  });
  
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    meta: {
      onError: (error: Error) => {
        console.error('Error fetching projects:', error);
        toast.error('Failed to load projects');
      }
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project updated');
    },
    onError: () => toast.error('Failed to update project')
  });
  
  const addMutation = useMutation({
    mutationFn: addProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setNewProject({
        title: '',
        description: '',
        category: 'Residential',
        client: '',
        completionDate: ''
      });
      setSelectedImage(null);
      toast.success('Project added');
    },
    onError: () => toast.error('Failed to add project')
  });
  
  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted');
    },
    onError: () => toast.error('Failed to delete project')
  });
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };
  
  const handleProjectImageChange = (projectId: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProjectImages(prev => ({
        ...prev,
        [projectId]: e.target.files?.[0] || null
      }));
    }
  };
  
  const handleUpdateProject = (project: Project) => {
    const projectImage = projectImages[project.id];
    
    if (projectImage) {
      const formData = new FormData();
      formData.append('id', project.id);
      formData.append('title', project.title);
      formData.append('description', project.description);
      formData.append('category', project.category);
      formData.append('client', project.client);
      formData.append('completionDate', project.completionDate || '');
      formData.append('image', projectImage);
      
      updateMutation.mutate(formData);
      
      // Clear the selected image after update
      setProjectImages(prev => ({
        ...prev,
        [project.id]: null
      }));
    } else {
      updateMutation.mutate(project);
    }
  };
  
  const handleAddProject = () => {
    if (!newProject.title || !newProject.description || !selectedImage) {
      toast.error('Title, description and image are required');
      return;
    }
    
    const formData = new FormData();
    formData.append('title', newProject.title);
    formData.append('description', newProject.description);
    formData.append('category', newProject.category);
    formData.append('client', newProject.client);
    formData.append('completionDate', newProject.completionDate);
    formData.append('image', selectedImage);
    
    addMutation.mutate(formData);
  };
  
  if (isLoading) {
    return <div className="flex justify-center p-6">Loading projects data...</div>;
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {projects?.map((project: Project) => (
              <div key={project.id} className="border rounded-lg p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`title-${project.id}`}>Title</Label>
                      <Input 
                        id={`title-${project.id}`}
                        value={project.title} 
                        onChange={(e) => updateMutation.mutate({...project, title: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`description-${project.id}`}>Description</Label>
                      <Textarea 
                        id={`description-${project.id}`}
                        value={project.description} 
                        onChange={(e) => updateMutation.mutate({...project, description: e.target.value})}
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`category-${project.id}`}>Category</Label>
                      <select
                        id={`category-${project.id}`}
                        value={project.category}
                        onChange={(e) => updateMutation.mutate({
                          ...project, 
                          category: e.target.value as 'Residential' | 'Commercial' | 'Industrial'
                        })}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Industrial">Industrial</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor={`client-${project.id}`}>Client</Label>
                      <Input 
                        id={`client-${project.id}`}
                        value={project.client} 
                        onChange={(e) => updateMutation.mutate({...project, client: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`date-${project.id}`}>Completion Date</Label>
                      <Input 
                        id={`date-${project.id}`}
                        type="date"
                        value={project.completionDate} 
                        onChange={(e) => updateMutation.mutate({...project, completionDate: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Project Image</Label>
                    <div className="mt-2 mb-4">
                      <img 
                        src={project.image || '/placeholder.svg'} 
                        alt={project.title} 
                        className="w-full h-48 object-cover rounded-md border"
                      />
                    </div>
                    
                    <div className="flex items-center gap-3 mt-3">
                      <Label 
                        htmlFor={`project-image-${project.id}`} 
                        className="cursor-pointer bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-md flex items-center gap-2"
                      >
                        <Upload size={16} />
                        <span>Update Image</span>
                      </Label>
                      <Input 
                        id={`project-image-${project.id}`}
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        onChange={handleProjectImageChange(project.id)}
                      />
                      {projectImages[project.id] && (
                        <span className="text-sm text-green-600">
                          {projectImages[project.id]?.name} selected
                        </span>
                      )}
                    </div>
                    
                    {projectImages[project.id] && (
                      <Button 
                        onClick={() => handleUpdateProject(project)}
                        className="mt-2"
                        size="sm"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save Image
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    variant="destructive"
                    onClick={() => deleteMutation.mutate(project.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Project
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Add New Project</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="new-project-title">Title</Label>
                    <Input 
                      id="new-project-title"
                      value={newProject.title} 
                      onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                      placeholder="Residential Solar Installation"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="new-project-description">Description</Label>
                    <Textarea 
                      id="new-project-description"
                      value={newProject.description} 
                      onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                      placeholder="A complete solar solution for a residential property..."
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="new-project-category">Category</Label>
                    <select
                      id="new-project-category"
                      value={newProject.category}
                      onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Industrial">Industrial</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="new-project-client">Client</Label>
                    <Input 
                      id="new-project-client"
                      value={newProject.client} 
                      onChange={(e) => setNewProject({...newProject, client: e.target.value})}
                      placeholder="John Smith"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="new-project-date">Completion Date</Label>
                    <Input 
                      id="new-project-date"
                      type="date"
                      value={newProject.completionDate} 
                      onChange={(e) => setNewProject({...newProject, completionDate: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="new-project-image">Project Image</Label>
                  <div className="mt-2 border rounded-md p-4 flex flex-col items-center justify-center min-h-[200px]">
                    {selectedImage ? (
                      <div className="space-y-2">
                        <p className="text-sm text-green-600">
                          {selectedImage.name} selected
                        </p>
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedImage(null)}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Label 
                          htmlFor="project-image-upload" 
                          className="cursor-pointer bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-md flex items-center gap-2"
                        >
                          <Upload size={16} />
                          <span>Choose Image</span>
                        </Label>
                        <Input 
                          id="project-image-upload"
                          type="file" 
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleAddProject}
                className="mt-6"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Project
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectsEditor;
