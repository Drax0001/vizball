import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ value = 0, count = 0, interactive = false, onRate, size = 18 }) {
  const [hovered, setHovered] = useState(0);
  const display = interactive && hovered ? hovered : Math.round(value);

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center gap-0.5"
        onMouseLeave={() => interactive && setHovered(0)}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRate?.(n)}
            onMouseEnter={() => interactive && setHovered(n)}
            className={interactive ? 'cursor-pointer' : 'cursor-default'}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
          >
            <Star
              size={size}
              className={n <= display ? 'text-accent' : 'text-white/20'}
              fill={n <= display ? 'currentColor' : 'none'}
            />
          </button>
        ))}
      </div>
      {count > 0 && (
        <span className="font-body text-xs text-white/40">
          {value.toFixed(1)} ({count})
        </span>
      )}
    </div>
  );
}
