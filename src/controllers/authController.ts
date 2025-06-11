import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, name, password, role, skills, seniority, maxCapacity, department } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new user
    const user = new User({
      email,
      name,
      password,
      role,
      skills,
      seniority,
      maxCapacity,
      department,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { _id: user._id.toString() },
      'your-super-secret-key-123',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        skills: user.skills,
        seniority: user.seniority,
        maxCapacity: user.maxCapacity,
        department: user.department,
      },
      token,
    });
  } catch (error) {
    res.status(400).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email });

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch);
    if (!isMatch) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { _id: user._id.toString() },
      'your-super-secret-key-123',
      { expiresIn: '7d' }
    );

    console.log('Login successful for user:', email);
    res.json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        skills: user.skills,
        seniority: user.seniority,
        maxCapacity: user.maxCapacity,
        department: user.department,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ error: 'Login failed' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as any).user._id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Failed to get profile' });
  }
}; 