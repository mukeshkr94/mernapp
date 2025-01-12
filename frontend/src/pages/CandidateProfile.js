import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { RiLoader2Fill } from "react-icons/ri";
import {baseUrl} from '../utils/apiConfig'

const CandidateProfile = () => {
  const [profile, setProfile] = useState([]);
  const [profileImg, setProfileImg] = useState('');
  const [resume, setResume] = useState('');
  const [id, setId] = useState('');
  const [loaderImg, setLoaderImg] = useState(false);
  const [loaderResume, setLoaderResume] = useState(false);

  useEffect(() => {
    const { id } = JSON.parse(localStorage.getItem('token'));
    setId(id);
    getProfileData(id);
  }, []);

  // get profile data
  const getProfileData = async (id) => {
    try {
      const response = await axios.get(`${baseUrl}/get_candidate_byid/${id}`, { withCredentials: true });
      setProfile(response.data.candidate);
    } catch (error) {
      console.log(error)
      alert(error.response.data.message);
    }
  };

  // handle upload image

  const handleImageUpload = async () => {
    const formData = new FormData();
    try {
      formData.append('image', profileImg);
      setLoaderImg(true);
      const response = await axios.post(`${baseUrl}/upload_profileimg/${id}`, formData, {
        withCredentials: true
      });
      console.log(response);
      setLoaderImg(false);
      alert(response.data.message);
      getProfileData(id);
    } catch (error) {
      console.log(error)
      alert(error.response.data.message);
      setLoaderImg(false);
    }
  };

  // handle upload resume 

  const handleResumeUpload = async (filetype) => {
    const formData = new FormData();
    try {
      if (resume.type !== 'application/pdf') {
        alert('Allowed only pdf file');
      }
      formData.append('resume', resume);
      setLoaderResume(true);
      const response = await axios.post(`${baseUrl}/upload_resume/${id}`, formData, {
        withCredentials: true
      });
      alert(response.data.message);
      console.log(response);
      setLoaderResume(false);
      alert(response.data.message);
    } catch (error) {
      console.log(error)
      alert(error.response.data.message);
      setLoaderResume(false);
    }
  };
  return (
    <div className="p-10 flex justify-center  ">
      <table className="w-[40rem] border-[1px] border-[#6c01c5] rounded-lg shadow-xl">
        <tbody>
          <tr className="border-2 border-[#6c01c5] ">
            <td className=" w-[150px] p-2">
              <img
                src={profile.profilePicture}
                alt="pro-pic"
                width={150}
              />
            </td>
            <td className='p-2'>
              <table className="text-[#6c01c5] border-[1px] border-[#6c01c5] text-left bg-[#f8f2fd]">
                <tbody>
                  <tr>
                    <td className="px-6 py-2 text-sm">Name</td>
                    <td>:</td>
                    <td className="px-6 py-2 text-sm">{profile.name}</td>
                  </tr>
                  <tr className=" border-[#6c01c5]">
                    <td className="px-6 py-2 text-sm">Email</td>
                    <td>:</td>
                    <td className="px-6 py-2 text-sm">{profile.email}</td>
                  </tr>

                  <tr className=" border-[#6c01c5]">
                    <td className="px-6 py-2 text-sm">Mobile</td>
                    <td>:</td>
                    <td className="px-6 py-2 text-sm">{profile.mobile}</td>
                  </tr>

                  <tr className=" border-[#6c01c5]">
                    <td className="px-6 py-2 text-sm">Address</td>
                    <td>:</td>
                    <td className="px-6 py-2 text-sm">{profile.address}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr className="border-2 border-[#6c01c5]">
            <td > 
              {loaderImg ? <RiLoader2Fill className="ml-4 text-3xl text-[#6001ad] animate-spin "/>:
                <button className='px-3 py-1 text-white  bg-[#6c01c5] hover:bg-[#6001ad] shadow-xl rounded-sm text-sm' onClick={handleImageUpload}>Upload Image</button>}
            </td>
            <td className='p-2 text-sm'>
              <input type='file' required onChange={(e) => setProfileImg(e.target.files[0])} />
            </td>

          </tr>
          <tr className="border-2 border-[#6c01c5] p-2">
            <td>
              {
                loaderResume ? <RiLoader2Fill className="ml-4 text-3xl text-[#6001ad] animate-spin"/>: <button className='px-2 py-1 text-white  bg-[#6c01c5] hover:bg-[#6001ad] shadow-xl rounded-sm text-sm' onClick={handleResumeUpload}>Upload Resume</button>
              }
            </td>
            <td className='p-2 text-sm'>
              <input type='file' required onChange={(e) => setResume(e.target.files[0])} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CandidateProfile;
