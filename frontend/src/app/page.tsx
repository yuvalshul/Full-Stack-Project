"use client";
import axios from 'axios';

import { useEffect, useState } from 'react';

import type { note } from './Note';
import Note from './Note';
import Pagination from './pagination';

const HomePage = () => {
  const [notes, setNotes] = useState<note[]>([]);
  const[numOfPages, setNumOfPages] = useState<number>(1);
  const[currentPage, setCurrentPage] = useState<number>(1);
  const[numOfNotes, setNumOfNotes] = useState<number>(1);
  const [newNoteTitle, setNewNoteTitle] = useState<string>('');
  const [newAuthorName, setNewAuthorName] = useState<string>('');
  const [newAuthorEmail, setNewAuthorEmail] = useState<string>('');
  const [newNoteContent, setNewNoteContent] = useState<string>('');
  const [theme, setTheme] = useState<string>('black');
  const [isAdding, setIsAdding] = useState(false);
  
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
        const { data } = response; // Extract data from the response object
        const { notes, count } = data; // Destructure notes and count from data
        setNumOfNotes(count);
        setNotes(notes);
        setNumOfPages (Math.ceil(count / 10));
      })
      .catch(error => { console.log("Encountered an error:" + error)});
  }, [currentPage, numOfNotes]);

const handleSave = (idDB: number, newContent: string) => {
  const id = (currentPage - 1) * 10 + notes.findIndex(note => note.id === idDB) + 1;
  console.log("1) node id to update: " + id)
  axios.put(`http://localhost:3001/notes/${id}`, {
    content: newContent
  })
  .then((response) => {
    console.log("2) node id to update: " + id)
    setNotes(notes.map(note => note.id === idDB ? { ...note, content: newContent } : note
    ));
  })
  .catch(error => {
    console.error('Error updating note:', error);
  });
};


const handleDelete = (idDB: number) => {
  const inedx = notes.findIndex(note => note.id === idDB);
  const id = (currentPage - 1) * 10 + inedx + 1;
  //console.log(id)
  axios.delete(`http://localhost:3001/notes/${id}`)
  .then((response) => {
    // Remove the note from the notes state if successful
    setNotes(notes => {
      const updatedNotes = [...notes];
      updatedNotes.splice(inedx, 1); // Remove the note at index id - 1
      setNumOfNotes(numOfNotes - 1);
      if(updatedNotes.length == 0)
        setCurrentPage(currentPage - 1);
      return updatedNotes;
    });
  })
  .catch(error => {
    console.error('Error deleting note:', error);
  });
};

const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setNewNoteTitle(event.target.value);
};

const handleAuthorNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setNewAuthorName(event.target.value);
};

const handleAuthorEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setNewAuthorEmail(event.target.value);
};

const handleContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setNewNoteContent(event.target.value);
};

const handleThemeChange = () => {
  const newTheme = theme === 'white' ? 'black' : 'white';
  setTheme(newTheme);
};


const handleAddNote = () => {
  setIsAdding (true);
};

const handleCancelClick = () => {
  //setEditContent(content);
  setIsAdding(false);
};

const handleSaveClick = () => {
  axios.post(`http://localhost:3001/notes`, {
    title: newNoteTitle,
    author: {
      name: newAuthorName,
      email: newAuthorEmail
    },
    content: newNoteContent
  })
    .then((response) => {
      console.log("Note added successfully:", response.data);
      setNotes([...notes, response.data]);
      setNewNoteTitle('');
      setNewAuthorName('');
      setNewAuthorEmail('');
      setNewNoteContent('');
      setNumOfNotes(numOfNotes + 1);
    })
    .catch(error => {
      console.error('Error adding note:', error);
    });
};

return (
  <div style={{ padding: '30px',minHeight: '100vh', margin: 0, backgroundColor: theme === 'white' ? 'black' : 'white'}}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
    <h1 className="mainHeadline" style={{ marginBottom: '6px', color: theme }}>Notes</h1>
      <button name="change_theme" onClick={handleThemeChange} style={{backgroundColor: 'LightGrey', borderColor: theme, color: 'black'}}>Change theme to {theme}</button>
    </div>
      {notes.map((note) => (
        <div style={{ color: theme }}>
        <Note key={note.id} id={note.id} title={note.title} author={note.author} content={note.content} theme={theme} onSave={handleSave} onDelete={handleDelete}></Note>
        </div>
      ))}
      <button name="add_new_note" onClick={handleAddNote} style={{backgroundColor: 'LightGrey', borderColor: theme, color: 'black'}}>Add Note</button>
      {isAdding && (
        <div>
        <br />
          <input type="text" placeholder="Enter note title..." value={newNoteTitle} onChange={handleTitleChange} style={{backgroundColor: 'LightGrey', borderColor: theme, color: 'black'}}/>
          <br />
          <input type="text" placeholder="Enter author name..." value={newAuthorName} onChange={handleAuthorNameChange} style={{backgroundColor: 'LightGrey', borderColor: theme, color: 'black'}}/>
          <br />
          <input type="text" placeholder="Enter author email..." value={newAuthorEmail} onChange={handleAuthorEmailChange} style={{backgroundColor: 'LightGrey', borderColor: theme, color: 'black'}}/>
          <br />
          <input type="text" placeholder="Enter note content..." value={newNoteContent} onChange={handleContentChange} style={{backgroundColor: 'LightGrey', borderColor: theme, color: 'black'}}/>
          <br />
          <button name="text_input_save_new_note" onClick={handleSaveClick} style={{backgroundColor: 'LightGrey', borderColor: theme, color: 'black'}}>Save</button>
          <button name="text_input_cancel_new_note" onClick={handleCancelClick} style={{backgroundColor: 'LightGrey', borderColor: theme, color: 'black'}}>Cancel</button>
        </div>
      )}
    <Pagination currentPage={currentPage} pageCount={numOfPages} handle={(i: number) => handleClick(i)}></Pagination>
  </div>
);}

export default HomePage;