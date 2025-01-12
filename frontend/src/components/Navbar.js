import React, { useEffect, useState } from 'react';
import { Link , useNavigate} from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { baseUrl } from '../utils/apiConfig';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [auth, setAuth] = useState('')
  const navigate = useNavigate();
  useEffect(()=>{
    const auth = JSON.parse(localStorage.getItem('token'))||[];
    setAuth(auth);
    const {role, token} = auth
    if(!token && !role){
      navigate('/login');
    }
  },[navigate])
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const logout =async()=>{
    try {
      const response = await axios.get(`${baseUrl}/logout`, {withCredentials:true});
      localStorage.clear('token');
      setAuth('');
      navigate('/login');
      alert(response.data.message);
    
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <nav className="px-8 py-2 flex justify-between items-center bg-[#6c01c5] text-white font-semibold">
      <span className="font-medium text-2xl
       bg-white text-[#6c01c5] 
       px-2 py-1 
     
       ">RBCMS</span>
      <button
        className="text-white text-2xl md:hidden focus:outline-none"
        onClick={toggleMenu}
      >
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Navigation Links */}
      <div
        className={`absolute top-16 left-0 w-full bg-[#6c01c5] md:bg-transparent md:static md:w-auto md:flex ${
          isMenuOpen ? 'block' : 'hidden'
        }`}
      >
        <ul className="flex flex-col md:flex-row md:items-center md:gap-4">
          {auth.role==='admin' && <><li className="p-4 md:p-0">
            <Link to="/">Candidate List</Link>
          </li>
          <li className="p-4 md:p-0">
            <Link to="/add_candidate">Add Candidate</Link>
          </li></>}
          {auth.role==='candidate' && <li className="p-4 md:p-0">
            <Link to="/candidate_profile">My Profile</Link>
          </li>}
          { auth.length===0?<li className="p-4 md:p-0">
            <Link to="/login">Login</Link>
          </li>:
          <li className="p-4 md:p-0">
            <Link onClick={logout} to="/login" >Logout</Link>
          </li>}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
