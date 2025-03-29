import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-center space-y-8">
          <h1 className="text-4xl font-bold">Analytics Collector</h1>
          <p className="text-xl">Sistema de coleta de metadados de usuários</p>

          <div className="space-x-4">
            <Button asChild>
              <Link href="/dashboard">Ver Dashboard</Link>
            </Button>

            <Button variant="outline" asChild>
              <Link href="/dashboard" target="_blank">
                Abrir em nova aba
              </Link>
            </Button>
          </div>
        </div>
      </main>
  );
}