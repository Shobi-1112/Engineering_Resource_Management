import mongoose, { Document, Schema } from 'mongoose';

export interface IAssignment extends Document {
  engineerId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  allocationPercentage: number;
  startDate: Date;
  endDate: Date;
  role: string;
  status: 'active' | 'completed' | 'planned';
}

const assignmentSchema = new Schema<IAssignment>(
  {
    engineerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    allocationPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'planned'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Add index for efficient queries
assignmentSchema.index({ engineerId: 1, projectId: 1 });

export const Assignment = mongoose.model<IAssignment>('Assignment', assignmentSchema); 