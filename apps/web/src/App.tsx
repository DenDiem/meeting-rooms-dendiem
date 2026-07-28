import { useEffect, useState, type JSX } from 'react';

interface HealthResponse {
  readonly status: string;
  readonly database: string;
}

type HealthState =
  | { readonly kind: 'loading' }
  | { readonly kind: 'ready'; readonly health: HealthResponse }
  | { readonly kind: 'failed'; readonly message: string };

const fetchHealth = async (signal: AbortSignal): Promise<HealthResponse> => {
  const response = await fetch('/api/health', { signal });

  if (!response.ok) {
    throw new Error(`the API answered with ${response.status}`);
  }

  return (await response.json()) as HealthResponse;
};

export const App = (): JSX.Element => {
  const [state, setState] = useState<HealthState>({ kind: 'loading' });

  useEffect(() => {
    const controller = new AbortController();

    fetchHealth(controller.signal)
      .then((health) => setState({ kind: 'ready', health }))
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setState({
            kind: 'failed',
            message: error instanceof Error ? error.message : String(error),
          });
        }
      });

    return () => controller.abort();
  }, []);

  return (
    <main className="page">
      <h1>Meeting rooms</h1>

      {state.kind === 'loading' && <p className="card">Checking the API…</p>}

      {state.kind === 'ready' && (
        <dl className="card">
          <dt>API</dt>
          <dd>{state.health.status}</dd>
          <dt>Database</dt>
          <dd>{state.health.database}</dd>
        </dl>
      )}

      {state.kind === 'failed' && (
        <p className="card card--failed">The API is unreachable: {state.message}</p>
      )}
    </main>
  );
};
