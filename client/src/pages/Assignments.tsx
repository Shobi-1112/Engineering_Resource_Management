import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

interface Assignment {
  _id: string;
  project: {
    _id: string;
    name: string;
    description: string;
  };
  status: 'pending' | 'in_progress' | 'completed';
  startDate: string;
  endDate: string;
  hoursAllocated: number;
  hoursSpent: number;
}

export default function Assignments() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: assignments, isLoading } = useQuery({
    queryKey: ['assignments'],
    queryFn: async () => {
      const response = await api.get('/assignments');
      return response.data;
    },
    enabled: user?.role === 'engineer',
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ assignmentId, status }: { assignmentId: string; status: string }) => {
      const response = await api.patch(`/assignments/${assignmentId}`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
  });

  const updateHoursMutation = useMutation({
    mutationFn: async ({ assignmentId, hoursSpent }: { assignmentId: string; hoursSpent: number }) => {
      const response = await api.patch(`/assignments/${assignmentId}`, { hoursSpent });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      setIsModalOpen(false);
    },
  });

  if (isLoading) {
    return <div className="loading-spinner" />;
  }

  return (
    <div className="container">
      <h1 className="page-title">My Assignments</h1>
      
      <div className="assignments-grid">
        {assignments?.map((assignment: Assignment) => (
          <div key={assignment._id} className="assignment-card">
            <div className="assignment-header">
              <h3>{assignment.project.name}</h3>
              <span className={`status-badge ${assignment.status}`}>
                {assignment.status.replace('_', ' ')}
              </span>
            </div>
            
            <p className="assignment-description">{assignment.project.description}</p>
            
            <div className="assignment-details">
              <div className="detail-item">
                <span className="detail-label">Start Date:</span>
                <span className="detail-value">
                  {new Date(assignment.startDate).toLocaleDateString()}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">End Date:</span>
                <span className="detail-value">
                  {new Date(assignment.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Hours Allocated:</span>
                <span className="detail-value">{assignment.hoursAllocated}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Hours Spent:</span>
                <span className="detail-value">{assignment.hoursSpent}</span>
              </div>
            </div>

            <div className="assignment-actions">
              <select
                value={assignment.status}
                onChange={(e) => updateStatusMutation.mutate({
                  assignmentId: assignment._id,
                  status: e.target.value,
                })}
                className="status-select"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <button
                className="primary-button"
                onClick={() => {
                  setSelectedAssignment(assignment);
                  setIsModalOpen(true);
                }}
              >
                Update Hours
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && selectedAssignment && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Update Hours Spent</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const hoursSpent = parseInt(form.hoursSpent.value);
                updateHoursMutation.mutate({
                  assignmentId: selectedAssignment._id,
                  hoursSpent,
                });
              }}
            >
              <div className="form-group">
                <label htmlFor="hoursSpent" className="form-label">
                  Hours Spent
                </label>
                <input
                  type="number"
                  id="hoursSpent"
                  name="hoursSpent"
                  className="form-input"
                  min="0"
                  max={selectedAssignment.hoursAllocated}
                  defaultValue={selectedAssignment.hoursSpent}
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="primary-button"
                  disabled={updateHoursMutation.isPending}
                >
                  {updateHoursMutation.isPending ? (
                    <>
                      <span className="spinner" />
                      Updating...
                    </>
                  ) : (
                    'Update Hours'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 