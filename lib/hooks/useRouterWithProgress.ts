import { useRouter } from 'next/navigation';
import NProgress from 'nprogress';
import { useCallback } from 'react';

export function useRouterWithProgress() {
  const router = useRouter();

  const push = useCallback(
    (href: string, options?: any) => {
      NProgress.start();
      router.push(href, options);
      // NProgress.done() will be called when the page finishes loading
      // via a setTimeout to ensure the navigation has started
      setTimeout(() => {
        NProgress.done();
      }, 500);
    },
    [router],
  );

  const replace = useCallback(
    (href: string, options?: any) => {
      NProgress.start();
      router.replace(href, options);
      setTimeout(() => {
        NProgress.done();
      }, 500);
    },
    [router],
  );

  const back = useCallback(() => {
    NProgress.start();
    router.back();
    setTimeout(() => {
      NProgress.done();
    }, 500);
  }, [router]);

  const forward = useCallback(() => {
    NProgress.start();
    router.forward();
    setTimeout(() => {
      NProgress.done();
    }, 500);
  }, [router]);

  const refresh = useCallback(() => {
    NProgress.start();
    router.refresh();
    setTimeout(() => {
      NProgress.done();
    }, 500);
  }, [router]);

  return {
    push,
    replace,
    back,
    forward,
    refresh,
    prefetch: router.prefetch,
  };
}
