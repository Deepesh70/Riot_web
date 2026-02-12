import React from 'react';
import { TiLocationArrow } from 'react-icons/ti';


const BentoCard = ({ src, title, description, isComingSoon }) => {
  return (
    <div className="relative size-full overflow-hidden rounded-xl border border-white/20 bg-black/50 p-6 flex flex-col justify-end min-h-64 group hover:bg-black/70 transition-colors">
      <video
        src={src}
        loop
        muted
        autoPlay
        className="absolute left-0 top-0 size-full object-cover opacity-50 transition-opacity duration-300 group-hover:opacity-80"
      />

      <div className="relative z-10 flex size-full flex-col justify-between p-5 text-blue-50">
        <div>
          <h1 className="bento-title special-font font-bold text-3xl">{title}</h1>
          {description && (
            <p className="mt-3 max-w-64 text-xs md:text-base">{description}</p>
          )}
        </div>

        {isComingSoon && (
          <div className="absolute top-5 right-5 flex gap-2 items-center rounded-md bg-black px-3 py-1 text-xs uppercase text-white/50 border border-white/10">
            <TiLocationArrow className="scale-150 rotate-45" />
            Coming Soon
          </div>
        )}
      </div>
    </div>
  );
};

const Feature = () => {
  return (
    <section className="bg-black pb-52">
      <div className="container mx-auto px-3 md:px-10">
        <div className="px-5 py-32">
          <p className="font-circular-web text-lg text-blue-50">
            Our Games & Media
          </p>
          <p className="max-w-md font-circular-web text-lg text-blue-50 opacity-50">
            We aspire to be the most player-focused game company in the world.
            From developing and publishing games to esports and entertainment.
          </p>
        </div>


        <div className="grid h-[135vh] w-full grid-cols-2 grid-rows-3 gap-7 pb-7">
          <div className="col-span-2 row-span-1 md:col-span-1 md:row-span-2">
            <BentoCard
              src="/videos/feature-1.mp4"
              title={
                <>
                  rad<b>i</b>ant
                </>
              }
              description="A tactical shooter where precise gunplay matches unique agent abilities."
              isComingSoon
            />
          </div>

          <div className="col-span-2 row-span-1 ms-32 md:col-span-1 md:ms-0">
            <BentoCard
              src="/videos/feature-2.mp4"
              title={
                <>
                  val<b>o</b>rant
                </>
              }
              description="Defy the limits in a 5v5 character-based tactical shooter."
              isComingSoon
            />
          </div>

          <div className="col-span-2 row-span-1 me-14 md:col-span-1 md:me-0">
            <BentoCard
              src="/videos/feature-3.mp4"
              title={
                <>
                  ome<b>n</b>
                </>
              }
              description="A phantom of a memory, Omen hunts in the shadows."
              isComingSoon
            />
          </div>

          <div className="col-span-2 row-span-1 md:col-span-1">
            <BentoCard
              src="/videos/feature-4.mp4"
              title={
                <>
                  dr<b>i</b>ft
                </>
              }
              description="Experience the flow of battle in our newest map environment."
              isComingSoon
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feature;
