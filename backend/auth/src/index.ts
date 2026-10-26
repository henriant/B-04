import { auth } from "../auth.js"; // path to your auth file

export default {
    async fetch(request: Request) {
        const url = new URL(request.url);

        // Handle auth routes
        if (url.pathname.startsWith("/api/auth")) {
            return auth.handler(request);
        }

        // Handle other routes
        return new Response("Not found", { status: 404 });
    },
};