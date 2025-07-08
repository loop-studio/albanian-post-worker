export default {
    async fetch(request) {
        const url = new URL(request.url);

        if (!url.pathname.startsWith('/geo-api')) {
            return fetch(request); // Skip if not our geo endpoint
        }

        const asn = request.cf?.asn || 'unknown';

        // Forward the request to the real API
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
