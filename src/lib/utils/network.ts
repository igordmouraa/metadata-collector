export function getClientIp(request: Request): string {
    const headers = request.headers;
    const cfConnectingIp = headers.get('cf-connecting-ip');
    const xRealIp = headers.get('x-real-ip');
    const xForwardedFor = headers.get('x-forwarded-for');

    return cfConnectingIp || xRealIp || xForwardedFor || 'unknown';
}