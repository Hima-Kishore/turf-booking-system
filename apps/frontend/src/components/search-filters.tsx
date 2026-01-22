'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search, X } from 'lucide-react';

interface SearchFiltersProps {
  onSearch: (filters: {
    city?: string;
    sportType?: string;
    minPrice?: number;
    maxPrice?: number;
    date?: string;
  }) => void;
  isLoading?: boolean;
}

export function SearchFilters({ onSearch, isLoading }: SearchFiltersProps) {
  const [city, setCity] = useState('');
  const [sportType, setSportType] = useState<string>('');
  const [priceRange, setPriceRange] = useState<number[]>([0, 5000]);
  const [date, setDate] = useState('');

  const handleSearch = () => {
    onSearch({
      city: city || undefined,
      sportType: sportType || undefined,
      minPrice: priceRange[0] || undefined,
      maxPrice: priceRange[1] || undefined,
      date: date || undefined,
    });
  };

  const handleReset = () => {
    setCity('');
    setSportType('');
    setPriceRange([0, 5000]);
    setDate('');
    onSearch({});
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search & Filter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* City Search */}
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Sport Type Filter */}
        <div className="space-y-2">
          <Label htmlFor="sport">Sport Type</Label>
          <Select value={sportType} onValueChange={setSportType} disabled={isLoading}>
            <SelectTrigger id="sport">
              <SelectValue placeholder="Select sport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cricket">Cricket</SelectItem>
              <SelectItem value="football">Football</SelectItem>
              <SelectItem value="badminton">Badminton</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Filter */}
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            disabled={isLoading}
          />
        </div>

        {/* Price Range Slider */}
        <div className="space-y-4">
          <Label>Price Range (per hour)</Label>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              min={0}
              max={5000}
              step={100}
              disabled={isLoading}
              className="w-full"
            />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button
            onClick={handleSearch}
            className="flex-1"
            disabled={isLoading}
          >
            <Search className="h-4 w-4 mr-2" />
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            disabled={isLoading}
          >
            <X className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}