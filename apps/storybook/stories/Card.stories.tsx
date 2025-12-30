import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardBody, CardFooter, Button } from '@huble/ui';

const meta = {
  title: 'Molecules/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'bordered', 'elevated'],
      description: 'Visual style variant of the card',
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
    children: (
      <>
        <CardHeader>
          <h3 className="text-xl font-semibold">Card Title</h3>
        </CardHeader>
        <CardBody>
          <p className="text-gray-600">
            This is the card body with some content. Cards are versatile
            containers for grouping related information.
          </p>
        </CardBody>
      </>
    ),
  },
};

export const Bordered: Story = {
  args: {
    variant: 'bordered',
    children: (
      <>
        <CardHeader>
          <h3 className="text-xl font-semibold">Bordered Card</h3>
        </CardHeader>
        <CardBody>
          <p className="text-gray-600">This card has a border around it.</p>
        </CardBody>
      </>
    ),
  },
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    children: (
      <>
        <CardHeader>
          <h3 className="text-xl font-semibold">Elevated Card</h3>
        </CardHeader>
        <CardBody>
          <p className="text-gray-600">This card has a shadow for elevation.</p>
        </CardBody>
      </>
    ),
  },
};

export const WithFooter: Story = {
  args: {
    variant: 'elevated',
    children: (
      <>
        <CardHeader>
          <h3 className="text-xl font-semibold">Complete Card</h3>
        </CardHeader>
        <CardBody>
          <p className="text-gray-600">
            This card demonstrates all sections: header, body, and footer.
          </p>
        </CardBody>
        <CardFooter>
          <div className="flex gap-2">
            <Button variant="primary" size="sm">
              Confirm
            </Button>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </div>
        </CardFooter>
      </>
    ),
  },
};

export const FeatureCard: Story = {
  args: {
    variant: 'elevated',
    children: (
      <>
        <CardHeader>
          <div className="text-4xl mb-2">🎨</div>
          <h3 className="text-xl font-semibold">Design Tokens</h3>
        </CardHeader>
        <CardBody>
          <p className="text-gray-600">
            Single source of truth for visual design. Compile to CSS custom
            properties and TypeScript constants.
          </p>
        </CardBody>
      </>
    ),
  },
};
