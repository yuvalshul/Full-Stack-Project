"use client";
import axios from 'axios';

import { useEffect, useState } from 'react';

import type { Post } from './Posts';
import Pagination from './pagination';

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const[numOfPages, setNumOfPages] = useState<number>(1)
  const[currentPage, setCurrentPage] = useState<number>(1);
  
  const handleClick = (i: number): void =>{
    setCurrentPage(i);
  };

  useEffect(() => {
    const promise = axios.get(`http://localhost:3001/notes`, {
      params: {
        _page: currentPage,
        _per_page: 10,
      },
    });
    promise
      .then((response) => {
        setPosts(response.data);
        const totalNumOfPosts = parseInt(response.headers["x-total-count"], 10);
        setNumOfPages (Math.ceil(totalNumOfPosts / 10));
      })
      .catch(error => { console.log("Encountered an error:" + error)});
  }, [currentPage]);

return (
  <div style={{ padding: '20px' }}>
    <h1 className="mainHeadline" style={{ marginBottom: '6px' }}>Posts</h1>
    {posts.length > 0 ? (
      posts.map((post) => (
        <div key={post.id} style={{ marginBottom: '20px' }}>
          <span className="bullet">&#8226;</span>
          <span className="headline">{post.title}</span>
          <p><strong>Author:</strong> {post.author.name} ({post.author.email})</p>
          <p>{post.content}</p>
        </div>
      ))
    ) : (
      <p>No posts to display.</p>
    )}
    <Pagination currentPage={currentPage} pageCount={numOfPages} handle={(i: number) => handleClick(i)}></Pagination>
  </div>
);}

export default HomePage;