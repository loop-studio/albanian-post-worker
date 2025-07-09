export default {
    async fetch(request) {
        const url = new URL(request.url);
        const pathname = url.pathname;

        const asn = request.cf?.asn || 'unknown';

        // Clone headers to inject into request
        const reqHeaders = new Headers(request.headers);
        reqHeaders.set('x-client-asn', asn); // 👈 this header will be readable in Nuxt SSR middleware

        let response;

        // Special case: geo-api proxy logic
        if (pathname.startsWith('/geo-api')) {
            const forwardedAsn = reqHeaders.get('x-forwarded-asn');
            const effectiveAsn = forwardedAsn || asn;

            response = await fetch("https://admin.albanianpost.com/api", {
                method: request.method,
                headers: reqHeaders,
                body: request.body,
                redirect: request.redirect,
            });

            const newHeaders = new Headers(response.headers);
            newHeaders.set('x-asn', effectiveAsn);
            newHeaders.set('access-control-expose-headers', 'x-asn');

            return new Response(response.body, {
                status: response.status,
                statusText: response.statusText,
                headers: newHeaders,
            });
        }

        const modifiedRequest = new Request(request.url, {
            method: request.method,
            headers: reqHeaders,
            body: request.body,
            redirect: request.redirect,
            // cf: request.cf // optional – not necessary
        });

        const rootResponse = await fetch(modifiedRequest);

        const newHeaders = new Headers(rootResponse.headers);
        newHeaders.set('x-asn', asn);
        newHeaders.set('access-control-expose-headers', 'x-asn');

        return new Response(rootResponse.body, {
            status: rootResponse.status,
            statusText: rootResponse.statusText,
            headers: newHeaders,
        });
    }
};