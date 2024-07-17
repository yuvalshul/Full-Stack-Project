"use client";
import axios from 'axios';

import '../css/globals.css';
import loginService from '../services/login'
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
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [newNoteTitle, setNewNoteTitle] = useState<string>('');
  const [newAuthorName, setNewAuthorName] = useState<string>('');
  const [newAuthorEmail, setNewAuthorEmail] = useState<string>('');
  const [newNoteContent, setNewNoteContent] = useState<string>('');
  const [theme, setTheme] = useState<string>('black');
  const [isAdding, setIsAdding] = useState(false);
  const [user, setUser] = useState<{ token: string } | null>(null);

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

const handleNoteSave = (idDB: number, newContent: string) => {
  const id = (currentPage - 1) * 10 + notes.findIndex(note => note.id === idDB) + 1;
  if(user)
  axios.put(`http://localhost:3001/notes/${id}`, {
    content: newContent
  }, {headers: { Authorization: setToken(user.token) }})
  .then((response) => {
    console.log(".then frontend")
    setNotes(notes.map(note => note.id === idDB ? { ...note, content: newContent } : note
    ));
  })
  .catch(error => {
    console.error('Error updating note:', error);
  });
};

const setToken = (newToken: string) => {
  return `Bearer ${newToken}`
}

const handleNoteDelete = (idDB: number) => {
  const inedx = notes.findIndex(note => note.id === idDB);
  const id = (currentPage - 1) * 10 + inedx + 1;
  if(user)
    axios.delete(`http://localhost:3001/notes/${id}`, {headers: { Authorization: setToken(user.token) }})
  .then((response) => {
    console.log("delete frontend .then")
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
  if(user){
    axios.post(`http://localhost:3001/notes`, {
      title: newNoteTitle,
      author: {
        name: newAuthorName,
        email: newAuthorEmail
      },
      content: newNoteContent
    }, {headers: { Authorization: setToken(user.token) }})
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
      })
  };
  handleCancelClick();
};

const handleCreateUser = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  try{
    console.log(name)
    console.log(email)
    console.log(createUserName)
    console.log(createPassword)
    axios.post(`http://localhost:3001/users`, {
    name: name,
    email: email,
    username: createUserName,
    password: createPassword
  })
  setCreatePassword('')
  setCreateUserName('')
  setEmail('')
  setName('')
}
  catch(error) {
    console.error('could not create a new user', error);
  };
}

const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault()
  try {
    const user = await loginService.login({
      username, password,
    })
    //setToken(user.token)
    setUser(user)
    setUsername('')
    setPassword('')
  } catch (exception) {
    console.error('Wrong credentials', exception);
    setTimeout(() => {
      console.error(null)
    }, 5000)
  }
}


return (
  <div style={{ padding: '30px',minHeight: '100vh', margin: 0, backgroundColor: theme === 'white' ? 'black' : 'white'}}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
    <h1 className="mainHeadline" style={{ marginBottom: '6px', color: theme }}>Notes</h1>
      <button name="change_theme" onClick={handleThemeChange} style={{backgroundColor: 'LightGrey', borderColor: theme, color: 'black'}}>Change theme to {theme}</button>
    </div>
    <br />
    {user === null ?
    <div>
    <form name="create_user_form" onSubmit={handleCreateUser}>
    <h1 className="headline" style={{ color: theme }}>Create user</h1>
    <input name="create_user_form_name" type="text" placeholder="Enter Name..." value={name} onChange={({ target }) => setName(target.value)} style={{backgroundColor: 'LightGrey', borderColor: theme, color: 'black'}}/>
    <br />
    <input name= "create_user_form_email" type="text" placeholder="Enter Email..." value={email} onChange={({ target }) => setEmail(target.value)} style={{backgroundColor: 'LightGrey', borderColor: theme, color: 'black'}}/>
    <br />
    <input name="create_user_form_username" type="text" placeholder="Enter user name..." value={createUserName} onChange={({ target }) => setCreateUserName(target.value)} style={{backgroundColor: 'LightGrey', borderColor: theme, color: 'black'}}/>
    <br />
    <input name="create_user_form_password" type="text" placeholder="Enter password..." value={createPassword} onChange={({ target }) => setCreatePassword(target.value)} style={{backgroundColor: 'LightGrey', borderColor: theme, color: 'black'}}/>
    <br />
    <button name= "create_user_form_create_user" onClick={()=>{}} style={{backgroundColor: 'LightGrey', borderColor: theme, color: 'black'}}>Create User</button>
    </form>
    <br />
    <form name="login_form" onSubmit={handleLogin}>
    <h1 className="headline" style={{ color: theme }}>Login</h1>
    <input name="login_form_username" type="text" placeholder="Enter user name..." value={username} onChange={({ target }) => setUsername(target.value)} style={{backgroundColor: 'LightGrey', borderColor: theme, color: 'black'}}/>
    <br />
    <input name="login_form_password" type="text" placeholder="Enter password..." value={password} onChange={({ target }) => setPassword(target.value)} style={{backgroundColor: 'LightGrey', borderColor: theme, color: 'black'}}/>
    <br />
    <button name="login_form_login" type="submit" style={{backgroundColor: 'LightGrey', borderColor: theme, color: 'black'}}>Login</button>
    </form>
    </div>
    :
    <div>
    <button name="logout" onClick={()=>{}} style={{backgroundColor: 'LightGrey', borderColor: theme, color: 'black'}}>Logout</button>
    </div>
    }
      {notes.map((note) => (
        <div key={note.id} style={{ color: theme }}>
        <Note key={note.id} id={note.id} title={note.title} author={note.author} content={note.content} theme={theme} onSave={handleNoteSave} onDelete={handleNoteDelete}></Note>
        </div>
      ))}
      
      <button name="add_new_note" onClick={handleAddNote} style={{backgroundColor: 'LightGrey', borderColor: theme, color: 'black'}}>Add Note</button>
      {isAdding && (
        <div>
        <br />
          <input type="text" placeholder="Enter note title..." value={newNoteTitle} onChange={({ target }) => setNewNoteTitle(target.value)} style={{backgroundColor: 'LightGrey', borderColor: theme, color: 'black'}}/>
          <br />
          <input type="text" placeholder="Enter author name..." value={newAuthorName} onChange={({ target }) => setNewAuthorName(target.value)} style={{backgroundColor: 'LightGrey', borderColor: theme, color: 'black'}}/>
          <br />
          <input type="text" placeholder="Enter author email..." value={newAuthorEmail} onChange={({ target }) => setNewAuthorEmail(target.value)} style={{backgroundColor: 'LightGrey', borderColor: theme, color: 'black'}}/>
          <br />
          <input name="text_input_new_note" type="text" placeholder="Enter note content..." value={newNoteContent} onChange={({ target }) => setNewNoteContent(target.value)} style={{backgroundColor: 'LightGrey', borderColor: theme, color: 'black'}}/>
          <br />
          <button name="text_input_save_new_note" onClick={handleSaveClick} style={{backgroundColor: 'LightGrey', borderColor: theme, color: 'black'}}>Save</button>
          <button name="text_input_cancel_new_note" onClick={handleCancelClick} style={{backgroundColor: 'LightGrey', borderColor: theme, color: 'black'}}>Cancel</button>
          </div>
        
      )}
    <Pagination currentPage={currentPage} pageCount={numOfPages} handle={(i: number) => handlePaginationClick(i)}></Pagination>
  </div>
);}