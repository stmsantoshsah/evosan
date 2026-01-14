import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';

export async function GET(
    req: NextRequest,
    { params }: { params: { username: string } }
) {
    try {
        const { username } = params;
        const db = (await dbConnect()).connection.db;
        if (!db) throw new Error('Database connection failed');

        // 1. Find User by Name (Case Insensitive)
        // Note: In a real app, use a unique username field. Here using full_name.
        const user = await db.collection('users').findOne({
            full_name: { $regex: new RegExp(`^${username}$`, 'i') }
        });

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        // 2. Fetch Gamification Stats (Currently global/single user in this prototype)
        // In multi-tenant, would query { userId: user._id }
        const gamestats = await db.collection('gamestats').findOne({});
        const workoutsCount = await db.collection('workouts').countDocuments({});
        const journalCount = await db.collection('journal_entries').countDocuments({});

        // Reliability Proxy
        const habitLogs = await db.collection('habit_logs').find({ completed: true }).toArray();
        const totalCompleted = habitLogs.length;

        const xp = gamestats ? gamestats.xp : 0;
        const level = Math.floor(xp / 1000) + 1;
        const nextLevelXP = level * 1000;
        const title = gamestats?.title || "Script Kiddie";

        // Badges Logic (Duplicated from gamification/route.ts for now - should allow shared lib)
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

        // 3. Assemble Public Profile Data
        const profileData = {
            id: user._id,
            name: user.full_name,
            bio: user.bio,
            role: user.role || 'ENGINEER',
            joinedAt: user.created_at || new Date().toISOString(),
            avatarUrl: user.avatar_url,
            // Fallback for avatar using name seed
            derivedAvatarUrl: `https://api.dicebear.com/7.x/notionists/svg?seed=${user.full_name}`
        };

        const gamificationData = {
            xp,
            level,
            nextLevelXP,
            title,
            stats: {
                uptime: Math.floor((Date.now() - new Date(profileData.joinedAt).getTime()) / (1000 * 60 * 60 * 24)),
                totalWorkouts: workoutsCount,
                knowledgeIngested: journalCount * 10,
                volumeMoved: workoutsCount * 500,
                reliability: Math.min(98, 50 + (level * 2))
            },
            badges
        };

        return NextResponse.json({
            success: true,
            data: {
                profile: profileData,
                gamification: gamificationData
            }
        });

    } catch (error: any) {
        console.error('Public Profile API Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
