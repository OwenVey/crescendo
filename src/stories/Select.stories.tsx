import type { Meta, StoryObj } from '@storybook/react';
import { Select } from '@/components/ui/select';

const meta = {
  title: 'Select',
  component: Select,
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    className: 'w-40',
    label: 'Fruits',
    placeholder: 'Select a fruit',
  },
  render: ({ ...args }) => (
    <Select {...args}>
      <Select.Option value="apple">Apple</Select.Option>
      <Select.Option value="banana">Banana</Select.Option>
      <Select.Option value="blueberry">Blueberry</Select.Option>
      <Select.Option value="grapes">Grapes</Select.Option>
      <Select.Option value="pineapple">Pineapple</Select.Option>
    </Select>
  ),
};
