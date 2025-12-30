import type { Meta, StoryObj } from '@storybook/react';
import { Hero, Button } from '@huble/ui';

const meta = {
  title: 'Organisms/Hero',
  component: Hero,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    heading: {
      control: 'text',
      description: 'Main heading text',
    },
    description: {
      control: 'text',
      description: 'Supporting description text',
    },
    imagePosition: {
      control: 'select',
      options: ['left', 'right', 'background'],
      description: 'Position of the hero image',
    },
  },
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    heading: 'Welcome to Huble Developer Kit',
    description:
      'Modern HubSpot development with React, design tokens, and islands architecture.',
    imageSrc:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
    imageAlt: 'Developer working on code',
    imagePosition: 'right',
  },
};

export const WithCTAs: Story = {
  args: {
    heading: 'Build Amazing Websites',
    description:
      'Fast, scalable, multi-brand websites with excellent Core Web Vitals.',
    imageSrc:
      'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=600&fit=crop',
    imageAlt: 'Web development',
    imagePosition: 'right',
    primaryCta: (
      <Button variant="primary" size="lg">
        Get Started
      </Button>
    ),
    secondaryCta: (
      <Button variant="outline" size="lg">
        Learn More
      </Button>
    ),
  },
};

export const ImageLeft: Story = {
  args: {
    heading: 'Image on the Left',
    description: 'The hero image can be positioned on either side.',
    imageSrc:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop',
    imageAlt: 'Code editor',
    imagePosition: 'left',
  },
};

export const NoImage: Story = {
  args: {
    heading: 'Text-Only Hero',
    description:
      'Hero sections can work great without images, focusing on the message.',
    primaryCta: (
      <Button variant="primary" size="lg">
        Take Action
      </Button>
    ),
  },
};

export const MinimalContent: Story = {
  args: {
    heading: 'Simple and Clean',
  },
};
