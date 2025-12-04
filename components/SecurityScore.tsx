import React from 'react';
import { SecurityScoreData } from '../types';
import { CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  scoreData: SecurityScoreData;
}

export const SecurityScore: React.FC<Props> = ({ scoreData }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scoreData.score / 100) * circumference;

  return (
    <div className="bg-white dark:bg-dark rounded-2xl shadow-xl p-6 border border-slate-200 dark:border-slate-800 h-full">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Security Grade</h3>
      
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Circular Meter */}
        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg className="transform -rotate-90 w-40 h-40">
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              className="text-slate-100 dark:text-slate-800"
            />
            <motion.circle
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              cx="80"
              cy="80"
              r={radius}
              stroke={scoreData.color}
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={circumference}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold" style={{ color: scoreData.color }}>{scoreData.score}</span>
            <span className="text-sm font-semibold text-slate-400 uppercase">Score</span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-500 dark:text-slate-400">Overall Rating</span>
            <span className="text-2xl font-bold" style={{ color: scoreData.color }}>{scoreData.grade}</span>
          </div>
          <div className="space-y-3">
            {scoreData.breakdown.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-300">{item.label}</span>
                {item.passed ? (
                  <CheckCircle2 size={16} className="text-success" />
                ) : (
                  <XCircle size={16} className="text-danger" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};