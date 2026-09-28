// What the Dealr Trigger does with the subscription its workflow remembers,
// on activation and deactivation. Dependency-free, so the connector tests drive it.

export interface RememberedSubscription {
    url: string;
    events: string[];
    enabled?: boolean;
}

function sameEvents(a: string[], b: string[]): boolean {
    return a.length === b.length && [...a].sort().join(',') === [...b].sort().join(',');
}

/**
 * - `recreate`: it serves another webhook URL (the test URL, or n8n before it
 *   moved host), so leave it alone and give this URL its own.
 * - `update`: a revoked connection or 72 hours of failed deliveries disabled
 *   it, or the workflow now wants other events; re-enable it with those.
 * - `keep`: it already delivers what this workflow wants.
 */
export function reconcileSubscription(existing: RememberedSubscription, url: string, events: string[]): 'recreate' | 'update' | 'keep' {
    if (existing.url !== url) return 'recreate';
    if (existing.enabled === false || !sameEvents(existing.events, events)) return 'update';
    return 'keep';
}

/**
 * The subscriptions a new one for `url` replaces. A create retried after its
 * response was lost has already made one, which would deliver every event a
 * second time; each trigger node has a webhook URL of its own, so any earlier
 * subscription this connection made to it is stale.
 */
export function subscriptionsTo(subscriptions: { id: string; url: string }[], url: string): string[] {
    return subscriptions.filter((subscription) => subscription.url === url).map((subscription) => subscription.id);
}

function httpStatus(error: unknown): number | undefined {
    const candidate = error as { httpCode?: string; response?: { status?: number }; cause?: { response?: { status?: number } } } | null;
    const status = candidate?.response?.status ?? candidate?.cause?.response?.status ?? Number(candidate?.httpCode);
    return Number.isFinite(status) ? status : undefined;
}

export function isNotFound(error: unknown): boolean {
    return httpStatus(error) === 404;
}

/**
 * Whether deleting a subscription failed only because there is nothing left
 * to delete for this connection: the subscription is already gone (404), or
 * the connection itself is (401, after n8n's own token refresh failed). A
 * disconnect in Dealr has already disabled every subscription it made, and
 * a key that no longer works cannot delete one, so deactivating the workflow
 * must still succeed.
 */
export function subscriptionAlreadyGone(error: unknown): boolean {
    const status = httpStatus(error);
    return status === 404 || status === 401;
}
