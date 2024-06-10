import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aula',
};

export default function Aula({
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
      <h1>Tabla aula</h1>
      <p>Query: {query}</p>
      <p>Página: {page}</p>
    </>
  );
}
