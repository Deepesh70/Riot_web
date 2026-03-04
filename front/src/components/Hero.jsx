import React, { useState } from 'react';
import Button from './Button';
import { TiLocationArrow } from 'react-icons/ti';

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const totalVideos = 4;

  const handleVideoLoad = () => {

  };

  const handleNextVideo = () => {
    setCurrentIndex((prevIndex) => (prevIndex % totalVideos) + 1);
  };

  // Official Riot Games CDN Video URLs
  const riotVideos = [
    // 'https://cmsassets.rgpub.io/sanity/files/dsfx7636/news/8df78cd4a12001bb055fe0fcbd7a17720def040a.mp4', // League of Legends
    'https://cmsassets.rgpub.io/sanity/files/dsfx7636/news/f6ccf20dfe3f6a24ea9216bb8afaaa66740c715d.mp4', // Valorant
    'https://cmsassets.rgpub.io/sanity/files/dsfx7636/news/53c202665c409ecd9f3d41f3e395675593e260ea.mp4', // Wild Rift
     // Another Wild Rift / General Cinematic
    
    'https://cmsassets.rgpub.io/sanity/files/dsfx7636/news/409ab2fc369ba5e1fe50bac10c6676d7d1365a9f.mp4', // Valorant Loop 2
    'https://cmsassets.rgpub.io/sanity/files/dsfx7636/game_data/4cbc968f05713579aae9464c5a16dc3f6863f943.mp4', // Valorant Jett
    'https://cmsassets.rgpub.io/sanity/files/dsfx7636/news/4b70a7cbcdedca007f6a8f0d6df704ea889a7a1a.mp4',
    
  ];

  const getVideoSrc = (index) => riotVideos[(index - 1) % riotVideos.length];

  return (
    <div className="relative h-dvh w-screen overflow-x-hidden">

      <div
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75"
      >
        <div>
          <video
            key={`main-${currentIndex}`}
            src={getVideoSrc(currentIndex)}
            autoPlay
            muted
            className="absolute left-0 top-0 size-full object-cover object-center"
            onEnded={handleNextVideo}
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
              title="Next"
              onClick={handleNextVideo}
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
