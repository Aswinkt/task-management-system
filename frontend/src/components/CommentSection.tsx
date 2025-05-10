import React, { useState } from 'react';
import { Comment, User } from '../types';
import { taskService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface CommentSectionProps {
    taskId: number;
    comments: Comment[];
    onCommentAdded: (newComment: Comment) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ taskId, comments = [], onCommentAdded }) => {
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            setLoading(true);
            setError(null);
            const comment = await taskService.addComment(taskId, newComment);
            onCommentAdded(comment);
            setNewComment('');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to add comment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="comment-section">
            <h3>Comments</h3>
            {error && <div className="error">{error}</div>}
            
            <form onSubmit={handleSubmit} className="comment-form">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    rows={3}
                    disabled={loading}
                />
                <button type="submit" disabled={loading || !newComment.trim()}>
                    {loading ? 'Posting...' : 'Post Comment'}
                </button>
            </form>

            <div className="comments-list">
                {comments.length === 0 ? (
                    <p className="no-comments">No comments yet. Be the first to comment!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="comment">
                            <div className="comment-header">
                                <span className="comment-author">
                                    {comment.user.first_name} {comment.user.last_name}
                                </span>
                                <span className="comment-date">
                                    {new Date(comment.created_at).toLocaleString()}
                                </span>
                            </div>
                            <p className="comment-content">{comment.content}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}; 