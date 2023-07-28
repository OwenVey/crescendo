import type { Preview } from '@storybook/react';
import '../src/app/globals.css';
import { themeDecorator } from './theme-decorator';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    layout: 'fullscreen',
    backgrounds: {
      disable: true,
    },
  },
  decorators: [themeDecorator],
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      type: 'string',
      toolbar: {
        title: 'Theme',
        icon: 'sun',
        items: [
          { title: 'Light', value: 'light', icon: 'sun' },
          { title: 'Dark', value: 'dark', icon: 'moon' },
          { title: 'Split', value: 'split', icon: 'sidebyside' },
          { title: 'Stacked', value: 'stacked', icon: 'stacked' },
        ],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
