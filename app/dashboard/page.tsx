export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Todo } from '@/lib/types';
import Dashboard from '@/components/Dashboard';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: todos } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <Dashboard
      initialTodos={(todos as Todo[]) ?? []}
      userEmail={user.email ?? ''}
    />
  );
}
