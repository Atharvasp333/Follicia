"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface QuizPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuizPopup({ isOpen, onClose }: QuizPopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] border-none bg-[#F4F7F5] p-0 overflow-hidden shadow-2xl">
        <div className="relative p-8 pt-12">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#2A9D8F]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
          
          <DialogHeader className="relative z-10 text-center sm:text-center">
            <div className="mx-auto mb-6 w-16 h-16 bg-[#0D3B44] rounded-2xl flex items-center justify-center text-[#D4AF37] shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <Sparkles size={32} />
            </div>
            <DialogTitle className="font-playfair text-3xl font-extrabold text-[#0D3B44] leading-tight mb-2">
              Ready for Your <br /> Best Hair Ever?
            </DialogTitle>
            <DialogDescription className="font-inter text-[#4A6B63] text-lg leading-relaxed max-w-[320px] mx-auto">
              Our AI analysis takes just 90 seconds to match you with your clinical precision regimen.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-10 flex flex-col gap-4 relative z-10">
            <Link href="/quiz" className="w-full">
              <Button 
                className="w-full h-14 rounded-full bg-[#0D3B44] hover:bg-[#1a5a66] text-white font-montserrat font-bold text-lg group transition-all duration-300 shadow-lg hover:shadow-[#0D3B44]/20"
                onClick={onClose}
              >
                Start My Assessment
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <Button 
              variant="ghost" 
              className="w-full h-12 rounded-full text-[#4A6B63] hover:text-[#0D3B44] hover:bg-black/5 font-montserrat font-semibold"
              onClick={onClose}
            >
              Maybe Later
            </Button>
          </div>

          <p className="mt-8 text-center text-[#9AABA5] text-xs font-inter uppercase tracking-[0.15em] relative z-10">
            * Precision Matching · 2,400+ Formulations
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
