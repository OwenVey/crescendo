import { Label } from '@/components/ui/label';
import type { Meta, StoryObj } from '@storybook/react';

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
