import GridBackground from '@/components/GridBackground';
import AuthForm from '@/components/AuthForm';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <div className="relative min-h-screen">
      <GridBackground />
      <div className="relative z-10">
        <AuthForm />
      </div>
    </div>
  );
}
