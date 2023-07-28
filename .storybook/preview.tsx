import type { Preview, Decorator } from '@storybook/react';

import { withThemeByClassName } from '@storybook/addon-styling';

import '../src/app/globals.css';

const themeBackground: Decorator = (StoryFn) => {
  return (
    <>
      <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <StoryFn />
      </div>
    </>
  );
};

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    layout: 'centered',
    backgrounds: {
      disable: true,
    },
  },

  decorators: [
    withThemeByClassName({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
    themeBackground,
  ],
};

export default preview;
