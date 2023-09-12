'use client';

import { cn } from '@/lib/utils';
import type { DialogDescriptionProps, DialogProps, DialogTitleProps, DialogTriggerProps } from '@radix-ui/react-dialog';
import { useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './dialog';
import type { DrawerContentProps } from './drawer';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from './drawer';

interface ModalProps extends DialogProps {
  children?: React.ReactNode;
}

export function Modal({ children, ...props }: ModalProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [open, setOpen] = useState(false);

  if (!window) return;
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
  if (!window) return;
  return isDesktop ? <DialogTrigger {...props} /> : <DrawerTrigger {...props} />;
}

export function ModalContent(props: DrawerContentProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  if (!window) return;
  return isDesktop ? <DialogContent {...props} /> : <DrawerContent {...props} />;
}

export const ModalHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  if (!window) return;
  return isDesktop ? <DialogHeader {...props} /> : <DrawerHeader {...props} />;
};

export const ModalFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
);

export function ModalTitle(props: DialogTitleProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  if (!window) return;
  return isDesktop ? <DialogTitle {...props} /> : <DrawerTitle {...props} />;
}

export function ModalDescription(props: DialogDescriptionProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  if (!window) return;
  return isDesktop ? <DialogDescription {...props} /> : <DrawerDescription {...props} />;
}
