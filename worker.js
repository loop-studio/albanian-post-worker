export default {
    async fetch(request) {
        const asn = request.cf?.asn || 'unknown';

        const response = await fetch(request);
        const newHeaders = new Headers(response.headers);
        newHeaders.set('x-asn', asn);
        newHeaders.set('access-control-expose-headers', 'x-asn');

        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders,
        });
    }
}
