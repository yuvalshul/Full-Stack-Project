import { useEffect, useState } from 'react';

export type Post = {
    id: number;
    title: string;
    author: {
      name: string;
      email: string;
    }
    content: string;
  }

  const Posts: React.FC<Post> = ({id, title, author, content}) => {
    return(
      <div  className="post" id={id.toString()} key={id} style={{ marginBottom: '20px' }}>
          <span className="bullet">&#8226;</span>
          <span className="headline">{title}</span>
          <p><strong>Author:</strong> {author.name} ({author.email})</p>
          <p>{content}</p>
      </div>
    );  
  }

  export default Posts;