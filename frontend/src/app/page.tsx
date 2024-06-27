"use client";
import axios from 'axios';

import { useEffect, useState } from 'react';

import type { note } from './Note';
import Note from './Note';
import Pagination from './pagination';

const HomePage = () => {
  const [notes, setNotes] = useState<note[]>([]);
  const[numOfPages, setNumOfPages] = useState<number>(1)
  const[currentPage, setCurrentPage] = useState<number>(1);
  const[numOfNotes, setNumOfNotes] = useState<number>(1);
  const [newNoteTitle, setNewNoteTitle] = useState<string>('');
  const [newAuthorName, setNewAuthorName] = useState<string>('');
  const [newAuthorEmail, setNewAuthorEmail] = useState<string>('');
  const [newNoteContent, setNewNoteContent] = useState<string>('');
  
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

const handleSave = (id: number, newContent: string) => {
  axios.put(`http://localhost:3001/notes/${id}`, {
    content: newContent
  })
  .then((response) => {
    console.log("newContent=" + newContent)
    setNotes(notes.map(note => note.noteNumber === id ? { ...note, content: newContent } : note
    ));
  })
  .catch(error => {
    console.error('Error updating note:', error);
  });
};


const handleDelete = (id: number) => {
  axios.delete(`http://localhost:3001/notes/${id}`)
  .then((response) => {
    // Remove the note from the notes state if successful
    setNotes(notes.filter(note => note.noteNumber !== id));
  })
  .catch(error => {
    console.error('Error deleting note:', error);
  });
};

const handleAddNote = () => {
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

const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setNewNoteContent(event.target.value);
};

return (
  <div style={{ padding: '20px' }}>
    <h1 className="mainHeadline" style={{ marginBottom: '6px' }}>Notes</h1>
      {notes.map((note) => (
        <Note key={note.noteNumber} noteNumber={note.noteNumber} title={note.title} author={note.author} content={note.content} onSave={handleSave} onDelete={handleDelete}></Note>
      ))}
      <div style={{ marginBottom: '12px' }} className='headline'>Add a new note
      <br />
        <input type="text" placeholder="Enter note title..." value={newNoteTitle} onChange={handleTitleChange}/>
        <br />
        <input type="text" placeholder="Enter author name..." value={newAuthorName} onChange={handleAuthorNameChange}/>
        <br />
        <input type="text" placeholder="Enter author email..." value={newAuthorEmail} onChange={handleAuthorEmailChange}/>
        <br />
        <input type="text" placeholder="Enter note content..." value={newNoteContent} onChange={handleContentChange}/>
        <br />
        <button onClick={handleAddNote}>Add Note</button>
      </div>
    <Pagination currentPage={currentPage} pageCount={numOfPages} handle={(i: number) => handleClick(i)}></Pagination>
  </div>
);}

export default HomePage;