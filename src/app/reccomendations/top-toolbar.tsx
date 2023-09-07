'use client';

import { Slider } from '@/components/ui/slider';
import { Toolbar, ToolbarSeparator, ToolbarToggleGroup, ToolbarToggleItem } from '@/components/ui/toolbar';
import { LayoutGridIcon, LayoutListIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-react';

function updateTrackImageSize(size: number) {
  document.documentElement.style.setProperty('--card-width', `${size}px`);
}

export function TopToolbar() {
  return (
    <Toolbar className="flex h-16 shrink-0 items-center gap-4 border-b border-t border-gray-200 bg-white px-3 py-2 shadow-sm dark:border-gray-800 dark:bg-gray-950 md:border-t-0">
      <ToolbarToggleGroup defaultValue="grid" type="single">
        <ToolbarToggleItem value="grid" aria-label="Grid view">
          <LayoutGridIcon className="h-4 w-4" />
        </ToolbarToggleItem>

        <ToolbarToggleItem value="list" aria-label="List view">
          <LayoutListIcon className="h-4 w-4" />
        </ToolbarToggleItem>
      </ToolbarToggleGroup>

      <ToolbarSeparator />

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
    </Toolbar>
  );
}
