import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '@/components/ui/button';
import { SearchIcon } from 'lucide-react';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Button',
  component: Button,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    children: 'Button',
    disabled: false,
  },
};

export const AllVariants: Story = {
  args: {
    disabled: false,
  },
  render: ({ ...args }) => (
    <div className="space-x-4">
      <Button {...args} variant="default">
        Default
      </Button>
      <Button {...args} variant="secondary">
        Secondary
      </Button>
      <Button {...args} variant="destructive">
        Destructive
      </Button>
      <Button {...args} variant="outline">
        Outline
      </Button>
      <Button {...args} variant="ghost">
        Ghost
      </Button>
      <Button {...args} variant="link">
        Link
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    children: 'Button',
    disabled: true,
  },
};

export const Icon: Story = {
  args: {
    size: 'icon',
    children: <SearchIcon />,
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <SearchIcon className="mr-2 h-4 w-4" />
        Search
      </>
    ),
  },
};
