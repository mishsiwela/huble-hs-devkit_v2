import { forwardRef } from 'react';
import type { HeroProps } from './Hero.types';
import {
  heroContainerStyles,
  heroContentStyles,
  heroGridStyles,
  heroTextContainerStyles,
  heroHeadingStyles,
  heroDescriptionStyles,
  heroCtaContainerStyles,
  heroImageStyles,
} from './Hero.styles';

export const Hero = forwardRef<HTMLElement, HeroProps>(
  (
    {
      className,
      heading,
      description,
      primaryCta,
      secondaryCta,
      imageSrc,
      imageAlt,
      imagePosition = 'right',
      ...props
    },
    ref
  ) => {
    const hasImage = imageSrc && imagePosition !== 'background';

    return (
      <section
        ref={ref}
        className={`${heroContainerStyles} ${className || ''}`}
        {...props}
      >
        <div className={heroContentStyles}>
          <div className={hasImage ? heroGridStyles : ''}>
            <div
              className={heroTextContainerStyles}
              style={{ order: imagePosition === 'left' ? 2 : 1 }}
            >
              <h1 className={heroHeadingStyles}>{heading}</h1>
              {description && <p className={heroDescriptionStyles}>{description}</p>}
              {(primaryCta || secondaryCta) && (
                <div className={heroCtaContainerStyles}>
                  {primaryCta}
                  {secondaryCta}
                </div>
              )}
            </div>

            {hasImage && (
              <div style={{ order: imagePosition === 'left' ? 1 : 2 }}>
                <img
                  src={imageSrc}
                  alt={imageAlt || heading}
                  className={heroImageStyles}
                />
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }
);

Hero.displayName = 'Hero';
