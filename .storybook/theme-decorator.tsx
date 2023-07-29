import type { Decorator } from '@storybook/react';
import { inter } from '../src/app/fonts/inter';
import { cn } from '../src/lib/utils';
import type { ReactNode } from 'react';
import { TooltipProvider } from '../src/components/ui/tooltip';

type Theme = 'light' | 'dark' | 'split' | 'stacked';

function StoryContainer({
  className,
  viewMode,
  children,
  dark,
}: {
  className?: string;
  children: ReactNode;
  viewMode: 'story' | 'docs';
  dark?: boolean;
}) {
  return (
    <TooltipProvider>
      <div
        className={cn(
          'grid place-items-center',
          viewMode === 'story' ? 'min-h-screen' : 'p-8',
          dark && 'dark bg-gray-950 [color-scheme:dark]',
          className,
        )}
      >
        {children}
      </div>
    </TooltipProvider>
  );
}

export const themeDecorator: Decorator = (Story, context) => {
  const { viewMode } = context;

  const htmlElement = document.querySelector('html');
  htmlElement?.classList.add(inter.variable);
  htmlElement?.classList.remove('dark');
  htmlElement?.style.removeProperty('color-scheme');

  const bodyElement = document.querySelector('body');
  bodyElement?.classList.add('bg-white');
  bodyElement?.classList.add('dark:bg-gray-950');
  const theme = context.globals.theme as Theme;

  switch (theme) {
    case 'light': {
      return (
        <StoryContainer viewMode={viewMode}>
          <Story />
        </StoryContainer>
      );
    }
    case 'dark': {
      htmlElement?.classList.add('dark');
      htmlElement.style['color-scheme'] = 'dark';
      return (
        <StoryContainer viewMode={viewMode} dark>
          <Story />
        </StoryContainer>
      );
    }
    case 'split': {
      return (
        <div className="grid grid-cols-2">
          <StoryContainer viewMode={viewMode}>
            <Story />
          </StoryContainer>
          <StoryContainer viewMode={viewMode} dark>
            <Story />
          </StoryContainer>
        </div>
      );
    }
    case 'stacked': {
      return (
        <div
          className={cn(
            'grid grid-rows-2',
            viewMode === 'story' && 'min-h-screen',
          )}
        >
          <StoryContainer viewMode={viewMode} className="min-h-0">
            <Story />
          </StoryContainer>
          <StoryContainer viewMode={viewMode} dark className="min-h-0">
            <Story />
          </StoryContainer>
        </div>
      );
    }
    default: {
      return (
        <StoryContainer viewMode={viewMode}>
          <Story />
        </StoryContainer>
      );
    }
  }
};
