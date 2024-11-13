import { Button } from '@/components/ui/button';
import { DialogDescription, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { searchGifsService } from '@/services/search-gifs.service';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

interface GifSelectorProps {
  onSelect: (url: string) => void;
}

export default function GifSelector({ onSelect }: GifSelectorProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 350);

  const { data, mutate } = useMutation({
    mutationFn: searchGifsService,
  });

  useEffect(() => {
    if (debouncedQuery) {
      mutate({
        query: debouncedQuery,
      });
    }
  }, [debouncedQuery, mutate]);

  const loadMore = () => {
    if (!debouncedQuery || !data?.next) {
      return;
    }

    mutate({
      query: debouncedQuery,
      next: data.next,
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Search GIFs</DialogTitle>
        <DialogDescription className="sr-only">Search GIFs</DialogDescription>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search GIFs"
        />
      </DialogHeader>

      <div className="overflow-auto pr-1 grid grid-cols-3">
        {data?.results.map((gif) => (
          <button
            key={gif.id}
            type="button"
            onClick={() => onSelect(gif.media_formats.loopedmp4.url)}
          >
            <video
              src={gif.media_formats.loopedmp4.url}
              loop
              autoPlay
              muted
              playsInline
            />
          </button>
        ))}
      </div>
      {data?.next && (
        <Button type="button" variant="secondary" onClick={loadMore}>
          Load more
        </Button>
      )}
    </>
  );
}
