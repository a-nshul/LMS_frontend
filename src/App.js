import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Signup from './components/singup';
import Dashboard from "./components/home";
import Attendence from './components/attendance';
import Assignment from './components/assignments';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="attendance" element={<Attendence />} />
        <Route path="assignments" element={<Assignment />} />

      </Routes>
    </Router>
  );
}
 
export default App;
