import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

interface Project {
  _id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'pending';
  startDate: string;
  endDate: string;
  teamSize: number;
}

export default function Projects() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.projects.getAll(),
    enabled: user?.role === 'manager',
  });

  const createProject = useMutation({
    mutationFn: (data: Partial<Project>) => api.projects.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsModalOpen(false);
    },
  });

  const updateProject = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Project> }) =>
      api.projects.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsModalOpen(false);
      setSelectedProject(null);
    },
  });

  const deleteProject = useMutation({
    mutationFn: (id: string) => api.projects.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Projects</h1>
        <button
          className="primary-button"
          onClick={() => {
            setSelectedProject(null);
            setIsModalOpen(true);
          }}
        >
          Create Project
        </button>
      </div>

      <div className="projects-grid">
        {projects?.map((project: Project) => (
          <div key={project._id} className="project-card">
            <div className="project-header">
              <h3>{project.name}</h3>
              <span className={`status-badge ${project.status}`}>
                {project.status}
              </span>
            </div>
            <p className="project-description">{project.description}</p>
            <div className="project-details">
              <div className="detail-item">
                <span className="detail-label">Team Size:</span>
                <span className="detail-value">{project.teamSize}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Start Date:</span>
                <span className="detail-value">
                  {new Date(project.startDate).toLocaleDateString()}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">End Date:</span>
                <span className="detail-value">
                  {new Date(project.endDate).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="project-actions">
              <button
                className="edit-button"
                onClick={() => {
                  setSelectedProject(project);
                  setIsModalOpen(true);
                }}
              >
                Edit
              </button>
              <button
                className="delete-button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this project?')) {
                    deleteProject.mutate(project._id);
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{selectedProject ? 'Edit Project' : 'Create Project'}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const data = {
                  name: formData.get('name') as string,
                  description: formData.get('description') as string,
                  status: formData.get('status') as Project['status'],
                  startDate: formData.get('startDate') as string,
                  endDate: formData.get('endDate') as string,
                  teamSize: parseInt(formData.get('teamSize') as string),
                };

                if (selectedProject) {
                  updateProject.mutate({ id: selectedProject._id, data });
                } else {
                  createProject.mutate(data);
                }
              }}
            >
              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  Project Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  defaultValue={selectedProject?.name}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="form-input"
                  defaultValue={selectedProject?.description}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="status">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  className="form-input"
                  defaultValue={selectedProject?.status}
                  required
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="startDate">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  className="form-input"
                  defaultValue={selectedProject?.startDate.split('T')[0]}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="endDate">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  className="form-input"
                  defaultValue={selectedProject?.endDate.split('T')[0]}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="teamSize">
                  Team Size
                </label>
                <input
                  type="number"
                  id="teamSize"
                  name="teamSize"
                  className="form-input"
                  defaultValue={selectedProject?.teamSize}
                  min="1"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="primary-button">
                  {selectedProject ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedProject(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 