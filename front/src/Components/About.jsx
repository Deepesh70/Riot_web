import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

import AnimatedTitle from "./AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  useGSAP(() => {
    const clipAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#clip", 
        start: "center center", 
        end: "+=800 center", 
        scrub: 0.5, 
        pin: true, 
        pinSpacing: true, 
      },
    });

    clipAnimation.to(".mask-clip-path", {
      width: "100vw", 
      height: "100vh", 
      borderRadius: 0, 
    });
  });

  return (
    <div id="about" className="min-h-screen w-screen">
      <div className="relative mb-8 mt-36 flex flex-col items-center gap-5">
        <p className="font-general text-sm uppercase md:text-[10px]">
          Welcome to Riot
        </p>

        <AnimatedTitle
          title="Welc<b>o</b>me to the <br /> world of <b>R</b>iot Games"
          containerClass="mt-5 !text-black text-center"
        />

        <div className="about-subtext">
          <p>Experience the most played PC game in the world</p>
          <p className="text-gray-500">
            From the Rift to the stage, we create games that defy expectations.
            Join millions of players in our ever-expanding universe.
          </p>
        </div>
      </div>

      <div className="h-dvh w-screen" id="clip">
        <div className="mask-clip-path about-image">
          <img
            src="img/about.webp.jpg"
            alt="Background"
            className="absolute left-0 top-0 size-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default About;
