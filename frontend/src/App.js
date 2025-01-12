import React from 'react';
import { Routes,Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import AddCandidate from './pages/AddCandidate';
import CandidateList from './pages/CandidateList';
import CandidateProfile from './pages/CandidateProfile';
import Login from './pages/Login';
import ProtectedRoute from './components/PrivateComp';

function App() {
  return (
    <div className="App">
<Navbar />

<Routes>
<Route path='/login' element={<Login/>}/>

  {/* admin route */}
  <Route element={<ProtectedRoute role={['admin']}/>}>
  <Route path='/' element={<CandidateList/>}/>
  <Route path='/add_candidate' element={<AddCandidate/>}/>
  </Route>

  {/* candidate route */}
  <Route element={<ProtectedRoute role={['candidate']}/>}>
  <Route path='/candidate_profile' element={<CandidateProfile/>}/>
  </Route>
</Routes>

    </div>
  );
}

export default App;
