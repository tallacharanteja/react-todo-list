import { useState, useEffect } from 'react';
import './App.css';
import Login from './Login';
import Signup from './Signup';

function App() {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  // Load user and todos from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('todoUser');
    if (savedUser) {
      setUser(savedUser);
      const userTodos = JSON.parse(localStorage.getItem(`todos_${savedUser}`) || '[]');
      setTodos(userTodos);
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`todos_${user}`, JSON.stringify(todos));
    }
  }, [todos, user]);

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
      setInput('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEdit = (id, text) => {
    setEditId(id);
    setEditText(text);
  };

  const saveEdit = () => {
    setTodos(todos.map(todo => 
      todo.id === editId ? { ...todo, text: editText } : todo
    ));
    setEditId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditText('');
  };

  const handleLogin = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[email] && users[email] === password) {
      setUser(email);
      localStorage.setItem('todoUser', email);
      const userTodos = JSON.parse(localStorage.getItem(`todos_${email}`) || '[]');
      setTodos(userTodos);
      return true;
    }
    return false;
  };

  const handleSignup = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[email]) {
      return false; // User already exists
    }
    users[email] = password;
    localStorage.setItem('users', JSON.stringify(users));
    setUser(email);
    localStorage.setItem('todoUser', email);
    setTodos([]);
    return true;
  };

  const handleLogout = () => {
    localStorage.removeItem('todoUser');
    setUser(null);
    setTodos([]);
  };

  if (!user) {
    return showSignup ? (
      <Signup onSignup={handleSignup} onSwitchToLogin={() => setShowSignup(false)} />
    ) : (
      <Login onLogin={handleLogin} onSwitchToSignup={() => setShowSignup(true)} />
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>To-Do List</h1>
        <div>
          <span style={{ marginRight: '10px' }}>Welcome, {user}</span>
          <button onClick={handleLogout} style={{ padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
        </div>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new task..."
          style={{ padding: '8px', marginRight: '10px', width: '300px' }}
        />
        <button onClick={addTodo} style={{ padding: '8px 16px' }}>Add</button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li key={todo.id} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '10px', 
            borderBottom: '1px solid #eee' 
          }}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              style={{ marginRight: '10px' }}
            />
            {editId === todo.id ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                  style={{ flex: 1, padding: '4px', marginRight: '10px' }}
                />
                <button onClick={saveEdit} style={{ background: '#4CAF50', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', marginRight: '5px' }}>Save</button>
                <button onClick={cancelEdit} style={{ background: '#888', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', marginRight: '5px' }}>Cancel</button>
              </>
            ) : (
              <>
                <span style={{ 
                  flex: 1, 
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  color: todo.completed ? '#888' : '#000'
                }}>
                  {todo.text}
                </span>
                <button onClick={() => startEdit(todo.id, todo.text)} style={{ background: '#2196F3', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', marginRight: '5px' }}>Edit</button>
                <button onClick={() => deleteTodo(todo.id)} style={{ background: '#ff4444', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px' }}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
      
      {todos.length === 0 && (
        <p style={{ textAlign: 'center', color: '#888' }}>No tasks yet. Add one above!</p>
      )}
    </div>
  );
}

export default App;
