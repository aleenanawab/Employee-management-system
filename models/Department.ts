import mongoose from 'mongoose';

export interface IDepartment extends mongoose.Document {
  name: string;
  description: string;
  head: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  head: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
}, {
  timestamps: true,
});

export default mongoose.models.Department || mongoose.model<IDepartment>('Department', DepartmentSchema);