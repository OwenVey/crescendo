'use client';

import { cn } from '@/lib/utils';
import type { DialogDescriptionProps, DialogProps, DialogTitleProps, DialogTriggerProps } from '@radix-ui/react-dialog';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';

import type { DrawerContentProps } from './drawer';

const Dialog = dynamic(() => import('@/components/ui/dialog').then((Dialog) => Dialog.Dialog), {
  ssr: false,
});
const DialogTrigger = dynamic(() => import('@/components/ui/dialog').then((Dialog) => Dialog.DialogTrigger), {
  ssr: false,
});
const DialogContent = dynamic(() => import('@/components/ui/dialog').then((Dialog) => Dialog.DialogContent), {
  ssr: false,
});
const DialogDescription = dynamic(() => import('@/components/ui/dialog').then((Dialog) => Dialog.DialogDescription), {
  ssr: false,
});
const DialogHeader = dynamic(() => import('@/components/ui/dialog').then((Dialog) => Dialog.DialogHeader), {
  ssr: false,
});
const DialogTitle = dynamic(() => import('@/components/ui/dialog').then((Dialog) => Dialog.DialogTitle), {
  ssr: false,
});

const Drawer = dynamic(() => import('@/components/ui/drawer').then((Drawer) => Drawer.Drawer), {
  ssr: false,
});
const DrawerTrigger = dynamic(() => import('@/components/ui/drawer').then((Drawer) => Drawer.DrawerTrigger), {
  ssr: false,
});
const DrawerContent = dynamic(() => import('@/components/ui/drawer').then((Drawer) => Drawer.DrawerContent), {
  ssr: false,
});
const DrawerDescription = dynamic(() => import('@/components/ui/drawer').then((Drawer) => Drawer.DrawerDescription), {
  ssr: false,
});
const DrawerHeader = dynamic(() => import('@/components/ui/drawer').then((Drawer) => Drawer.DrawerHeader), {
  ssr: false,
});
const DrawerTitle = dynamic(() => import('@/components/ui/drawer').then((Drawer) => Drawer.DrawerTitle), {
  ssr: false,
});

interface ModalProps extends DialogProps {
  children?: React.ReactNode;
}

export function Modal({ children, ...props }: ModalProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [open, setOpen] = useState(false);

  return isDesktop ? (
    <Dialog open={open} onOpenChange={setOpen} {...props}>
      {children}
    </Dialog>
  ) : (
    <Drawer open={open} onOpenChange={setOpen} {...props}>
      {children}
    </Drawer>
  );
}

export function ModalTrigger(props: DialogTriggerProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  return isDesktop ? <DialogTrigger {...props} /> : <DrawerTrigger {...props} />;
}

export function ModalContent(props: DrawerContentProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  return isDesktop ? <DialogContent {...props} /> : <DrawerContent {...props} />;
}

export const ModalHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  return isDesktop ? <DialogHeader {...props} /> : <DrawerHeader {...props} />;
};

export const ModalFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
);

export function ModalTitle(props: DialogTitleProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  return isDesktop ? <DialogTitle {...props} /> : <DrawerTitle {...props} />;
}

export function ModalDescription(props: DialogDescriptionProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  return isDesktop ? <DialogDescription {...props} /> : <DrawerDescription {...props} />;
}
