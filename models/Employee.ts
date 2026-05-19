import mongoose from 'mongoose';

export interface IEmployee extends mongoose.Document {
  name: string;
  email: string;
  phone: string;
  address: string;
  department: mongoose.Types.ObjectId;
  position: string;
  salary: number;
  joiningDate: Date;
  image?: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  position: { type: String, required: true },
  salary: { type: Number, required: true },
  joiningDate: { type: Date, required: true },
  image: String,
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, {
  timestamps: true,
});

EmployeeSchema.index({ name: 1 });
EmployeeSchema.index({ email: 1 });
EmployeeSchema.index({ department: 1 });
EmployeeSchema.index({ status: 1 });
EmployeeSchema.index({ createdAt: -1 });

export default mongoose.models.Employee || mongoose.model<IEmployee>('Employee', EmployeeSchema);