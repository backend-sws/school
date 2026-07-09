import React, { isValidElement, Fragment } from "react";

interface EachProps<T = any> {
  /** Array of items to iterate over */
  of: T[];
  /** Render function called for each item */
  render: (item: T, index: number) => React.ReactNode;
  /** Extract a unique key for each item (defaults to item.id or index) */
  keyExtractor?: (item: T, index: number) => string | number;
  /** Show loading fallback instead of items */
  isLoading?: boolean;
  /** Content to show while loading */
  fallback?: React.ReactNode;
  /** Content to show when array is empty */
  nodatafound?: React.ReactNode;
  /** Conditionally show/hide */
  show?: boolean;
}

/**
 * Polymorphic list renderer — always renders as a React Fragment,
 * so it's safe inside <table>, <select>, <ul>, or any DOM container.
 */
export default function Each<T = any>({
  show = true,
  fallback,
  render,
  of = [] as any,
  nodatafound,
  isLoading,
  keyExtractor,
}: EachProps<T>) {
  if (!show) return null;
  if (isLoading) return <>{fallback}</>;

  const items = Array.isArray(of) ? of : [of];
  if (!items.length) return <>{nodatafound}</>;

  return (
    <>
      {items.map((item, index) => {
        const key = keyExtractor ? keyExtractor(item, index) : (item as any)?.id ?? index;
        const rendered = render(item, index);

        if (isValidElement(rendered)) {
          return React.cloneElement(rendered, { key });
        }

        return <Fragment key={key}>{rendered}</Fragment>;
      })}
    </>
  );
}
