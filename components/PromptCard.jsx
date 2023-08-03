'use client'

import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { FcDocument } from "react-icons/fc";
import { PiExamDuotone } from "react-icons/pi";
import { RiGuideFill } from "react-icons/ri";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import Link from "next/link";

const bgcolor1 = 'w-10 h-10 bg-yellow-500 text-white text-lg font-quicksand p-2 font-bold rounded-full flex items-center justify-center'
const bgcolor2 = 'w-10 h-10 bg-pink-500 text-white text-lg font-quicksand p-2 font-bold rounded-full flex items-center justify-center'
const bgcolor3 = 'w-10 h-10 bg-green-500 text-white text-lg font-quicksand p-2 font-bold rounded-full flex items-center justify-center'
const bgcolor4 = 'w-10 h-10 bg-red-500 text-white text-lg font-quicksand p-2 font-bold rounded-full flex items-center justify-center'




const PromptCard = ({ post }) => {

  const { data: session } = useSession()
  const pathName = usePathname()
  const router = useRouter()
 

  const handleAddToDashboard = () => {
    
  }

  return (
    <div className='prompt_card' key={post._id}> 
      <div className="flex justify-between items-start gap-5">
        <div className="flex-1 flex justify-start items-start gap-3 cursor-pointer">
          <span 
            className={(
              post.subject === "English Language" && bgcolor1 ||
              post.subject === "Mathematics" && bgcolor2 ||
              post.subject === "Social Studies" && bgcolor3 ||
              post.subject === "Integrated Science" && bgcolor4

              )}
          >
            {post.subject[0].toUpperCase()}
          </span>

          <div className="flex flex-col">
            <h3 className="font-poppins font-semibold text-gray-900">
              {post.type}
            </h3>
            <p className="font-inter text-sm text-gray-800">
              {post.subject}
            </p>
            <p className="font-inter text-sm text-gray-800">
              {post.month.toUpperCase()}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <Link 
            title="Get Question"
            href={`/examSheet/${post._id}`} 
            className="copy_btn" 
          >
            <FcDocument size={26}/>
          </Link>
          <Link 
            title="Practice Exam"
            href={ session?.user ? `/quiz/${post._id}` : '/login'}
            className="copy_btn" 
          >
            <PiExamDuotone size={26}/>
          </Link>
          <Link title="Guide" href='/guide' className="copy_btn" >
            <RiGuideFill size={26}/>
          </Link>
          <div title="Add to dashboard" className="copy_btn" onClick={handleAddToDashboard}>
            <MdOutlineDashboardCustomize color="green" size={26} className="" />
          </div>
        </div>
        
      </div> 

      <p className="font-inter font-semibold text-sm blue_gradient cursor-pointer" 
      >
        {post.year}
      </p>
    </div>
  )
}

export default PromptCard