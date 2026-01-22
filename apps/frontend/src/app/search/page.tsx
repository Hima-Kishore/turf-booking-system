'use client';

import { useState } from 'react';
import { useSearchTurfs } from '@/hooks/use-search';
import { SearchFilters } from '@/components/search-filters';
import { TurfCard } from '@/components/turf-card';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const [filters, setFilters] = useState({});
  const { data: turfs, isLoading, error, refetch } = useSearchTurfs(filters);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSearch = (newFilters: any) => {
    setFilters(newFilters);
    refetch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Search Turfs</h1>
          <p className="text-muted-foreground">
            Find the perfect turf for your game
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <SearchFilters onSearch={handleSearch} isLoading={isLoading} />
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Loading State */}
            {isLoading && (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Searching for turfs...</p>
                </CardContent>
              </Card>
            )}

            {/* Error State */}
            {error && (
              <Card className="border-destructive">
                <CardContent className="py-12 text-center">
                  <p className="text-destructive">
                    Error: {error.message}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* No Results Yet */}
            {!isLoading && !error && !turfs && (
              <Card>
                <CardContent className="py-12 text-center space-y-4">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Start Your Search
                    </h3>
                    <p className="text-muted-foreground">
                      Use the filters on the left to find turfs near you
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* No Results Found */}
            {!isLoading && !error && turfs && turfs.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center space-y-4">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      No Turfs Found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your filters or search in a different city
                    </p>
                    <Button variant="outline" onClick={() => handleSearch({})}>
                      Clear Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results Grid */}
            {!isLoading && turfs && turfs.length > 0 && (
              <>
                <div className="mb-4 text-sm text-muted-foreground">
                  Found {turfs.length} turf{turfs.length !== 1 ? 's' : ''}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {turfs.map((turf) => (
                    <TurfCard key={turf.id} turf={turf} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}