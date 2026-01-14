import mongoose, { Schema, Document } from 'mongoose';

export interface IDailyLog extends Document {
    userId: mongoose.Types.ObjectId;
    date: string; // YYYY-MM-DD
    water_ml: number;
    calories: number;
    protein_g: number;
    mood_rating: number | null;
    workouts: Array<{
        name: string;
        duration: number;
    }>;
}

const DailyLogSchema = new Schema<IDailyLog>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        date: { type: String, required: true },
        water_ml: { type: Number, default: 0 },
        calories: { type: Number, default: 0 },
        protein_g: { type: Number, default: 0 },
        mood_rating: { type: Number, default: null },
        workouts: [
            {
                name: { type: String },
                duration: { type: Number },
            },
        ],
    },
    { timestamps: true }
);

// Prevent overwriting the model if it already exists (Next.js hot reload fix)
export default mongoose.models.DailyLog || mongoose.model<IDailyLog>('DailyLog', DailyLogSchema);
