import { useCallback, useEffect, useState } from 'react';

/**
 * Small request wrapper: loading, error and stale-response protection in one place.
 * `deps` controls when the request re-runs.
 */
export function useAsync(fn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(fn, deps);

  const load = useCallback(() => {
    let active = true;
    setState((prev) => ({ ...prev, loading: true, error: null }));
    run()
      .then((data) => active && setState({ data, loading: false, error: null }))
      .catch((error) => active && setState({ data: null, loading: false, error }));
    return () => {
      active = false;
    };
  }, [run]);

  useEffect(load, [load]);

  return { ...state, reload: load };
}
