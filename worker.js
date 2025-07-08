export default {
    async fetch(request) {
        const asn = request.cf && request.cf.asn ? request.cf.asn : 'unknown';
        const headers = new Headers(request.headers);
        headers.set('X-ASN', asn);
        return fetch(request.url, {
            method: request.method,
            headers,
            body: request.body,
            redirect: request.redirect
        });
    }
}