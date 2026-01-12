import { NextPage, Metadata } from "next";
import React from "react";
import DoctorPatients from '@/features/patient/components/DoctorPatients';

export const metadata: Metadata = {
    title: "Patients | Evosan",
    description: "Patient Management and Clinical Records",
};

/**
 * Patients Page (/patients)
 *
 * Provides a comprehensive interface for doctors to manage patients, 
 * view clinical histories, and record new findings.
 *
 * @component
 * @returns {JSX.Element} <DoctorPatients />
 */
const PatientsPage = () => <DoctorPatients />;

export default PatientsPage;
