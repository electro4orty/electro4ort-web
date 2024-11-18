export default function ChatMessagesInfo({
  children,
}: React.PropsWithChildren) {
  return (
    <p className="text-center text-muted-foreground text-sm py-2">{children}</p>
  );
}
