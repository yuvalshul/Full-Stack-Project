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

  const Post: React.FC<Post> = ({id, title, author, content}) => {
    return(
      <div>
        <h2>"id=:"{id}</h2>
        <div>title=:{title}</div>
        {author ? (
        <>
          <div>author: {author.name}</div>
          <div>author email: {author.email}</div>
        </>
      ) : (
        <div>author: Unknown</div>
      )}
        <div>content=:{content}</div>
      </div>
    );  
  }

  export default Post;