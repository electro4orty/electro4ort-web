interface GifMessageProps {
  url: string;
}

export default function GifMessage({ url }: GifMessageProps) {
  return <video src={url} autoPlay loop muted playsInline />;
}
