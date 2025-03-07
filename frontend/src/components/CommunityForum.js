import React, { useState, useEffect } from 'react';
import { 
  FaThumbsUp, 
  FaLightbulb, 
  FaLeaf, 
  FaQuestion, 
  FaStar, 
  FaComments, 
  FaReply, 
  FaPlus, 
  FaSearch,
  FaSpinner 
} from 'react-icons/fa';
import axios from 'axios';
import '../CSS/CommunityForum.css';

const CommunityForum = () => {
  // Community Forum states
  const [forumCategory, setForumCategory] = useState('success');
  const [forumPosts, setForumPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [postError, setPostError] = useState(null);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'success',
    target_type: '',
    target_name: '',
    target_id: '',
    rating: 0
  });
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchingTarget, setIsSearchingTarget] = useState(false);
  
  // Fetch user profile when component mounts
  useEffect(() => {
    fetchUserProfile();
  }, []);
  
  // Fetch community posts when category changes
  useEffect(() => {
    fetchCommunityPosts();
  }, [forumCategory]);
  
  // Fetch user profile from backend
  const fetchUserProfile = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) return;
    
    try {
      setIsLoadingProfile(true);
      
      const response = await axios.get('http://localhost:5000/profile/get', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 200) {
        setUserProfile(response.data.profile);
        console.log('User profile:', response.data.profile);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setIsLoadingProfile(false);
    }
  };
  
  // Fetch community posts from backend
  const fetchCommunityPosts = async () => {
    try {
      setIsLoadingPosts(true);
      setPostError(null);
      
      const response = await axios.get(`http://localhost:5000/community/posts?category=${forumCategory}`);
      
      if (response.status === 200) {
        setForumPosts(response.data.posts || []);
      }
    } catch (error) {
      console.error('Error fetching community posts:', error);
      setPostError('Failed to load community posts. Please try again later.');
    } finally {
      setIsLoadingPosts(false);
    }
  };
  
  // Search for target by name
  const searchTargetByName = async (type, name) => {
    if (!name || name.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    
    try {
      setIsSearchingTarget(true);
      
      let endpoint = '';
      switch (type) {
        case 'donor':
          endpoint = 'donor/search';
          break;
        case 'receiver':
          endpoint = 'receiver/search';
          break;
        case 'delivery_partner':
          endpoint = 'delivery/search';
          break;
        default:
          return;
      }
      
      const response = await axios.get(`http://localhost:5000/${endpoint}?name=${encodeURIComponent(name)}`);
      
      if (response.status === 200) {
        setSearchResults(response.data.results || []);
      }
    } catch (error) {
      console.error(`Error searching for ${type}:`, error);
      setSearchResults([]);
    } finally {
      setIsSearchingTarget(false);
    }
  };
  
  // Handle target name change
  const handleTargetNameChange = (e) => {
    const { value } = e.target;
    setNewPost(prev => ({ ...prev, target_name: value, target_id: '' }));
    
    // Search for targets when name is entered
    if (newPost.target_type && value.trim().length >= 2) {
      searchTargetByName(newPost.target_type, value);
    } else {
      setSearchResults([]);
    }
  };
  
  // Handle target selection
  const handleTargetSelection = (id, name) => {
    setNewPost(prev => ({ 
      ...prev, 
      target_id: id,
      target_name: name
    }));
    setSearchResults([]);
  };
  
  // Handle new post submission
  const handleNewPostSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to create a post');
        return;
      }
      
      // Prepare post data
      const postData = {
        title: newPost.title,
        content: newPost.content,
        category: newPost.category
      };
      
      // Add review-specific fields if it's a review
      if (newPost.category === 'review') {
        if (!newPost.target_type) {
          alert('Please select what you are reviewing');
          return;
        }
        
        if (newPost.target_type !== 'general' && !newPost.target_id) {
          alert('Please select a specific entity to review');
          return;
        }
        
        if (!newPost.rating) {
          alert('Please provide a rating');
          return;
        }
        
        postData.target_type = newPost.target_type;
        postData.target_id = newPost.target_id;
        postData.target_name = newPost.target_name;
        postData.rating = parseInt(newPost.rating);
      }
      
      // Add user profile information if available
      if (userProfile) {
        postData.author_name = getUserDisplayName();
      }
      
      console.log('Sending post data:', postData);
      console.log('Token:', token);
      
      const response = await axios.post('http://localhost:5000/community/posts', postData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 201) {
        // Reset form and fetch updated posts
        setNewPost({
          title: '',
          content: '',
          category: forumCategory,
          target_type: '',
          target_name: '',
          target_id: '',
          rating: 0
        });
        setShowNewPostForm(false);
        fetchCommunityPosts();
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    }
  };
  
  // Get user display name based on role
  const getUserDisplayName = () => {
    if (!userProfile) return 'Anonymous User';
    
    const { role } = userProfile;
    
    // Try to get the name based on role
    if (role === 'donor' && userProfile.name) {
      return userProfile.name;
    } else if (role === 'receiver' && userProfile.name) {
      return userProfile.name;
    } else if (role === 'delivery_partner' && userProfile.name) {
      return userProfile.name;
    } else if (userProfile.email) {
      return userProfile.email.split('@')[0]; // Use part of email as fallback
    }
    
    return 'Anonymous User';
  };
  
  // Handle post like
  const handleLikePost = async (postId) => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to like a post');
        return;
      }
      
      const response = await axios.post(`http://localhost:5000/community/posts/${postId}/like`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 200) {
        // Refresh posts to show updated like count
        fetchCommunityPosts();
      }
    } catch (error) {
      console.error('Error liking post:', error);
      alert('Failed to like post. Please try again.');
    }
  };
  
  // Handle adding a comment
  const handleAddComment = async (postId, commentContent) => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to comment');
        return;
      }
      
      if (!commentContent.trim()) {
        alert('Comment cannot be empty');
        return;
      }
      
      const response = await axios.post(`http://localhost:5000/community/posts/${postId}/comment`, {
        content: commentContent
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 201) {
        // Refresh posts to show the new comment
        fetchCommunityPosts();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    }
  };
  
  // Handle new post form change
  const handleNewPostChange = (e) => {
    const { name, value } = e.target;
    setNewPost(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle forum category change
  const handleForumCategoryChange = (category) => {
    setForumCategory(category);
    setNewPost(prev => ({
      ...prev,
      category: category
    }));
  };
  
  // Handle search change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Get filtered posts based on search query
  const getFilteredPosts = () => {
    if (!searchQuery.trim()) return forumPosts;
    
    return forumPosts.filter(post => 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  
  const filteredPosts = getFilteredPosts();
  
  // Handle new post form button click
  const handleNewPostButtonClick = () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to create a post. Please log in first.');
      // Redirect to login page or show login modal
      window.location.href = '/login';
      return;
    }
    
    setShowNewPostForm(true);
  };
  
  // Render the search results dropdown
  const renderSearchResults = () => {
    if (searchResults.length === 0) {
      return isSearchingTarget ? (
        <div className="search-results">
          <div className="search-result-message">
            <FaSpinner className="spinner" /> Searching...
          </div>
        </div>
      ) : newPost.target_name.length >= 2 ? (
        <div className="search-results">
          <div className="search-result-message">No results found</div>
        </div>
      ) : null;
    }
    
    return (
      <div className="search-results">
        {searchResults.map(result => (
          <div 
            key={result._id} 
            className="search-result-item" 
            onClick={() => handleTargetSelection(result._id, result.name || result.full_name || result.contact_person || result.person_name)}
          >
            {result.name || result.full_name || result.contact_person || result.person_name}
            {result.organization_name && <span className="result-detail"> ({result.organization_name})</span>}
            {result.ngo_name && <span className="result-detail"> ({result.ngo_name})</span>}
            {result.company_name && <span className="result-detail"> ({result.company_name})</span>}
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="community-forum">
      <div className="forum-header">
        <div className="forum-categories">
          <button 
            className={forumCategory === 'success' ? 'active' : ''} 
            onClick={() => handleForumCategoryChange('success')}
          >
            <FaThumbsUp /> Success Stories
          </button>
          <button 
            className={forumCategory === 'initiatives' ? 'active' : ''} 
            onClick={() => handleForumCategoryChange('initiatives')}
          >
            <FaLightbulb /> Initiatives
          </button>
          <button 
            className={forumCategory === 'tips' ? 'active' : ''} 
            onClick={() => handleForumCategoryChange('tips')}
          >
            <FaLeaf /> Tips & Tricks
          </button>
          <button 
            className={forumCategory === 'qa' ? 'active' : ''} 
            onClick={() => handleForumCategoryChange('qa')}
          >
            <FaQuestion /> Q&A
          </button>
          <button 
            className={forumCategory === 'review' ? 'active' : ''} 
            onClick={() => handleForumCategoryChange('review')}
          >
            <FaStar /> Reviews
          </button>
        </div>
        
        <div className="forum-actions">
          <div className="search-box">
            <FaSearch />
            <input 
              type="text" 
              placeholder="Search posts..." 
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          
          <button className="new-post-btn" onClick={handleNewPostButtonClick}>
            <FaPlus /> New Post
          </button>
        </div>
      </div>
      
      {isLoadingPosts ? (
        <div className="loading-message">Loading posts...</div>
      ) : postError ? (
        <div className="error-message">{postError}</div>
      ) : filteredPosts.length === 0 ? (
        <div className="no-posts-message">
          {searchQuery ? 'No posts match your search.' : 'No posts in this category yet. Be the first to post!'}
        </div>
      ) : (
        <div className="forum-posts">
          {filteredPosts.map(post => (
            <div key={post._id} className="forum-post">
              <div className="post-header">
                <h3>{post.title}</h3>
                <div className="post-meta">
                  <span className="post-author">By {post.author_name}</span>
                  <span className="post-date">{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              
              {post.category === 'review' && post.rating && (
                <div className="post-review-info">
                  <div className="post-rating">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < post.rating ? 'star-filled' : 'star-empty'} />
                    ))}
                  </div>
                  {post.target_name && post.target_type && (
                    <div className="review-target">
                      Review of: <span className="target-name">
                        {post.target_name}
                        {post.target_type === 'donor' && ' (Donor)'}
                        {post.target_type === 'receiver' && ' (Receiver)'}
                        {post.target_type === 'delivery_partner' && ' (Delivery Partner)'}
                        {post.target_type === 'general' && ' (General Service)'}
                      </span>
                    </div>
                  )}
                </div>
              )}
              
              <div className="post-content">
                <p>{post.content}</p>
              </div>
              
              <div className="post-actions">
                <button className="like-btn" onClick={() => handleLikePost(post._id)}>
                  <FaThumbsUp /> {post.likes ? post.likes.length : 0} Likes
                </button>
                
                <button className="comment-btn" onClick={() => {
                  // Toggle comment form visibility
                  const commentForm = document.getElementById(`comment-form-${post._id}`);
                  if (commentForm) {
                    commentForm.style.display = commentForm.style.display === 'none' ? 'block' : 'none';
                  }
                }}>
                  <FaComments /> {post.comments ? post.comments.length : 0} Comments
                </button>
              </div>
              
              {/* Comment form */}
              <div id={`comment-form-${post._id}`} className="comment-form" style={{display: 'none'}}>
                <textarea 
                  placeholder="Write a comment..." 
                  id={`comment-input-${post._id}`}
                ></textarea>
                <button onClick={() => {
                  const commentInput = document.getElementById(`comment-input-${post._id}`);
                  if (commentInput) {
                    handleAddComment(post._id, commentInput.value);
                    commentInput.value = '';
                  }
                }}>
                  <FaReply /> Add Comment
                </button>
              </div>
              
              {/* Comments */}
              {post.comments && post.comments.length > 0 && (
                <div className="post-comments">
                  <h4>Comments</h4>
                  {post.comments.map((comment, index) => (
                    <div key={index} className="comment">
                      <div className="comment-header">
                        <span className="comment-author">{comment.author_name}</span>
                        <span className="comment-date">{new Date(comment.created_at).toLocaleDateString()}</span>
                      </div>
                      <p>{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* New Post Form Modal */}
      {showNewPostForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{forumCategory === 'review' ? 'Write a Review' : 'Create a New Post'}</h3>
              <button className="close-btn" onClick={() => setShowNewPostForm(false)}>×</button>
            </div>
            
            <form onSubmit={handleNewPostSubmit} className="new-post-form">
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select 
                  id="category" 
                  name="category" 
                  value={newPost.category}
                  onChange={handleNewPostChange}
                >
                  <option value="success">Success Story</option>
                  <option value="initiatives">Initiative</option>
                  <option value="tips">Tip or Trick</option>
                  <option value="qa">Question</option>
                  <option value="review">Review</option>
                </select>
              </div>
              
              {newPost.category === 'review' && (
                <>
                  <div className="form-group">
                    <label htmlFor="target_type">Review Type</label>
                    <select 
                      id="target_type" 
                      name="target_type" 
                      value={newPost.target_type}
                      onChange={handleNewPostChange}
                      required
                    >
                      <option value="">Select what you're reviewing</option>
                      <option value="donor">Food Donor</option>
                      <option value="receiver">Food Receiver</option>
                      <option value="delivery_partner">Delivery Partner</option>
                      <option value="general">General Service</option>
                    </select>
                  </div>
                  
                  {newPost.target_type && newPost.target_type !== 'general' && (
                    <div className="form-group">
                      <label htmlFor="target_name">Select Specific {newPost.target_type === 'donor' ? 'Donor' : newPost.target_type === 'receiver' ? 'Receiver' : 'Delivery Partner'}</label>
                      <input 
                        type="text" 
                        id="target_name" 
                        name="target_name" 
                        placeholder={`Enter ${newPost.target_type} name`}
                        value={newPost.target_name}
                        onChange={handleTargetNameChange}
                        required
                      />
                      {renderSearchResults()}
                    </div>
                  )}
                  
                  <div className="form-group">
                    <label htmlFor="rating">Rating</label>
                    <div className="rating-input">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={i < newPost.rating ? 'star-filled' : 'star-empty'} 
                          onClick={() => setNewPost(prev => ({...prev, rating: i + 1}))}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input 
                  type="text" 
                  id="title" 
                  name="title" 
                  placeholder="Enter a title for your post" 
                  value={newPost.title}
                  onChange={handleNewPostChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="content">Content</label>
                <textarea 
                  id="content" 
                  name="content" 
                  placeholder="Write your post content here..." 
                  value={newPost.content}
                  onChange={handleNewPostChange}
                  required
                ></textarea>
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={() => setShowNewPostForm(false)}>Cancel</button>
                <button type="submit">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityForum; 