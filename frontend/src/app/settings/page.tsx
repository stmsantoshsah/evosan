import { NextPage, Metadata } from "next";
import React from "react";
import Settings from '@/features/settings/components/Settings';

export const metadata: Metadata = {
    title: "Settings | Evosan",
    description: "System Configuration and Workout Planning",
};

/**
 * Settings Page (/settings)
 *
 * Configurations for the application, including managing the weekly workout plan 
 * and other user preferences.
 *
 * @component
 * @returns {JSX.Element} <Settings />
 */
const SettingsPage = () => <Settings />;

export default SettingsPage;
