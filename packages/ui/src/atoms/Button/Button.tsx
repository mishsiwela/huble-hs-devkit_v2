import { forwardRef } from 'react';
import { buttonVariants } from './Button.styles';
import type { ButtonProps } from './Button.types';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, loading, fullWidth, children, disabled, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={`${buttonVariants({ variant, size })} ${
          fullWidth ? 'w-full' : ''
        } ${className || ''}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <span className="mr-2">⏳</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
