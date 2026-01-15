import React from 'react';

const DashboardSkeleton = () => {
    return (
        <div className="space-y-6 md:space-y-8 px-4 md:px-0 animate-pulse">

            {/* GAMIFICATION BAR SKELETON */}
            <div className="-mx-4 md:mx-0 -mt-4 md:mt-0 mb-6">
                <div className="h-2 w-full bg-zinc-800 rounded"></div>
            </div>

            {/* HEADER SKELETON */}
            <div>
                <div className="h-8 w-48 bg-zinc-800 rounded mb-2"></div>
                <div className="h-4 w-64 bg-zinc-800/50 rounded"></div>
            </div>

            {/* COMMAND BAR SKELETON */}
            <div className="max-w-2xl mx-auto w-full">
                <div className="h-12 w-full bg-zinc-800 rounded-lg"></div>
                <div className="h-3 w-48 bg-zinc-800/50 rounded mx-auto mt-2"></div>
            </div>

            {/* HUD SKELETON */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl min-h-[100px]">
                        <div className="h-4 w-20 bg-zinc-800 rounded mb-3"></div>
                        <div className="h-8 w-12 bg-zinc-800 rounded"></div>
                    </div>
                ))}
            </div>

            {/* MAIN CONTENT GRID SKELETON */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

                {/* Protocol & History (Left 2 Columns) */}
                <div className="lg:col-span-2 space-y-6 md:space-y-8">
                    {/* CHART SKELETON */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 min-h-[300px]">
                        <div className="flex justify-between mb-6">
                            <div className="h-6 w-32 bg-zinc-800 rounded"></div>
                            <div className="h-4 w-24 bg-zinc-800 rounded"></div>
                        </div>
                        <div className="h-[200px] bg-zinc-800/20 rounded w-full"></div>
                    </div>

                    {/* RECENT THOUGHTS SKELETON */}
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 min-h-[150px]">
                        <div className="h-6 w-40 bg-zinc-800 rounded mb-4"></div>
                        <div className="space-y-2">
                            <div className="h-4 w-full bg-zinc-800/50 rounded"></div>
                            <div className="h-4 w-3/4 bg-zinc-800/50 rounded"></div>
                        </div>
                    </div>
                </div>

                {/* Intelligence & Actions (Right 1 Column) */}
                <div className="space-y-6 md:space-y-8">
                    {/* INSIGHTS SKELETON */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 min-h-[250px]">
                        <div className="h-6 w-32 bg-zinc-800 rounded mb-4"></div>
                        <div className="space-y-4">
                            <div className="h-16 bg-zinc-800/30 rounded border-l-2 border-zinc-700"></div>
                            <div className="h-16 bg-zinc-800/30 rounded border-l-2 border-zinc-700"></div>
                        </div>
                    </div>

                    {/* QUICK ACCESS SKELETON */}
                    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
                        <div className="h-4 w-24 bg-zinc-800 rounded mb-4"></div>
                        <div className="space-y-3">
                            <div className="h-10 w-full bg-zinc-800 rounded"></div>
                            <div className="h-10 w-full bg-zinc-800 rounded"></div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DashboardSkeleton;
