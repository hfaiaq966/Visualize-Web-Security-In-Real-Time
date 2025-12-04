import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Server, Laptop, ArrowRight, FileBadge, KeyRound } from 'lucide-react';
import { AnimationStep } from '../types';

interface Props {
  isRunning: boolean;
  onComplete: () => void;
}

export const HttpsVisualizer: React.FC<Props> = ({ isRunning, onComplete }) => {
  const [step, setStep] = useState<AnimationStep>(AnimationStep.Idle);

  useEffect(() => {
    if (isRunning) {
      setStep(AnimationStep.ClientHello);
      const timer1 = setTimeout(() => setStep(AnimationStep.ServerHello), 2000);
      const timer2 = setTimeout(() => setStep(AnimationStep.KeyExchange), 5000);
      const timer3 = setTimeout(() => setStep(AnimationStep.Secure), 8000);
      const timer4 = setTimeout(onComplete, 9000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    } else {
        setStep(AnimationStep.Idle);
    }
  }, [isRunning, onComplete]);

  return (
    <div className="bg-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-800 relative overflow-hidden min-h-[300px] flex flex-col items-center justify-center">
      <h3 className="absolute top-6 left-6 text-white font-bold flex items-center gap-2">
        {step === AnimationStep.Secure ? <Lock className="text-success" size={20} /> : <Unlock className="text-danger" size={20} />}
        HTTPS Handshake Visualizer
      </h3>

      <div className="absolute top-6 right-6 text-xs text-slate-400 font-mono bg-slate-800 px-3 py-1 rounded-full">
        {step === AnimationStep.Idle && "Waiting..."}
        {step === AnimationStep.ClientHello && "Step 1: Client Hello"}
        {step === AnimationStep.ServerHello && "Step 2: Server Hello + Certificate"}
        {step === AnimationStep.KeyExchange && "Step 3: Key Exchange"}
        {step === AnimationStep.Secure && "Step 4: Encrypted Tunnel Established"}
      </div>

      <div className="flex w-full max-w-3xl justify-between items-center relative z-10 px-4 md:px-12 mt-8">
        {/* Client Node */}
        <div className="flex flex-col items-center gap-3">
            <div className={`p-4 rounded-2xl transition-colors duration-500 ${step === AnimationStep.Secure ? 'bg-emerald-900/50 ring-2 ring-emerald-500' : 'bg-slate-800'}`}>
                <Laptop size={40} className={step === AnimationStep.Secure ? 'text-emerald-400' : 'text-blue-400'} />
            </div>
            <span className="text-slate-400 text-sm font-medium">Browser</span>
        </div>

        {/* Animation Track */}
        <div className="flex-1 h-1 bg-slate-800 rounded mx-4 relative">
            {/* Step 1: Client Hello Particle */}
            <AnimatePresence>
                {step === AnimationStep.ClientHello && (
                    <motion.div
                        initial={{ left: '0%', opacity: 0 }}
                        animate={{ left: '100%', opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="absolute top-1/2 -translate-y-1/2 bg-blue-500 text-xs text-white px-2 py-1 rounded shadow-lg flex items-center gap-1 whitespace-nowrap"
                    >
                        Hello <ArrowRight size={10} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Step 2: Server Cert Particle */}
            <AnimatePresence>
                {step === AnimationStep.ServerHello && (
                    <motion.div
                        initial={{ left: '100%', opacity: 0 }}
                        animate={{ left: '0%', opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2.5, ease: "easeInOut" }}
                        className="absolute top-1/2 -translate-y-1/2 bg-purple-500 text-xs text-white px-2 py-1 rounded shadow-lg flex items-center gap-1 z-20"
                    >
                        <FileBadge size={12} /> Certificate
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Step 3: Key Exchange (Both directions) */}
            <AnimatePresence>
                {step === AnimationStep.KeyExchange && (
                    <>
                         <motion.div
                            initial={{ left: '0%', opacity: 1 }}
                            animate={{ left: '50%', opacity: 0 }}
                            transition={{ duration: 1 }}
                            className="absolute top-1/2 -translate-y-1/2 bg-yellow-500 w-3 h-3 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.8)]"
                        />
                        <motion.div
                            initial={{ right: '0%', opacity: 1 }}
                            animate={{ right: '50%', opacity: 0 }}
                            transition={{ duration: 1 }}
                            className="absolute top-1/2 -translate-y-1/2 bg-yellow-500 w-3 h-3 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.8)]"
                        />
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1.5, opacity: 1 }}
                            transition={{ delay: 1, duration: 0.5 }}
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-yellow-400"
                        >
                            <KeyRound size={24} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
             
             {/* Step 4: Secure Tunnel */}
            {step === AnimationStep.Secure && (
                 <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    className="absolute top-0 left-0 h-full bg-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.5)] rounded"
                 />
            )}
        </div>

        {/* Server Node */}
        <div className="flex flex-col items-center gap-3">
            <div className={`p-4 rounded-2xl transition-colors duration-500 ${step === AnimationStep.Secure ? 'bg-emerald-900/50 ring-2 ring-emerald-500' : 'bg-slate-800'}`}>
                <Server size={40} className={step === AnimationStep.Secure ? 'text-emerald-400' : 'text-purple-400'} />
            </div>
            <span className="text-slate-400 text-sm font-medium">Server</span>
        </div>
      </div>

      {/* Background Effect */}
      {step === AnimationStep.Secure && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            className="absolute inset-0 bg-emerald-500 z-0"
          />
      )}
    </div>
  );
};