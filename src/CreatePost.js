// src/CreatePost.js

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('标题和内容不能为空');
      return;
    }

    try {
      // 同样，这里需要用户登录，暂时用一个固定的 user_id
      const userId = 'e8ba956d-a9f3-4bff-b673-60b783c1cf48'; // 替换成一个真实的 user_id

      const { data, error } = await supabase
        .from('posts')
        .insert([
          { title: title, content: content, user_id: userId }
        ]);

      if (error) throw error;
      // 成功后跳转到首页
      navigate('/');
    } catch (error) {
      alert('Error creating post: ' + error.message);
    }
  };

  return (
    <div className="create-post">
      <h1>创建新文章</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">标题:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">内容:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="10"
            required
          ></textarea>
        </div>
        <button type="submit">发布文章</button>
      </form>
    </div>
  );
}

export default CreatePost;