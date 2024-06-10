'use client';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Input } from '@/app/components/form/input';
import { useTotalProfesorsPages } from '@/hooks/swr-hooks';

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const { mutateTotalProfesorsPages } = useTotalProfesorsPages();
  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    mutateTotalProfesorsPages();
    replace(`${pathname}?${params.toString()}`);
  }, 300);
  return (
    <Input
      isClearable
      className="w-full rounded-md"
      placeholder={placeholder}
      onClear={() => {
        handleSearch('');
      }}
      onChange={(e) => {
        handleSearch(e.target.value);
      }}
      defaultValue={searchParams.get('query')?.toString()}
      startContent={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
    />
  );
}
