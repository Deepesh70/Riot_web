import React from 'react';
import AnimatedTitle from '../common/AnimatedTitle';
import Button from '../common/Button';

const ImageClipBox = ({ src, clipClass, alt }) => (
  <div className={clipClass}>
    <img src={src} alt={alt} />
  </div>
);

const Contact = () => {
  return (
    <div id="contact" className="my-20 min-h-96 w-screen px-10">
      <div className="relative rounded-lg bg-dark-800 py-24 text-white sm:overflow-hidden border border-white/5">

        <div className="absolute -left-20 top-0 hidden h-full w-72 overflow-hidden md:block lg:left-20 lg:w-96 opacity-60">
          <ImageClipBox
            src="/img/gallery-1.png"
            clipClass="md:translate-y-24 lg:translate-y-40"
            alt="Contact section background"
          />
        </div>

        <div className="absolute right-10 top-1/2 hidden w-60 -translate-y-1/2 md:block lg:top-20 lg:w-80 lg:translate-y-0 opacity-60">
          <ImageClipBox
            src="/img/gallery-2.jpg"
            clipClass=""
            alt="Contact section accent"
          />
        </div>


        <div className="flex flex-col items-center text-center">
          <p className="mb-10 font-general text-xs uppercase tracking-widest text-accent-primary">
            Join Riot
          </p>

          <AnimatedTitle
            title="let&#39;s b<b>u</b>ild the <br /> new era of <br /> g<b>a</b>ming t<b>o</b>gether."
            containerClass="special-font w-full font-riot text-4xl sm:text-5xl md:text-6xl font-black leading-tight text-white"
          />

          <Button title="Contact Us" containerClass="mt-10 cursor-pointer z-auto" />
        </div>
      </div>
    </div>
  );
};

export default Contact;
