const AUTH_API_URL = "http://4.224.186.213/evaluation-service/auth";
const LOG_API_URL = "http://4.224.186.213/evaluation-service/logs";

let cachedToken = null;
async function getValidToken() {
    if (cachedToken) return cachedToken;

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
}

async function Log(stack, level, packageName, message) {
    try {
        const token = await getValidToken();

        const response = await fetch(LOG_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({
                "stack": stack,
                "level": level,
                "package": packageName,
                "message": message
            })
        });

    } catch (error) {
    }
}

module.exports = { Log };