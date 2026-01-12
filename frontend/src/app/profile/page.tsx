import { NextPage, Metadata } from "next";
import React from "react";
import Profile from '@/features/profile/components/Profile';

export const metadata: Metadata = {
    title: "Profile | Evosan",
    description: "User profile and account settings",
};

/**
 * Profile Page (/profile)
 *
 * Displays user identity, role, and historical activity markers.
 *
 * @component
 * @returns {JSX.Element} <Profile />
 */
const ProfilePage = () => <Profile />;

export default ProfilePage;
