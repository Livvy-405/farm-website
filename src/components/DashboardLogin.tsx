import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock } from 'lucide-react';

const DashboardLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'farmadmin') {
      onLogin();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6 animate-fade-up">
        <div className="text-center">
          <Lock className="h-10 w-10 mx-auto text-primary" />
          <h1 className="font-display text-2xl font-bold mt-4">Farm Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Enter password to access admin panel</p>
        </div>
        <Input type="password" placeholder="Password" value={password} onChange={(e) => { setPassword(e.target.value); setError(false); }} />
        {error && <p className="text-destructive text-sm">Incorrect password. Try again.</p>}
        <Button type="submit" className="w-full">Sign In</Button>
      </form>
    </div>
  );
};

export default DashboardLogin;
