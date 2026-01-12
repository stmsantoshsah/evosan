import { apiSlice } from '@/store/apiSlice';
import { PATIENT_ENDPOINTS } from '../endpoints';
import { Patient, PatientNote, CreatePatientPayload } from '../types/patientTypes';

export const patientApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPatients: builder.query<Patient[], void>({
            query: () => PATIENT_ENDPOINTS.GET_PATIENTS,
            providesTags: (result) =>
                result
                    ? [...result.map(({ id }) => ({ type: 'Patient' as const, id })), 'Patient']
                    : ['Patient'],
        }),
        getPatientDetails: builder.query<Patient, string>({
            query: (id) => PATIENT_ENDPOINTS.GET_PATIENT_DETAILS(id),
            providesTags: (result, error, id) => [{ type: 'Patient', id }],
        }),
        savePatientNote: builder.mutation<PatientNote, { patientId: string, content: string }>({
            query: ({ patientId, content }) => ({
                url: PATIENT_ENDPOINTS.SAVE_NOTE(patientId),
                method: 'POST',
                body: { content },
            }),
            invalidatesTags: (result, error, { patientId }) => [{ type: 'Patient', id: patientId }],
        }),
        createPatient: builder.mutation<Patient, CreatePatientPayload>({
            query: (payload) => ({
                url: PATIENT_ENDPOINTS.CREATE_PATIENT,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['Patient'],
        }),
    }),
});

export const {
    useGetPatientsQuery,
    useGetPatientDetailsQuery,
    useSavePatientNoteMutation,
    useCreatePatientMutation,
} = patientApiSlice;
