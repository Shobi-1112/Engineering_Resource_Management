import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  role: z.enum(['engineer', 'manager']),
  skills: z.string().min(2, { message: 'Skills are required' }),
  seniority: z.string().min(2, { message: 'Seniority is required' }),
  maxCapacity: z.string().min(1, { message: 'Max capacity is required' }),
  department: z.string().min(2, { message: 'Department is required' }),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    setError('');
    try {
      await registerUser(data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Create Account</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label className="form-label" htmlFor="name">Name</label>
          <input id="name" className="form-input" {...register('name')} disabled={loading} />
          {errors.name && <div className="error-message">{errors.name.message}</div>}
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email</label>
          <input id="email" type="email" className="form-input" {...register('email')} disabled={loading} />
          {errors.email && <div className="error-message">{errors.email.message}</div>}
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <input id="password" type="password" className="form-input" {...register('password')} disabled={loading} />
          {errors.password && <div className="error-message">{errors.password.message}</div>}
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="role">Role</label>
          <select id="role" className="form-input" {...register('role')} disabled={loading}>
            <option value="">Select role</option>
            <option value="engineer">Engineer</option>
            <option value="manager">Manager</option>
          </select>
          {errors.role && <div className="error-message">{errors.role.message}</div>}
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="skills">Skills</label>
          <input id="skills" className="form-input" {...register('skills')} disabled={loading} />
          {errors.skills && <div className="error-message">{errors.skills.message}</div>}
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="seniority">Seniority</label>
          <input id="seniority" className="form-input" {...register('seniority')} disabled={loading} />
          {errors.seniority && <div className="error-message">{errors.seniority.message}</div>}
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="maxCapacity">Max Capacity</label>
          <input id="maxCapacity" className="form-input" {...register('maxCapacity')} disabled={loading} />
          {errors.maxCapacity && <div className="error-message">{errors.maxCapacity.message}</div>}
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="department">Department</label>
          <input id="department" className="form-input" {...register('department')} disabled={loading} />
          {errors.department && <div className="error-message">{errors.department.message}</div>}
        </div>
        {error && <div className="error-message" style={{ textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}
        <button type="submit" className="form-button" disabled={loading}>
          {loading && <span className="spinner" />}Create Account
        </button>
      </form>
      <Link to="/login" className="form-link">Already have an account? Sign in</Link>
    </div>
  );
} 