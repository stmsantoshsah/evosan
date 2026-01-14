import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const db = (await dbConnect()).connection.db;

        const newHabit = {
            ...body,
            createdAt: new Date().toISOString(),
            status: 'active',
            streak: 0,
            completion_history: []
        };

        const result = await db.collection('habits').insertOne(newHabit);
        return NextResponse.json({ success: true, data: { ...newHabit, _id: result.insertedId } });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
