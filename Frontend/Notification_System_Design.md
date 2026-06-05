# Stage 1

## My Approach for the Priority Inbox
To figure out the top 10 most important notifications, I decided to sort the data using two main rules: the category of the notification, and how new it is.

1. **Setting Priority Weights:** First, I gave a score (or weight) to each category based on how important it is. Placements get the highest score (3), Results get a 2, and Events get a 1. 
2. **The Sorting Logic:** When the function runs, it sorts the list by these scores first. If two notifications have the exact same score (for example, if they are both "Placement" updates), the code looks at the timestamps and breaks the tie by putting the newest one on top.
3. **Getting the Output:** Once the entire list is sorted perfectly, I just slice the array to grab the first 10 items and return them to the user.

## Handling Real-Time Updates Efficiently
Right now, the code grabs the whole list and sorts it. That works fine for a static API call, but if notifications are constantly streaming in live, re-sorting a massive array every few seconds will slow the application down.

To maintain the top 10 efficiently without performance issues, the best approach is to use a **Min-Heap (Priority Queue)** that is strictly limited to 10 items.

* **The Setup:** The heap holds the current top 10 notifications. The "weakest" or lowest-priority notification out of those 10 sits at the very top of the heap (the root).
* **When a New Notification Arrives:** I don't need to look at the whole list. I just compare the new notification to the root of the heap. If the new one has a higher priority, I pop the old root out and insert the new one. 
* **Why this is better:** This means I never have to re-sort a massive database. I am only ever managing exactly 10 items in memory at any given time. Evaluating and inserting a new item only takes O(log k) time, which keeps the microservice incredibly fast even under a heavy load.