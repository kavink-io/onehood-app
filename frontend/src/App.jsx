import { Routes, Route } from 'react-router-dom';
import { AppShell } from '@mantine/core';

// Import all your page/layout components
import Navbar from './components/Navbar';
import Feed from './components/Feed';
import Marketplace from './components/Marketplace';
import Calendar from './components/Calendar';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    // We pass a function to the 'styles' prop. Mantine automatically
    // provides the 'theme' to this function. This is the fix.
    <AppShell
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      <Navbar />
      <main style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </AppShell>
  );
}

export default App;