import { useState } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

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

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1>To-Do List</h1>
      
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
