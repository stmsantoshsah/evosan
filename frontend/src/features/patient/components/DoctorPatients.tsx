'use client';

import { useState } from 'react';
import PatientList from './PatientList';
import PatientContent from './PatientContent';
import PatientFormModal from './PatientFormModal';

export default function DoctorPatients() {
    const [selectedPatientId, setSelectedPatientId] = useState<string | undefined>();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="flex bg-black min-h-[calc(100vh-140px)] rounded-2xl border border-zinc-800 overflow-hidden">
            {/* --- SIDEBAR --- */}
            <div className="w-[320px] shrink-0 hidden md:block">
                <PatientList
                    onSelectPatient={setSelectedPatientId}
                    selectedId={selectedPatientId}
                    onOpenCreateModal={() => setIsModalOpen(true)}
                />
            </div>

            {/* --- CONTENT --- */}
            <div className="flex-1 flex flex-col">
                <PatientContent patientId={selectedPatientId} />
            </div>

            {/* --- MODAL --- */}
            <PatientFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
