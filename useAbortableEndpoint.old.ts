import type { EndpointInterface } from '@rest-hooks/endpoint';
import { useRef, useMemo, useState } from 'react';

/** Builds abortable Endpoint and returns [Endpoint, Ref<AbortController>]
 *
 * Usage:
 * const [AbortableEndpoint, abortRef] = useAbortableEndpoint(MyEndpoint);
 * const data = useResource(AbortableEndpoint, { id });
 */
export default function useAbortableEndpoint<
  E extends EndpointInterface & {
    extend: (o: { signal?: AbortSignal | undefined }) => E;
  }
>(endpoint: E): [E, AbortController] {
  const [abort, setAbort] = useState(() => new AbortController());

  return [
    useMemo(
      () => {
        return endpoint.extend({
          signal: abort.signal,
        });
      },
      // endpoint is not allowed to change
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [abort],
    ),
    abort,
  ];
}
/*
### useAbortableEndpoint()

```tsx
const [AbortableEndpoint, abortRef] = useAbortableEndpoint(MyEndpoint);
const data = useResource(AbortableEndpoint, { id });
const revalidate = useFetcher(AbortableEndpoint);

return (
  <div>
    <button onClick={() => revalidate({ id })}>Refresh data</button>
    <button onClick={() => abortRef.current.abort()}>Abort fetch!</button>
  </div>
);
```
*/
