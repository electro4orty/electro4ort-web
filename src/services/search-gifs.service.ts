import { tenorClient } from '@/lib/tenor-client';
import { TenorResponse } from '@/types/tenor';

interface SearchGifsArgs {
  query: string;
  next?: string;
}

export async function searchGifsService(args: SearchGifsArgs) {
  const res = await tenorClient.get<TenorResponse>('/search', {
    params: {
      q: args.query,
      pos: args.next,
    },
  });

  return res.data;
}
