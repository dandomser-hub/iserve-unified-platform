import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface FormFieldProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({ label, error, hint, required, children }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & { error?: boolean };

export function Input({ className = '', error, ...props }: InputProps) {
  return (
    <input
      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-colors ${error ? 'border-red-400 bg-red-50' : 'border-slate-300'} ${className}`}
      {...props}
    />
  );
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean };

export function Select({ className = '', error, children, ...props }: SelectProps) {
  return (
    <select
      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-colors bg-white ${error ? 'border-red-400' : 'border-slate-300'} ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean };

export function Textarea({ className = '', error, ...props }: TextareaProps) {
  return (
    <textarea
      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-colors resize-none ${error ? 'border-red-400 bg-red-50' : 'border-slate-300'} ${className}`}
      rows={3}
      {...props}
    />
  );
}
