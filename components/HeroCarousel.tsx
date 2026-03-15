"use client";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { BezierDefinition } from "framer-motion";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import Image from "next/image";

/* ── Carousel slide data ──────────────────────────────────────────────── */
const slides = [
  {
    id: 1,
    image: "/assets/carousel1 img.png",
    badge: "New Collection",
    headline: "Your Hair,\nDecoded by AI.",
    sub: "Clinical-grade scalp science meets precision AI — formulated exclusively for your biology.",
    cta: "Take the Hair Quiz",
    ctaHref: "#quiz",
    accent: "#2A9D8F",
  },
  {
    id: 2,
    image: "/assets/carousel2 img.png",
    badge: "Bestseller",
    headline: "Advanced\nScalp Science.",
    sub: "Backed by 2,400+ clinical formulations. Stop the trial-and-error, start your personalised regimen.",
    cta: "Shop Bestsellers",
    ctaHref: "#products",
    accent: "#D4AF37",
  },
  {
    id: 3,
    image: "/assets/carousel3 img.png",
    badge: "Clean Beauty",
    headline: "Nature-Refined.\nClinic-Approved.",
    sub: "Zero sulphates. Zero parabens. 100% bio-matched to you. Science that's kind to your scalp.",
    cta: "Explore Products",
    ctaHref: "#products",
    accent: "#4DBCB0",
  },
];

/* ── Ease curve ─────────────────────────────────────────────────────── */
const E = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* ── Slide transition variants ────────────────────────────────────────── */
const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "100%" : "-100%",
    opacity: 1,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir < 0 ? "100%" : "-100%",
    opacity: 1,
  }),
};



const AUTOPLAY_INTERVAL = 5000;

export default function HeroCarousel() {
  const [[page, direction], setPage] = useState([0, 0]);
  const [autoplay, setAutoplay] = useState(true);

  const paginate = useCallback(
    (dir: number) => {
      setPage(([prev]) => [
        (prev + dir + slides.length) % slides.length,
        dir,
      ]);
    },
    []
  );

  // Autoplay
  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(() => paginate(1), AUTOPLAY_INTERVAL);
    return () => clearInterval(id);
  }, [autoplay, paginate]);

  const slide = slides[page];

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const handleDragEnd = (e: Event, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      paginate(1);
    } else if (swipe > swipeConfidenceThreshold) {
      paginate(-1);
    }
  };

  return (
    <section
      className="hero-carousel-section"
      onMouseEnter={() => setAutoplay(false)}
      onMouseLeave={() => setAutoplay(true)}
      style={{
        position: "relative",
        width: "100%",
        height: "100svh",
        minHeight: "600px",
        overflow: "hidden",
        background: "#0D3B44",
      }}
    >
      {/* ── Sliding image layer ──────────────────────────────────── */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={page}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 280, damping: 32 },
            opacity: { duration: 0.4 },
          }}
          style={{
            position: "absolute",
            inset: 0,
            willChange: "transform",
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
        >
          {/* Image */}
          <Image
            src={slide.image}
            alt="Hero Carousel Image"
            fill
            priority={page === 0}
            style={{ objectFit: "cover", objectPosition: "center", pointerEvents: "none" }}
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Subtle noise / grain texture overlay ─────────────────── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          opacity: 0.03,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "150px 150px",
          pointerEvents: "none",
        }}
      />


      {/* ── Autoplay progress bar ─────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "rgba(255,255,255,0.1)",
          zIndex: 10,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`progress-${page}`}
            initial={{ width: "0%" }}
            animate={{ width: autoplay ? "100%" : "0%" }}
            transition={{ duration: AUTOPLAY_INTERVAL / 1000, ease: "linear" }}
            style={{
              height: "100%",
              background: slide.accent,
              borderRadius: "0 2px 2px 0",
            }}
          />
        </AnimatePresence>
      </div>
    </section>
  );
}
