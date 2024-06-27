import { useEffect, useState } from 'react';

export type note = {
    noteNumber: number;
    title: string;
    author: {
      name: string;
      email: string;
    }
    content: string;
    onSave: (id: number, newContent: string) => void; //Saving content function
    onDelete: (id: number) => void; //Deleting note function
  }

  const Note: React.FC<note> = ({noteNumber, title, author, content, onSave, onDelete}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(content);
  
    const handleEditClick = () => {
      setIsEditing(true);
    };
  
    const handleSaveClick = () => {
      onSave(noteNumber, editContent);
      setIsEditing(false);
    };
  
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setEditContent(event.target.value);
    };

    const handleDeleteClick = () => {
      onDelete(noteNumber);
    };

    return(
      <div className="post" id={noteNumber.toString()} key={noteNumber} style={{ marginBottom: '20px' }}>
          <span className="bullet">&#8226;</span>
          <span className="headline">{title}</span>
          <button onClick={handleDeleteClick}>delete</button>
          {isEditing ? (
            <button onClick={handleSaveClick}>Save</button>
          ) : (
            <button onClick={handleEditClick}>Edit</button>
          )}
          <p><strong>Author:</strong> {author.name} ({author.email})</p>
          {isEditing ? (
            <textarea value={editContent} onChange={handleChange} />
          ) : (
            <p>{content}</p>
          )}
      </div>
    );  
  }

  export default Note;