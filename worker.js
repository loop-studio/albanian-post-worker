export default {
    async fetch(request) {
        const url = new URL(request.url);
        const originalBody = await request.text();

        // Only process geo-api calls
        const asn = request.cf?.asn || 'unknown';

        const response = await fetch("https://admin.albanianpost.com/api", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: originalBody,
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
