'use client';

import { useLocale } from 'next-intl';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useTransition } from 'react';

const LanguageSwitcher = () => {
  const [, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const localeActive = useLocale();

  const toggleLocale = () => {
    const nextLocale = localeActive === 'en' ? 'ge' : 'en';
    startTransition(() => {
      const newPath = `/${nextLocale}${pathname.replace(/^\/[a-zA-Z]+/, '')}`;
      const query = searchParams?.toString();
      router.replace(`${newPath}${query ? `?${query}` : ''}`);
    });
  };

  return (
    <button
      onClick={toggleLocale}
      className="px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg border border-gray-200"
    >
      {localeActive === 'en' ? 'ქართული | English' : 'ქართული | English'}
    </button>
  );
};

export default LanguageSwitcher;

