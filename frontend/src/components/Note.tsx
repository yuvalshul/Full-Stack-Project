import { useEffect, useState } from 'react';

export type note = {
    id: number;
    title: string;
    author: {
      name: string;
      email: string;
    }
    content: string;
    theme: string;
    onSave: (id: number, newContent: string) => void; //Saving content function
    onDelete: (id: number) => void; //Deleting note function
  }

  const Note: React.FC<note> = ({id, title, author, content, theme, onSave, onDelete}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(content);
  
    const handleEditClick = () => {
      setIsEditing(true);
    };
  
    const handleSaveClick = () => {
      onSave(id, editContent);
      setEditContent(content);
      setIsEditing(false);
    };
  
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setEditContent(event.target.value);
    };

    const handleDeleteClick = () => {
      onDelete(id);
    };

    const handleCancelClick = () => {
      setEditContent(content);
      setIsEditing(false);
    };

    return(
      <div className="note" id={id.toString()} key={id} style={{ marginBottom: '20px' }}>
          <span className="bullet">&#8226;</span>
          <span className="headline" style={{ color: theme }}>{title}</span>
          <button name={`delete-${id}`} onClick={handleDeleteClick} style={{backgroundColor: 'LightGrey', borderColor: theme, color: 'black'}}>Delete</button>
          <button name={`edit-${id}`} onClick={handleEditClick} style={{backgroundColor: 'LightGrey', borderColor: theme, color: 'black'}}>Edit</button>
          <p><strong>Author:</strong> {author.name} ({author.email})</p>
          {isEditing ? (
            <div>
            <textarea name={`text_input-${id}`} value={editContent} onChange={handleChange} style={{backgroundColor: 'LightGrey', color: 'black'}}/>
            <button name={`text_input_save-${id}`} onClick={handleSaveClick} style={{backgroundColor: 'LightGrey', borderColor: theme, color: 'black'}}>Save</button>
            <button name={`text_input_cancel-${id}`} onClick={handleCancelClick} style={{backgroundColor: 'LightGrey', borderColor: theme, color: 'black'}}>Cancel</button>
            </div>
          ) : (
            <p>{content}</p>
          )}
      </div>
    );  
  }

  export default Note;