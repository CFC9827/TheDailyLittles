/**
 * Daily Games Platform
 * 
 * Main app with routing between games
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Home } from './pages/Home';
import { CipherGame } from './pages/CipherGame';
import { GridGame } from './games/grid/GridGame';
import { ShiftGame } from './games/shift/ShiftGame';
import { SortGame } from './games/sort/SortGame';
import { MiniGame } from './games/mini/MiniGame';
import { AdminDashboard } from './pages/AdminDashboard';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cipher" element={<CipherGame />} />
          <Route path="/gridgram" element={<GridGame />} />
          <Route path="/shift" element={<ShiftGame />} />
          <Route path="/sort" element={<SortGame />} />
          <Route path="/mini" element={<MiniGame />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;


