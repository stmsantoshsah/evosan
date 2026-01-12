export const PATIENT_ENDPOINTS = {
    GET_PATIENTS: '/patients',
    GET_PATIENT_DETAILS: (id: string) => `/patients/${id}`,
    CREATE_PATIENT: '/patients',
    UPDATE_PATIENT: (id: string) => `/patients/${id}`,
    DELETE_PATIENT: (id: string) => `/patients/${id}`,
    GET_NOTES: (patientId: string) => `/patients/${patientId}/notes`,
    SAVE_NOTE: (patientId: string) => `/patients/${patientId}/notes`,
};
