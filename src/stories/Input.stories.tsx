import { Input } from '@/components/ui/input';
import type { Meta, StoryObj } from '@storybook/react';
import { SearchIcon } from 'lucide-react';

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

export const WithIcon: Story = {
  args: {
    disabled: false,
    label: 'Label',
    placeholder: 'Placeholder',
    icon: <SearchIcon className="h-4 w-4" />,
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
