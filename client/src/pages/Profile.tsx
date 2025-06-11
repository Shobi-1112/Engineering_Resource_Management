import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: 'manager' | 'engineer';
  skills: string[];
  seniority: string;
  maxCapacity: number;
  department: string;
}

export default function Profile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await api.get(`/users/${user?._id}`);
      return response.data;
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<UserProfile>) => {
      const response = await api.patch(`/users/${user?._id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setIsEditing(false);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map((skill) => skill.trim());
    setFormData((prev) => ({
      ...prev,
      skills,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="loading-spinner" />;
  }

  return (
    <div className="container">
      <h1 className="page-title">My Profile</h1>

      <div className="profile-card">
        {!isEditing ? (
          <>
            <div className="profile-header">
              <h2>{profile.name}</h2>
              <button
                className="primary-button"
                onClick={() => {
                  setFormData(profile);
                  setIsEditing(true);
                }}
              >
                Edit Profile
              </button>
            </div>

            <div className="profile-details">
              <div className="detail-item">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{profile.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Role:</span>
                <span className="detail-value">{profile.role}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Department:</span>
                <span className="detail-value">{profile.department}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Seniority:</span>
                <span className="detail-value">{profile.seniority}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Max Capacity:</span>
                <span className="detail-value">{profile.maxCapacity} hours/week</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Skills:</span>
                <div className="skills-list">
                  {profile.skills.map((skill: string, index: number) => (
                    <span key={index} className="skill-badge">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                value={formData.name || ''}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="department" className="form-label">
                Department
              </label>
              <input
                type="text"
                id="department"
                name="department"
                className="form-input"
                value={formData.department || ''}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="seniority" className="form-label">
                Seniority
              </label>
              <select
                id="seniority"
                name="seniority"
                className="form-input"
                value={formData.seniority || ''}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Seniority</option>
                <option value="junior">Junior</option>
                <option value="mid">Mid-level</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="maxCapacity" className="form-label">
                Max Capacity (hours/week)
              </label>
              <input
                type="number"
                id="maxCapacity"
                name="maxCapacity"
                className="form-input"
                min="0"
                max="168"
                value={formData.maxCapacity || ''}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="skills" className="form-label">
                Skills (comma-separated)
              </label>
              <input
                type="text"
                id="skills"
                name="skills"
                className="form-input"
                value={formData.skills?.join(', ') || ''}
                onChange={handleSkillsChange}
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="primary-button"
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? (
                  <>
                    <span className="spinner" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 