'use client';

import PatientsDetails from './PatientsDetails';
import EmptyDetailsPlaceholder from './EmptyDetailsPlaceholder';

interface PatientContentProps {
    patientId?: string;
}

export default function PatientContent({ patientId }: PatientContentProps) {
    if (!patientId) {
        return <EmptyDetailsPlaceholder />;
    }

    return <PatientsDetails patientId={patientId} />;
}
