"use client";

import { useEffect, useState } from 'react';

import type { Post } from './Posts';
import Pagination from './pagination';

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const[numOfPages, setNumOfPages] = useState<number>(1)
  const[currentPage, setCurrentPage] = useState<number>(1);
  
  function handleClick(i:number){
    setCurrentPage(i);
  }

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
  }, [currentPage]);
  return (
    <div style={{ padding: '20px' }}>
      <h1 className="mainHeadline" style={{ marginBottom: '6px' }}>Posts</h1>
      {posts.map((post) => (
        <div key={post.id} style={{ marginBottom: '20px' }}>
          <span className="bullet">&#8226;</span>
          <span className="headline">{post.title}</span>
          <p><strong>Author:</strong> {post.author.name} ({post.author.email})</p>
          <p>{post.content}</p>
        </div>
      ))}
      <Pagination currentPage={currentPage} pageCount={numOfPages} handle={(i: number) => handleClick(i)}></Pagination>
    </div>
  );
};

export default HomePage;
