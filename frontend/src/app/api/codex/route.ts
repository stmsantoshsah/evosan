import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';

export async function GET(req: NextRequest) {
    try {
        const db = (await dbConnect()).connection.db;
        const codex = await db.collection('codex').find({}).sort({ createdAt: -1 }).toArray();
        return NextResponse.json({ success: true, data: codex });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const db = (await dbConnect()).connection.db;

        const newEntry = {
            ...body,
            createdAt: new Date().toISOString()
        };

        const result = await db.collection('codex').insertOne(newEntry);
        return NextResponse.json({ success: true, data: { ...newEntry, _id: result.insertedId } });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
