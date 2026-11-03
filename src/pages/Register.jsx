import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/AuthContext';
import { useLang } from '@/lib/LanguageContext';
import t from '@/lib/translations';
import { api } from '@/api/client';
import Seo from '@/components/Seo';
import AuthShell, { Field } from '@/components/site/AuthShell';
import Cta from '@/components/site/Cta';

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
    <>
      <Seo title={tr.register_title} canonicalPath="/register" noindex />
      <AuthShell
        title={tr.register_title}
        subtitle={tr.register_subtitle}
        footer={
          <p>
            {tr.register_have_account}{' '}
            <Link to="/login" className="font-bold text-night underline decoration-accent decoration-2 underline-offset-4 hover:text-pitch">
              {tr.register_login_link}
            </Link>
          </p>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label={tr.register_username}>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} required autoFocus autoComplete="username" />
          </Field>
          <Field label={tr.register_email}>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </Field>
          <Field label={tr.register_password} hint={tr.register_password_hint}>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} autoComplete="new-password" />
          </Field>

          {error && <p role="alert" className="text-sm font-bold text-brand-red">{error}</p>}

          <Cta type="submit" tone="night" size="lg" magnetic={false} disabled={submitting} className="w-full">
            {submitting ? tr.register_submitting : tr.register_submit}
          </Cta>
        </form>
      </AuthShell>
    </>
  );
}
