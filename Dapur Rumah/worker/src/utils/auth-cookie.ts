const SESSION_COOKIE_NAMES = [
    '__Secure-better-auth.session_token',
    'better-auth.session_token',
];

export function withSessionCookieFromAuthorization(rawHeaders: Headers | Request) {
    const headers = rawHeaders instanceof Request
        ? new Headers(rawHeaders.headers)
        : new Headers(rawHeaders);

    const authHeader = headers.get('authorization') || '';
    if (!authHeader.toLowerCase().startsWith('bearer ')) {
        return headers;
    }

    const token = authHeader.slice(7).trim();
    if (!token) {
        return headers;
    }

    const existingCookieHeader = headers.get('cookie') || '';
    const hasSessionCookie = SESSION_COOKIE_NAMES.some((name) =>
        existingCookieHeader.includes(`${name}=`)
    );
    if (hasSessionCookie) {
        return headers;
    }

    const encodedToken = encodeURIComponent(token);
    const fallbackCookies = SESSION_COOKIE_NAMES
        .map((name) => `${name}=${encodedToken}`)
        .join('; ');

    headers.set(
        'cookie',
        existingCookieHeader
            ? `${existingCookieHeader}; ${fallbackCookies}`
            : fallbackCookies
    );
    return headers;
}

export function withRequestSessionCookieFromAuthorization(request: Request) {
    const authHeader = request.headers.get('authorization') || '';
    if (!authHeader.toLowerCase().startsWith('bearer ')) {
        return request;
    }

    const token = authHeader.slice(7).trim();
    if (!token) {
        return request;
    }

    const existingCookieHeader = request.headers.get('cookie') || '';
    const hasSessionCookie = SESSION_COOKIE_NAMES.some((name) =>
        existingCookieHeader.includes(`${name}=`)
    );
    if (hasSessionCookie) {
        return request;
    }

    const headers = withSessionCookieFromAuthorization(request);
    return new Request(request, { headers });
}
