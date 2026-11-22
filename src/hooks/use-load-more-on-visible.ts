import { useEffect, useRef } from "react";

type Options = {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => unknown;
};

// Returns a ref for an element placed after the last item. When that element
// gets close to the viewport, the next page is requested.
//
// IntersectionObserver lets the browser tell us when the element becomes
// visible, so there is no scroll listener running on every scroll event.
export function useLoadMoreOnVisible({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: Options) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) fetchNextPage();
      },
      // Start loading 200px before the element is on screen, so the next
      // page is usually there before the user reaches the end.
      { rootMargin: "200px" },
    );
    observer.observe(element);
    // The effect runs again after each page loads. The new observer reports
    // right away, so if the element is still visible it loads another page.
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return ref;
}
