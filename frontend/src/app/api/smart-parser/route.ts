import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import dbConnect from '@/lib/db';

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `
You are an AI assistant that extracts health data from text.
Extract the following fields into a strict JSON format:
- water_ml (number, inferred from text like "drank 1L" -> 1000, "500ml" -> 500).
- calories (number, estimated from food descriptions).
- protein_g (number, estimated).
- workout_name (string, or null).
- workout_duration (number in minutes).
- mood_rating (number 1-10).

Return ONLY the JSON. Do not include markdown formatting code blocks.
Example JSON:
{
  "water_ml": 1000,
  "calories": 500,
  "protein_g": 30,
  "workout_name": "Running",
  "workout_duration": 30,
  "mood_rating": 8
}
`;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { text } = body;

        if (!text) {
            return NextResponse.json({ success: false, error: 'Text is required' }, { status: 400 });
        }

        // 1. Send to Groq
        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: text },
            ],
            model: 'llama-3.3-70b-versatile',
            response_format: { type: 'json_object' },
        });

        const jsonContent = completion.choices[0]?.message?.content;
        if (!jsonContent) {
            throw new Error('No content returned from AI');
        }

        const extractedData = JSON.parse(jsonContent);

        // 2. Database Logic
        const db = (await dbConnect()).connection.db;
        if (!db) throw new Error('Database connection failed');

        const today = new Date().toISOString().split('T')[0];
        const now = new Date().toISOString();

        const promises = [];

        // A. Update Nutrition (Water, Calories, Protein)
        if (extractedData.water_ml || extractedData.calories || extractedData.protein_g) {
            const updateDoc: any = { $inc: {}, $setOnInsert: { date: today } };

            if (extractedData.water_ml) {
                // Backend expects water_liters
                updateDoc.$inc.water_liters = extractedData.water_ml / 1000;
            }
            if (extractedData.calories) updateDoc.$inc.calories = extractedData.calories;
            if (extractedData.protein_g) updateDoc.$inc.protein_grams = extractedData.protein_g;

            if (Object.keys(updateDoc.$inc).length > 0) {
                promises.push(
                    db.collection('nutrition').updateOne(
                        { date: today },
                        updateDoc,
                        { upsert: true }
                    )
                );
            }
        }

        // B. Update Workouts
        if (extractedData.workout_name) {
            const workoutUpdate = {
                $set: {
                    date: today,
                    routine_name: extractedData.workout_name,
                    duration_mins: extractedData.workout_duration || 0,
                    intensity: 5
                },
                $setOnInsert: {
                    exercises: "Logged via Smart Parser"
                }
            };

            promises.push(
                db.collection('workouts').updateOne(
                    { date: today },
                    workoutUpdate,
                    { upsert: true }
                )
            );
        }

        // C. Update Mood (Journal)
        if (extractedData.mood_rating) {
            // Find one for today by regex prefix
            const existingJournal = await db.collection('journal_entries').findOne({
                created_at: { $regex: `^${today}` }
            });

            if (existingJournal) {
                promises.push(
                    db.collection('journal_entries').updateOne(
                        { _id: existingJournal._id },
                        { $set: { mood: extractedData.mood_rating } }
                    )
                );
            } else {
                promises.push(
                    db.collection('journal_entries').insertOne({
                        created_at: now,
                        mood: extractedData.mood_rating,
                        content: "Auto-logged mood via Smart Parser",
                        title: "Daily Check-in"
                    })
                );
            }
        }

        await Promise.all(promises);

        return NextResponse.json({ success: true, data: extractedData });

    } catch (error: any) {
        console.error('Smart Parser Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
