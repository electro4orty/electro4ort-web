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
import { useSettingsStore } from '@/store/settings-store';

function ResponsiveDialog(props: DialogProps) {
  const isMobile = useIsMobile();
  const { useMobileDialog } = useSettingsStore();

  const isDrawer = isMobile && useMobileDialog;

  return isDrawer ? <Drawer {...props} /> : <Dialog {...props} />;
}

function ResponsiveDialogClose(props: DialogCloseProps) {
  const isMobile = useIsMobile();
  const { useMobileDialog } = useSettingsStore();

  const isDrawer = isMobile && useMobileDialog;

  return isDrawer ? <DrawerClose {...props} /> : <DialogClose {...props} />;
}

function ResponsiveDialogContent(props: DialogContentProps) {
  const isMobile = useIsMobile();
  const { useMobileDialog } = useSettingsStore();

  const isDrawer = isMobile && useMobileDialog;

  return isDrawer ? <DrawerContent {...props} /> : <DialogContent {...props} />;
}

function ResponsiveDialogDescription(props: DialogDescriptionProps) {
  const isMobile = useIsMobile();
  const { useMobileDialog } = useSettingsStore();

  const isDrawer = isMobile && useMobileDialog;

  return isDrawer ? (
    <DrawerDescription {...props} />
  ) : (
    <DialogDescription {...props} />
  );
}

function ResponsiveDialogFooter(props: React.HTMLAttributes<HTMLDivElement>) {
  const isMobile = useIsMobile();
  const { useMobileDialog } = useSettingsStore();

  const isDrawer = isMobile && useMobileDialog;

  return isDrawer ? <DrawerFooter {...props} /> : <DialogFooter {...props} />;
}

function ResponsiveDialogHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  const isMobile = useIsMobile();
  const { useMobileDialog } = useSettingsStore();

  const isDrawer = isMobile && useMobileDialog;

  return isDrawer ? <DrawerHeader {...props} /> : <DialogHeader {...props} />;
}

function ResponsiveDialogOverlay(props: DialogOverlayProps) {
  const isMobile = useIsMobile();
  const { useMobileDialog } = useSettingsStore();

  const isDrawer = isMobile && useMobileDialog;

  return isDrawer ? <DrawerOverlay {...props} /> : <DialogOverlay {...props} />;
}

function ResponsiveDialogPortal(props: DialogPortalProps) {
  const isMobile = useIsMobile();
  const { useMobileDialog } = useSettingsStore();

  const isDrawer = isMobile && useMobileDialog;

  return isDrawer ? <DrawerPortal {...props} /> : <DialogPortal {...props} />;
}

function ResponsiveDialogTitle(props: DialogTitleProps) {
  const isMobile = useIsMobile();
  const { useMobileDialog } = useSettingsStore();

  const isDrawer = isMobile && useMobileDialog;

  return isDrawer ? <DrawerTitle {...props} /> : <DialogTitle {...props} />;
}

function ResponsiveDialogTrigger(props: DialogTriggerProps) {
  const isMobile = useIsMobile();
  const { useMobileDialog } = useSettingsStore();

  const isDrawer = isMobile && useMobileDialog;

  return isDrawer ? <DrawerTrigger {...props} /> : <DialogTrigger {...props} />;
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
