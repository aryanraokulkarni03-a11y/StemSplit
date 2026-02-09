/**
 * Analytics Dashboard Component
 * 
 * Admin dashboard for viewing analytics and system health
 * Displays key metrics, charts, and real-time data
 */

'use client';

import { useEffect, useState } from 'react';

interface HealthMetrics {
    status: string;
    timestamp: string;
    uptime: number;
    memory: {
        used: number;
        total: number;
        percentage: number;
    };
    cpu: {
        usage: {
            user: number;
            system: number;
        };
    };
    environment: string;
    version: string;
}

export function AnalyticsDashboard() {
    const [health, setHealth] = useState<HealthMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchHealthMetrics();

        // Refresh every 30 seconds
        const interval = setInterval(fetchHealthMetrics, 30000);

        return () => clearInterval(interval);
    }, []);

    async function fetchHealthMetrics() {
        try {
            const response = await fetch('/api/health');

            if (!response.ok) {
                throw new Error('Failed to fetch health metrics');
            }

            const data = await response.json();
            setHealth(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="analytics-dashboard loading">
                <p>Loading analytics...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="analytics-dashboard error">
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={fetchHealthMetrics}>Retry</button>
            </div>
        );
    }

    if (!health) {
        return null;
    }

    const uptimeHours = Math.floor(health.uptime / 3600);
    const uptimeMinutes = Math.floor((health.uptime % 3600) / 60);

    return (
        <div className="analytics-dashboard" data-status={health.status}>
            <header>
                <h1>Analytics Dashboard</h1>
                <div className="status-badge" data-status={health.status}>
                    {health.status.toUpperCase()}
                </div>
            </header>

            <div className="metrics-grid">
                {/* System Health */}
                <div className="metric-card">
                    <h3>System Health</h3>
                    <div className="metric-value">{health.status}</div>
                    <div className="metric-label">Status</div>
                </div>

                {/* Uptime */}
                <div className="metric-card">
                    <h3>Uptime</h3>
                    <div className="metric-value">
                        {uptimeHours}h {uptimeMinutes}m
                    </div>
                    <div className="metric-label">Server Uptime</div>
                </div>

                {/* Memory Usage */}
                <div className="metric-card">
                    <h3>Memory Usage</h3>
                    <div className="metric-value">{health.memory.percentage}%</div>
                    <div className="metric-label">
                        {health.memory.used} MB / {health.memory.total} MB
                    </div>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${health.memory.percentage}%` }}
                            data-level={
                                health.memory.percentage > 80
                                    ? 'high'
                                    : health.memory.percentage > 50
                                        ? 'medium'
                                        : 'low'
                            }
                        />
                    </div>
                </div>

                {/* Environment */}
                <div className="metric-card">
                    <h3>Environment</h3>
                    <div className="metric-value">{health.environment}</div>
                    <div className="metric-label">Version {health.version}</div>
                </div>
            </div>

            <div className="dashboard-sections">
                {/* TODO: Add more sections */}
                {/* - User Analytics (active users, sessions, page views) */}
                {/* - Audio Processing Stats (total processed, avg time, success rate) */}
                {/* - Error Logs (recent errors, error rate) */}
                {/* - API Performance (response times, request rate) */}
                {/* - Real-time Activity Feed */}
            </div>

            <footer>
                <p>Last updated: {new Date(health.timestamp).toLocaleString()}</p>
                <button onClick={fetchHealthMetrics}>Refresh</button>
            </footer>
        </div>
    );
}
