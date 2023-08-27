import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

const meta = {
  title: 'Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    delayDuration: 700,
  },
  render: ({ ...args }) => (
    <Tooltip {...args}>
      <TooltipTrigger asChild>
        <Button>Hover Me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
  ),
};
