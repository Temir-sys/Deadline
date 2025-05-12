import React, { useState, useEffect } from 'react';

function App() {
  const [deadlines, setDeadlines] = useState(() => {
    const saved = localStorage.getItem('deadlines');
    return saved ? JSON.parse(saved) : [];
  });

  const [newDeadline, setNewDeadline] = useState({ title: '', date: '' });
  const [now, setNow] = useState(new Date());

  // Обновляем время каждую секунду
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Сохраняем дедлайны в localStorage
  useEffect(() => {
    localStorage.setItem('deadlines', JSON.stringify(deadlines));
  }, [deadlines]);

  const addDeadline = () => {
    if (!newDeadline.title || !newDeadline.date) return;
    setDeadlines([
      ...deadlines,
      {
        ...newDeadline,
        tasks: [],
        id: Date.now()
      }
    ]);
    setNewDeadline({ title: '', date: '' });
  };

  const addTask = (deadlineId, text) => {
    setDeadlines(deadlines.map(dl => {
      if (dl.id === deadlineId) {
        return {
          ...dl,
          tasks: [...dl.tasks, { text, done: false }]
        };
      }
      return dl;
    }));
  };

  const toggleTask = (deadlineId, index) => {
    setDeadlines(deadlines.map(dl => {
      if (dl.id === deadlineId) {
        const updated = dl.tasks.map((t, i) => i === index ? { ...t, done: !t.done } : t);
        return { ...dl, tasks: updated };
      }
      return dl;
    }));
  };

  const getTimeLeft = (date, now) => {
    const then = new Date(date);
    const diff = then - now;

    if (diff <= 0) return '⛔ Время вышло';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return `${days}д ${hours}ч ${minutes}м ${seconds}с`;
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🕰 Deadline</h1>

      <input
        type="text"
        placeholder="Название"
        value={newDeadline.title}
        onChange={e => setNewDeadline({ ...newDeadline, title: e.target.value })}
      />
      <input
        type="datetime-local"
        value={newDeadline.date}
        onChange={e => setNewDeadline({ ...newDeadline, date: e.target.value })}
      />
      <button onClick={addDeadline}>➕ Добавить</button>

      <hr style={{ margin: '2rem 0' }} />

      {deadlines.map(dl => (
        <div key={dl.id} style={{ marginBottom: '2rem' }}>
          <h2>{dl.title}</h2>
          <p>⏳ Осталось: {getTimeLeft(dl.date, now)}</p>

          <TaskList
            tasks={dl.tasks}
            onAdd={text => addTask(dl.id, text)}
            onToggle={index => toggleTask(dl.id, index)}
          />
        </div>
      ))}
    </div>
  );
}

function TaskList({ tasks, onAdd, onToggle }) {
  const [text, setText] = useState('');

  const handleAdd = () => {
    if (!text) return;
    onAdd(text);
    setText('');
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Цель"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={handleAdd}>Добавить цель</button>

      <ul>
        {tasks.map((t, i) => (
          <li
            key={i}
            style={{
              textDecoration: t.done ? 'line-through' : 'none',
              cursor: 'pointer'
            }}
            onClick={() => onToggle(i)}
          >
            {t.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
