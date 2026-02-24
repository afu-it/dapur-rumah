import { createAuth } from "./src/auth.js";
import { D1Database } from "@cloudflare/workers-types";

const mockD1 = {
    prepare: (query: string) => {
        console.log("D1 Prepare:", query);
        return {
            bind: (...args: any[]) => {
                console.log("D1 Bind:", args);
                return {
                    first: async () => null,
                    all: async () => ({ results: [] }),
                    run: async () => ({ success: true })
                }
            }
        };
    }
};

const env = {
    DB: mockD1 as unknown as D1Database,
    BETTER_AUTH_SECRET: "mock_secret",
    BETTER_AUTH_URL: "http://localhost:8787",
    FRONTEND_URL: "http://localhost:5173"
};

async function test() {
    try {
        const auth = createAuth(env);
        const req = new Request("http://localhost:8787/api/auth/sign-up/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Origin": "http://localhost:5173"
            },
            body: JSON.stringify({
                email: "test@example.com",
                password: "password123",
                name: "Test User"
            })
        });

        console.log("Sending Request to Auth Handler...");
        const res = await auth.handler(req);
        console.log("Status:", res.status);
        console.log("Body:", await res.text());
    } catch (e) {
        console.error("Crash:", e);
    }
}

test();
