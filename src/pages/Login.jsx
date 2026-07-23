import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/AuthContext';
import { useLang } from '@/lib/LanguageContext';
import t from '@/lib/translations';

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
    <div className="min-h-[70vh] flex items-center justify-center bg-background px-4 py-16">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg border border-slate-100">
        <h1 className="font-heading text-3xl text-primary mb-2">{tr.login_title}</h1>
        <p className="text-sm text-slate-500 mb-8">{tr.login_subtitle}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{tr.login_username}</label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} required autoFocus />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{tr.login_password}</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? tr.login_submitting : tr.login_submit}
          </Button>
        </form>

        <p className="text-sm text-slate-500 mt-6 text-center">
          {tr.login_no_account}{' '}
          <Link to="/register" className="text-accent font-medium hover:underline">
            {tr.login_register_link}
          </Link>
        </p>
      </div>
    </div>
  );
}
