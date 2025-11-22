import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  // 获取文章详情
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setPost(data);
      } catch (error) {
        alert('Error fetching post: ' + error.message);
      }
    };

    fetchPost();
  }, [id]);

  // ==================== 这里是修改的核心部分 ====================

  // 1. 把 fetchComments 函数提取出来，定义在 useEffect 外面
  const fetchComments = useCallback(async () => {
    try {
      const { error, data } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data);
    } catch (error) {
      alert('Error fetching comments: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // 2. 使用一个简化的 useEffect 来调用它
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // 提交新评论
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const userId = 'e8ba956d-a9f3-4bff-b673-60b783c1cf48'; // 记得替换成真实的 user_id

      const { error } = await supabase
        .from('comments')
        .insert([
          { content: newComment, post_id: id, user_id: userId }
        ]);

      if (error) throw error;
      
      // 刷新评论列表
      setNewComment('');
      // 3. 这里现在可以成功调用 fetchComments() 了
      fetchComments();
    } catch (error) {
      alert('Error adding comment: ' + error.message);
    }
  };

  if (loading)
    return (
      <div className="post-detail">
        <div className="loading">正在加载文章...</div>
      </div>
    );

  if (!post)
    return (
      <div className="post-detail">
        <div className="empty-state">未找到这篇文章，可能已经被删除。</div>
      </div>
    );

  return (
    <div className="post-detail">
      <button onClick={() => navigate('/')}>返回首页</button>
      <h1>{post.title}</h1>
      <p className="post-date">{new Date(post.created_at).toLocaleDateString()}</p>
      <div className="post-content">{post.content}</div>

      <hr />

      <h3>评论区 ({comments.length})</h3>
      <form onSubmit={handleCommentSubmit} className="comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="添加一条评论..."
          required
        ></textarea>
        <button type="submit">提交</button>
      </form>

      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <p>{comment.content}</p>
            <small>评论于: {new Date(comment.created_at).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostDetail;