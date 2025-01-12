import React, { useEffect, useState } from 'react'
import { MdDelete} from "react-icons/md";
import { FaEye , FaTimes} from "react-icons/fa";
import {baseUrl} from '../utils/apiConfig'
import axios from 'axios';

const CandidateList = () => {
const [candidate, setCandidate] = useState([]);
const [popOpen, setPopOpen] = useState(false);
const [preview, setPreview] = useState([])

const open = ()=>setPopOpen(true);
const close = ()=>setPopOpen(false);
  // get candidate list

  useEffect(()=>{
    getAllCandidateList();
  },[])
  const getAllCandidateList = async()=>{
    try {
      const response = await axios.get(`${baseUrl}/get_candidate`,{
        withCredentials:true
      });
      setCandidate(response.data.candidate);
      console.log(response)
    } catch (error) {
      console.log(error)
      alert(error.response.data.message)
    }
  }

  // handle delete

  const handleDelete = async(id)=>{
    
    try {
      const response = await axios.delete(`${baseUrl}/delete_candidate/${id}`,
      {withCredentials :true});
    alert(response.data.message);
    getAllCandidateList();
    } catch (error) {
      console.log(error.message);
      alert(error.response.data.message)
    }
  };

  // handle Preview

  const handlePreview = (id)=>{
    open()
    const cn = candidate.find((c)=>c._id === id);
    setPreview(cn);
  }
  return (
    <div className='p-6 relative'>
  
  {
    candidate.length===0 ? <p className='p-4 text-sm text-red-500'>Candidate not found</p>:
    <>
    <table className=" text-center min-w-full border-[1px] border-[#6c01c5] rounded-lg shadow ">
        <thead className="bg-[#f8f2fd]">
          <tr className=''>
            <th className="px-6 py-3 text-sm font-medium ">Profile_Pic</th>
            <th className="px-6 py-3 text-sm font-medium ">Name</th>
            <th className="px-6 py-3 text-sm font-medium ">Mobile</th>
            <th className="px-6 py-3 text-sm font-medium ">Address</th>
            <th className="px-6 py-3 text-sm font-medium ">Email</th>
            <th className="px-6 py-3 text-sm font-medium ">Action</th>
          </tr>
        </thead>
        <tbody>
          {
            candidate.map((c)=>(
              <tr className="border-t border-[#6c01c5]">
          <td className="px-6 text-sm"><img src={c.profilePicture} alt='pic' className='h-[40px] w-[40px] rounded-full'/></td>
            <td className="px-6 py-2 text-sm ">{c.name}</td>
            <td className="px-6 py-2 text-sm ">{c.mobile}</td>
            <td className="px-6 py-2 text-sm ">{c.address}</td>
            <td className="px-6 py-2 text-sm ">{c.email}</td>
            <td className="px-6 py-2 text-2xl  flex justify-evenly ">
            <MdDelete title='Delete Candidate' onClick={()=>handleDelete(c._id)} className='cursor-pointer text-red-500'/>
            <FaEye title='View Profile' onClick={()=>handlePreview(c._id)} className='cursor-pointer text-green-500'/>
            </td>
          </tr>
            ))
          }
        </tbody>
      </table>

      {/* popup model */}
          {
            popOpen && (
              <div className="p-10 flex justify-center  absolute top-10 right-[25rem] bg-[#efe9fb]">
       
      <table className="max-w-xl border-[1px] border-[#6c01c5] rounded-lg shadow-xl relative">
      <FaTimes className='absolute right-[-15px] top-[-15px] bg-[#6c01c5] text-white text-2xl rounded-full
      p-1 cursor-pointer
      '
      onClick={close}
      />
        <tbody>
          <tr className="border-2 border-[#6c01c5] ">
            <td className=" w-[150px] p-2">
              <img
                src={preview.profilePicture}
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
                    <td className="px-6 py-2 text-sm">{preview.name}</td>
                  </tr>
                  <tr className=" border-[#6c01c5]">
                    <td className="px-6 py-2 text-sm">Email</td>
                    <td>:</td>
                    <td className="px-6 py-2 text-sm">{preview.email}</td>
                  </tr>

                  <tr className=" border-[#6c01c5]">
                    <td className="px-6 py-2 text-sm">Mobile</td>
                    <td>:</td>
                    <td className="px-6 py-2 text-sm">{preview.mobile}</td>
                  </tr>

                  <tr className=" border-[#6c01c5]">
                    <td className="px-6 py-2 text-sm">Address</td>
                    <td>:</td>
                    <td className="px-6 py-2 text-sm">{preview.address}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
            )
          }
      
    </>
  }
    </div>
  )
}

export default CandidateList