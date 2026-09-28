// Verifies a Dealr webhook delivery: X-Dealr-Signature is the hex HMAC-SHA256
// of `${X-Dealr-Timestamp}.${raw body}` under the subscription's secret. Each
// retry is signed afresh, so a delivery older than the tolerance is a replay,
// not a retry.
//
// No n8n import, so tests can drive this file directly against Dealr's signer.

import { createHmac, timingSafeEqual } from 'crypto';

export const TOLERANCE_SECONDS = 10 * 60;

export interface SignedDelivery {
    secret: unknown;
    timestamp: unknown;
    signature: unknown;
    body: unknown;
    nowSeconds?: number;
}

export function verifyDeliverySignature({
    secret, timestamp, signature, body, nowSeconds = Math.floor(Date.now() / 1000),
}: SignedDelivery): boolean {
    if (typeof secret !== 'string' || secret === '') return false;
    if (typeof signature !== 'string' || !/^[0-9a-f]{64}$/i.test(signature)) return false;
    if (typeof body !== 'string') return false;

    const signedAt = Number(timestamp);
    if (!Number.isInteger(signedAt) || Math.abs(nowSeconds - signedAt) > TOLERANCE_SECONDS) return false;

    const expected = createHmac('sha256', secret).update(`${signedAt}.${body}`).digest();
    const given = Buffer.from(signature, 'hex');
    return given.length === expected.length && timingSafeEqual(given, expected);
}
