import { Route, Routes } from 'react-router-dom';
import './App.css';
import MeetingRoom from './components/MeetingRoom';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/:sessionId" element={<MeetingRoom />} />
      </Routes>
    </div>
  );
}

export default App;
