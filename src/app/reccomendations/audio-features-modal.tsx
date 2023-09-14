'use client';

import { Modal, ModalContent, ModalDescription, ModalHeader, ModalTitle, ModalTrigger } from '@/components/ui/modal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TRACK_ATTRIBUTES } from '@/lib/constants';
import type { AudioFeatures } from '@spotify/web-api-ts-sdk';
import { type Track } from '@spotify/web-api-ts-sdk';
import { useState } from 'react';

type AudioFeaturesModalProps = {
  track: Track;
  children?: React.ReactNode;
};

export function AudioFeaturesModal({ track, children }: AudioFeaturesModalProps) {
  const [open, setOpen] = useState(false);
  const [audioFeatures, setAudioFeatures] = useState<(AudioFeatures & { popularity: number }) | null>(null);

  async function onOpen(open: boolean) {
    setOpen(open);
    if (open) {
      const af: AudioFeatures = await (await fetch(`/api/audio-features/${track.id}`)).json();
      setAudioFeatures({ ...af, popularity: track.popularity });
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpen}>
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Audio Features</ModalTitle>
          <ModalDescription>Audio feature information for “{track.name}”</ModalDescription>
        </ModalHeader>

        {audioFeatures && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-32">Attribute</TableHead>
                <TableHead className="">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TRACK_ATTRIBUTES.map((attribute) => (
                <TableRow key={attribute.id}>
                  <TableCell className="text-gray-500 dark:text-gray-400">{attribute.label}</TableCell>
                  <TableCell className="font-medium">{audioFeatures[attribute.id]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </ModalContent>
    </Modal>
  );
}
