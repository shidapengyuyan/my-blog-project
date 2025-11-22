// src/Home.js

import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Link } from 'react-router-dom';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 在组件加载时获取所有文章
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        // 从 posts 表中选择所有数据，并按创建时间降序排列
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPosts(data);
      } catch (error) {
        alert('Error fetching posts: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading)
    return (
      <div className="home">
        <h1>我的博客</h1>
        <div className="loading">正在加载文章...</div>
      </div>
    );

  return (
    <div className="home">
      <h1>我的博客</h1>
      <Link to="/create" className="create-post-button">创建新文章</Link>
      {posts.length === 0 ? (
        <div className="empty-state">还没有任何文章，快去写一篇吧！</div>
      ) : (
        <div className="posts-list">
          {posts.map((post) => (
            <div key={post.id} className="post-card">
              <h2>{post.title}</h2>
              <p>{new Date(post.created_at).toLocaleDateString()}</p>
              <Link to={`/posts/${post.id}`}>阅读全文</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;