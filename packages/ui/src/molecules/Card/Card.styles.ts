import { cva } from 'class-variance-authority';

export const cardVariants = cva(['rounded-lg', 'overflow-hidden'], {
  variants: {
    variant: {
      default: ['bg-white'],
      bordered: ['bg-white', 'border', 'border-gray-200'],
      elevated: ['bg-white', 'shadow-lg'],
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const cardHeaderStyles = 'px-6 py-4 border-b border-gray-200';
export const cardBodyStyles = 'px-6 py-4';
export const cardFooterStyles = 'px-6 py-4 border-t border-gray-200 bg-gray-50';
