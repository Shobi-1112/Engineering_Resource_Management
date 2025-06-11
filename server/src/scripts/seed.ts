import mongoose from 'mongoose';
import { User } from '../models/User';
import { Project } from '../models/Project';
import { Assignment } from '../models/Assignment';
import { connectDB } from '../config/database';

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Assignment.deleteMany({});

    // Create managers
    const manager1 = await User.create({
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      password: 'password123',
      role: 'manager',
      department: 'Engineering'
    });

    const manager2 = await User.create({
      name: 'Michael Chen',
      email: 'michael@example.com',
      password: 'password123',
      role: 'manager',
      department: 'Product'
    });

    // Create engineers
    const engineer1 = await User.create({
      name: 'John Smith',
      email: 'john@example.com',
      password: 'password123',
      role: 'engineer',
      skills: ['React', 'Node.js', 'TypeScript'],
      seniority: 'senior',
      maxCapacity: 100,
      department: 'Engineering'
    });

    const engineer2 = await User.create({
      name: 'Emily Davis',
      email: 'emily@example.com',
      password: 'password123',
      role: 'engineer',
      skills: ['Python', 'Django', 'PostgreSQL'],
      seniority: 'mid',
      maxCapacity: 100,
      department: 'Engineering'
    });

    const engineer3 = await User.create({
      name: 'Alex Wong',
      email: 'alex@example.com',
      password: 'password123',
      role: 'engineer',
      skills: ['React', 'TypeScript', 'AWS'],
      seniority: 'junior',
      maxCapacity: 50,
      department: 'Engineering'
    });

    // Create projects
    const project1 = await Project.create({
      name: 'E-commerce Platform',
      description: 'Building a modern e-commerce platform with React and Node.js',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-06-30'),
      requiredSkills: ['React', 'Node.js', 'TypeScript'],
      teamSize: 3,
      status: 'active',
      managerId: manager1._id
    });

    const project2 = await Project.create({
      name: 'Data Analytics Dashboard',
      description: 'Creating a real-time analytics dashboard for business metrics',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-08-31'),
      requiredSkills: ['Python', 'Django', 'PostgreSQL'],
      teamSize: 2,
      status: 'active',
      managerId: manager2._id
    });

    const project3 = await Project.create({
      name: 'Mobile App Development',
      description: 'Developing a cross-platform mobile application',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-09-30'),
      requiredSkills: ['React', 'TypeScript', 'AWS'],
      teamSize: 2,
      status: 'planning',
      managerId: manager1._id
    });

    // Create assignments
    await Assignment.create({
      engineerId: engineer1._id,
      projectId: project1._id,
      allocationPercentage: 60,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-06-30'),
      role: 'Tech Lead',
      status: 'active'
    });

    await Assignment.create({
      engineerId: engineer2._id,
      projectId: project1._id,
      allocationPercentage: 40,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-06-30'),
      role: 'Backend Developer',
      status: 'active'
    });

    await Assignment.create({
      engineerId: engineer3._id,
      projectId: project1._id,
      allocationPercentage: 50,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-06-30'),
      role: 'Frontend Developer',
      status: 'active'
    });

    await Assignment.create({
      engineerId: engineer2._id,
      projectId: project2._id,
      allocationPercentage: 60,
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-08-31'),
      role: 'Lead Developer',
      status: 'active'
    });

    console.log('Seed data created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData(); 