import { cva, VariantProps } from 'class-variance-authority';

export const dialogVariants = cva(
  'fixed z-50 bg-background rounded-lg shadow-lg border',
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        'full': 'max-w-full'
      }
    },
    defaultVariants: {
      size: 'md'
    }
  }
);

export const dialogOverlayVariants = cva(
  'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm',
  {
    variants: {
      position: {
        'default': 'items-center justify-center',
        'top': 'items-start justify-center',
        'bottom': 'items-end justify-center'
      }
    },
    defaultVariants: {
      position: 'default'
    }
  }
);

export const dialogContentVariants = cva(
  'relative grid w-full gap-4 p-6',
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        'full': 'max-w-full'
      }
    },
    defaultVariants: {
      size: 'md'
    }
  }
);

export type ZardDialogVariants = VariantProps<typeof dialogVariants>;
export type ZardDialogOverlayVariants = VariantProps<typeof dialogOverlayVariants>;
export type ZardDialogContentVariants = VariantProps<typeof dialogContentVariants>;