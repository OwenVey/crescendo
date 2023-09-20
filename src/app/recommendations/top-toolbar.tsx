'use client';

import { useStore } from '@/app/store';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Modal, ModalContent, ModalDescription, ModalHeader, ModalTitle, ModalTrigger } from '@/components/ui/modal';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { TextArea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';
import {
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
  ToolbarToggleGroup,
  ToolbarToggleItem,
} from '@/components/ui/toolbar';
import { useToast } from '@/components/ui/use-toast';
import { useSpotifySdk } from '@/lib/hooks/useSpotifySdk';
import { searchParamsToObject } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { HeartOffIcon, LayoutGridIcon, LayoutListIcon, ListPlusIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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
export function TopToolbar({ view }: TopToolbarProps) {
  const recommendations = useStore(({ recommendations }) => recommendations);
  const hideSaved = useStore(({ hideSaved }) => hideSaved);
  const setHideSaved = useStore(({ setHideSaved }) => setHideSaved);
  const numHidden = useStore((state) => state.recommendations.filter((t) => t.isSaved).length);

  const [isCreatePlaylistModalOpen, setIsCreatePlaylistModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const sdk = useSpotifySdk();
  const { data: session } = useSession();
  const { toast } = useToast();

  const searchParams = useSearchParams();

  function updateTrackImageSize(cards: number) {
    document.documentElement.style.setProperty('--cards-global', `${10 - cards}`);
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
        recommendations.map(({ uri }) => uri),
      );
      setIsCreatePlaylistModalOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Toolbar className="flex h-16 shrink-0 items-center gap-4 border-b border-t border-gray-200 bg-white px-3 py-2 shadow-sm dark:border-gray-800 dark:bg-gray-950 md:border-t-0">
      <ToolbarToggleGroup value={view} defaultValue="grid" type="single">
        <ToolbarToggleItem value="grid" aria-label="Grid view" asChild>
          <Link href={{ pathname: 'recommendations', query: { ...searchParamsToObject(searchParams), view: 'grid' } }}>
            <LayoutGridIcon className="h-4 w-4" />
          </Link>
        </ToolbarToggleItem>

        <ToolbarToggleItem value="list" aria-label="List view" asChild>
          <Link href={{ pathname: 'recommendations', query: { ...searchParamsToObject(searchParams), view: 'list' } }}>
            <LayoutListIcon className="h-4 w-4" />
          </Link>
        </ToolbarToggleItem>
      </ToolbarToggleGroup>

      <div className="flex items-center gap-1">
        <ZoomOutIcon className="h-4 w-4 text-gray-500 dark:text-gray-500" />
        <Slider
          size="sm"
          className="w-24"
          min={1}
          max={9}
          step={1}
          defaultValue={[5]}
          onValueChange={([value]) => updateTrackImageSize(value)}
        />
        <ZoomInIcon className="h-4 w-4 text-gray-500 dark:text-gray-500" />
      </div>

      <ToolbarSeparator />

      <Modal open={isCreatePlaylistModalOpen} onOpenChange={setIsCreatePlaylistModalOpen}>
        <ModalTrigger asChild>
          <ToolbarButton variant="secondary" size="icon">
            <ListPlusIcon className="h-4 w-4" />
          </ToolbarButton>
        </ModalTrigger>
        <ModalContent>
          <ModalHeader>
            <ModalTitle className="">Create Playlist</ModalTitle>
            <ModalDescription>
              Create a new playlist on your Spotify account with the recommendations generated.
            </ModalDescription>
          </ModalHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Name</FormLabel>
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

      <ToolbarButton
        asChild
        variant="ghost"
        size="icon"
        tooltip={hideSaved ? 'Show saved tracks' : 'Hide saved tracks'}
      >
        <Toggle pressed={hideSaved} variant="outline" onPressedChange={setHideSaved} size="icon">
          <HeartOffIcon className="h-4 w-4" />
        </Toggle>
      </ToolbarButton>
      {hideSaved && <div className="-ml-2 text-sm text-gray-500 dark:text-gray-400">{numHidden} hidden</div>}
    </Toolbar>
  );
}
