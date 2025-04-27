import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config/apiConfig';
import DefaultAvatar from '../../assets/pp2.jpeg';
import { useToast } from './Toast';
import ConfirmDialog from './ConfirmDialog';

const CommentSection = ({ 
  post, 
  currentUser, 
  formatTime, 
  onCommentAdded,
  onCommentDeleted 
}) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();
  
  // Add state for confirm dialog
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/posts/${post.id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newComment })
      });
      
      if (!response.ok) {
        throw new Error('Failed to add comment');
      }
      
      const updatedPost = await response.json();
      setNewComment('');
      setShowComments(true);
      
      if (onCommentAdded) {
        onCommentAdded(updatedPost);
      }
      
      addToast('Comment added successfully!', 'success');
    } catch (error) {
      console.error('Error adding comment:', error);
      addToast('Failed to add comment. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };
  
  const toggleComments = () => {
    setShowComments(!showComments);
  };
  
  // Add this to determine if user can delete a comment
  const canDeleteComment = (comment) => {
    return currentUser && (
      currentUser.id === comment.userId || 
      currentUser.id === post.authorId
    );
  };
  
  // Make sure we handle the case when onCommentDeleted is not provided
  const handleDeleteComment = (commentId) => {
    setCommentToDelete(commentId);
    setShowConfirmDialog(true);
  };
  
  const confirmDeleteComment = () => {
    if (typeof onCommentDeleted === 'function' && commentToDelete) {
      onCommentDeleted(post.id, commentToDelete);
    } else {
      console.warn('onCommentDeleted prop is not a function');
    }
    setShowConfirmDialog(false);
    setCommentToDelete(null);
  };
  
  return (
    <div className="mt-2">
      <div 
        className="flex items-center cursor-pointer py-2 text-gray-500 hover:text-DarkColor"
        onClick={toggleComments}
      >
        <i className={`bx ${showComments ? 'bx-chevron-up' : 'bx-chevron-down'} mr-2`}></i>
        <span>{post.comments?.length || 0} Comments</span>
      </div>
      
      {showComments && (
        <div className="mt-2 space-y-3">
          {/* Comment form */}
          <form onSubmit={handleSubmitComment} className="flex space-x-2">
            <img 
              src={currentUser?.profilePicture || DefaultAvatar} 
              alt={currentUser?.username}
              className="h-8 w-8 rounded-full object-cover"
            />
            <div className="flex-1 relative">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full px-3 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-DarkColor"
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={!newComment.trim() || isSubmitting}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-DarkColor disabled:text-gray-400"
              >
                {isSubmitting ? (
                  <i className='bx bx-loader-alt animate-spin'></i>
                ) : (
                  <i className='bx bx-send'></i>
                )}
              </button>
            </div>
          </form>
          
          {/* Comments list */}
          <div className="space-y-3">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <div key={comment.id} className="flex space-x-2 group">
                  <img 
                    src={comment.userProfilePicture || DefaultAvatar} 
                    alt={comment.username}
                    className="h-8 w-8 rounded-full object-cover cursor-pointer"
                    onClick={() => handleUserClick(comment.userId)}
                  />
                  <div className="flex-1">
                    <div className="bg-gray-100 px-3 py-2 rounded-lg relative">
                      <p 
                        className="font-medium text-sm text-gray-800 cursor-pointer hover:underline"
                        onClick={() => handleUserClick(comment.userId)}
                      >
                        {comment.username}
                      </p>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                      
                      {/* Use the safe handler for delete */}
                      {canDeleteComment(comment) && (
                        <button 
                          className="absolute right-2 top-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleDeleteComment(comment.id)}
                          title="Delete comment"
                        >
                          <i className='bx bx-trash text-sm'></i>
                        </button>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 ml-2">
                      {formatTime(comment.createdAt)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-gray-500">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      )}
      
      {/* Add Confirm Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={confirmDeleteComment}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default CommentSection;
