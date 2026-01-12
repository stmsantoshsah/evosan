export interface Patient {
    id: string;
    name: string;
    age: number;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    email?: string;
    phone?: string;
    lastVisit?: string;
}

export interface PatientNote {
    id: string;
    patientId: string;
    content: string;
    createdAt: string;
}

export interface CreatePatientPayload {
    name: string;
    age: number;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    email?: string;
    phone?: string;
}
