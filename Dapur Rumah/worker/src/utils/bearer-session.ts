import { eq } from 'drizzle-orm';
import { createDb } from '../db';
import { session, user } from '../schema';

export function getBearerToken(rawHeaders: Headers | Request) {
    const headers = rawHeaders instanceof Request ? rawHeaders.headers : rawHeaders;
    const authHeader = headers.get('authorization') || '';
    if (!authHeader.toLowerCase().startsWith('bearer ')) {
        return '';
    }
    return authHeader.slice(7).trim();
}

export async function getSessionFromBearerToken(dbBinding: D1Database, token: string) {
    if (!token) return null;

    const db = createDb(dbBinding);
    const sessionRow = await db
        .select()
        .from(session)
        .where(eq(session.token, token))
        .get();

    if (!sessionRow) return null;

    const expiry = new Date(sessionRow.expiresAt as any);
    if (Number.isNaN(expiry.getTime()) || expiry.getTime() <= Date.now()) {
        return null;
    }

    const userRow = await db
        .select()
        .from(user)
        .where(eq(user.id, sessionRow.userId))
        .get();

    if (!userRow) return null;

    return {
        session: sessionRow,
        user: userRow,
    };
}
