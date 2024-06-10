import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Carrera',
};

export default function Carrera({
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
      <h1>Tabla carrera</h1>
      <p>Query: {query}</p>
      <p>Página: {page}</p>
    </>
  );
}
