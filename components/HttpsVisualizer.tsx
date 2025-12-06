import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Server, Laptop, ArrowRight, FileBadge, KeyRound } from 'lucide-react';
import { AnimationStep } from '../types';

interface Props {
  isRunning: boolean;
  onComplete: () => void;
  darkMode?: boolean;
}

export const HttpsVisualizer: React.FC<Props> = ({ isRunning, onComplete, darkMode = false }) => {
  const [step, setStep] = useState<AnimationStep>(AnimationStep.Idle);

  // Colors & classes that react to darkMode prop
  const bgClass = darkMode
    ? "bg-slate-900 border-slate-800"
    : "bg-white border-slate-300";

  const textColor = darkMode ? "text-white" : "text-slate-900";
  const subTextColor = darkMode ? "text-slate-400" : "text-slate-600";
  const trackBg = darkMode ? "bg-slate-800" : "bg-slate-300";
  const nodeBg = (secure: boolean) =>
    secure ? 'bg-green-900/30 ring-2 ring-green-500' : (darkMode ? 'bg-slate-800' : 'bg-slate-200');

  useEffect(() => {
    // When isRunning changes OR darkMode toggled, restart animation so it responds to theme changes
    if (isRunning) {
      setStep(AnimationStep.ClientHello);

      const t1 = setTimeout(() => setStep(AnimationStep.ServerHello), 2000);
      const t2 = setTimeout(() => setStep(AnimationStep.KeyExchange), 5000);
      const t3 = setTimeout(() => setStep(AnimationStep.Secure), 8000);
      const t4 = setTimeout(() => {
        onComplete();
      }, 9000);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    } else {
      setStep(AnimationStep.Idle);
    }
  }, [isRunning, onComplete, darkMode]); // <- added darkMode here

  return (
    <div className={`${bgClass} rounded-2xl shadow-2xl p-8 border relative overflow-hidden min-h-[300px] flex flex-col items-center justify-center transition-colors duration-300`}>
      {/* Title */}
      <h3 className={`absolute top-6 left-6 font-bold flex items-center gap-2 ${textColor}`}>
        {step === AnimationStep.Secure ? (
          <Lock className={`${darkMode ? 'text-green-300' : 'text-green-500'}`} size={20} />
        ) : (
          <Unlock className={`${darkMode ? 'text-red-400' : 'text-red-500'}`} size={20} />
        )}
        HTTPS Handshake Visualizer
      </h3>

      {/* Status text */}
      <div className={`absolute top-6 right-6 text-xs font-mono px-3 py-1 rounded-full ${subTextColor} ${darkMode ? 'bg-black/30' : 'bg-black/10'}`}>
        {step === AnimationStep.Idle && "Waiting..."}
        {step === AnimationStep.ClientHello && "Step 1: Client Hello"}
        {step === AnimationStep.ServerHello && "Step 2: Server Hello + Certificate"}
        {step === AnimationStep.KeyExchange && "Step 3: Key Exchange"}
        {step === AnimationStep.Secure && "Step 4: Encrypted Tunnel Established"}
      </div>

      {/* Main Animation Row */}
      <div className="flex w-full max-w-3xl justify-between items-center relative z-10 px-4 md:px-12 mt-8">

        {/* Client Node */}
        <div className="flex flex-col items-center gap-3">
          <div className={`p-4 rounded-2xl transition-colors duration-500 ${step === AnimationStep.Secure ? nodeBg(true) : nodeBg(false)}`}>
            <Laptop
              size={40}
              className={step === AnimationStep.Secure ? (darkMode ? 'text-green-300' : 'text-green-400') : (darkMode ? 'text-blue-300' : 'text-blue-500')}
            />
          </div>
          <span className={`${subTextColor} text-sm font-medium`}>Browser</span>
        </div>

        {/* TRACK */}
        <div className={`flex-1 h-1 mx-4 rounded relative ${trackBg}`}>

          {/* Step 1 */}
          <AnimatePresence>
            {step === AnimationStep.ClientHello && (
              <motion.div
                initial={{ left: '0%', opacity: 0 }}
                animate={{ left: '100%', opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
                className="absolute top-1/2 -translate-y-1/2 bg-blue-500 text-xs text-white px-2 py-1 rounded shadow-lg flex items-center gap-1"
              >
                Hello <ArrowRight size={10} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 2 */}
          <AnimatePresence>
            {step === AnimationStep.ServerHello && (
              <motion.div
                initial={{ left: '100%', opacity: 0 }}
                animate={{ left: '0%', opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2.5 }}
                className="absolute top-1/2 -translate-y-1/2 bg-purple-500 text-xs text-white px-2 py-1 rounded shadow-lg flex items-center gap-1 z-20"
              >
                <FileBadge size={12} /> Certificate
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 3 */}
          <AnimatePresence>
            {step === AnimationStep.KeyExchange && (
              <>
                <motion.div
                  initial={{ left: '0%', opacity: 1 }}
                  animate={{ left: '50%', opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute top-1/2 -translate-y-1/2 bg-yellow-500 w-3 h-3 rounded-full"
                />
                <motion.div
                  initial={{ right: '0%', opacity: 1 }}
                  animate={{ right: '50%', opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute top-1/2 -translate-y-1/2 bg-yellow-500 w-3 h-3 rounded-full"
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

          {/* Step 4 */}
          {step === AnimationStep.Secure && (
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              className="absolute top-0 left-0 h-full rounded"
              style={{ background: darkMode ? 'rgba(34,197,94,0.14)' : 'rgba(34,197,94,0.25)' }}
            />
          )}
        </div>

        {/* Server Node */}
        <div className="flex flex-col items-center gap-3">
          <div className={`p-4 rounded-2xl transition-colors duration-500 ${step === AnimationStep.Secure ? nodeBg(true) : nodeBg(false)}`}>
            <Server
              size={40}
              className={step === AnimationStep.Secure ? (darkMode ? 'text-green-300' : 'text-green-400') : (darkMode ? 'text-purple-300' : 'text-purple-500')}
            />
          </div>
          <span className={`${subTextColor} text-sm font-medium`}>Server</span>
        </div>
      </div>

      {/* Secure background effect */}
      {step === AnimationStep.Secure && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.08 }}
          className="absolute inset-0"
          style={{ background: darkMode ? 'rgba(34,197,94,0.08)' : 'rgba(34,197,94,0.08)' }}
        />
      )}
    </div>
  );
};
