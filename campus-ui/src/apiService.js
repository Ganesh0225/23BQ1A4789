import { getValidToken, Log } from './logger';

const NOTIFICATIONS_API_URL = "/evaluation-service/notifications";

export async function fetchNotifications(isPriority = false) {
    const token = await getValidToken();
    if (!token) return [];

    try {
        const response = await fetch(NOTIFICATIONS_API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            }
        });

        if (!response.ok) {
            Log("frontend", "error", "api", `Failed to fetch notifications. Status: ${response.status}`);
            return [];
        }

        const data = await response.json();
        let notifications = data.notifications || [];

        Log("frontend", "info", "api", `Successfully fetched ${isPriority ? "Priority" : "All"} notifications`);

        if (isPriority) {
            const weights = { "Placement": 3, "Result": 2, "Event": 1 };
            notifications.sort((a, b) => {
                const weightA = weights[a.Type] || 0;
                const weightB = weights[b.Type] || 0;
                if (weightA !== weightB) return weightB - weightA;
                return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
            });
            return notifications.slice(0, 10);
        }

        return notifications;
    } catch (error) {
        Log("frontend", "error", "api", `Crash in fetchNotifications: ${error.message}`);
        return [];
    }
}