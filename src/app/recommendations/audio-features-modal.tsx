'use client';

import { Modal, ModalContent, ModalDescription, ModalHeader, ModalTitle, ModalTrigger } from '@/components/ui/modal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TRACK_ATTRIBUTES } from '@/lib/constants';
import type { TrackWithSaved } from '@/types';
import type { AudioFeatures } from '@spotify/web-api-ts-sdk';
import { useState } from 'react';
import useSWRImmutable from 'swr/immutable';

type AudioFeaturesModalProps = {
  track: TrackWithSaved;
  children?: React.ReactNode;
};

export function AudioFeaturesModal({ track, children }: AudioFeaturesModalProps) {
  const [open, setOpen] = useState(false);

  const { data: audioFeatures } = useSWRImmutable<AudioFeatures>(`/api/audio-features/${track.id}`);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Audio Features</ModalTitle>
          <ModalDescription>Audio feature information for &quot;{track.name}&quot;</ModalDescription>
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
              {Object.entries(audioFeatures).map(([key, value]) => {
                const attribute = TRACK_ATTRIBUTES.find((a) => a.id === key);
                return (
                  attribute && (
                    <TableRow key={key}>
                      <TableCell className="text-gray-500 dark:text-gray-400">{attribute.label}</TableCell>
                      <TableCell className="font-medium">{value}</TableCell>
                    </TableRow>
                  )
                );
              })}
            </TableBody>
          </Table>
        )}
      </ModalContent>
    </Modal>
  );
}
