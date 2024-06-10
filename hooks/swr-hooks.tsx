import useSWR from 'swr';

const fetcher = async (...args: Parameters<typeof fetch>) => {
  const res = await fetch(...args);
  return res.json();
};
export function useProfesorById(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/profesor?id=${id}`,
    fetcher,
  );

  return {
    profesor: data,
    isLoading,
    isError: error,
    mutateProfesor: mutate,
  };
}
export function useProfesors(query?: string, page?: number) {
  if (!page && !query) {
    const { data, error, isLoading, mutate } = useSWR('/api/profesor', fetcher);
    return {
      profesors: data,
      isLoading,
      isError: error,
      mutateProfesors: mutate,
    };
  } else if (page && !query) {
    const { data, error, isLoading, mutate } = useSWR(
      `/api/profesor?page=${page}`,
      fetcher,
    );
    return {
      profesors: data,
      isLoading,
      isError: error,
      mutateProfesors: mutate,
    };
  } else if (query && !page) {
    const { data, error, isLoading, mutate } = useSWR(
      `/api/profesor?query=${query}`,
      fetcher,
    );
    return {
      profesors: data,
      isLoading,
      isError: error,
      mutateProfesors: mutate,
    };
  } else {
    const { data, error, isLoading, mutate } = useSWR(
      `/api/profesor?page=${page}&query=${query}`,
      fetcher,
    );
    return {
      profesors: data,
      isLoading,
      isError: error,
      mutateProfesors: mutate,
    };
  }
}
export function useTotalProfesors() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/count/profesor',
    fetcher,
  );

  return {
    totalProfesors: data,
    isLoading,
    isError: error,
    mutateTotalProfesors: mutate,
  };
}
export function useTotalProfesorsPages(query?: string) {
  if (!query) {
    const { data, error, isLoading, mutate } = useSWR(
      '/api/count/profesor/pages',
      fetcher,
    );
    return {
      totalProfesorsPages: data,
      isLoading,
      isError: error,
      mutateTotalProfesorsPages: mutate,
    };
  } else {
    const { data, error, isLoading, mutate } = useSWR(
      `/api/count/profesor/pages?query=${query}`,
      fetcher,
    );
    return {
      totalProfesorsPages: data,
      isLoading,
      isError: error,
      mutateTotalProfesorsPages: mutate,
    };
  }
}

// AULAS

export function useAulasById(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/aula?id=${id}`,
    fetcher,
  );

  return {
    aula: data,
    isLoading,
    isError: error,
    mutateAula: mutate,
  };
}

export function useAulas(query?: string, page?: number) {
  if (!page && !query) {
    const { data, error, isLoading, mutate } = useSWR('/api/aula', fetcher);
    return {
      aulas: data,
      isLoading,
      isError: error,
      mutateAulas: mutate,
    };
  } else if (page && !query) {
    const { data, error, isLoading, mutate } = useSWR(
      `/api/aula?page=${page}`,
      fetcher,
    );
    return {
      aulas: data,
      isLoading,
      isError: error,
      mutateAulas: mutate,
    };
  } else if (query && !page) {
    const { data, error, isLoading, mutate } = useSWR(
      `/api/aula?query=${query}`,
      fetcher,
    );
    return {
      aulas: data,
      isLoading,
      isError: error,
      mutateAulas: mutate,
    };
  } else {
    const { data, error, isLoading, mutate } = useSWR(
      `/api/aula?page=${page}&query=${query}`,
      fetcher,
    );
    return {
      aulas: data,
      isLoading,
      isError: error,
      mutateAulas: mutate,
    };
  }
}

export function useTotalAulas() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/count/aula',
    fetcher,
  );

  return {
    totalAulas: data,
    isLoading,
    isError: error,
    mutateTotalAulas: mutate,
  };
}

export function useTotalAulasPages(query?: string) {
  if (!query) {
    const { data, error, isLoading, mutate } = useSWR(
      '/api/count/aula/pages',
      fetcher,
    );
    return {
      totalAulasPages: data,
      isLoading,
      isError: error,
      mutateTotalAulasPages: mutate,
    };
  } else {
    const { data, error, isLoading, mutate } = useSWR(
      `/api/count/aula/pages?query=${query}`,
      fetcher,
    );
    return {
      totalAulasPages: data,
      isLoading,
      isError: error,
      mutateTotalAulasPages: mutate,
    };
  }
}
