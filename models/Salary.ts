import mongoose, { Schema } from "mongoose";

const SalarySchema = new Schema(
  {
    employeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    amount: { type: Number, required: true },
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true },
    status: { type: String, enum: ["paid", "pending", "cancelled"], default: "pending" },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Salary || mongoose.model("Salary", SalarySchema);
