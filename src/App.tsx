import React, { useEffect, useState } from 'react';
import { AdminCrmApp } from './components/AdminCrmApp';
import { StudentApp } from './components/StudentApp';

export default function App() {
  const [pathname, setPathname] = useState<string>(() => window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const isAdminRoute =
    pathname === '/admin' ||
    pathname.startsWith('/admin/') ||
    window.location.hash.startsWith('#/admin');

  if (isAdminRoute) {
    return <AdminCrmApp />;
  }

  return <StudentApp />;
}
