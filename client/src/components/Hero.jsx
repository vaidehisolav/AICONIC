import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

import demoVideo from '../assets/demo_video.mp4' 

const Hero = () => {
    const navigate = useNavigate()
    // 2. State to control the popup visibility
    const [showVideo, setShowVideo] = useState(false)

    return (
        <div className='px-4 sm:px-20 xl:px-32 relative inline-flex flex-col w-full
        justify-center bg-[url(/gradientBackground.png)] bg-cover bg-no-repeat
        min-h-screen'>

            <div className='text-center mb-6'>
                <h1 className='text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl
                font-semibold mx-auto leading-[1.2]'>Create amazing content <br/> with 
                <span className='text-primary'> AI tools</span></h1>
                <p className='mt-4 max-w-xs sm:max-w-lg 2xl:max-w-xl m-auto
                max-sm:text-xs text-gray-700'>Transform your content creation with our suite of premium AI tools.
                Write articles, generate images, and enhance your workflow.</p>
            </div>

            <div className='flex flex-wrap justify-center gap-4 text-sm max-sm:text-xs'>
                <button onClick={()=> navigate('/ai')} className='bg-primary text-white px-10 py-3 rounded-lg
                hover:scale-102 active:scale-95 transition cursor-pointer'>Start creating now</button>
                
                {/* 3. Open the video on click */}
                <button onClick={() => setShowVideo(true)} className='bg-white px-10 py-3 rounded-lg border
                border-gray-300 hover:scale-102 active:scale-95 transition
                cursor-pointer'>Watch demo</button>
            </div>

            <div className="flex items-center gap-4 mt-8 mx-auto text-gray-700">
                <img src={assets.user_group} alt="" className="h-8" />
                Trusted by 10k+ people
            </div>

            {/* 4. The Video Modal Popup */}
            {showVideo && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4'>
                    <div className='relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl'>
                        
                        {/* Close Button */}
                        <button 
                            onClick={() => setShowVideo(false)}
                            className='absolute top-4 right-4 text-white bg-gray-800/50 hover:bg-gray-700 w-10 h-10 rounded-full z-10 text-2xl'
                        >
                            &times;
                        </button>
                        
                        {/* Video Player */}
                        <video 
                            className='w-full block' 
                            controls 
                            autoPlay
                            disablePictureInPicture     // Isse picture-in-picture icon hat jayega
                            controlsList="nodownload"    // Isse download options hat jayenge
                        >
                            <source src={demoVideo} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Hero