import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  [
    'inline-flex',
    'items-center',
    'justify-center',
    'rounded-md',
    'font-medium',
    'transition-colors',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'disabled:opacity-50',
    'disabled:pointer-events-none',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-primary-600',
          'text-white',
          'hover:bg-primary-700',
          'focus:ring-primary-600',
        ],
        secondary: [
          'bg-secondary-600',
          'text-white',
          'hover:bg-secondary-700',
          'focus:ring-secondary-600',
        ],
        outline: [
          'border-2',
          'border-gray-300',
          'text-gray-700',
          'hover:bg-gray-50',
          'focus:ring-gray-500',
        ],
        ghost: ['text-gray-700', 'hover:bg-gray-100', 'focus:ring-gray-500'],
        destructive: [
          'bg-red-600',
          'text-white',
          'hover:bg-red-700',
          'focus:ring-red-600',
        ],
      },
      size: {
        sm: ['text-sm', 'px-3', 'py-1.5'],
        md: ['text-base', 'px-4', 'py-2'],
        lg: ['text-lg', 'px-6', 'py-3'],
        icon: ['p-2'],
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);
