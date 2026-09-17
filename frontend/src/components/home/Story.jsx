import React from 'react';
import AnimatedTitle from '../common/AnimatedTitle';
import Button from '../common/Button';

const Story = () => {
  return (
    <div id="story" className="min-h-dvh w-full px-4 bg-dark-900 text-white">
      <div className="flex size-full flex-col items-center pt-24 pb-24">

        <p className="font-general text-sm text-accent-primary uppercase md:text-xs tracking-widest">
          The World of Runeterra
        </p>

        <div className="relative size-full">
          <AnimatedTitle
            title="Expl<b>o</b>re the <br /> Lore of Le<b>g</b>ends"
            containerClass="mt-5 pointer-events-none relative z-10 text-white"
          />


          <div className="story-img-container transition-all duration-300 transform hover:scale-105">
            <div className="story-img-mask relative">
              <div className="story-image-content rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/img/gallery-3.jpg"
                  alt="Runeterra realm entrance"
                  className="object-contain w-full h-full"
                />
              </div>
            </div>


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


        <div className="-mt-80 flex w-full justify-center md:-mt-64 md:me-44 md:justify-end">
          <div className="flex h-full w-fit flex-col items-center md:items-start">
            <p className="mt-3 max-w-sm text-center font-circular-web text-white/80 md:text-start leading-relaxed">
              From the bustling streets of Zaun to the celestial peak of Targon,
              Runeterra is home to champions of all kinds.
            </p>

            <Button
              id="realm-btn"
              title="Read Universe"
              containerClass="mt-5 z-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Story;
