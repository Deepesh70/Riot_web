import React from 'react';
import AnimatedTitle from './AnimatedTitle';
import Button from './Button';

const Story = () => {
  return (
    <div id="story" className="min-h-dvh w-full px-4 text-black">
      <div className="flex size-full flex-col items-center py-10 pb-24">
        {/* Simple Text Section */}
        <p className="font-general text-sm text-blue-500 uppercase md:text-[10px]">
          The World of Runeterra
        </p>

        <div className="relative size-full">
          <AnimatedTitle
            title="Expl<b>o</b>re the <br /> Lore of Le<b>g</b>ends"
            containerClass="mt-5 pointer-events-none mix-blend-difference relative z-10"
          />

          {/* Simple Image Container without 3D rotation */}
          <div className="story-img-container transition-all duration-300 transform hover:scale-105">
            <div className="story-img-mask relative">
              <div className="story-image-content rounded-3xl overflow-hidden shadow-xl">
                 <img
                   src="/img/gallery-3.jpg"
                   alt="Realm Entrance"
                   className="object-contain w-full h-full"
                 />
              </div>
            </div>

            {/* SVG Filter for nice corner effect (optional, keeping it simple) */}
            <svg
              className="invisible absolute size-0"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="flt_tag">
                  <feGaussianBlur
                    in="SourceGraphic"
                    stdDeviation="8"
                    result="blur"
                  />
                  <feColorMatrix
                    in="blur"
                    mode="matrix"
                    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                    result="flt_tag"
                  />
                  <feComposite
                    in="SourceGraphic"
                    in2="flt_tag"
                    operator="atop"
                  />
                </filter>
              </defs>
            </svg>
          </div>
        </div>

        {/* Text Details - Simple formatting */}
        <div className="-mt-80 flex w-full justify-center md:-mt-64 md:me-44 md:justify-end">
          <div className="flex h-full w-fit flex-col items-center md:items-start">
            <p className="mt-3 max-w-sm text-center font-circular-web text-black md:text-start">
              From the bustling streets of Zaun to the celestial peak of Targon,
              Runeterra is home to champions of all kinds.
            </p>

            <Button
              id="realm-btn"
              title="Read Universe"
              containerClass="mt-5 bg-blue-500 text-black hover:bg-blue-600 "
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Story;
