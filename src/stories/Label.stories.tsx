import type { Meta, StoryObj } from '@storybook/react';
import { Label } from '@/components/ui/label';

const meta = {
  title: 'Label',
  component: Label,
  tags: ['autodocs'],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { children: 'Label' },
};
