import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';

export async function GET(req: NextRequest) {
    try {
        const db = (await dbConnect()).connection.db;
        if (!db) throw new Error('Database connection failed');

        // Assuming single user context for personal dashboard
        // In multi-user app, filter by userId
        // 1. Fetch Basic Stats
        const gamestats = await db.collection('gamestats').findOne({});
        const workoutsCount = await db.collection('workouts').countDocuments({});

        // 2. Fetch Habit Stats for Reliability & Knowledge
        const habitLogs = await db.collection('habit_logs').find({ completed: true }).toArray();
        const totalCompleted = habitLogs.length; // Approximate "Volume"

        // Calculate Reliability (Completed / (Completed + Missed) is hard without missed records. 
        // For now, let's use a proxy: Reliability = (Completed last 7 days / 7 * habits_count) or just mock it based on XP)
        // Better: Use the raw count of completed habits as "Consistency Points"

        // Knowledge: Count habits with category 'learning' (need to join or check habit_ids)
        // Optimization: For this personal dashboard, let's just count 'journal_entries' for "Mind" 
        const journalCount = await db.collection('journal_entries').countDocuments({});

        // System Uptime (Days since specific date or first log)
        const firstLog = await db.collection('nutrition').findOne({}, { sort: { date: 1 } });
        const startDate = firstLog ? new Date(firstLog.date) : new Date('2024-01-01');
        const diffTime = Math.abs(new Date().getTime() - startDate.getTime());
        const daysActive = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const xp = gamestats ? gamestats.xp : 0;
        const level = Math.floor(xp / 1000) + 1;
        const nextLevelXP = level * 1000;
        const title = gamestats?.title || "Script Kiddie";

        // 3. Calculate Badges
        const badges = [
            {
                id: 'hello_world',
                title: 'Hello World',
                description: 'Logged your first entry',
                icon: '🏆',
                unlocked: workoutsCount > 0 || journalCount > 0
            },
            {
                id: 'iron_lung',
                title: 'Iron Lung',
                description: 'Logged 10+ Workouts',
                icon: '🫁',
                unlocked: workoutsCount >= 10
            },
            {
                id: 'bug_squasher',
                title: 'Bug Squasher',
                description: 'Logged 50+ Habits',
                icon: '🐛',
                unlocked: totalCompleted >= 50
            },
            {
                id: '10x_engineer',
                title: '10x Engineer',
                description: 'Reach Level 50',
                icon: '🚀',
                unlocked: level >= 50
            }
        ];


        return NextResponse.json({
            success: true,
            data: {
                xp,
                level,
                nextLevelXP,
                title,
                stats: {
                    uptime: daysActive,
                    totalWorkouts: workoutsCount,
                    knowledgeIngested: journalCount * 10, // Proxy: 10 pages per journal?
                    volumeMoved: workoutsCount * 500, // Proxy: 500kg per workout
                    reliability: Math.min(98, 50 + (level * 2)) // Proxy equation
                },
                badges
            }
        });

    } catch (error: any) {
        console.error('Gamification API Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { duration, taskName } = body;

        const db = (await dbConnect()).connection.db;
        if (!db) throw new Error('Database connection failed');

        // 1. Log the Focus Session
        await db.collection('focus_logs').insertOne({
            duration: duration || 0, // in seconds
            taskName: taskName || 'Deep Work',
            completedAt: new Date(),
            xpAwarded: 50
        });

        // 2. Award XP
        await db.collection('gamestats').updateOne(
            {},
            { $inc: { xp: 50 } },
            { upsert: true }
        );

        return NextResponse.json({ success: true, message: 'Focus Session Logged. +50 XP.' });
    } catch (error: any) {
        console.error('Focus Log Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
