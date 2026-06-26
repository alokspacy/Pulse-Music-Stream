'use client';

import { ui } from '@/lib/styles';
import { cn } from '@/lib/utils';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';

// Field
interface AuthformFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'password';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon: ReactNode;
  required?: boolean;
  autoComplete?: string;
  minLength?: number;
  maxLength?: number;
  hint?: ReactNode;
  describedBy?: string;
}

export function AuthFormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  icon,
  required,
  autoComplete,
  minLength,
  maxLength,
  hint,
  describedBy,
}: AuthformFieldProps) {
  const isPassword = type === 'password';
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={ui.authLabel}>
        {label}
      </label>
      <div className="group relative">
        <span className={ui.authInputIcon} aria-hidden>
          {icon}
        </span>
        <input
          id={id}
          type={isPassword && showPassword ? 'text' : type}
          name={id}
          required={required}
          autoComplete={autoComplete}
          minLength={minLength}
          maxLength={maxLength}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-describedby={describedBy}
          className={cn(ui.authInput, isPassword ? 'pr-12' : 'pr-4')}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
            className={ui.authPasswordToggle}>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {hint}
    </div>
  );
}

// Error panel
export function AuthErrorPanel({ message }: { message: string }) {
  return (
    <div role="alert" className={ui.authError}>
      <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden />
      <span>{message}</span>
    </div>
  );
}

// Submit button
interface AuthSubmitButtonProps {
  pending: boolean;
  pendingLabel: string;
  children: ReactNode;
}

export function AuthSubmitButton({
  pending,
  pendingLabel,
  children,
}: AuthSubmitButtonProps) {
  return (
    <button type="submit" disabled={pending} className={ui.authSubmit}>
      {pending ? pendingLabel : children}
    </button>
  );
}

// Password strength (register only)
function scorePassword(pw: string): number {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

const STRENGTH_LABELS = ['Too short', 'Weak', 'Okay', 'Strong', 'Excellent'];
const STRENGTH_COLORS = [
  'bg-white/15',
  'bg-red-500',
  'bg-amber-500',
  'bg-yellow-400',
  'bg-pulse-accent-bright',
];

export function PasswordStrengthMeter({
  password,
  id,
}: {
  password: string;
  id: string;
}) {
  const strength = useMemo(() => scorePassword(password), [password]);
  return (
    <div id={id} className="flex items-center gap-3 pt-1" aria-live="polite">
      <div className="flex flex-1 gap-1.5" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors',
              i < strength ? STRENGTH_COLORS[strength] : 'bg-white/10',
            )}
          />
        ))}
      </div>
      <span
        className={cn(
          'min-w-22 text-right text-xs font-semibold tabular-nums',
          strength >= 3
            ? 'text-pulse-accent-bright'
            : strength === 2
              ? 'text-yellow-300'
              : 'text-text-subdued',
        )}>
        {password ? STRENGTH_LABELS[strength] : '8+ characters'}
      </span>
    </div>
  );
}
