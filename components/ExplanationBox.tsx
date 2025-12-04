import React, { useState, useEffect } from 'react';
import { ExplanationLevel } from '../types';
import { getAIExplanation } from '../services/geminiService';
import { Bot, BookOpen, GraduationCap, Baby } from 'lucide-react';

interface Props {
  domain: string;
}

export const ExplanationBox: React.FC<Props> = ({ domain }) => {
  const [activeTab, setActiveTab] = useState<ExplanationLevel>(ExplanationLevel.Normal);
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchExplanation = async () => {
      setLoading(true);
      const text = await getAIExplanation(domain, activeTab);
      setContent(text);
      setLoading(false);
    };
    fetchExplanation();
  }, [domain, activeTab]);

  const tabs = [
    { id: ExplanationLevel.Beginner, label: 'Simple', icon: Baby },
    { id: ExplanationLevel.Normal, label: 'Normal', icon: BookOpen },
    { id: ExplanationLevel.Technical, label: 'Expert', icon: GraduationCap },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-darker rounded-2xl shadow-xl p-6 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300">
          <Bot size={24} />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">AI Security Analyst</h3>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-xl mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="min-h-[100px] text-slate-700 dark:text-slate-300 leading-relaxed">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-24 gap-2 text-slate-400">
             <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
             <span className="text-xs">Analyzing...</span>
          </div>
        ) : (
          <p className="animate-fade-in">{content}</p>
        )}
      </div>
    </div>
  );
};