import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = { title: 'RILOC Admin | Content Dashboard', description: 'Manage RILOC website content.' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
