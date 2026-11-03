import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/AuthContext';
import { useLang } from '@/lib/LanguageContext';
import t from '@/lib/translations';
import Seo from '@/components/Seo';
import AuthShell, { Field } from '@/components/site/AuthShell';
import Cta from '@/components/site/Cta';

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
    <>
      <Seo title={tr.login_title} canonicalPath="/login" noindex />
      <AuthShell
        title={tr.login_title}
        subtitle={tr.login_subtitle}
        footer={
          <p>
            {tr.login_no_account}{' '}
            <Link to="/register" className="font-bold text-night underline decoration-accent decoration-2 underline-offset-4 hover:text-pitch">
              {tr.login_register_link}
            </Link>
          </p>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label={tr.login_username}>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} required autoFocus autoComplete="username" />
          </Field>
          <Field label={tr.login_password}>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
          </Field>

          {error && <p role="alert" className="text-sm font-bold text-brand-red">{error}</p>}

          <Cta type="submit" tone="night" size="lg" magnetic={false} disabled={submitting} className="w-full">
            {submitting ? tr.login_submitting : tr.login_submit}
          </Cta>
        </form>
      </AuthShell>
    </>
  );
}
