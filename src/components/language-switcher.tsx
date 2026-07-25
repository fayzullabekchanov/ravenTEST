// 'use client';
// import { usePathname, useSearchParams } from 'next/navigation';
// import { locales, localeLabels, type Locale } from '@/lib/i18n';
//
// export function LanguageSwitcher({ current }: { current: Locale }) {
//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const query = searchParams.toString();
//   const redirect = encodeURIComponent(query ? `${pathname}?${query}` : pathname);
//
//   return (
//     <div className="lang-switch">
//       {locales.map((locale) => (
//         <a
//           key={locale}
//           href={`/api/locale?locale=${locale}&redirect=${redirect}`}
//           className={`lang-option ${locale === current ? 'active' : ''}`}
//         >
//           {localeLabels[locale]}
//         </a>
//       ))}
//     </div>
//   );
// }


'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { locales, localeLabels, type Locale } from '@/lib/i18n';

export function LanguageSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.toString();
  const redirect = encodeURIComponent(query ? `${pathname}?${query}` : pathname);

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
      <div className="lang-dropdown" ref={ref}>
        <button
            type="button"
            className="lang-current"
            onClick={() => setOpen(!open)}
        >
          <span>{localeLabels[current]}</span>
          <span className={open ? 'arrow open' : 'arrow'}>▼</span>
        </button>

        {open && (
            <div className="lang-menu">
              {locales
                  .filter((locale) => locale !== current)
                  .map((locale) => (
                      <a
                          key={locale}
                          href={`/api/locale?locale=${locale}&redirect=${redirect}`}
                          className="lang-item"
                      >
                        {localeLabels[locale]}
                      </a>
                  ))}
            </div>
        )}
      </div>
  );
}