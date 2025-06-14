
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Save, Trash2, Upload } from 'lucide-react';
import { fetchProjects, updateProject, addProject, deleteProject } from '@/services/projectService';
import { Project } from '@/types/payload-types';
import { getImageWithCacheBusting } from '@/services/serviceUtils';

const ProjectsEditor: React.FC = () => {
  const queryClient = useQueryClient();
  const [newProjectImage, setNewProjectImage] = useState<File | null>(null);
  const [projectImages, setProjectImages] = useState<Record<string, File | null>>({});
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
  
  const [newProject, setNewProject] = useState<Omit<Project, 'id' | 'image'>>({
    title: '',
    description: '',
    category: 'Residential',
    client: '',
    completionDate: ''
  });
  
  const { data: projects = [], isLoading } = useQuery({
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
    onSuccess: (_, variables) => {
      const id = variables.get('id') as string;
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      // Clear image state for the updated project
      setProjectImages(prev => ({ ...prev, [id]: null }));
      setPreviewUrls(prev => ({ ...prev, [id]: '' }));
      toast.success('Project updated successfully');
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
      setNewProjectImage(null);
      setPreviewUrls(prev => ({ ...prev, newProject: '' }));
      toast.success('Project added successfully');
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, projectId?: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      
      if (projectId) {
        setProjectImages(prev => ({ ...prev, [projectId]: file }));
        setPreviewUrls(prev => ({ ...prev, [projectId]: previewUrl }));
      } else {
        setNewProjectImage(file);
        setPreviewUrls(prev => ({ ...prev, newProject: previewUrl }));
      }
    }
  };

  const handleUpdateProject = (e: React.FormEvent<HTMLFormElement>, project: Project) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('id', project.id);
    
    const imageFile = projectImages[project.id];
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    updateMutation.mutate(formData);
  };

  const handleAddProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newProject.title || !newProject.description || !newProjectImage) {
      toast.error('Title, description and image are required');
      return;
    }
    
    const formData = new FormData(e.currentTarget);
    formData.append('image', newProjectImage);
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
            {projects.map((project: Project) => (
              <form key={project.id} onSubmit={(e) => handleUpdateProject(e, project)} className="border rounded-lg p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`title-${project.id}`}>Title</Label>
                      <Input id={`title-${project.id}`} name="title" defaultValue={project.title} />
                    </div>
                    <div>
                      <Label htmlFor={`description-${project.id}`}>Description</Label>
                      <Textarea id={`description-${project.id}`} name="description" defaultValue={project.description} rows={3} />
                    </div>
                    <div>
                      <Label htmlFor={`category-${project.id}`}>Category</Label>
                      <select id={`category-${project.id}`} name="category" defaultValue={project.category} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Industrial">Industrial</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor={`client-${project.id}`}>Client</Label>
                      <Input id={`client-${project.id}`} name="client" defaultValue={project.client} />
                    </div>
                    <div>
                      <Label htmlFor={`date-${project.id}`}>Completion Date</Label>
                      <Input id={`date-${project.id}`} name="completionDate" type="date" defaultValue={project.completionDate} />
                    </div>
                  </div>
                  <div>
                    <Label>Project Image</Label>
                    <div className="mt-2 mb-4">
                      <img src={previewUrls[project.id] || project.image || '/placeholder.svg'} alt={project.title} className="w-full h-48 object-cover rounded-md border" />
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <Label htmlFor={`project-image-${project.id}`} className="cursor-pointer bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-md flex items-center gap-2">
                        <Upload size={16} />
                        <span>{projectImages[project.id] ? 'Image Selected' : 'Change Image'}</span>
                      </Label>
                      <Input id={`project-image-${project.id}`} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, project.id)} />
                      {projectImages[project.id] && <span className="text-sm text-green-600">{projectImages[project.id]?.name}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <Button type="submit"><Save className="mr-2 h-4 w-4" /> Save Changes</Button>
                  <Button variant="destructive" type="button" onClick={() => deleteMutation.mutate(project.id)}><Trash2 className="mr-2 h-4 w-4" /> Delete Project</Button>
                </div>
              </form>
            ))}
            
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Add New Project</h3>
              <form onSubmit={handleAddProject}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="new-project-title">Title</Label>
                      <Input id="new-project-title" name="title" placeholder="Residential Solar Installation" />
                    </div>
                    <div>
                      <Label htmlFor="new-project-description">Description</Label>
                      <Textarea id="new-project-description" name="description" placeholder="A complete solar solution..." rows={3} />
                    </div>
                    <div>
                      <Label htmlFor="new-project-category">Category</Label>
                      <select id="new-project-category" name="category" defaultValue="Residential" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Industrial">Industrial</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="new-project-client">Client</Label>
                      <Input id="new-project-client" name="client" placeholder="John Smith" />
                    </div>
                    <div>
                      <Label htmlFor="new-project-date">Completion Date</Label>
                      <Input id="new-project-date" name="completionDate" type="date" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="new-project-image">Project Image</Label>
                    <div className="mt-2 border rounded-md p-4 flex flex-col items-center justify-center min-h-[200px] bg-muted/20">
                      {previewUrls.newProject ? <img src={previewUrls.newProject} alt="New project preview" className="w-full h-48 object-cover rounded-md border mb-4" /> : null}
                      <Label htmlFor="project-image-upload" className="cursor-pointer bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-md flex items-center gap-2">
                        <Upload size={16} />
                        <span>{newProjectImage ? 'Image Selected' : 'Choose Image'}</span>
                      </Label>
                      <Input id="project-image-upload" type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e)} />
                      {newProjectImage && <p className="text-sm text-green-600 mt-2">{newProjectImage.name}</p>}
                    </div>
                  </div>
                </div>
                <Button type="submit" className="mt-6"><Plus className="mr-2 h-4 w-4" /> Add Project</Button>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectsEditor;
