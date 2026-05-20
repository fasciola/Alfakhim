import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealOptions {
  y?: number;
  x?: number;
  opacity?: number;
  scale?: number;
  duration?: number;
  stagger?: number;
  ease?: string;
  start?: string;
  delay?: number;
}

export function useScrollReveal<T extends HTMLElement>(options: ScrollRevealOptions = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      y = 40,
      x = 0,
      opacity = 0,
      scale = 1,
      duration = 0.7,
      stagger = 0.08,
      ease = 'back.out(1.2)',
      start = 'top 85%',
      delay = 0,
    } = options;

    const children = el.children.length > 1 ? Array.from(el.children) : [el];

    gsap.set(children, { y, x, opacity, scale });

    const tween = gsap.to(children, {
      y: 0,
      x: 0,
      opacity: 1,
      scale: 1,
      duration,
      stagger,
      ease,
      delay,
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: 'play none none none',
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el) st.kill();
      });
    };
  }, []);

  return ref;
}
