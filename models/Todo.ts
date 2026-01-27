import mongoose, { Schema, Document } from 'mongoose';

export interface ITodo extends Document {
    title: string;
    description?: string;
    notes?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    completed: boolean;
    dueDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const TodoSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, default: '' },
        notes: { type: String, default: '' },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high', 'urgent'],
            default: 'medium'
        },
        completed: { type: Boolean, default: false },
        dueDate: { type: Date },
    },
    {
        timestamps: true,
    }
);

// Prevent overwriting the model if it's already compiled
export default mongoose.models.Todo || mongoose.model<ITodo>('Todo', TodoSchema);
