import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger with GSAP
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const fadeInUp = (element: string | Element, delay: number = 0) => {
  return gsap.fromTo(
    element,
    { y: 50, opacity: 0 },
    { 
      y: 0, 
      opacity: 1, 
      duration: 1, 
      delay, 
      ease: 'power3.out' 
    }
  );
};

export const parallaxScroll = (element: string | Element, speed: number = 0.5) => {
  return gsap.to(element, {
    y: () => -window.innerHeight * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });
};

export const initHeroAnimation = (
  backgroundRef: React.RefObject<HTMLDivElement>,
  headingRef: React.RefObject<HTMLHeadingElement>,
  subheadingRef: React.RefObject<HTMLParagraphElement>
) => {
  const timeline = gsap.timeline();
  
  // Animate the background with parallax effect
  if (backgroundRef.current) {
    parallaxScroll(backgroundRef.current, 0.3);
  }
  
  // Animate the heading
  if (headingRef.current) {
    timeline.from(headingRef.current, { 
      y: 100, 
      opacity: 0, 
      duration: 1, 
      ease: 'power3.out' 
    });
  }
  
  // Animate the subheading
  if (subheadingRef.current) {
    timeline.from(subheadingRef.current, { 
      y: 50, 
      opacity: 0, 
      duration: 1, 
      ease: 'power3.out' 
    }, '-=0.5');
  }
  
  return timeline;
};

export const staggerElements = (elements: string | Element, staggerTime: number = 0.1) => {
  return gsap.fromTo(
    elements,
    { y: 20, opacity: 0 },
    { 
      y: 0, 
      opacity: 1, 
      stagger: staggerTime, 
      duration: 0.8, 
      ease: 'power2.out' 
    }
  );
};