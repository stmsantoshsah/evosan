import { NextPage, Metadata } from "next";
import React from "react";
import Insights from '@/features/insights/components/Insights';

export const metadata: Metadata = {
    title: "Insights | Evosan",
    description: "System Analytics and pattern recognition",
};

/**
 * Insights Page (/insights)
 *
 * Visualizes long-term data trends, correlation between habits and mood, 
 * and provides actionable feedback to the user.
 *
 * @component
 * @returns {JSX.Element} <Insights />
 */
const InsightsPage = () => <Insights />;

export default InsightsPage;
