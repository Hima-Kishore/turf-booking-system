import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  showNumber?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StarRating({ rating, maxRating = 5, showNumber = false, size = 'md' }: StarRatingProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }, (_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= Math.round(rating);

        return (
          <Star
            key={i}
            className={`${sizeClasses[size]} ${
              isFilled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        );
      })}
      {showNumber && (
        <span className="text-sm font-medium ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}