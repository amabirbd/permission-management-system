'use client';

import { FormEvent, useState } from 'react';
import { ApiError, api } from '../lib/api';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), password })
      }) as { accessToken: string };
      window.sessionStorage.setItem('access_token', result.accessToken);
      window.location.href = '/dashboard';
    } catch (caught) {
      if (caught instanceof ApiError && caught.status === 401) {
        setError('Invalid email or password. Please try again.');
      } else if (caught instanceof Error) {
        setError(caught.message || 'Unable to login right now. Please try again.');
      } else {
        setError('Unable to login right now. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-[18px]" onSubmit={handleSubmit} noValidate>
      <div>
        <label className="block text-[13px] font-semibold text-[#575966]" htmlFor="email">Email</label>
        <input className={`mt-2 h-[46px] w-full rounded-[11px] border bg-white px-4 text-[13px] text-[#2c2d35] outline-none transition placeholder:text-[#bec1cb] focus:border-[#ff6845] focus:ring-4 focus:ring-[#ff6845]/10 ${error ? 'border-[#ff6845]' : 'border-[#e7e8ee]'}`} id="email" onChange={(event) => setEmail(event.target.value)} placeholder="example@email.com" type="email" value={email} />
      </div>
      <div>
        <label className="block text-[13px] font-semibold text-[#575966]" htmlFor="password">Password</label>
        <div className="relative mt-2">
          <input className={`h-[46px] w-full rounded-[11px] border bg-white px-4 pr-11 text-[13px] text-[#2c2d35] outline-none transition placeholder:text-[#bec1cb] focus:border-[#ff6845] focus:ring-4 focus:ring-[#ff6845]/10 ${error ? 'border-[#ff6845]' : 'border-[#e7e8ee]'}`} id="password" onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" type="password" value={password} />
          <span className="absolute right-4 top-1/2 h-2.5 w-4 -translate-y-1/2 rounded-full border-2 border-[#c9ccd4]" />
        </div>
      </div>

      <div className="flex items-center justify-between pt-0.5 text-[12px]">
        <label className="flex items-center gap-2 font-medium text-[#858895]">
          <input className="h-[14px] w-[14px] rounded-[3px] border-[#dfe1e8] accent-[#ff6845]" type="checkbox" />
          Remember me
        </label>
        <a className="font-semibold text-[#ff6845]" href="#">Forgot password?</a>
      </div>

      {error ? (
        <div className="rounded-[11px] border border-[#ffd5cb] bg-[#fff4f1] px-4 py-3 text-[12px] font-semibold text-[#d94324]" role="alert" aria-live="polite">
          {error}
        </div>
      ) : null}

      <button className="mt-7 h-[46px] w-full rounded-[11px] bg-[#ff6845] text-[13px] font-bold text-white shadow-[0_16px_26px_rgba(255,104,69,0.36)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#ff5d38] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Logging in...' : 'Log in'}
      </button>

      <p className="pt-6 text-center text-[13px] font-medium text-[#858895]">
        Don&apos;t have an account? <a className="font-bold text-[#30313b]" href="#">Sign up</a>
      </p>
    </form>
  );
}
