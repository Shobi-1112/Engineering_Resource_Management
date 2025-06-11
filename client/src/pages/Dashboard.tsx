import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';

export default function Dashboard() {
  const { user } = useAuth();

  // Fetch projects for managers
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.projects.getAll(),
    enabled: user?.role === 'manager',
  });

  // Fetch assignments for engineers
  const { data: assignments } = useQuery({
    queryKey: ['myAssignments'],
    queryFn: () => api.assignments.getMyAssignments(),
    enabled: user?.role === 'engineer',
  });

  if (user?.role === 'manager') {
    return (
      <div className="container">
        <h1 className="page-title">Manager Dashboard</h1>
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h2>Project Overview</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Projects</h3>
                <p className="stat-number">{projects?.length || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Active Projects</h3>
                <p className="stat-number">
                  {projects?.filter(p => p.status === 'active').length || 0}
                </p>
              </div>
              <div className="stat-card">
                <h3>Completed Projects</h3>
                <p className="stat-number">
                  {projects?.filter(p => p.status === 'completed').length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <h2>Recent Projects</h2>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                  </tr>
                </thead>
                <tbody>
                  {projects?.slice(0, 5).map(project => (
                    <tr key={project._id}>
                      <td>{project.name}</td>
                      <td>
                        <span className={`status-badge ${project.status}`}>
                          {project.status}
                        </span>
                      </td>
                      <td>{new Date(project.startDate).toLocaleDateString()}</td>
                      <td>{new Date(project.endDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="page-title">Engineer Dashboard</h1>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>My Assignments</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Assignments</h3>
              <p className="stat-number">{assignments?.length || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Active Assignments</h3>
              <p className="stat-number">
                {assignments?.filter(a => a.status === 'active').length || 0}
              </p>
            </div>
            <div className="stat-card">
              <h3>Completed Assignments</h3>
              <p className="stat-number">
                {assignments?.filter(a => a.status === 'completed').length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Current Assignments</h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                </tr>
              </thead>
              <tbody>
                {assignments?.slice(0, 5).map(assignment => (
                  <tr key={assignment._id}>
                    <td>{assignment.project.name}</td>
                    <td>{assignment.role}</td>
                    <td>
                      <span className={`status-badge ${assignment.status}`}>
                        {assignment.status}
                      </span>
                    </td>
                    <td>{new Date(assignment.startDate).toLocaleDateString()}</td>
                    <td>{new Date(assignment.endDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 