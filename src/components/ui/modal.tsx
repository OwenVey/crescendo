'use client';

import { cn } from '@/lib/utils';

import { useMediaQuery } from 'usehooks-ts';

import type { DialogDescriptionProps, DialogProps, DialogTitleProps, DialogTriggerProps } from '@radix-ui/react-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  type DrawerContentProps,
} from './drawer';

interface ModalProps extends DialogProps {
  children?: React.ReactNode;
}

export function Modal({ children, ...props }: ModalProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  return isDesktop ? <Dialog {...props}>{children}</Dialog> : <Drawer {...props}>{children}</Drawer>;
}

export function ModalTrigger(props: DialogTriggerProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  return isDesktop ? <DialogTrigger {...props} /> : <DrawerTrigger {...props} />;
}

export function ModalContent(props: DrawerContentProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  return isDesktop ? <DialogContent {...props} /> : <DrawerContent {...props} />;
}

export const ModalHeader = ({ ...props }: React.HTMLAttributes<HTMLDivElement>) => {
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
