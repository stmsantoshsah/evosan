import { NextPage, Metadata } from "next";
import React from "react";
import Habits from '@/features/habits/components/Habits';

export const metadata: Metadata = {
    title: "Habits | Evosan",
    description: "Daily Protocol and Habit Tracking",
};

/**
 * Habits Page (/habits)
 *
 * Provides the interface for tracking daily habits. Users can view their protocol, 
 * mark habits as complete, and add new habits to their system.
 *
 * @component
 * @returns {JSX.Element} <Habits />
 */
const HabitsPage = () => <Habits />;

export default HabitsPage;
