export default {
    async fetch(request) {
        const url = new URL(request.url);

        // Only intercept /geo-api requests
        if (!url.pathname.startsWith('/geo-api')) {
            return fetch(request);
        }

        // Prefer CF ASN, fallback to x-forwarded-asn header if present
        const cfAsn = request.cf?.asn;
        const forwardedAsn = request.headers.get('x-forwarded-asn');
        const asn = cfAsn || forwardedAsn || 'unknown';

        const response = await fetch("https://admin.albanianpost.com/api", {
            method: request.method,
            headers: request.headers,
            body: request.body,
            redirect: request.redirect,
        });

        const newHeaders = new Headers(response.headers);
        newHeaders.set('x-asn', asn);
        newHeaders.set('access-control-expose-headers', 'x-asn');

        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders,
        });
    }
};
