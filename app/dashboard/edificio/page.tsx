import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edificio',
};

export default function Edificio({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const { query, page } = searchParams || {};
  return (
    <>
      <h1>Tabla edificio</h1>
      <p>Query: {query}</p>
      <p>Página: {page}</p>
    </>
  );
}
