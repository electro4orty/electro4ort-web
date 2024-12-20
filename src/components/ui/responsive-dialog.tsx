import {
  DialogCloseProps,
  DialogContentProps,
  DialogDescriptionProps,
  DialogOverlayProps,
  DialogPortalProps,
  DialogProps,
  DialogTitleProps,
  DialogTriggerProps,
} from '@radix-ui/react-dialog';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from './dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from './drawer';
import { useIsMobile } from '@/hooks/use-mobile';

function ResponsiveDialog(props: DialogProps) {
  const isMobile = useIsMobile();

  return isMobile ? <Drawer {...props} /> : <Dialog {...props} />;
}

function ResponsiveDialogClose(props: DialogCloseProps) {
  const isMobile = useIsMobile();

  return isMobile ? <DrawerClose {...props} /> : <DialogClose {...props} />;
}

function ResponsiveDialogContent(props: DialogContentProps) {
  const isMobile = useIsMobile();

  return isMobile ? <DrawerContent {...props} /> : <DialogContent {...props} />;
}

function ResponsiveDialogDescription(props: DialogDescriptionProps) {
  const isMobile = useIsMobile();

  return isMobile ? (
    <DrawerDescription {...props} />
  ) : (
    <DialogDescription {...props} />
  );
}

function ResponsiveDialogFooter(props: React.HTMLAttributes<HTMLDivElement>) {
  const isMobile = useIsMobile();

  return isMobile ? <DrawerFooter {...props} /> : <DialogFooter {...props} />;
}

function ResponsiveDialogHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  const isMobile = useIsMobile();

  return isMobile ? <DrawerHeader {...props} /> : <DialogHeader {...props} />;
}

function ResponsiveDialogOverlay(props: DialogOverlayProps) {
  const isMobile = useIsMobile();

  return isMobile ? <DrawerOverlay {...props} /> : <DialogOverlay {...props} />;
}

function ResponsiveDialogPortal(props: DialogPortalProps) {
  const isMobile = useIsMobile();

  return isMobile ? <DrawerPortal {...props} /> : <DialogPortal {...props} />;
}

function ResponsiveDialogTitle(props: DialogTitleProps) {
  const isMobile = useIsMobile();

  return isMobile ? <DrawerTitle {...props} /> : <DialogTitle {...props} />;
}

function ResponsiveDialogTrigger(props: DialogTriggerProps) {
  const isMobile = useIsMobile();

  return isMobile ? <DrawerTrigger {...props} /> : <DialogTrigger {...props} />;
}

export {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogOverlay,
  ResponsiveDialogPortal,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
};
