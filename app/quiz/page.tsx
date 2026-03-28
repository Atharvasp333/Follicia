'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronRight, FlaskConical, Sparkles, Check, ChevronLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { auth } from '@/lib/firebase';

/* ─── Types and Constants ─── */

interface QuizData {
  texture: number | null;
  porosity: string | null;
  chemicalHistory: string[];
  clinicalNotes: string;
}

const STEPS = [
  { id: 'texture', title: 'Strand Architecture', phase: '01' },
  { id: 'porosity', title: 'Scalp & Porosity', phase: '02' },
  { id: 'history', title: 'Chemical History', phase: '03' },
  { id: 'notes', title: 'Synthesis', phase: '04' },
];

const TEXTURE_OPTIONS = [
  { id: 1, label: 'STRAIGHT', image: '/quiz/straight.png', index: '1.' },
  { id: 2, label: 'WAVY', image: '/quiz/wavy.png', index: '2.' },
  { id: 3, label: 'CURLY', image: '/quiz/curly.png', index: '3.' },
  { id: 4, label: 'COILY', image: '/quiz/coily.png', index: '4.' },
];

const POROSITY_OPTIONS = [
  {
    id: 'high-porosity',
    label: 'High Porosity',
    description: 'Cuticles are raised or damaged, allowing moisture to enter quickly but escape just as fast.',
    fact: 'Cuticle alignment is 92% compatible',
  },
  {
    id: 'low-porosity',
    label: 'Balanced / Low',
    description: 'Tightly bound cuticles that resist moisture penetration.',
    fact: 'Cuticle alignment is 98% compatible',
  },
];

const CHEMICAL_OPTIONS = [
  {
    id: 'bleach',
    label: 'Bleach / Lightening',
    description: 'High-lift strands or double-process history',
    image: '/quiz/straight.png',
  },
  {
    id: 'virgin',
    label: 'Virgin',
    description: 'No oxidative color or chemical alterations',
    image: '/quiz/wavy.png',
  },
];

export default function QuizPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const [quizResults, setQuizResults] = useState<QuizData>({
    texture: null,
    porosity: null,
    chemicalHistory: [],
    clinicalNotes: ''
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const progress = ((activeStep + 1) / STEPS.length) * 100;

  const handleNext = () => {
    if (activeStep < STEPS.length - 1) setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setIsAnalyzing(true);
    try {
      const user = auth.currentUser;
      const payload = {
        texture: quizResults.texture,
        porosityChecks: [quizResults.porosity || 'low-porosity'],
        scalp: 'balanced',
        chemicalHistory: quizResults.chemicalHistory,
        clinicalNotes: quizResults.clinicalNotes || 'No additional notes provided.',
        userId: user?.uid
      };

      const response = await fetch('/api/ai/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (result.success) {
        localStorage.setItem('hairDNA', JSON.stringify(result.data));
        router.push('/quiz/results');
      } else {
        alert('Diagnostic sequence failed. Retrying sync...');
        setIsAnalyzing(false);
      }
    } catch (error) {
      console.error('Quiz Error:', error);
      setIsAnalyzing(false);
    }
  };

  if (!isMounted) return <div className="h-screen w-full bg-[#FAFCFB]" />;

  /* ── Full-Screen Analyzing Overlay ── */
  if (isAnalyzing) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#FAFCFB] flex flex-col items-center justify-center overflow-hidden">
        {/* Dot Matrix Background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(#2A9D8F 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Animated Progress Ring */}
        <div className="relative w-96 h-96 flex items-center justify-center mb-12">
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#2A9D8F"
                strokeWidth="0.5"
                strokeDasharray="4 4"
                opacity="0.3"
              />
            </svg>
          </motion.div>

          <motion.div
            className="relative z-10 w-64 h-64 rounded-full flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle, rgba(42,157,143,0.1) 0%, transparent 70%)',
            }}
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <FlaskConical className="w-20 h-20 text-[#2A9D8F]" strokeWidth={1.5} />
          </motion.div>
        </div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <h2
            className="font-display text-4xl italic text-[#0D3B44] mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Analyzing Your DNA...
          </h2>
          <p
            className="text-[#4A6B63] text-sm tracking-[0.3em] uppercase"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
          >
            Laboratory Analysis in Progress
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="h-screen w-full flex flex-col overflow-hidden"
      style={{ background: '#FAFCFB' }}
    >
      <Navbar isFixed={true} />

      {/* Dot Matrix Background */}
      <div
        className="fixed inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#2A9D8F 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <main className="flex-1 flex flex-col items-center mt-20 px-8 relative z-10 overflow-hidden">
        {/* Progress Bar Header - Centered */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-3xl mb-6 pt-2"
        >
          <div className="flex justify-between items-center mb-3">
            <span
              className="text-[10px] font-bold tracking-[0.3em] text-[#2A9D8F] uppercase"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Phase {STEPS[activeStep].phase} — Analysis
            </span>
            <span
              className="text-[10px] font-bold tracking-[0.3em] text-[#2A9D8F] uppercase"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {Math.round(progress)}% Analyzed
            </span>
          </div>
          <div className="w-full h-[2px] bg-[#E8EDEB] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#2A9D8F]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

        {/* Content Area - Centered, Single Column */}
        <div className="w-full max-w-4xl flex-1 flex flex-col items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30, duration: 0.5 }}
              className="w-full flex flex-col items-center"
            >
              {/* Title */}
              <h1
                className="text-3xl text-[#0D3B44] mb-3 text-center"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {STEPS[activeStep].title}
              </h1>

              {/* Description */}
              <p
                className="text-[#4A6B63] text-sm mb-6 max-w-2xl text-center leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {activeStep === 0 &&
                  'Identify your primary fiber geometry. Our sensors will calibrate based on the cortical alignment of your selection.'}
                {activeStep === 1 &&
                  'Understanding the hair cuticle\'s structural integrity to determine nutrient absorption velocity.'}
                {activeStep === 2 &&
                  'Identify any prior chemical interventions to ensure formulation compatibility and fiber integrity.'}
                {activeStep === 3 &&
                  'Synthesize final observations to construct the precision hair-health profile.'}
              </p>

              {/* PHASE 01: Texture - Circular Specimen Cards */}
              {activeStep === 0 && (
                <div className="grid grid-cols-4 gap-6 mb-6">
                  {TEXTURE_OPTIONS.map((opt, index) => (
                    <motion.button
                      key={opt.id}
                      onClick={() => setQuizResults((prev) => ({ ...prev, texture: opt.id }))}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, type: 'spring', stiffness: 300, damping: 25 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="group relative flex flex-col items-center"
                    >
                      <div
                        className={`
                          relative w-32 h-32 rounded-full mb-3 overflow-hidden transition-all duration-500
                          ${
                            quizResults.texture === opt.id
                              ? 'ring-4 ring-[#2A9D8F] shadow-[0_0_30px_rgba(42,157,143,0.4)]'
                              : 'ring-2 ring-[#E8EDEB] hover:ring-[#CBD5D1]'
                          }
                        `}
                      >
                        <div className="relative w-full h-full rounded-full overflow-hidden bg-[#F0F7F6]">
                          <Image
                            src={opt.image}
                            alt={opt.label}
                            fill
                            className={`object-cover transition-transform duration-700 ${
                              quizResults.texture === opt.id ? 'scale-110' : 'group-hover:scale-105'
                            }`}
                          />
                          {quizResults.texture === opt.id && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="absolute inset-0 bg-[#2A9D8F]/20 flex items-center justify-center"
                            >
                              <Check className="w-8 h-8 text-white stroke-[3]" />
                            </motion.div>
                          )}
                        </div>
                      </div>
                      <p
                        className={`text-[10px] font-bold tracking-[0.2em] transition-colors ${
                          quizResults.texture === opt.id ? 'text-[#0D3B44]' : 'text-[#9AABA5]'
                        }`}
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {opt.index} {opt.label}
                      </p>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* PHASE 02: Porosity - Large Horizontal Specimen Cards */}
              {activeStep === 1 && (
                <div className="w-full max-w-3xl space-y-4 mb-6">
                  {POROSITY_OPTIONS.map((opt, index) => (
                    <motion.button
                      key={opt.id}
                      onClick={() => setQuizResults((prev) => ({ ...prev, porosity: opt.id }))}
                      onHoverStart={() => setHoveredCard(opt.id)}
                      onHoverEnd={() => setHoveredCard(null)}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.15, type: 'spring', stiffness: 300, damping: 30 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        relative w-full p-6 rounded-3xl text-left transition-all duration-500 overflow-hidden
                        ${
                          quizResults.porosity === opt.id
                            ? 'bg-[#F0F7F6] ring-2 ring-[#2A9D8F] shadow-[0_0_40px_rgba(42,157,143,0.3)]'
                            : 'bg-white ring-1 ring-[#E8EDEB] hover:ring-[#CBD5D1]'
                        }
                      `}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3
                          className="text-2xl text-[#0D3B44]"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {opt.label}
                        </h3>
                        {quizResults.porosity === opt.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                          >
                            <Check className="w-5 h-5 text-[#2A9D8F]" />
                          </motion.div>
                        )}
                      </div>
                      <p
                        className="text-[#4A6B63] text-xs leading-relaxed mb-3"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {opt.description}
                      </p>

                      {/* Molecular Fact Tooltip */}
                      <AnimatePresence>
                        {hoveredCard === opt.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="flex items-center gap-2 mt-4 px-4 py-2 bg-[#2A9D8F]/10 rounded-full w-fit"
                          >
                            <Sparkles className="w-3 h-3 text-[#2A9D8F]" />
                            <span
                              className="text-[10px] font-bold text-[#2A9D8F] tracking-wider"
                              style={{ fontFamily: "'Inter', sans-serif" }}
                            >
                              {opt.fact}
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* PHASE 03: Chemical History - 2x2 Grid with Circular Images */}
              {activeStep === 2 && (
                <div className="grid grid-cols-2 gap-6 mb-6 max-w-2xl">
                  {CHEMICAL_OPTIONS.map((opt, index) => (
                    <motion.button
                      key={opt.id}
                      onClick={() => {
                        const newHistory = quizResults.chemicalHistory.includes(opt.id)
                          ? quizResults.chemicalHistory.filter((h) => h !== opt.id)
                          : [...quizResults.chemicalHistory, opt.id];
                        setQuizResults((prev) => ({ ...prev, chemicalHistory: newHistory }));
                      }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.15, type: 'spring', stiffness: 300, damping: 25 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="group relative flex flex-col items-center"
                    >
                      <div
                        className={`
                          relative w-36 h-36 rounded-full mb-3 overflow-hidden transition-all duration-500
                          ${
                            quizResults.chemicalHistory.includes(opt.id)
                              ? 'ring-4 ring-[#2A9D8F] shadow-[0_0_30px_rgba(42,157,143,0.4)]'
                              : 'ring-2 ring-[#E8EDEB] hover:ring-[#CBD5D1]'
                          }
                        `}
                      >
                        <div className="relative w-full h-full rounded-full overflow-hidden bg-[#F0F7F6]">
                          <Image
                            src={opt.image}
                            alt={opt.label}
                            fill
                            className={`object-cover transition-transform duration-700 ${
                              quizResults.chemicalHistory.includes(opt.id)
                                ? 'scale-110'
                                : 'group-hover:scale-105'
                            }`}
                          />
                          {quizResults.chemicalHistory.includes(opt.id) && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="absolute inset-0 bg-[#2A9D8F]/20 flex items-center justify-center"
                            >
                              <Check className="w-8 h-8 text-white stroke-[3]" />
                            </motion.div>
                          )}
                        </div>
                      </div>
                      <h3
                        className="text-lg text-[#0D3B44] mb-1"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {opt.label}
                      </h3>
                      <p
                        className="text-[#4A6B63] text-xs text-center max-w-[180px]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {opt.description}
                      </p>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* PHASE 04: Synthesis - Centered Input */}
              {activeStep === 3 && (
                <div className="w-full max-w-2xl mb-6">
                  {/* Clinical Notes Input */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative"
                  >
                    <div className="absolute -top-3 left-6 px-3 bg-[#FAFCFB] z-10">
                      <span
                        className="text-[10px] font-bold tracking-[0.2em] text-[#9AABA5] uppercase"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        Patient Clinical Notes
                      </span>
                    </div>
                    <div className="relative rounded-3xl ring-1 ring-[#E8EDEB] bg-white overflow-hidden p-6 transition-all duration-500 focus-within:ring-2 focus-within:ring-[#2A9D8F] focus-within:shadow-[0_0_30px_rgba(42,157,143,0.2)]">
                      <textarea
                        value={quizResults.clinicalNotes}
                        onChange={(e) =>
                          setQuizResults((prev) => ({ ...prev, clinicalNotes: e.target.value }))
                        }
                        placeholder="Begin clinical entry... (e.g., Follicular miniaturization noted in vertex; scalp barrier integrity weakened...)"
                        className="w-full h-40 bg-transparent border-none outline-none text-sm text-[#0D3B44] leading-loose placeholder:text-[#CBD5D1] resize-none"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#F0F7F6] flex items-center justify-center">
                          <Check className="w-3 h-3 text-[#2A9D8F]" />
                        </div>
                        <div className="text-left">
                          <p
                            className="text-[8px] font-bold text-[#9AABA5] uppercase tracking-wider"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            Practitioner
                          </p>
                          <p
                            className="text-[10px] font-bold text-[#1C2B28]"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            Dr. Alistair Vance
                          </p>
                        </div>
                      </div>
                      <p
                        className="text-[9px] font-bold text-[#9AABA5] tabular-nums"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {quizResults.clinicalNotes.length} chars documented
                      </p>
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls - Centered at Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-3xl flex items-center gap-3 py-4"
        >
          {activeStep > 0 && (
            <motion.button
              onClick={handleBack}
              whileHover={{ scale: 1.02, x: -5 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-full border-2 border-[#0D3B44] text-[#0D3B44] font-bold text-[10px] tracking-[.2em] uppercase transition-all duration-300 flex items-center gap-2"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </motion.button>
          )}
          {activeStep < STEPS.length - 1 ? (
            <motion.button
              onClick={handleNext}
              disabled={
                (activeStep === 0 && !quizResults.texture) ||
                (activeStep === 1 && !quizResults.porosity)
              }
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 py-3 rounded-full bg-[#0D3B44] text-white font-bold text-[10px] tracking-[.2em] uppercase flex items-center justify-center gap-2 transition-all duration-300 ${
                (activeStep === 0 && !quizResults.texture) ||
                (activeStep === 1 && !quizResults.porosity)
                  ? 'opacity-30 cursor-not-allowed'
                  : 'hover:bg-[#1C2B28] shadow-lg shadow-[#0D3B44]/20'
              }`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.button
              onClick={handleSubmit}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 rounded-full bg-[#0D3B44] text-white font-bold text-[10px] tracking-[.2em] uppercase flex items-center justify-center gap-2 hover:bg-[#1C2B28] transition-all duration-300 shadow-xl shadow-[#0D3B44]/30"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <Sparkles className="w-4 h-4" />
              Generate Scientific Profile
            </motion.button>
          )}
        </motion.div>
      </main>
    </div>
  );
}
