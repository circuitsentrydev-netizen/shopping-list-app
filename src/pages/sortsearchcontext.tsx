import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';

interface ContextType {
  searchQuery: string;
    sortBy: string;
      setSearchQuery: (val: string) => void;
        setSortBy: (val: string) => void;
        }

        const SearchSortContext = createContext<ContextType | undefined>(undefined);

        export function SearchSortProvider({ children }: { children: ReactNode }) {
          const [searchParams, setSearchParams] = useSearchParams();
            
              const searchQuery = searchParams.get('q') || '';
                const sortBy = searchParams.get('sort') || 'name';

                  const setSearchQuery = (val: string) => {
                      if (val) searchParams.set('q', val);
                          else searchParams.delete('q');
                              setSearchParams(searchParams);
                                };

                                  const setSortBy = (val: string) => {
                                      searchParams.set('sort', val);
                                          setSearchParams(searchParams);
                                            };

                                              return (
                                                  <SearchSortContext.Provider value={{ searchQuery, sortBy, setSearchQuery, setSortBy }}>
                                                        {children}
                                                            </SearchSortContext.Provider>
                                                              );
                                                              }

                                                              export const useSearchSort = () => {
                                                                const context = useContext(SearchSortContext);
                                                                  if (!context) throw new Error('useSearchSort must be used within Provider');
                                                                    return context;
                                                                    };
                                                                    