import { useEffect, useState } from 'react';

export type note = {
    noteNum: number;
    title: string;
    author: {
      name: string;
      email: string;
    }
    content: string;
    theme: string;
    onSave: (noteNum: number, newContent: string) => void; //Saving content function
    onDelete: (noteNum: number) => void; //Deleting note function
  }

  const Note: React.FC<note> = ({noteNum, title, author, content, theme, onSave, onDelete}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(content);
  
    const handleEditClick = () => {
      setIsEditing(true);
    };
  
    const handleSaveClick = () => {
      onSave(noteNum, editContent);
      setIsEditing(false);
    };
  
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setEditContent(event.target.value);
    };

    const handleDeleteClick = () => {
      onDelete(noteNum);
    };

    const handleCancelClick = () => {
      setEditContent(content);
      setIsEditing(false);
    };

    return(
      <div className="note" id={noteNum.toString()} key={noteNum} style={{ marginBottom: '20px' }}>
          <span className="bullet">&#8226;</span>
          <span className="headline" style={{ color: theme }}>{title}</span>
          <button name={`delete-${noteNum}`} onClick={handleDeleteClick} style={{backgroundColor: 'LightGrey', borderColor: theme, color: 'black'}}>Delete</button>
          <button name={`edit-${noteNum}`} onClick={handleEditClick} style={{backgroundColor: 'LightGrey', borderColor: theme, color: 'black'}}>Edit</button>
          <p><strong>Author:</strong> {author.name} ({author.email})</p>
          {isEditing ? (
            <div>
            <textarea name={`text_input-${noteNum}`} value={editContent} onChange={handleChange} style={{backgroundColor: 'LightGrey', color: 'black'}}/>
            <button name={`text_input_save-${noteNum}`} onClick={handleSaveClick} style={{backgroundColor: 'LightGrey', borderColor: theme, color: 'black'}}>Save</button>
            <button name={`text_input_cancel-${noteNum}`} onClick={handleCancelClick} style={{backgroundColor: 'LightGrey', borderColor: theme, color: 'black'}}>Cancel</button>
            </div>
          ) : (
            <p>{content}</p>
          )}
      </div>
    );  
  }

  export default Note;