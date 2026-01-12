import { NextPage, Metadata } from "next";
import React from "react";
import Dashboard from '@/features/dashboard/components/Dashboard';

export const metadata: Metadata = {
    title: "Dashboard | Evosan",
    description: "System Overview and Performance Trends",
};

/**
 * Dashboard Page (/)
 *
 * Displays the main system overview, including habit completion stats, mood tracking, 
 * and performance trends. Serves as the landing page for authenticated users.
 *
 * @component
 * @returns {JSX.Element} <Dashboard />
 */
const HomePage = () => <Dashboard />;

export default HomePage;
