'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store';
import { login } from '@/store/slices/authSlice';
import type { LoginFormData } from '@/types';
import { FaGoogle, FaDiscord, FaEye, FaEyeSlash } from 'react-icons/fa';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state: any) => state.auth.loading as boolean);
  const authError = useAppSelector((state: any) => state.auth.error as string | null);
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await dispatch(login(formData));
    
    if (login.fulfilled.match(result)) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Welcome Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 p-12 flex-col justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-12">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-white">İade Yönetim</span>
          </div>
          
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-6">İade Yönetim Sistemine Hoş Geldiniz</h1>
            <p className="text-lg text-indigo-100 mb-8">
              Profesyonel bir platform ile iade, envanter ve kargo süreçlerinizi kolayca yönetin. Hızlı, güvenli ve kullanıcı dostu arayüz ile işlerinizi daha verimli hale getirin.
            </p>
          </div>
        </div>

        {/* Company Logos */}
        {/* <div className="grid grid-cols-3 gap-6 opacity-70">
          <div className="text-white text-xl font-bold">accenture</div>
          <div className="text-white text-xl font-bold">AT&T</div>
          <div className="text-white text-xl font-bold">Bolt</div>
          <div className="text-white text-xl font-bold">SAMSUNG</div>
          <div className="text-white text-xl font-bold">aws</div>
          <div className="text-white text-xl font-bold">VISMA</div>
        </div> */}
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-gray-900">İade Yönetim</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Giriş Yap</h2>
            <p className="text-gray-600">
              Hesabınız yok mu?{' '}
              <Link href="/register" className="text-indigo-600 hover:text-indigo-700 font-medium">
                Kayıt ol
              </Link>
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              className="w-full flex items-center justify-center space-x-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaGoogle className="w-5 h-5 text-red-500" />
              <span className="text-gray-700 font-medium">Google ile devam et</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">veya</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {authError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {authError}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-posta adresi
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="ornek@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Şifre
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-12"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>

            <div className="text-center">
              <Link href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                Şifremi unuttum
              </Link>
            </div>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-800">Demo için: admin@test.com şifresi: 123456</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
