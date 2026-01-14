import { Metadata } from 'next';
import Codex from '@/features/codex/components/Codex';

export const metadata: Metadata = {
    title: 'The Codex | Evosan',
    description: 'Mental Firmware and Operating Principles',
};

export default function CodexPage() {
    return <Codex />;
}
