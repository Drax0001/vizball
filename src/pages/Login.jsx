import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/AuthContext';
import { useLang } from '@/lib/LanguageContext';
import t from '@/lib/translations';
import Seo from '@/components/Seo';
import PageHeader from '@/components/PageHeader';

export default function Login() {
  const { lang } = useLang();
  const tr = t[lang];
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from || '/forum';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(username, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(tr.login_error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <Seo title={tr.login_title} canonicalPath="/login" noindex />
      <PageHeader title={tr.login_title} subtitle={tr.login_subtitle} />
      <div className="shell flex justify-center py-14 md:py-20">
      <div className="w-full max-w-md rounded-lg bg-card p-8 shadow-lg ring-1 ring-border">

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="meta mb-2 block text-primary">{tr.login_username}</label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} required autoFocus />
          </div>
          <div>
            <label className="meta mb-2 block text-primary">{tr.login_password}</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={submitting} className="btn btn-green h-auto w-full">
            {submitting ? tr.login_submitting : tr.login_submit}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground mt-6 text-center">
          {tr.login_no_account}{' '}
          <Link to="/register" className="font-bold text-[hsl(var(--brand-red))] underline-offset-4 hover:underline">
            {tr.login_register_link}
          </Link>
        </p>
      </div>
      </div>
    </div>
  );
}
