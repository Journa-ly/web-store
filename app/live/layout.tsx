import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live Streams | Journa',
  description:
    'Watch and replay our live design streams, featuring new designs and creative inspiration.',
  keywords: ['live stream', 'design stream', 'design events', 'journa live']
};

export default function LiveLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-base-100">{children}</div>;
}
