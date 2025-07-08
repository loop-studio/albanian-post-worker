export default {
    async fetch(request) {
        const asn = request.cf?.asn || 'unknown';

        const response = await fetch(request);
        const newHeaders = new Headers(response.headers);
        newHeaders.set('X-ASN', asn);
        newHeaders.set('X-Worker-Active', 'yes');

        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders,
        });
    }
}
