"use client";
import axios from 'axios';

import '../css/globals.css';

import { useEffect, useState } from 'react';

import type { note } from '../components/Note';
import Note from '../components/Note';
import Pagination from '../components/pagination';

export default function Page () {
  const [notes, setNotes] = useState<note[]>([]);
  const [numOfPages, setNumOfPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [numOfNotes, setNumOfNotes] = useState<number>(1);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [createUserName, setCreateUserName] = useState<string>('');
  const [createPassword, setCreatePassword] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [newNoteTitle, setNewNoteTitle] = useState<string>('');
  const [newAuthorName, setNewAuthorName] = useState<string>('');
  const [newAuthorEmail, setNewAuthorEmail] = useState<string>('');
  const [newNoteContent, setNewNoteContent] = useState<string>('');
  const [theme, setTheme] = useState<string>('black');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const promise = axios.get(`http://localhost:3001/notes`, {
      params: {
        _page: currentPage,
        _per_page: 10,
      },
    })
    promise
      .then((response) => {
        setNotes(response.data.notesRes);
        setNumOfNotes(parseInt(response.data.count));
        setNumOfPages (Math.ceil(numOfNotes / 10));
      })
      .catch(error => { console.error("Encountered an error:" + error)});;
  }, [currentPage, numOfNotes]);

const handlePaginationClick = (i: number): void =>{
  setCurrentPage(i);
};

const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setName(event.target.value);
};

const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setEmail(event.target.value);
};

const handleCreateUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setCreateUserName(event.target.value);
};

const handleCreatePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setCreatePassword(event.target.value);
};

const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setUserName(event.target.value);
};

const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setPassword(event.target.value);
};


const handleNoteSave = (idDB: number, newContent: string) => {
  const id = (currentPage - 1) * 10 + notes.findIndex(note => note.id === idDB) + 1;
  axios.put(`http://localhost:3001/notes/${id}`, {
    content: newContent
  })
  .then((response) => {
    setNotes(notes.map(note => note.id === idDB ? { ...note, content: newContent } : note
    ));
  })
  .catch(error => {
    console.error('Error updating note:', error);
  });
};


const handleNoteDelete = (idDB: number) => {
  const inedx = notes.findIndex(note => note.id === idDB);
  const id = (currentPage - 1) * 10 + inedx + 1;
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
  setNewNoteTitle('');
  setNewAuthorName('');
  setNewAuthorEmail('');
  setNewNoteContent('');
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
      setNotes([...notes, response.data]);
      setNewNoteTitle('');
      setNewAuthorName('');
      setNewAuthorEmail('');
      setNewNoteContent('');
      setIsAdding(false);
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
    <form>
    <h1 className="headline" style={{ color: theme }}>Create user</h1>
    <input name="........." type="text" placeholder="Enter Name..." value={name} onChange={handleNameChange} style={{backgroundColor: 'LightGrey', borderColor: theme, color: 'black'}}/>
    <br />
    <input name="........." type="text" placeholder="Enter Email..." value={email} onChange={handleEmailChange} style={{backgroundColor: 'LightGrey', borderColor: theme, color: 'black'}}/>
    <br />
    <input name="........." type="text" placeholder="Enter user name..." value={createUserName} onChange={handleCreateUserNameChange} style={{backgroundColor: 'LightGrey', borderColor: theme, color: 'black'}}/>
    <br />
    <input name="........." type="text" placeholder="Enter password..." value={createPassword} onChange={handleCreatePasswordChange} style={{backgroundColor: 'LightGrey', borderColor: theme, color: 'black'}}/>
    <br />
    <button name="........." onClick={()=>{}} style={{backgroundColor: 'LightGrey', borderColor: theme, color: 'black'}}>Create</button>
    </form>
    <br />
    <form>
    <h1 className="headline" style={{ color: theme }}>Login</h1>
    <input name="........." type="text" placeholder="Enter user name..." value={userName} onChange={handleUserNameChange} style={{backgroundColor: 'LightGrey', borderColor: theme, color: 'black'}}/>
    <br />
    <input name="........." type="text" placeholder="Enter password..." value={password} onChange={handlePasswordChange} style={{backgroundColor: 'LightGrey', borderColor: theme, color: 'black'}}/>
    <br />
    <button name="........." onClick={()=>{}} style={{backgroundColor: 'LightGrey', borderColor: theme, color: 'black'}}>Login</button>
    </form>
      {notes.map((note) => (
        <div key={note.id} style={{ color: theme }}>
        <Note key={note.id} id={note.id} title={note.title} author={note.author} content={note.content} theme={theme} onSave={handleNoteSave} onDelete={handleNoteDelete}></Note>
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
          <input name="text_input_new_note" type="text" placeholder="Enter note content..." value={newNoteContent} onChange={handleContentChange} style={{backgroundColor: 'LightGrey', borderColor: theme, color: 'black'}}/>
          <br />
          <button name="text_input_save_new_note" onClick={handleSaveClick} style={{backgroundColor: 'LightGrey', borderColor: theme, color: 'black'}}>Save</button>
          <button name="text_input_cancel_new_note" onClick={handleCancelClick} style={{backgroundColor: 'LightGrey', borderColor: theme, color: 'black'}}>Cancel</button>
          </div>
        
      )}
    <Pagination currentPage={currentPage} pageCount={numOfPages} handle={(i: number) => handlePaginationClick(i)}></Pagination>
  </div>
);}

