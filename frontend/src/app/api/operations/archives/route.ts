import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';

export async function GET(req: NextRequest) {
    try {
        const db = (await dbConnect()).connection.db;
        const archives = await db.collection('archives').find({}).sort({ createdAt: -1 }).toArray();
        return NextResponse.json({ success: true, data: archives });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const db = (await dbConnect()).connection.db;

        const newArchive = {
            ...body,
            createdAt: new Date().toISOString()
        };

        const result = await db.collection('archives').insertOne(newArchive);
        return NextResponse.json({ success: true, data: { ...newArchive, _id: result.insertedId } });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
