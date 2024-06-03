"use client";

import { useEffect, useState } from 'react';

import type { Post } from './Posts';
import Pagination from './pagination';

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const[numOfPages, setNumOfPages] = useState<number>(1)
  const[currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('http://localhost:3001/notes');
      const data = await response.json();
      const startIndex = (currentPage - 1) * 10;
      const slicedPosts = data.slice(startIndex, startIndex + 10);
      setPosts(slicedPosts);
      setNumOfPages(Math.ceil(data.length / 10));
    };

    fetchPosts();
  }, []);
  return (
    <div style={{ padding: '20px' }}>
      <h1>Posts</h1>
      {posts.map((post) => (
        <div key={post.id} style={{ marginBottom: '20px' }}>
          <h2>{post.title}</h2>
          <p><strong>Author:</strong> {post.author.name} ({post.author.email})</p>
          <p>{post.content}</p>
        </div>
      ))}
      <Pagination page={currentPage} pageCount={numOfPages}></Pagination>
    </div>
  );
};

export default HomePage;
