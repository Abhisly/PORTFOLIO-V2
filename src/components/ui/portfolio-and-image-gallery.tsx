'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  Ref,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

function useMergeRefs<T>(...refs: (Ref<T> | undefined)[]) {
  return useMemo(() => {
    if (refs.every((ref) => ref == null)) return null;
    return (node: T) => {
      refs.forEach((ref) => {
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref != null) {
          (ref as React.MutableRefObject<T | null>).current = node;
        }
      });
    };
  }, [refs]);
}

function useResponsiveValue(baseValue: number, mobileValue: number) {
  const [value, setValue] = useState(baseValue);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setValue(window.innerWidth < 768 ? mobileValue : baseValue);
    };

    handleResize();

    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [baseValue, mobileValue]);

  return value;
}

export interface RadialScrollGalleryProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Render function that returns the array of items to be placed on the wheel.
   * Receives the currently `hoveredIndex` to allow for parent-controlled hover states.
   */
  children: (hoveredIndex: number | null) => ReactNode[];
  /**
   * The vertical scroll distance (in pixels) required to complete one full 360-degree rotation.
   * Defaults to 2500.
   */
  scrollDuration?: number;
  /**
   * Percentage of the circle visible above the fold (0-100).
   * Determines how "deep" the wheel is buried. Defaults to 45.
   */
  visiblePercentage?: number;
  /** Radius of the circle on desktop devices (>=768px). */
  baseRadius?: number;
  /** Radius of the circle on mobile devices (<768px). */
  mobileRadius?: number;
  /**
   * GSAP ScrollTrigger start position string (e.g., "top 80%", "center center").
   */
  startTrigger?: string;
  /** Callback fired when an item is clicked or selected via keyboard. */
  onItemSelect?: (index: number) => void;
  /** Callback fired when the active/centered card changes. */
  onActiveIndexChange?: (index: number) => void;
  /** Rotational direction of the wheel. */
  direction?: 'ltr' | 'rtl';
  /** Disables all interactions and applies a grayscale effect. */
  disabled?: boolean;
  /** Optional header element to pin alongside the gallery */
  header?: React.ReactNode;
  /** Optional footer element to pin alongside the gallery */
  footer?: React.ReactNode;
}

/**
 * A scroll-driven interaction that rotates items along a large, partially hidden circle.
 * The component pins itself to the viewport while the user scrolls through the rotational progress.
 */
export const RadialScrollGallery = forwardRef<
  HTMLDivElement,
  RadialScrollGalleryProps
>(
  (
    {
      children,
      scrollDuration = 2500,
      visiblePercentage = 45,
      baseRadius = 550,
      mobileRadius = 220,
      className = '',
      startTrigger = 'center center',
      onItemSelect,
      onActiveIndexChange,
      direction = 'ltr',
      disabled = false,
      header,
      footer,
      ...rest
    },
    ref
  ) => {
    const pinRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLUListElement>(null);
    const childRef = useRef<HTMLLIElement>(null);

    const mergedRef = useMergeRefs(ref, pinRef);

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [childSize, setChildSize] = useState<{ w: number; h: number } | null>(
      null
    );
    const [isMounted, setIsMounted] = useState(false);

    const currentRadius = useResponsiveValue(baseRadius, mobileRadius);
    const circleDiameter = currentRadius * 2;
    const wheelOffset = useResponsiveValue(65, 20);

    const { visibleDecimal, hiddenDecimal } = useMemo(() => {
      const clamped = Math.max(10, Math.min(100, visiblePercentage));
      const v = clamped / 100;
      return { visibleDecimal: v, hiddenDecimal: 1 - v };
    }, [visiblePercentage]);

    const childrenNodes = useMemo(
      () => React.Children.toArray(children(hoveredIndex)),
      [children, hoveredIndex]
    );
    const childrenCount = childrenNodes.length;

    // Use Refs to keep GSAP callbacks up-to-date without rebuilding the timeline
    const hoveredIndexRef = useRef<number | null>(null);
    hoveredIndexRef.current = hoveredIndex;

    const onActiveIndexChangeRef = useRef<((index: number) => void) | undefined>(onActiveIndexChange);
    onActiveIndexChangeRef.current = onActiveIndexChange;

    // Measure the first child to determine layout buffers.
    useEffect(() => {
      setIsMounted(true);

      if (!childRef.current) return;

      const observer = new ResizeObserver((entries) => {
        let hasChanged = false;
        for (const entry of entries) {
          setChildSize({
            w: entry.contentRect.width,
            h: entry.contentRect.height,
          });
          hasChanged = true;
        }
        if (hasChanged) {
          ScrollTrigger.refresh();
        }
      });

      observer.observe(childRef.current);
      return () => observer.disconnect();
    }, [childrenCount]);

    useGSAP(
      () => {
        if (!pinRef.current || !containerRef.current || childrenCount === 0)
          return;

        const prefersReducedMotion = window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        ).matches;

        if (!prefersReducedMotion) {
          gsap.fromTo(
            containerRef.current.children,
            { scale: 0, autoAlpha: 0 },
            {
              scale: 1,
              autoAlpha: 1,
              duration: 1.2,
              ease: 'back.out(1.2)',
              stagger: 0.05,
              scrollTrigger: {
                trigger: pinRef.current,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
              },
            }
          );

          gsap.to(containerRef.current, {
            rotation: 360,
            ease: 'none',
            scrollTrigger: {
              id: 'radial-gallery-trigger',
              trigger: pinRef.current,
              pin: true,
              start: startTrigger,
              end: `+=${scrollDuration}`,
              scrub: true,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                // If not hovered, calculate active index based on scroll position
                if (hoveredIndexRef.current === null) {
                  const progress = self.progress;
                  const currentRotation = progress * 360;
                  const angleAtTop = (270 - currentRotation) % 360;
                  const normalizedAngle = angleAtTop < 0 ? angleAtTop + 360 : angleAtTop;
                  const computedIndex = Math.round((normalizedAngle / 360) * childrenCount) % childrenCount;
                  onActiveIndexChangeRef.current?.(computedIndex);
                }
              }
            },
          });
        }
      },
      {
        scope: pinRef,
        dependencies: [
          scrollDuration,
          currentRadius,
          startTrigger,
          childrenCount,
        ],
      }
    );

    if (childrenCount === 0) return null;

    const scaleFactor = 1.25;
    const calculatedBuffer = childSize
      ? childSize.h * scaleFactor - childSize.h + 60
      : 150;

    const visibleAreaHeight = childSize
      ? circleDiameter * visibleDecimal + childSize.h / 2 + calculatedBuffer
      : circleDiameter * visibleDecimal + 200;

    // Helper to calculate and trigger the active index based on current scroll state
    const restoreActiveIndexFromScroll = () => {
      const trigger = ScrollTrigger.getById('radial-gallery-trigger');
      if (trigger) {
        const progress = trigger.progress;
        const currentRotation = progress * 360;
        const angleAtTop = (270 - currentRotation) % 360;
        const normalizedAngle = angleAtTop < 0 ? angleAtTop + 360 : angleAtTop;
        const computedIndex = Math.round((normalizedAngle / 360) * childrenCount) % childrenCount;
        onActiveIndexChange?.(computedIndex);
      }
    };

    return (
      <div
        ref={mergedRef}
        className={`h-screen max-h-screen w-full relative flex flex-col items-center justify-between overflow-hidden pt-10 sm:pt-16 pb-2 ${className}`}
        {...rest}
      >
        {header && <div className="w-full relative z-20">{header}</div>}

        <div
          className='relative w-full overflow-hidden'
          style={{
            height: `${visibleAreaHeight}px`,
            maskImage:
              'linear-gradient(to top, transparent 0%, black 40%, black 100%)',
            WebkitMaskImage:
              'linear-gradient(to top, transparent 0%, black 40%, black 100%)',
          }}
        >
          <ul
            ref={containerRef}
            className={`
              absolute left-1/2 -translate-x-1/2 will-change-transform m-0 p-0 list-none
              transition-opacity duration-500 ease-out
              ${disabled ? 'opacity-50 pointer-events-none grayscale' : ''}
              ${isMounted ? 'opacity-100' : 'opacity-0'}
            `}
            dir={direction}
            style={{
              width: circleDiameter,
              height: circleDiameter,
              bottom: -(circleDiameter * hiddenDecimal) - wheelOffset,
            }}
          >
            {childrenNodes.map((child, index) => {
              const angle = (index / childrenCount) * 2 * Math.PI;
              let x = currentRadius * Math.cos(angle);
              const y = currentRadius * Math.sin(angle);

              if (direction === 'rtl') {
                x = -x;
              }

              const rotationAngle = (angle * 180) / Math.PI;
              const isHovered = hoveredIndex === index;

              return (
                <li
                  key={index}
                  ref={index === 0 ? childRef : null}
                  className='absolute top-1/2 left-1/2'
                  style={{
                    zIndex: isHovered ? 100 : 10,
                    transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) rotate(${
                      rotationAngle + 90
                    }deg)`,
                  }}
                >
                  <div
                    role='button'
                    tabIndex={disabled ? -1 : 0}
                    onClick={() => !disabled && onItemSelect?.(index)}
                    onKeyDown={(e) => {
                      if (disabled) return;
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onItemSelect?.(index);
                      }
                    }}
                    onMouseEnter={() => {
                      if (!disabled) {
                        setHoveredIndex(index);
                        onActiveIndexChange?.(index);
                      }
                    }}
                    onMouseLeave={() => {
                      if (!disabled) {
                        setHoveredIndex(null);
                        restoreActiveIndexFromScroll();
                      }
                    }}
                    onFocus={() => {
                      if (!disabled) {
                        setHoveredIndex(index);
                        onActiveIndexChange?.(index);
                      }
                    }}
                    onBlur={() => {
                      if (!disabled) {
                        setHoveredIndex(null);
                        restoreActiveIndexFromScroll();
                      }
                    }}
                    className={`
                      block cursor-pointer outline-none text-left
                      focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                      rounded-xl transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) will-change-transform
                      ${isHovered ? 'scale-115 -translate-y-4' : 'scale-100'}
                    `}
                  >
                    {child}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {footer && <div className="w-full absolute bottom-12 sm:bottom-20 left-0 right-0 z-20 pointer-events-none">{footer}</div>}
      </div>
    );
  }
);

RadialScrollGallery.displayName = 'RadialScrollGallery';
