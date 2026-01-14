import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';

export async function GET(req: NextRequest) {
    try {
        const db = (await dbConnect()).connection.db;
        if (!db) throw new Error('Database connection failed');

        // Assuming single user context for personal dashboard
        // In multi-user app, filter by userId
        const gamestats = await db.collection('gamestats').findOne({});

        const xp = gamestats ? gamestats.xp : 0;
        const level = Math.floor(xp / 1000) + 1;
        const nextLevelXP = level * 1000;
        const title = gamestats?.title || "Novice";

        return NextResponse.json({
            success: true,
            data: {
                xp,
                level,
                nextLevelXP,
                title
            }
        });

    } catch (error: any) {
        console.error('Gamification API Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
