const { Log } = require('./logger'); 

const AUTH_API_URL = "http://4.224.186.213/evaluation-service/auth";
const NOTIFICATIONS_API_URL = "http://4.224.186.213/evaluation-service/notifications";

const weights = {
    "Placement": 3,
    "Result": 2,
    "Event": 1
};

async function getPriorityInbox() {  
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

        if (!authResponse.ok) {
            return;
        }

        const authData = await authResponse.json();
        const AUTH_TOKEN = authData.access_token || authData.token; 

        const response = await fetch(NOTIFICATIONS_API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AUTH_TOKEN}` 
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            Log("backend", "error", "api", `Failed to fetch notifications. Status: ${response.status}`);
            return;
        }

        const data = await response.json();
        const notifications = data.notifications || [];

        notifications.sort((a, b) => {
            const weightA = weights[a.Type] || 0;
            const weightB = weights[b.Type] || 0;
            if (weightA !== weightB) {
                return weightB - weightA; 
            } else {
                const timeA = new Date(a.Timestamp).getTime();
                const timeB = new Date(b.Timestamp).getTime();
                return timeB - timeA; 
            }
        });

        const top10Notifications = notifications.slice(0, 10);
        
        Log("backend", "info", "api", "Successfully fetched and sorted top 10 Priority Notifications");
        
    } catch (error) {
    }
}

getPriorityInbox();