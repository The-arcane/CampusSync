import { redirect } from 'next/navigation';

export default function DashboardPage() {
  // Redirect to the default dashboard, e.g., the admin dashboard
  redirect('/dashboard/admin');
}
