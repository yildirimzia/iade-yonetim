'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import { isAdmin } from '@/lib/auth';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchUsers } from '@/store/slices/usersSlice';

export default function UsersPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Redux state
  const users = useAppSelector((state: any) => state.users.items as User[]) || [];
  const loading = useAppSelector((state: any) => state.users.loading as boolean);
  const error = useAppSelector((state: any) => state.users.error as string | null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'admin' | 'seller'>('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  useEffect(() => {
    // Sadece adminler erişebilir
    if (!isAdmin()) {
      router.push('/dashboard');
      return;
    }

    dispatch(fetchUsers({ page: 1, limit: 100 }));
  }, [router, dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="relative inline-flex">
            <div className="w-16 h-16 border-4 border-indigo-200 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-indigo-600 rounded-full animate-spin border-t-transparent absolute top-0 left-0"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  // Filter users based on tab
  const filteredUsers = users.filter(user => {
    if (filterTab === 'admin') return user.role === 'admin';
    if (filterTab === 'seller') return user.role === 'seller';
    return true;
  }).filter(user => {
    if (!searchQuery) return true;
    return user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (user.phone && user.phone.includes(searchQuery));
  });

  const allCount = users.length;
  const adminCount = users.filter(u => u.role === 'admin').length;
  const sellerCount = users.filter(u => u.role === 'seller').length;

  return (
    <div className="h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg flex items-center space-x-2 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6 flex items-center justify-between">
        <div>
          <nav className="flex space-x-8">
            <button
              onClick={() => setFilterTab('all')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                filterTab === 'all'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All <span className="ml-2 text-gray-400">{allCount}</span>
            </button>
            <button
              onClick={() => setFilterTab('admin')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                filterTab === 'admin'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Admin <span className="ml-2 text-gray-400">{adminCount}</span>
            </button>
            <button
              onClick={() => setFilterTab('seller')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                filterTab === 'seller'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Seller <span className="ml-2 text-gray-400">{sellerCount}</span>
            </button>
          <div className="flex items-center space-x-3 mb-6">
            <div className="flex-1"></div>
          </div>
          </nav>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2 min-w-[140px] justify-between "
          >
            <span>
              {sortBy === 'newest' && 'En yeni'}
              {sortBy === 'oldest' && 'En eski'}
              {sortBy === 'name-asc' && 'İsim A-Z'}
              {sortBy === 'name-desc' && 'İsim Z-A'}
            </span>
            <svg 
              className={`w-4 h-4 text-gray-400 transition-transform ${isSortDropdownOpen ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isSortDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsSortDropdownOpen(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                <button
                  onClick={() => {
                    setSortBy('newest');
                    setIsSortDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                    sortBy === 'newest' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'
                  }`}
                >
                  En yeni
                </button>
                <button
                  onClick={() => {
                    setSortBy('oldest');
                    setIsSortDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                    sortBy === 'oldest' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'
                  }`}
                >
                  En eski
                </button>
                <button
                  onClick={() => {
                    setSortBy('name-asc');
                    setIsSortDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                    sortBy === 'name-asc' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'
                  }`}
                >
                  İsim A-Z
                </button>
                <button
                  onClick={() => {
                    setSortBy('name-desc');
                    setIsSortDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                    sortBy === 'name-desc' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'
                  }`}
                >
                  İsim Z-A
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created at</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <Link 
                        href={`/dashboard/users/${user.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-indigo-600"
                      >
                        {user.name}
                      </Link>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.phone || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.created_at!).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role === 'admin' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      user.role === 'admin' ? 'bg-green-500' : 'bg-blue-500'
                    }`}></span>
                    {user.role === 'admin' ? 'Admin' : 'Seller'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Rows per page:{' '}
            <select className="border-0 text-gray-700 font-medium focus:ring-0">
              <option>5</option>
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
          </div>
          <div className="text-sm text-gray-500">
            1-{filteredUsers.length} of {filteredUsers.length}
          </div>
        </div>
      </div>
    </div>
  );
}