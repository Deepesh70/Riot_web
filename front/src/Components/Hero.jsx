import React, { useState } from 'react';
import Button from './Button';
import { TiLocationArrow } from 'react-icons/ti';

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const totalVideos = 4;

  const handleVideoLoad = () => {
    // Just a placeholder for any loading logic if needed, but keeping it simple
  };

  const handleMiniVdClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex % totalVideos) + 1);
  };

  // Simplified: No preloading logic, just get the video src.
  // const getVideoSrc = (index) => `videos/hero-${index}.mp4`;
  const getVideoSrc = (index) => `/videos/hero-${index}.mp4`;

  return (
    <div className="relative h-dvh w-screen overflow-x-hidden">
      {/* Main Video Background with Clickable Logic */}
      <div
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75"
        onClick={handleMiniVdClick} // Simple click handler
      >
        <div>
          <div className="mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg hover:scale-105 transition-transform duration-300">
            {/* Mini Video Preview - Simplified */}
            <div
              className="origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100"
            >
              <video
                key={`mini-${currentIndex}`}
                src={getVideoSrc((currentIndex % totalVideos) + 1)}
                loop
                muted
                id="current-video"
                className="size-64 origin-center scale-150 object-cover object-center"
                onLoadedData={handleVideoLoad}
              />
            </div>
          </div>

          {/* Main Full Screen Video */}
          <video
            key={`main-${currentIndex}`}
            src={getVideoSrc(currentIndex)}
            autoPlay
            loop
            muted
            id="next-video"
            className="absolute-center invisible absolute z-20 size-64 object-cover object-center sm:visible sm:size-full"
            onLoadedData={handleVideoLoad}
          />

          <video
            src={getVideoSrc(currentIndex === 1 ? 1 : currentIndex - 1)}
            autoPlay
            loop
            muted
            className="absolute left-0 top-0 size-full object-cover object-center"
            onLoadedData={handleVideoLoad}
          />
        </div>

        <h1 className="special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75">
          G<b>a</b>ming
        </h1>

        <div className="absolute left-0 top-0 z-40 size-full">
          <div className="mt-24 px-5 sm:px-10">
            <h1 className="special-font hero-heading text-blue-100">
              redefi<b>n</b>e
            </h1>

            <p className="mb-5 max-w-64 font-robert-regular text-blue-100">
              Enter the Metagame Layer <br /> Unleash the Play Economy
            </p>

            <Button
              id="watch-trailer"
              title="Watch Trailer"
              leftIcon={<TiLocationArrow />}
              containerClass="!bg-yellow-300 flex-center gap-1"
            />
          </div>
        </div>
      </div>

      <h1 className="special-font hero-heading absolute bottom-5 right-5 text-black">
        G<b>a</b>ming
      </h1>
    </div>
  );
};

export default Hero;
