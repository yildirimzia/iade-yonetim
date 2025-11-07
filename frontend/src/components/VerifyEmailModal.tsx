'use client';

import { useState, useEffect, ChangeEvent } from 'react';

interface VerifyEmailModalProps {
  isOpen: boolean;
  email: string;
  onVerify: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
  onClose: () => void;
}

export default function VerifyEmailModal({
  isOpen,
  email,
  onVerify,
  onResend,
  onClose,
}: VerifyEmailModalProps) {
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [resendTimer, setResendTimer] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);

  // Timer for resend button
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  // Reset timer when modal opens
  useEffect(() => {
    if (isOpen) {
      setResendTimer(60);
      setCanResend(false);
      setCode(['', '', '', '', '', '']);
      setError('');
    }
  }, [isOpen]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }

    // Auto-submit when all fields are filled
    if (index === 5 && value) {
      const fullCode = newCode.join('');
      if (fullCode.length === 6) {
        handleVerify(fullCode);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (/^\d+$/.test(pastedData)) {
      const newCode = pastedData.split('').concat(['', '', '', '', '', '']).slice(0, 6);
      setCode(newCode);
      
      if (pastedData.length === 6) {
        handleVerify(pastedData);
      }
    }
  };

  const handleVerify = async (verificationCode?: string) => {
    const fullCode = verificationCode || code.join('');
    
    if (fullCode.length !== 6) {
      setError('Lütfen 6 haneli kodu girin');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onVerify(fullCode);
    } catch (err: any) {
      setError(err.message || 'Kod doğrulanamadı. Lütfen tekrar deneyin.');
      setCode(['', '', '', '', '', '']);
      document.getElementById('code-0')?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setLoading(true);
    setError('');

    try {
      await onResend();
      setResendTimer(60);
      setCanResend(false);
      setCode(['', '', '', '', '', '']);
      document.getElementById('code-0')?.focus();
    } catch (err: any) {
      setError(err.message || 'Kod gönderilemedi. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
          E-posta Doğrulama
        </h2>
        <p className="text-center text-gray-600 mb-8">
          <span className="font-medium">{email}</span> adresine gönderilen 6 haneli kodu girin
        </p>

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {/* Code inputs */}
        <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
          {code.map((digit, index) => (
            <input
              key={index}
              id={`code-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
              disabled={loading}
            />
          ))}
        </div>

        {/* Verify button */}
        <button
          onClick={() => handleVerify()}
          disabled={loading || code.join('').length !== 6}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          {loading ? 'Doğrulanıyor...' : 'Doğrula'}
        </button>

        {/* Resend button */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            Kod gelmedi mi?
          </p>
          <button
            onClick={handleResend}
            disabled={!canResend || loading}
            className="text-indigo-600 hover:text-indigo-700 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {canResend ? 'Tekrar Gönder' : `Tekrar gönder (${resendTimer}s)`}
          </button>
        </div>

        {/* Info */}
        <p className="text-xs text-gray-500 text-center mt-6">
          Kod 15 dakika geçerlidir
        </p>
      </div>
    </div>
  );
}
