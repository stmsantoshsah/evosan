import { Metadata } from 'next';
import Operations from '@/features/operations/components/Operations';

export const metadata: Metadata = {
    title: 'Operations | Evosan',
    description: 'Mission Queue and Knowledge Repository',
};

export default function OperationsPage() {
    return <Operations />;
}
