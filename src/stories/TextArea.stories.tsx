import type { Meta, StoryObj } from '@storybook/react';
import { TextArea } from '@/components/ui/textarea';

const meta = {
  title: 'TextArea',
  component: TextArea,
  tags: ['autodocs'],
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    disabled: false,
    placeholder: 'Placeholder',
    className: 'w-72',
  },
};
