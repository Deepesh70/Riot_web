import React, { useEffect, useRef } from 'react';

const AutoPlayVideo = ({
  active = true,
  className,
  preload = 'metadata',
  rootMargin = '200px 0px',
  threshold = 0.35,
  ...props
}) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return undefined;
    }

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let inViewport = false;
    let pageVisible = !document.hidden;

    const syncPlayback = () => {
      const shouldPlay = active && pageVisible && inViewport && !reducedMotionQuery.matches;

      if (shouldPlay) {
        const playPromise = video.play();
        playPromise?.catch(() => {});
        return;
      }

      video.pause();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewport = entry?.isIntersecting ?? false;
        syncPlayback();
      },
      { rootMargin, threshold }
    );

    const handleVisibilityChange = () => {
      pageVisible = !document.hidden;
      syncPlayback();
    };

    const handleMotionChange = () => {
      syncPlayback();
    };

    observer.observe(video);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    if (reducedMotionQuery.addEventListener) {
      reducedMotionQuery.addEventListener('change', handleMotionChange);
    } else {
      reducedMotionQuery.addListener(handleMotionChange);
    }

    syncPlayback();

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (reducedMotionQuery.removeEventListener) {
        reducedMotionQuery.removeEventListener('change', handleMotionChange);
      } else {
        reducedMotionQuery.removeListener(handleMotionChange);
      }

      video.pause();
    };
  }, [active, rootMargin, threshold, props.src]);

  return (
    <video
      ref={videoRef}
      className={className}
      loop
      muted
      playsInline
      preload={preload}
      {...props}
    />
  );
};

export default AutoPlayVideo;
