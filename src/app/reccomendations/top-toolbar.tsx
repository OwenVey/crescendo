'use client';

import { reccomendationsAtom, viewAtom } from '@/app/store';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Modal, ModalContent, ModalDescription, ModalHeader, ModalTitle, ModalTrigger } from '@/components/ui/modal';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { TextArea } from '@/components/ui/textarea';
import {
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
  ToolbarToggleGroup,
  ToolbarToggleItem,
} from '@/components/ui/toolbar';
import { useToast } from '@/components/ui/use-toast';
import { useSpotifySdk } from '@/lib/hooks/useSpotifySdk';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom, useAtomValue } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { LayoutGridIcon, LayoutListIcon, ListPlusIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const createPlaylistFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  public: z.boolean().default(false),
});

type TopToolbarProps = {
  view: 'grid' | 'list';
};
export function TopToolbar(props: TopToolbarProps) {
  useHydrateAtoms([[viewAtom, props.view]]);
  const [view, updateView] = useAtom(viewAtom);
  const reccomendations = useAtomValue(reccomendationsAtom);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const sdk = useSpotifySdk();
  const { data: session } = useSession();
  const { toast } = useToast();

  function updateTrackImageSize(size: number) {
    document.documentElement.style.setProperty('--card-width', `${size}px`);
  }

  const form = useForm<z.infer<typeof createPlaylistFormSchema>>({
    resolver: zodResolver(createPlaylistFormSchema),
    defaultValues: {
      name: '',
      description: '',
      public: false,
    },
  });

  async function onSubmit(values: z.infer<typeof createPlaylistFormSchema>) {
    console.log(values);
    if (!session?.user.name) {
      toast({
        variant: 'destructive',
        title: 'User not signed in',
        description: 'You must authorize Spotify in order to create a playlist',
      });
      return;
    }
    try {
      setLoading(true);
      const playlist = await sdk.playlists.createPlaylist(session.user.name, values);
      await sdk.playlists.addItemsToPlaylist(
        playlist.id,
        reccomendations.map(({ uri }) => uri),
      );
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Toolbar className="flex h-16 shrink-0 items-center gap-4 border-b border-t border-gray-200 bg-white px-3 py-2 shadow-sm dark:border-gray-800 dark:bg-gray-950 md:border-t-0">
      <ToolbarToggleGroup
        value={view}
        onValueChange={(value: 'grid' | 'list' | '') => updateView(value ? value : view === 'grid' ? 'list' : 'grid')}
        defaultValue="grid"
        type="single"
      >
        <ToolbarToggleItem value="grid" aria-label="Grid view">
          <LayoutGridIcon className="h-4 w-4" />
        </ToolbarToggleItem>

        <ToolbarToggleItem value="list" aria-label="List view">
          <LayoutListIcon className="h-4 w-4" />
        </ToolbarToggleItem>
      </ToolbarToggleGroup>

      <div className="flex items-center gap-1">
        <ZoomOutIcon className="h-4 w-4 text-gray-500 dark:text-gray-500" />
        <Slider
          size="sm"
          className="w-24"
          min={100}
          max={300}
          step={1}
          defaultValue={[200]}
          onValueChange={([value]) => updateTrackImageSize(value)}
        />
        <ZoomInIcon className="h-4 w-4 text-gray-500 dark:text-gray-500" />
      </div>

      <ToolbarSeparator />

      <Modal open={open} onOpenChange={setOpen}>
        <ModalTrigger asChild>
          <ToolbarButton variant="secondary" size="icon">
            <ListPlusIcon className="h-4 w-4" />
          </ToolbarButton>
        </ModalTrigger>
        <ModalContent>
          <ModalHeader>
            <ModalTitle className="">Create Playlist</ModalTitle>
            <ModalDescription>
              Create a new playlist on your Spotify account with the reccomendations generated.
            </ModalDescription>
          </ModalHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input autoComplete="off" placeholder="Add a name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <TextArea placeholder="Add an optional description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="public"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel>Public</FormLabel>
                    </div>
                    <FormDescription>Make playlist visible to others</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full md:float-right md:w-auto" loading={loading}>
                Create
              </Button>
            </form>
          </Form>
        </ModalContent>
      </Modal>
    </Toolbar>
  );
}
