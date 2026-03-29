import React, { useEffect, useRef, useState } from 'react';
import Button from '../common/Button';
import { TiLocationArrow } from 'react-icons/ti';

const riotVideos = [
  'https://cmsassets.rgpub.io/sanity/files/dsfx7636/news/f6ccf20dfe3f6a24ea9216bb8afaaa66740c715d.mp4',
  'https://cmsassets.rgpub.io/sanity/files/dsfx7636/news/53c202665c409ecd9f3d41f3e395675593e260ea.mp4',
  'https://cmsassets.rgpub.io/sanity/files/dsfx7636/news/409ab2fc369ba5e1fe50bac10c6676d7d1365a9f.mp4',
  'https://cmsassets.rgpub.io/sanity/files/dsfx7636/game_data/4cbc968f05713579aae9464c5a16dc3f6863f943.mp4',
  'https://cmsassets.rgpub.io/sanity/files/dsfx7636/news/4b70a7cbcdedca007f6a8f0d6df704ea889a7a1a.mp4',
];

const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [pendingIndex, setPendingIndex] = useState(null);
  const [readyIndices, setReadyIndices] = useState(() => new Set());
  const sectionRef = useRef(null);
  const frameRef = useRef(null);
  const videoRefs = useRef([]);

  const handleVideoReady = (index) => {
    setReadyIndices((prev) => {
      if (prev.has(index)) return prev;
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  const activateVideo = (index) => {
    setActiveIndex(index);
    setPendingIndex((currentPending) => (currentPending === index ? null : currentPending));
  };

  const queueVideo = (index) => {
    if (index === activeIndex) return;

    if (readyIndices.has(index)) {
      activateVideo(index);
      return;
    }

    setPendingIndex(index);
  };

  const handleNextVideo = () => {
    queueVideo((activeIndex + 1) % riotVideos.length);
  };

  useEffect(() => {
    if (pendingIndex !== null && readyIndices.has(pendingIndex)) {
      activateVideo(pendingIndex);
    }
  }, [pendingIndex, readyIndices]);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      if (index === activeIndex) {
        video.currentTime = 0;
        const playPromise = video.play();
        if (playPromise?.catch) {
          playPromise.catch(() => {});
        }
        return;
      }

      video.pause();
      video.currentTime = 0;
    });
  }, [activeIndex]);

  useEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;

    if (!section || !frame) return undefined;

    let rafId = 0;

    const updateScrollFrame = () => {
      rafId = 0;

      const rect = section.getBoundingClientRect();
      const scrollableDistance = Math.max(section.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(-rect.top / scrollableDistance, 0), 1);
      const tagTransition = Math.min(Math.max((progress - 0.42) / 0.16, 0), 1);

      const clipPath = `polygon(${(1 + progress * 8).toFixed(2)}% 0%, 100% ${(progress * 6).toFixed(2)}%, ${(100 - progress * 7).toFixed(2)}% ${(100 - progress * 12).toFixed(2)}%, ${(progress * 12).toFixed(2)}% 100%, 0% ${(100 - progress * 5).toFixed(2)}%, ${(progress * 4).toFixed(2)}% ${(progress * 12).toFixed(2)}%)`;

      frame.style.setProperty('--hero-clip-path', clipPath);
      frame.style.setProperty('--hero-frame-scale', (1 - progress * 0.05).toFixed(3));
      frame.style.setProperty('--hero-frame-shift', `${(progress * -28).toFixed(2)}px`);
      frame.style.setProperty('--hero-frame-rotate', `${(progress * -2.2).toFixed(2)}deg`);
      frame.style.setProperty('--hero-frame-radius', `${(20 + progress * 16).toFixed(2)}px`);
      frame.style.setProperty('--hero-media-scale', (1 + progress * 0.06).toFixed(3));
      frame.style.setProperty('--hero-overlay-opacity', (0.16 + progress * 0.2).toFixed(3));
      frame.style.setProperty('--hero-content-shift', `${(progress * -20).toFixed(2)}px`);
      frame.style.setProperty('--hero-content-opacity', (1 - progress * 0.12).toFixed(3));
      frame.style.setProperty('--hero-accent-shift', `${(progress * 24).toFixed(2)}px`);
      section.style.setProperty('--hero-tag-light-opacity', (1 - tagTransition).toFixed(3));
      section.style.setProperty('--hero-tag-dark-opacity', tagTransition.toFixed(3));
    };

    const requestUpdate = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(updateScrollFrame);
    };

    requestUpdate();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="hero-scroll-shell relative h-[130vh] w-screen overflow-x-hidden"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="relative flex h-full items-center justify-center px-3 py-4 sm:px-6 lg:px-10">
          <div
            id="video-frame"
            ref={frameRef}
            className="hero-scroll-frame relative z-10 h-[88vh] w-full overflow-hidden rounded-lg bg-blue-75 sm:h-[86vh]"
          >
            <div className="hero-scroll-media absolute inset-0">
              {riotVideos.map((videoSrc, index) => (
                <video
                  key={videoSrc}
                  ref={(element) => {
                    videoRefs.current[index] = element;
                  }}
                  src={videoSrc}
                  muted
                  playsInline
                  preload="auto"
                  className={`absolute left-0 top-0 size-full object-cover object-center transition-opacity duration-500 ${
                    index === activeIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                  onCanPlay={() => handleVideoReady(index)}
                  onEnded={index === activeIndex ? handleNextVideo : undefined}
                />
              ))}
            </div>

            <div className="hero-scroll-vignette absolute inset-0" />

            <h1 className="hero-scroll-tag hero-scroll-tag--light special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-100">
              G<b>a</b>ming
            </h1>

            <div className="hero-scroll-content absolute left-0 top-0 z-40 size-full">
              <div className="mt-24 px-5 sm:px-10">
                <h1 className="special-font hero-heading text-blue-100">
                  redefi<b>n</b>e
                </h1>

                <p className="mb-5 max-w-64 font-robert-regular text-blue-100">
                  Enter the Metagame Layer <br /> Unleash the Play Economy
                </p>

                <div className="hero-scroll-accent">
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
          </div>
        </div>

        <h1 className="hero-scroll-tag hero-scroll-tag--dark special-font hero-heading absolute bottom-5 right-5 z-20 text-black">
          G<b>a</b>ming
        </h1>
      </div>
    </section>
  );
};

export default Hero;
