'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronRight, FlaskConical, Beaker, Check } from 'lucide-react';
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
  { id: 'notes', title: 'Clinical Notes', phase: '04' },
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
    description: 'Cuticles are raised or damaged, allowing moisture to enter quickly but escape just as fast. Requires lipid-rich sealing agents.',
    image: '/quiz/porosity_high.png',
  },
  { 
    id: 'low-porosity', 
    label: 'Balanced / Low', 
    description: 'Tightly bound cuticles that resist moisture penetration. Requires heat-activated hydration or humectants with low molecular weight.',
    image: '/quiz/porosity_low.png',
  },
];

const CHEMICAL_OPTIONS = [
  { 
    id: 'bleach', 
    label: 'Bleach / Lightening', 
    description: 'High-lift strands or double-process history',
    image: 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?q=80&w=800&auto=format&fit=crop'
  },
  { 
    id: 'virgin', 
    label: 'Virgin', 
    description: 'No oxidative color or chemical alterations',
    image: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=800&auto=format&fit=crop'
  },
];

export default function QuizPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
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

  if (!isMounted) return <div className="h-screen w-full bg-white" />;

  /* ── Loading Overlay ── */
  if (isAnalyzing) {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-8 overflow-hidden">
        <div className="relative w-80 h-80 flex items-center justify-center">
          <motion.div 
            className="absolute inset-0 bg-brand-teal/5 rounded-full blur-[60px]"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div 
            className="w-48 h-48 rounded-full border border-brand-teal/20 flex items-center justify-center relative overflow-hidden"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
             <div className="absolute inset-0 bg-gradient-to-tr from-[#E0F2F1] via-white to-[#B2DFDB] opacity-50" />
             <div className="relative z-10 w-32 h-32 rounded-full shadow-[0_0_40px_rgba(42,157,143,0.3)] bg-gradient-radial from-white to-[#E0F2F1] flex items-center justify-center">
                <FlaskConical className="w-12 h-12 text-brand-teal/40" />
             </div>
          </motion.div>
        </div>
        <div className="mt-12 text-center">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-display text-3xl italic text-[#0D3B44] mb-3"
          >
            Sequencing DNA...
          </motion.h2>
          <p className="font-body text-[#4A6B63] text-sm tracking-widest uppercase">Laboratory Analysis in Progress</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-white flex flex-col overflow-hidden font-sans">
      <Navbar isFixed={true} />

      <main className="flex-1 flex mt-20 h-full overflow-hidden">
        {/* LEFT PANEL (55%) */}
        <div className="w-[55%] h-full flex flex-col px-16 py-12 bg-white relative">
          
          {/* Progress Bar Header */}
          <div className="mb-12">
             <div className="flex justify-between items-center mb-6">
                <span className="font-body text-[10px] font-bold tracking-[0.2em] text-[#2A9D8F] uppercase">Phase {STEPS[activeStep].phase} — Analysis</span>
                <span className="font-body text-[10px] font-bold tracking-[0.2em] text-[#2A9D8F] uppercase">{progress}% Analyzed</span>
             </div>
             <div className="w-full h-[1.5px] bg-[#E8EDEB]">
                <motion.div 
                  className="h-full bg-[#2A9D8F]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
             </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
              >
                <h1 className="font-display text-5xl text-[#0D3B44] mb-4">
                  {STEPS[activeStep].title}
                </h1>
                <p className="font-sans text-[#4A6B63] text-lg mb-12 max-w-xl leading-relaxed">
                  {activeStep === 0 && "Identify your primary fiber geometry. Our sensors will calibrate based on the cortical alignment of your selection."}
                  {activeStep === 1 && "Understanding the hair cuticle's structural integrity to determine nutrient absorption velocity."}
                  {activeStep === 2 && "Identify any prior chemical interventions to ensure formulation compatibility and fiber integrity."}
                  {activeStep === 3 && "Synthesize final observations to construct the precision hair-health profile."}
                </p>

                {/* STEP 1 CONTENT: Texture */}
                {activeStep === 0 && (
                  <div className="grid grid-cols-2 gap-12 max-w-lg mb-12">
                    {TEXTURE_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setQuizResults(prev => ({ ...prev, texture: opt.id }))}
                        className={`group relative flex flex-col items-center transition-all duration-500`}
                      >
                        <div className={`
                          relative w-44 h-44 rounded-full mb-4 overflow-hidden border-2 transition-all duration-500
                          ${quizResults.texture === opt.id ? 'border-[#2A9D8F] p-1' : 'border-transparent hover:border-[#E8EDEB]'}
                        `}>
                          <div className="relative w-full h-full rounded-full overflow-hidden bg-[#F0F7F6]">
                            <Image src={opt.image} alt={opt.label} fill className={`object-cover transition-transform duration-700 ${quizResults.texture === opt.id ? 'scale-110' : 'group-hover:scale-105'}`} />
                            {quizResults.texture === opt.id && (
                              <div className="absolute inset-0 bg-[#0D3B44]/20 flex items-center justify-center">
                                <Check className="w-8 h-8 text-white stroke-[3]" />
                              </div>
                            )}
                          </div>
                        </div>
                        <p className={`font-body text-[11px] font-bold tracking-[0.2em] transition-colors ${quizResults.texture === opt.id ? 'text-[#0D3B44]' : 'text-[#9AABA5]'}`}>
                          {opt.index} {opt.label}
                        </p>
                      </button>
                    ))}
                  </div>
                )}

                {/* STEP 2 CONTENT: Porosity */}
                {activeStep === 1 && (
                  <div className="space-y-6 max-w-xl mb-12">
                    {POROSITY_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setQuizResults(prev => ({ ...prev, porosity: opt.id }))}
                        className={`
                          w-full flex items-stretch text-left rounded-3xl overflow-hidden border-2 transition-all duration-500
                          ${quizResults.porosity === opt.id ? 'border-[#2A9D8F] bg-[#F0F7F6]/30' : 'border-[#E8EDEB] hover:border-[#CBD5D1] bg-white'}
                        `}
                      >
                        <div className="w-1/3 min-h-[160px] relative">
                          <Image src={opt.image} alt={opt.label} fill className="object-cover" />
                          <div className="absolute inset-0 bg-black/10" />
                        </div>
                        <div className="flex-1 p-8 flex flex-col justify-center">
                          <div className="flex justify-between items-start mb-2">
                             <h3 className="font-display text-2xl text-[#0D3B44]">{opt.label}</h3>
                             {quizResults.porosity === opt.id && <Check className="w-4 h-4 text-[#2A9D8F]" />}
                          </div>
                          <p className="font-sans text-[#4A6B63] text-xs leading-relaxed pr-8">{opt.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* STEP 3 CONTENT: Chemical History */}
                {activeStep === 2 && (
                  <div className="space-y-6 max-w-xl mb-12">
                    {CHEMICAL_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                           const newHistory = quizResults.chemicalHistory.includes(opt.id)
                             ? quizResults.chemicalHistory.filter(h => h !== opt.id)
                             : [...quizResults.chemicalHistory, opt.id];
                           setQuizResults(prev => ({ ...prev, chemicalHistory: newHistory }));
                        }}
                        className={`
                          w-full flex items-stretch text-left rounded-3xl overflow-hidden border-2 transition-all duration-500
                          ${quizResults.chemicalHistory.includes(opt.id) ? 'border-[#2A9D8F] bg-[#F0F7F6]/30' : 'border-[#E8EDEB] hover:border-[#CBD5D1] bg-white'}
                        `}
                      >
                        <div className="w-1/3 min-h-[160px] relative">
                          <Image src={opt.image} alt={opt.label} fill className="object-cover" />
                        </div>
                        <div className="flex-1 p-8 flex flex-col justify-center">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-display text-2xl text-[#0D3B44]">{opt.label}</h3>
                            {quizResults.chemicalHistory.includes(opt.id) && <Check className="w-4 h-4 text-[#2A9D8F]" />}
                          </div>
                          <p className="font-sans text-[#4A6B63] text-xs leading-relaxed">{opt.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* STEP 4 CONTENT: Clinical Notes */}
                {activeStep === 3 && (
                  <div className="max-w-xl mb-12">
                    <div className="relative group">
                      <div className="absolute -top-3 left-6 px-3 bg-white z-10">
                        <span className="font-body text-[10px] font-bold tracking-[0.2em] text-[#9AABA5] uppercase">Patient Clinical Notes</span>
                      </div>
                      <div className="relative rounded-3xl border border-[#E8EDEB] bg-white overflow-hidden p-8 transition-all duration-500 group-focus-within:border-[#2A9D8F] group-focus-within:ring-4 group-focus-within:ring-[#2A9D8F]/5">
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0D3B44 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                        <textarea 
                          value={quizResults.clinicalNotes}
                          onChange={(e) => setQuizResults(prev => ({ ...prev, clinicalNotes: e.target.value }))}
                          placeholder="Begin clinical entry... (e.g., Follicular miniaturization noted in vertex; scalp barrier integrity weakened...)"
                          className="w-full h-80 bg-transparent border-none outline-none font-sans text-sm text-[#0D3B44] leading-loose placeholder:text-[#CBD5D1] relative z-10 resize-none"
                        />
                      </div>
                      <div className="flex justify-between items-center mt-6">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-[#F0F7F6] flex items-center justify-center"><Check className="w-4 h-4 text-[#2A9D8F]" /></div>
                           <div className="text-left">
                              <p className="font-body text-[8px] font-bold text-[#9AABA5] uppercase tracking-tighter">Practitioner</p>
                              <p className="font-body text-[11px] font-bold text-[#1C2B28]">Dr. Alistair Vance</p>
                           </div>
                        </div>
                        <p className="font-sans text-[10px] font-bold text-[#9AABA5] tabular-nums">{quizResults.clinicalNotes.length} chars documented</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-6 mt-8">
            {activeStep > 0 && (
              <button onClick={handleBack} className="w-32 py-5 rounded-full border border-[#E8EDEB] text-[#0D3B44] font-body font-bold text-[11px] tracking-[.2em] uppercase hover:bg-[#F4F7F5] transition-colors">Previous</button>
            )}
            {activeStep < STEPS.length - 1 ? (
              <button onClick={handleNext} disabled={activeStep === 0 ? !quizResults.texture : activeStep === 1 ? !quizResults.porosity : false} className={`flex-1 py-5 rounded-full bg-[#0D3B44] text-white font-body font-bold text-[11px] tracking-[.2em] uppercase flex items-center justify-center gap-3 transition-all duration-300 ${(activeStep === 0 && !quizResults.texture) || (activeStep === 1 && !quizResults.porosity) ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#1C2B28] hover:translate-x-1 shadow-lg shadow-[#0D3B44]/10'}`}>
                {activeStep === 0 ? 'Confirm Geometry' : 'Continue'}
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleSubmit} className="flex-1 py-5 rounded-full bg-[#0D3B44] text-white font-body font-bold text-[11px] tracking-[.2em] uppercase flex items-center justify-center gap-3 hover:bg-[#1C2B28] transition-all duration-300 shadow-xl shadow-[#0D3B44]/20">Generate Scientific Profile</button>
            )}
          </div>
        </div>

        {/* RIGHT PANEL (45%) */}
        <div className="w-[45%] h-full bg-[#F0F7F6] relative flex flex-col items-center justify-center p-16 overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#2A9D8F 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
          <AnimatePresence mode="wait">
            <motion.div key={activeStep + (quizResults.texture || '')} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.6 }} className="relative w-full max-w-lg aspect-square flex flex-col items-center justify-center">
              
              {activeStep === 0 && (
                <div className="w-full flex flex-col items-center">
                  <div className="relative w-full aspect-square max-w-[400px] mb-12">
                     <div className="absolute inset-0 bg-white/40 rounded-full blur-3xl" />
                     <div className="relative w-full h-full rounded-full overflow-hidden border border-white/50 shadow-2xl">
                        <Image src="https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=800&auto=format&fit=crop" alt="Hair" fill className="object-cover" />
                        <div className="absolute inset-0 bg-[#0D3B44]/10 mix-blend-multiply" />
                     </div>
                  </div>
                  <div className="w-full space-y-8">
                     <div className="flex gap-6">
                        <div className="w-[2px] h-12 bg-[#2A9D8F]/30 shrink-0" />
                        <div>
                           <h4 className="font-display text-2xl text-[#0D3B44] mb-2">The Medulla</h4>
                           <p className="font-sans text-[#4A6B63] text-sm leading-relaxed">{quizResults.texture ? "The innermost core of the hair fiber. Highly variable in presence." : "Awaiting calibration..."}</p>
                        </div>
                     </div>
                     <div className="flex gap-6">
                        <div className="w-[2px] h-12 bg-[#2A9D8F]/30 shrink-0" />
                        <div>
                           <h4 className="font-display text-2xl text-[#0D3B44] mb-2">The Cortex</h4>
                           <p className="font-sans text-[#4A6B63] text-sm leading-relaxed">{quizResults.texture ? "Contains long keratin chains that dictate fiber geometry." : "Calibration pending..."}</p>
                        </div>
                     </div>
                  </div>
                  <div className="mt-12">
                     <div className="inline-flex items-center px-4 py-2 rounded-full border border-[#CBD5D1] bg-white gap-3">
                        <div className={`w-2 h-2 rounded-full ${quizResults.texture ? 'bg-[#2A9D8F]' : 'bg-[#9AABA5] animate-pulse'}`} />
                        <span className="font-body text-[10px] font-bold tracking-[0.1em] text-[#0D3B44] uppercase">
                          {quizResults.texture 
                            ? `Calibration: ${TEXTURE_OPTIONS.find(o => o.id === quizResults.texture)?.label} ACTIVE` 
                            : 'Awaiting Calibration'
                          }
                        </span>
                     </div>
                  </div>
                </div>
              )}

              {activeStep === 1 && (
                <div className="w-full flex flex-col items-center">
                  <div className="text-left w-full mb-12">
                     <p className="font-body text-[10px] font-bold tracking-[0.2em] text-[#9AABA5] uppercase">Molecular Structure</p>
                     <p className="font-sans text-xs text-[#0D3B44]">H₂0 + Lipophilic Complex</p>
                  </div>
                  <div className="relative w-80 h-80 mb-12 flex items-center justify-center">
                    <motion.div className="absolute inset-0 bg-white/40 rounded-full blur-2xl" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 5, repeat: Infinity }} />
                    <motion.div className="relative w-64 h-64 rounded-full shadow-2xl bg-gradient-to-br from-[#E0F2F1] via-white to-[#B2DFDB] border border-white/80 overflow-hidden flex items-center justify-center" animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
                       <div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'radial-gradient(circle, #2A9D8F 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
                       <div className="relative z-10 w-24 h-24 rounded-full border border-white/40 bg-white/30 backdrop-blur-md flex items-center justify-center">
                          <motion.div className="w-16 h-16 rounded-full bg-brand-teal/10" animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity }} />
                       </div>
                    </motion.div>
                  </div>
                  <div className="w-full grid grid-cols-2 gap-8 border-t border-[#CBD5D1] pt-4">
                     <div>
                        <p className="font-body text-[9px] font-bold text-[#9AABA5] uppercase">Ref. ID</p>
                        <p className="font-sans text-xs font-bold text-[#1C2B28]">SC-992/PX</p>
                     </div>
                     <div className="text-right">
                        <p className="font-body text-[9px] font-bold text-[#2A9D8F] uppercase">Accuracy</p>
                        <p className="font-sans text-xs font-bold text-[#1C2B28]">98.2%</p>
                     </div>
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="relative w-full max-w-sm aspect-[3/4] rounded-[40px] overflow-hidden shadow-2xl">
                   <Image src="https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=800&auto=format&fit=crop" alt="Lab" fill className="object-cover" />
                   <div className="absolute inset-0 bg-gradient-to-t from-[#0D3B44]/80 to-transparent" />
                   <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute bottom-8 left-8 right-8 bg-white/95 p-8 rounded-3xl">
                      <Beaker className="w-6 h-6 text-[#2A9D8F] mb-4" />
                      <h4 className="font-display text-2xl text-[#0D3B44] mb-2">Lab Report 29-C</h4>
                      <p className="font-sans text-[#4A6B63] text-xs leading-relaxed">Chemical history directly dictates molecular permeability for the final formulation.</p>
                   </motion.div>
                </div>
              )}

              {activeStep === 3 && (
                <div className="w-full flex flex-col items-center">
                  <div className="relative w-72 h-96 rounded-[50px] overflow-hidden shadow-2xl mb-12">
                      <Image src="/assets/Products/Scalp Serum Concentrate.jpeg" alt="Product" fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent" />
                      <div className="absolute bottom-10 left-8 right-8 text-center bg-white/40 backdrop-blur-md p-4 rounded-xl">
                        <p className="font-display italic text-xs text-[#0D3B44]">"Precision meets aesthetic excellence."</p>
                      </div>
                  </div>
                  <div className="w-full space-y-2">
                     <div className="flex justify-between font-body text-[10px] uppercase text-[#2A9D8F] tracking-widest font-bold"><span>Accuracy</span><span>98.4%</span></div>
                     <div className="w-full h-1 bg-[#2A9D8F]/10 rounded-full"><motion.div className="h-full bg-[#2A9D8F]" initial={{ width: 0 }} animate={{ width: '98.4%' }} transition={{ duration: 1.5 }} /></div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #F4F7F5; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5D1; border-radius: 10px; }
        .bg-gradient-radial { background-image: radial-gradient(var(--tw-gradient-stops)); }
      `}</style>
    </div>
  );
}
