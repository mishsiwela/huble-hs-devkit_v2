import { HTMLAttributes, ReactNode } from 'react';

export interface HeroProps extends HTMLAttributes<HTMLElement> {
  heading: string;
  description?: string;
  primaryCta?: ReactNode;
  secondaryCta?: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  imagePosition?: 'left' | 'right' | 'background';
}
