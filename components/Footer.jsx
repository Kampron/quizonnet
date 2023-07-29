import React from 'react'
import Image from 'next/image'

const Footer = () => {
  return (
     <div className="h-[50px] text-[14px] flex flex-col sm:flex-row gap-4 items-center justify-between mt-20">
      <div className='mr-5 font-quicksand font-semibold'>©2023 Quizonnet All rights reserved</div>
      <div className="flex items-center gap-2">
        <Image src="/assets/icons/1.png" width={15} height={15} className="icon" alt="social" />
        <Image src="/assets/icons/2.png" width={15} height={15} className="icon" alt="social" />
        <Image src="/assets/icons/3.png" width={15} height={15} className="icon" alt="social" />
        <Image src="/assets/icons/4.png" width={15} height={15} className="icon" alt="social" />
      </div>
    </div>
  )
}

export default Footer