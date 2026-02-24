async function test() {
    try {
        const res = await fetch("http://localhost:8787/api/auth/sign-up/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Origin": "http://localhost:5173"
            },
            body: JSON.stringify({
                email: "siti12@example.com",
                password: "password123",
                name: "Siti Hajar"
            })
        });
        const text = await res.text();
        console.log("Status:", res.status);
        console.log("Response:", text);
    } catch (e) {
        console.error("Fetch Error:", e);
    }
}
test();
