import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  id: number;
  date: Date;
  amount: number;
  category: 'Revenue' | 'Expense';
  status: 'Paid' | 'Pending';
  user_id: string;
  user_profile: string;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    id: { type: Number, required: true, unique: true },
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true, enum: ['Revenue', 'Expense'] },
    status: { type: String, required: true, enum: ['Paid', 'Pending'] },
    user_id: { type: String, required: true },
    user_profile: { type: String, default: '' },
  },
  { timestamps: true }
);

// Indexes for optimized queries
TransactionSchema.index({ date: -1 });
TransactionSchema.index({ category: 1 });
TransactionSchema.index({ status: 1 });
TransactionSchema.index({ user_id: 1 });
TransactionSchema.index({ amount: 1 });

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
