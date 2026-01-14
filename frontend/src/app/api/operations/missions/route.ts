import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
    try {
        const db = (await dbConnect()).connection.db;
        const missions = await db.collection('missions').find({}).sort({ dueDate: 1 }).toArray();
        return NextResponse.json({ success: true, data: missions });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const db = (await dbConnect()).connection.db;

        const newMission = {
            ...body,
            isCompleted: false,
            createdAt: new Date().toISOString()
        };

        const result = await db.collection('missions').insertOne(newMission);
        return NextResponse.json({ success: true, data: { ...newMission, _id: result.insertedId } });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, isCompleted } = body;

        if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

        const db = (await dbConnect()).connection.db;

        await db.collection('missions').updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    isCompleted,
                    completedAt: isCompleted ? new Date().toISOString() : null
                }
            }
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
