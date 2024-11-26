import { useEffect, useState } from 'react';

interface TiktokMessageProps {
  url: string;
}

export default function TiktokMessage({ url }: TiktokMessageProps) {
  const [tikTok, setTikTok] = useState<{
    embed_product_id: string;
    html: string;
  } | null>(null);

  useEffect(() => {
    fetch(`https://www.tiktok.com/oembed?url=${url}`)
      .then((res) => res.json())
      .then((data) => {
        setTikTok(
          data as {
            embed_product_id: string;
            html: string;
          }
        );
      });
  }, [url]);

  return (
    <div className="mb-1 break-dance">
      <div className="rounded-md overflow-hidden">
        {tikTok && (
          <iframe
            src={`https://www.tiktok.com/player/v1/${tikTok.embed_product_id}`}
            width="100%"
            className="w-full lg:min-w-[400px] h-[400px] lg:h-[600px]"
          />
        )}
      </div>
      {tikTok && (
        <div
          dangerouslySetInnerHTML={{
            __html: tikTok.html,
          }}
          className="[&>.tiktok-embed]:!min-w-0"
        />
      )}
    </div>
  );
}
