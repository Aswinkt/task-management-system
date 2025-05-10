import React from 'react';
import { ActivityLog as ActivityLogType } from '../types';

interface ActivityLogProps {
    activities?: ActivityLogType[];
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ activities = [] }) => {
    return (
        <div className="activity-log">
            <h3>Activity History</h3>
            {activities.length === 0 ? (
                <p className="no-activities">No activity recorded yet.</p>
            ) : (
                <div className="activities-list">
                    {activities.map((activity) => (
                        <div key={activity.id} className="activity-item">
                            <div className="activity-header">
                                <span className="activity-user">
                                    {activity.user.first_name} {activity.user.last_name}
                                </span>
                                <span className="activity-date">
                                    {new Date(activity.created_at).toLocaleString()}
                                </span>
                            </div>
                            <div className="activity-content">
                                <span className="activity-action">{activity.action}</span>
                                {activity.details && (
                                    <p className="activity-details">{activity.details}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}; 