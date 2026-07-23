import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/AuthContext';
import { useLang } from '@/lib/LanguageContext';
import t from '@/lib/translations';
import { api } from '@/api/client';

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
    <div className="min-h-[70vh] flex items-center justify-center bg-background px-4 py-16">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg border border-slate-100">
        <h1 className="font-heading text-3xl text-primary mb-2">{tr.register_title}</h1>
        <p className="text-sm text-slate-500 mb-8">{tr.register_subtitle}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{tr.register_username}</label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} required autoFocus />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{tr.register_email}</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{tr.register_password}</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            <p className="text-xs text-slate-400 mt-1">{tr.register_password_hint}</p>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? tr.register_submitting : tr.register_submit}
          </Button>
        </form>

        <p className="text-sm text-slate-500 mt-6 text-center">
          {tr.register_have_account}{' '}
          <Link to="/login" className="text-accent font-medium hover:underline">
            {tr.register_login_link}
          </Link>
        </p>
      </div>
    </div>
  );
}
