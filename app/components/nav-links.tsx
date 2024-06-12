'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
  { href: 'https://www.unrn.edu.ar/home', label: 'UNRN' },
  { href: 'https://guarani.unrn.edu.ar/', label: 'SIU Guaraní' },
  { href: '/contacto', label: 'Contacto' },
  { href: '/login', label: 'Acceder' },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <nav className=" hover:text-pr mx-4 flex flex-row gap-3">
      {links.map(({ href, label }) => (
        <Link
          key={`${href}${label}`}
          href={href}
          className={clsx(
            'px-2 py-3 transition-colors duration-150 ease-in-out hover:text-primary',
            {
              'text-primary': pathname === href,
            },
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
