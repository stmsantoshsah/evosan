import { apiSlice } from '@/store/apiSlice';
import { JOURNAL_ENDPOINTS } from '../endpoints';
import { JournalEntry, CreateJournalPayload } from '../types/journalTypes';

export const journalApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getJournalEntries: builder.query<JournalEntry[], void>({
      query: () => JOURNAL_ENDPOINTS.GET_ENTRIES,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Journal' as const, id })), 'Journal']
          : ['Journal'],
    }),
    createJournalEntry: builder.mutation<JournalEntry, CreateJournalPayload>({
      query: (payload) => ({
        url: JOURNAL_ENDPOINTS.CREATE_ENTRY,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Journal', 'Stat'],
    }),
    uploadVoiceJournal: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: JOURNAL_ENDPOINTS.VOICE_JOURNAL,
        method: 'POST',
        body: formData,
        // fetchBaseQuery will automatically NOT set Content-Type if body is FormData
      }),
    }),
  }),
});

export const {
  useGetJournalEntriesQuery,
  useCreateJournalEntryMutation,
  useUploadVoiceJournalMutation,
} = journalApiSlice;
