import { useEffect, RefObject } from 'react';

export function useStickyShell(
  ref: RefObject<HTMLElement | null>,
  position: 'top' | 'bottom' = 'top'
) {
  useEffect(() => {
    const shell = ref.current;
    if (!shell) return;

    shell.style.top = position === 'top' ? '0' : '';
    shell.style.bottom = position === 'bottom' ? '0' : '';

    const update = () => {
      const shellHeight = shell.getBoundingClientRect().height;
      shell.style.position = shellHeight > window.innerHeight * 0.5 ? 'static' : 'sticky';
    };

    update();
    window.addEventListener('resize', update);
    const observer = new ResizeObserver(update);
    observer.observe(shell);

    return () => {
      window.removeEventListener('resize', update);
      observer.disconnect();
    };
  }, [ref, position]);
}