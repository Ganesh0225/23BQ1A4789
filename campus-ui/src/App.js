import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Grid, Card, CardContent, Chip, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { fetchNotifications } from './apiService';
import { Log } from './logger';

function NotificationList({ isPriority }) {
    const [notifications, setNotifications] = useState([]);
    const [filterType, setFilterType] = useState('All');
    const [viewedIds, setViewedIds] = useState(() => {
        return JSON.parse(localStorage.getItem('viewedNotifications')) || [];
    });

    useEffect(() => {
        async function loadData() {
            const data = await fetchNotifications(isPriority);
            setNotifications(data);
            Log("frontend", "info", "page", `Loaded ${isPriority ? "Priority" : "All Notifications"} page`);
        }
        loadData();
    }, [isPriority]);

    const markAsViewed = (id) => {
        if (!viewedIds.includes(id)) {
            const newViewed = [...viewedIds, id];
            setViewedIds(newViewed);
            localStorage.setItem('viewedNotifications', JSON.stringify(newViewed));
            Log("frontend", "info", "component", `Notification ID ${id} marked as viewed`);
        }
    };

    const getTypeColor = (type) => {
        if (type === 'Placement') return 'success';
        if (type === 'Result') return 'primary';
        return 'default';
    };

    const displayedNotifications = notifications.filter(n => 
        filterType === 'All' ? true : n.Type === filterType
    );

    return (
        <Box sx={{ mt: 2 }}>
            <Box mb={3} display="flex" justifyContent="flex-end">
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="filter-label">Filter by Type</InputLabel>
                    <Select
                        labelId="filter-label"
                        value={filterType}
                        label="Filter by Type"
                        onChange={(e) => {
                            setFilterType(e.target.value);
                            Log("frontend", "info", "component", `Filtered list by type: ${e.target.value}`);
                        }}
                    >
                        <MenuItem value="All">All Types</MenuItem>
                        <MenuItem value="Placement">Placement</MenuItem>
                        <MenuItem value="Result">Result</MenuItem>
                        <MenuItem value="Event">Event</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Grid container spacing={2}>
                {displayedNotifications.map(n => {
                    const isViewed = viewedIds.includes(n.ID);
                    return (
                        <Grid item xs={12} key={n.ID}>
                            <Card 
                                onClick={() => markAsViewed(n.ID)}
                                sx={{ 
                                    cursor: 'pointer', 
                                    opacity: isViewed ? 0.6 : 1,
                                    backgroundColor: isViewed ? '#f5f5f5' : '#ffffff',
                                    borderLeft: isViewed ? 'none' : '6px solid #1976d2',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                        <Typography variant="h6" color={isViewed ? "textSecondary" : "textPrimary"}>
                                            {n.Message}
                                        </Typography>
                                        <Chip label={n.Type} color={getTypeColor(n.Type)} variant={isViewed ? "outlined" : "filled"} />
                                    </Box>
                                    <Typography variant="caption" color="textSecondary">
                                        {new Date(n.Timestamp).toLocaleString()} &nbsp; • &nbsp;
                                        <strong>{isViewed ? "Viewed" : "NEW"}</strong>
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    )
                })}
            </Grid>
        </Box>
    );
}

export default function App() {
    return (
        <Router>
            <AppBar position="static" color="primary">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Affordmed Campus Portal
                    </Typography>
                    <Button color="inherit" component={Link} to="/">All Notifications</Button>
                    <Button color="inherit" component={Link} to="/priority">Priority Inbox</Button>
                </Toolbar>
            </AppBar>
            
            <Container maxWidth="md" sx={{ mb: 5 }}>
                <Routes>
                    <Route path="/" element={
                        <>
                            <Typography variant="h4" sx={{ mt: 4, mb: 1 }}>All Notifications</Typography>
                            <Typography variant="subtitle1" color="textSecondary">Click a notification to mark it as viewed.</Typography>
                            <NotificationList isPriority={false} />
                        </>
                    } />
                    <Route path="/priority" element={
                        <>
                            <Typography variant="h4" sx={{ mt: 4, mb: 1 }}>Priority Inbox</Typography>
                            <Typography variant="subtitle1" color="textSecondary">Top 10 highest priority unread alerts.</Typography>
                            <NotificationList isPriority={true} />
                        </>
                    } />
                </Routes>
            </Container>
        </Router>
    );
}