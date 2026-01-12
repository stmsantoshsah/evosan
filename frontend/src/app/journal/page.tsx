import { NextPage, Metadata } from "next";
import React from "react";
import Journal from '@/features/journal/components/Journal';

export const metadata: Metadata = {
    title: "Journal | Evosan",
    description: "Daily Reflections and Mood Tracking",
};

/**
 * Journal Page (/journal)
 *
 * Allows users to record daily journal entries and track their mental state (mood).
 *
 * @component
 * @returns {JSX.Element} <Journal />
 */
const JournalPage = () => <Journal />;

export default JournalPage;
