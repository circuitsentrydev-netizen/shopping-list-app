import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type SortField = 'name' | 'quantity' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

type SortSearchContextValue = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  sortBy: SortField;
  setSortBy: (value: SortField) => void;
  sortDirection: SortDirection;
  setSortDirection: (value: SortDirection) => void;
  sortAndFilterItems: <T extends Record<string, unknown>>(
    items: T[],
    searchKeys?: string[]
  ) => T[];
};

const SortSearchContext = createContext<SortSearchContextValue | undefined>(
  undefined
);

type SortSearchProviderProps = {
  children: ReactNode;
  initialSearch?: string;
  initialSortBy?: SortField;
  initialDirection?: SortDirection;
};

export function SortSearchProvider({
  children,
  initialSearch = '',
  initialSortBy = 'name',
  initialDirection = 'asc',
}: SortSearchProviderProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortBy, setSortBy] = useState<SortField>(initialSortBy);
  const [sortDirection, setSortDirection] =
    useState<SortDirection>(initialDirection);

  const sortAndFilterItems = useMemo(() => {
    return <T extends Record<string, unknown>>(
      items: T[],
      searchKeys: string[] = ['name']
    ) => {
      const normalizedSearch = searchTerm.trim().toLowerCase();

      const filtered = items.filter((item) => {
        if (!normalizedSearch) return true;

        return searchKeys.some((key) => {
          const value = item[key];
          return String(value ?? '').toLowerCase().includes(normalizedSearch);
        });
      });

      return filtered.sort((a, b) => {
        const left = a[sortBy];
        const right = b[sortBy];

        if (left == null && right == null) return 0;
        if (left == null) return 1;
        if (right == null) return -1;

        const multiplier = sortDirection === 'asc' ? 1 : -1;

        if (typeof left === 'number' && typeof right === 'number') {
          return (left - right) * multiplier;
        }

        return String(left).localeCompare(String(right)) * multiplier;
      });
    };
  }, [searchTerm, sortBy, sortDirection]);

  const value = useMemo<SortSearchContextValue>(
    () => ({
      searchTerm,
      setSearchTerm,
      sortBy,
      setSortBy,
      sortDirection,
      setSortDirection,
      sortAndFilterItems,
    }),
    [searchTerm, sortBy, sortDirection, sortAndFilterItems]
  );

  return (
    <SortSearchContext.Provider value={value}>
      {children}
    </SortSearchContext.Provider>
  );
}

// Alias for compatibility with other imports
export const SearchSortProvider = SortSearchProvider;

export function useSortSearch() {
  const context = useContext(SortSearchContext);

  if (!context) {
    throw new Error('useSortSearch must be used inside a SortSearchProvider');
  }

  return context;
}

// Alias for compatibility with other imports
export const useSearchSort = useSortSearch;
