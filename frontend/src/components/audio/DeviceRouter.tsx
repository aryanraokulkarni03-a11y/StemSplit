'use client';

import { useState } from 'react';

export interface Device {
    id: string;
    name: string;
    type: 'headphones' | 'speakers' | 'bluetooth';
}

export interface Routing {
    vocal: string[];
    instrumental: string[];
}

export interface DeviceRouterProps {
    onRoutingChange: (routing: Routing) => void;
    className?: string;
}

/**
 * Device Router Component
 * Simulates audio routing to multiple devices
 * 
 * Features:
 * - List of available output devices (mock data)
 * - Drag-and-drop stems to devices
 * - Visual indicator of routing connections
 * - Support for N devices
 * 
 * TODO: Integrate user's custom skeuomorphic design
 * TODO: Implement actual drag-and-drop (currently using click-based routing)
 */
export function DeviceRouter({ onRoutingChange, className }: DeviceRouterProps) {
    const [devices] = useState<Device[]>([
        { id: 'device-1', name: 'Headphones', type: 'headphones' },
        { id: 'device-2', name: 'Speakers', type: 'speakers' },
        { id: 'device-3', name: 'Bluetooth Speaker', type: 'bluetooth' },
    ]);

    const [routing, setRouting] = useState<Routing>({
        vocal: ['device-1'],
        instrumental: ['device-2'],
    });

    const handleStemToggle = (stem: 'vocal' | 'instrumental', deviceId: string) => {
        setRouting((prev) => {
            const newRouting = { ...prev };
            const stemDevices = newRouting[stem];

            if (stemDevices.includes(deviceId)) {
                // Remove device from stem
                newRouting[stem] = stemDevices.filter((id) => id !== deviceId);
            } else {
                // Add device to stem
                newRouting[stem] = [...stemDevices, deviceId];
            }

            onRoutingChange(newRouting);
            return newRouting;
        });
    };

    const isRouted = (stem: 'vocal' | 'instrumental', deviceId: string): boolean => {
        return routing[stem].includes(deviceId);
    };

    return (
        <div className={className} data-component="device-router">
            <h3>Audio Routing</h3>
            <p className="description">
                Route different stems to different output devices
            </p>

            {/* Stems */}
            <div className="stems-container">
                <div className="stem" data-stem="vocal">
                    <h4>Vocal Track</h4>
                    <div className="stem-indicator" data-active={routing.vocal.length > 0}>
                        Routed to {routing.vocal.length} device(s)
                    </div>
                </div>

                <div className="stem" data-stem="instrumental">
                    <h4>Instrumental Track</h4>
                    <div className="stem-indicator" data-active={routing.instrumental.length > 0}>
                        Routed to {routing.instrumental.length} device(s)
                    </div>
                </div>
            </div>

            {/* Devices */}
            <div className="devices-container">
                <h4>Available Devices</h4>
                {devices.map((device) => (
                    <div
                        key={device.id}
                        className="device-card"
                        data-device-type={device.type}
                    >
                        <div className="device-info">
                            <span className="device-icon">{/* Icon placeholder */}</span>
                            <span className="device-name">{device.name}</span>
                        </div>

                        <div className="device-routing-controls">
                            <button
                                onClick={() => handleStemToggle('vocal', device.id)}
                                className={`routing-button ${isRouted('vocal', device.id) ? 'active' : ''}`}
                                data-active={isRouted('vocal', device.id)}
                                aria-label={`Route vocal to ${device.name}`}
                            >
                                Vocal
                            </button>

                            <button
                                onClick={() => handleStemToggle('instrumental', device.id)}
                                className={`routing-button ${isRouted('instrumental', device.id) ? 'active' : ''}`}
                                data-active={isRouted('instrumental', device.id)}
                                aria-label={`Route instrumental to ${device.name}`}
                            >
                                Instrumental
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Routing Visualization */}
            <div className="routing-visualization">
                <h4>Current Routing</h4>
                <div className="routing-map">
                    <div className="routing-line" data-stem="vocal">
                        Vocal → {routing.vocal.map((id) => devices.find((d) => d.id === id)?.name).join(', ') || 'None'}
                    </div>
                    <div className="routing-line" data-stem="instrumental">
                        Instrumental → {routing.instrumental.map((id) => devices.find((d) => d.id === id)?.name).join(', ') || 'None'}
                    </div>
                </div>
            </div>
        </div>
    );
}
