import React from 'react'
import Button from './Button'

const ImageClipBox= ({ src, clipClass}) => {
    return (
        <div className={clipClass}>
            <img src={src}/>
        </div>
    )
}
const Contact = () => {
  return (
    <div id='contact' className='relative my-24 min-h-[32rem] w-full px-4 md:px-16 flex items-center justify-center'>
        <div className='relative rounded-3xl bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] shadow-2xl py-20 md:py-28 px-4 md:px-16 text-blue-50 overflow-hidden w-full max-w-6xl'>

            {/* Decorative Images Left */}
            <div className='absolute -left-16 top-0 hidden h-full w-60 md:w-72 lg:w-96 sm:block z-10'>
                <ImageClipBox
                    clipClass="contact-clip-path-1 drop-shadow-2xl opacity-80"  
                    src="img/contact-1.webp"
                /> 
                <ImageClipBox
                    clipClass="contact-clip-path-2 lg:translate-y-40 translate-y-60 drop-shadow-xl opacity-70"
                    src="img/contact-2.webp"
                />
            </div>
            {/* Decorative Images Right */}
            <div className='absolute -top-32 right-0 md:right-10 lg:top-10 w-40 md:w-60 lg:w-80 z-10'>
                <ImageClipBox
                    src="img/swordman-partial.webp"
                    clipClass="absolute md:scale-125 opacity-80 rotate-6"
                />
                <ImageClipBox
                    src="img/swordman.webp"
                    clipClass="sword-man-clip-path md:scale opacity-90 -rotate-3"
                />
            </div>
            <div className='relative z-20 flex flex-col items-center text-center uppercase'>
                <p className='font-general text-xs md:text-sm tracking-widest text-blue-200 mb-2 animate-fade-in'>JOIN ZENTRY</p>
                <h2 className='mt-6 mb-8 w-full font-robert-medium text-4xl md:text-6xl lg:text-7xl leading-tight md:leading-[1.1] bg-gradient-to-r from-blue-300 via-blue-100 to-blue-400 bg-clip-text text-transparent drop-shadow-lg animate-slide-up'>
                    <b>Let's build the <br className='hidden md:block'/> new era of <br className='hidden md:block'/> gaming together</b>
                </h2>
                <p className='max-w-xl mx-auto text-blue-200 text-base md:text-lg font-general mb-8 animate-fade-in-slow'>
                    We are looking for passionate gamers, developers, and creators to join our journey. Connect with us and be a part of something extraordinary!
                </p>
                <Button title="Contact Us" containerClass="mt-4 md:mt-8 px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 shadow-lg transition-all duration-300 cursor-pointer text-lg font-robert-medium uppercase tracking-wider animate-pop"/>
            </div>
        </div>
    </div>
  )
}

export default Contact