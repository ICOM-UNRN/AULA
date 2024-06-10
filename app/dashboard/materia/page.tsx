import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Materia',
};

export default function Materia({
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
      <h1>Tabla materia</h1>
      <p>Query: {query}</p>
      <p>Página: {page}</p>
    </>
  );
}
