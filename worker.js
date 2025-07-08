export default {
    async fetch(request) {
        const asn = request.cf?.asn || 'unknown';

        // Fetch the original request
        const response = await fetch(request);

        // Clone response and inject header
        const newHeaders = new Headers(response.headers);
        newHeaders.set('X-ASN', asn);

        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders
        });
    }
}
