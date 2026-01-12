import { NextPage, Metadata } from "next";
import React from "react";
import Health from '@/features/health/components/Health';

export const metadata: Metadata = {
    title: "Health | Evosan",
    description: "Physical Health and Workout Tracking",
};

/**
 * Health Page (/health)
 *
 * Tracks physical health metrics and workout routines.
 *
 * @component
 * @returns {JSX.Element} <Health />
 */
const HealthPage = () => <Health />;

export default HealthPage;
