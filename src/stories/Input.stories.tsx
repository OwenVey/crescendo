import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@/components/ui/input';

const meta = {
  title: 'Input',
  component: Input,
  tags: ['autodocs'],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    disabled: false,
    placeholder: 'Placeholder',
  },
  render: ({ ...args }) => <Input className="w-72" {...args} />,
};

export const WithLabel: Story = {
  args: {
    disabled: false,
    label: 'Label',
    placeholder: 'Placeholder',
  },
  render: ({ ...args }) => <Input className="w-72" {...args} />,
};

export const File: Story = {
  args: {
    disabled: false,
    placeholder: 'Placeholder',
    type: 'file',
  },
  render: ({ ...args }) => <Input className="w-72" {...args} />,
};
