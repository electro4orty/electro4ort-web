import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = (props: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      duration={5000}
      visibleToasts={3}
      style={
        {
          '--toast-close-button-start': 'unset',
          '--toast-close-button-end': '0',
          '--toast-close-button-transform': 'translate(35%, -35%)',
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          closeButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      closeButton
      position="top-center"
      {...props}
    />
  );
};

export { Toaster };
