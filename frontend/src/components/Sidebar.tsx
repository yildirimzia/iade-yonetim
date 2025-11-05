'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import type { UserRole } from '@/types';

interface NavigationItem {
  name: string;
  href: string;
  icon: string;
  roles: UserRole[];
}

export default function Sidebar() {
  const pathname = usePathname();
  const userIsAdmin = isAdmin();

  const navigation: NavigationItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: '📊',
      roles: ['admin', 'seller'],
    },
    {
      name: 'Ürünlerim',
      href: '/products',
      icon: '📦',
      roles: ['seller'],
    },
    {
      name: 'İadeler',
      href: '/returns',
      icon: '↩️',
      roles: ['admin', 'seller'],
    },
    {
      name: 'Envanter',
      href: '/inventory',
      icon: '🗃️',
      roles: ['admin'],
    },
    {
      name: 'Kargolar',
      href: '/shipments',
      icon: '🚚',
      roles: ['admin'],
    },
    {
      name: 'Kullanıcılar',
      href: '/dashboard/users',
      icon: '👥',
      roles: ['admin'],
    },
    {
      name: 'Satıcı Ürünleri',
      href: '/dashboard/products',
      icon: '📦',
      roles: ['admin'],
    },
    {
      name: 'Profil',
      href: '/profile',
      icon: '👤',
      roles: ['admin', 'seller'],
    },
  ];

  const filteredNavigation = navigation.filter((item) =>
    userIsAdmin ? item.roles.includes('admin') : item.roles.includes('seller')
  );

  return (
    <aside className="w-64 bg-gray-800 min-h-screen">
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors
                  ${
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }
                `}
              >
                <span className="mr-3 text-xl">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
