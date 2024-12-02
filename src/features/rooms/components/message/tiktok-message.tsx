import { useQuery } from '@tanstack/react-query';

interface TiktokMessageProps {
  url: string;
}

export default function TiktokMessage({ url }: TiktokMessageProps) {
  const { data, isError } = useQuery({
    queryKey: ['tiktok', url],
    queryFn: async () => {
      const res = await fetch(`https://www.tiktok.com/oembed?url=${url}`);
      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = (await res.json()) as {
        embed_product_id: string;
        html: string;
      };
      return data;
    },
    refetchInterval: false,
    refetchOnWindowFocus: false,
    retry: false,
  });

  if (isError) {
    return <span>TikTok failed to load</span>;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="mb-1 break-dance">
      <div className="rounded-md overflow-hidden">
        <iframe
          src={`https://www.tiktok.com/player/v1/${data.embed_product_id}`}
          width="100%"
          className="w-full lg:min-w-[400px] h-[400px] lg:h-[600px]"
        />
      </div>
      <div
        dangerouslySetInnerHTML={{
          __html: data.html,
        }}
        className="[&>.tiktok-embed]:!min-w-0"
      />
    </div>
  );
}
