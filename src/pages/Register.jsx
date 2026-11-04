import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/AuthContext';
import { useLang } from '@/lib/LanguageContext';
import t from '@/lib/translations';
import { api } from '@/api/client';
import Seo from '@/components/Seo';
import PageHeader from '@/components/PageHeader';

export default function Register() {
  const { lang } = useLang();
  const tr = t[lang];
  const { checkUserAuth } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.auth.register(username, password, email);
      await checkUserAuth();
      navigate('/forum', { replace: true });
    } catch (err) {
      setError(err.message || tr.register_error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <Seo title={tr.register_title} canonicalPath="/register" noindex />
      <PageHeader title={tr.register_title} subtitle={tr.register_subtitle} />
      <div className="shell flex justify-center py-14 md:py-20">
      <div className="w-full max-w-md rounded-lg bg-card p-8 shadow-lg ring-1 ring-border">

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="meta mb-2 block text-primary">{tr.register_username}</label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} required autoFocus />
          </div>
          <div>
            <label className="meta mb-2 block text-primary">{tr.register_email}</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="meta mb-2 block text-primary">{tr.register_password}</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            <p className="text-xs text-muted-foreground mt-1">{tr.register_password_hint}</p>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={submitting} className="btn btn-green h-auto w-full">
            {submitting ? tr.register_submitting : tr.register_submit}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground mt-6 text-center">
          {tr.register_have_account}{' '}
          <Link to="/login" className="font-bold text-[hsl(var(--brand-red))] underline-offset-4 hover:underline">
            {tr.register_login_link}
          </Link>
        </p>
      </div>
      </div>
    </div>
  );
}
