import { Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Index from './pages/Index';
import Dashboard from './pages/Admin/Dashboard';
import ChatBox from './pages/dashboard/chatbox';
const App = () => {
  return (
    <>
      {/* <Navbar /> */}
      <Routes>
        <Route path='/' element={<Index />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/dashboard/*' element={<Dashboard />} />
        <Route path='/chatbox' element={<ChatBox />} />
      </Routes>
    </>
  );
};

export default App;
