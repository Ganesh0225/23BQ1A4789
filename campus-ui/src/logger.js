const AUTH_API_URL = "/evaluation-service/auth";
const LOG_API_URL = "/evaluation-service/logs";

let cachedToken = null;

export async function getValidToken() {
    if (cachedToken) return cachedToken;
    try {
        const authResponse = await fetch(AUTH_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "email": "arunganeshtadepalli03@gmail.com",
                "name": "tadepalli mohan sai arun ganesh",
                "rollNo": "23bq1a4789",
                "accessCode": "QQdEYy",
                "clientID": "386dc0cd-8e3f-4578-a60a-d3b3a89e2a0a",
                "clientSecret": "rhzyNkMJQeqrAnDN"
            })
        });
        const authData = await authResponse.json();
        cachedToken = authData.access_token || authData.token;
        return cachedToken;
    } catch (error) {
        return null;
    }
}

export async function Log(stack, level, packageName, message) {
    try {
        const token = await getValidToken();
        await fetch(LOG_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ stack, level, package: packageName, message })
        });
    } catch (error) {
    }
}