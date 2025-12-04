import React, { useState, useRef } from 'react';
import { Moon, Sun, Download, ShieldCheck, Github } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { CertificateCard } from './components/CertificateCard';
import { SecurityScore } from './components/SecurityScore';
import { HttpsVisualizer } from './components/HttpsVisualizer';
import { ExplanationBox } from './components/ExplanationBox';
import { fetchCertificateDetails, getAIExplanation } from './services/geminiService';
import { calculateSecurityScore } from './utils/scoreCalculator';
import { generatePDF } from './utils/pdfGenerator';
import { CertificateDetails, SecurityScoreData, ExplanationLevel } from './types';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [domain, setDomain] = useState<string | null>(null);
  const [certData, setCertData] = useState<CertificateDetails | null>(null);
  const [scoreData, setScoreData] = useState<SecurityScoreData | null>(null);
  const [visualizerRunning, setVisualizerRunning] = useState(false);
  const [visualizerComplete, setVisualizerComplete] = useState(false);

  // For PDF generation later - we fetch explanation text for the PDF on demand
  const explanationRef = useRef<string>("");

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleSearch = async (searchDomain: string) => {
    setLoading(true);
    setDomain(searchDomain);
    setCertData(null);
    setScoreData(null);
    setVisualizerRunning(false);
    setVisualizerComplete(false);

    // 1. Fetch Certificate Data (Simulated via AI)
    const data = await fetchCertificateDetails(searchDomain);
    setCertData(data);

    // 2. Calculate Score
    const score = calculateSecurityScore(data);
    setScoreData(score);

    // 3. Start Visualization
    setLoading(false);
    setVisualizerRunning(true);
  };

  const handleVisualizerComplete = () => {
    setVisualizerRunning(false);
    setVisualizerComplete(true);
  };

  const handleExportPDF = async () => {
    if (!domain || !certData || !scoreData) return;
    
    // Get a text summary for PDF if not already in UI state
    const summary = await getAIExplanation(domain, ExplanationLevel.Normal);
    generatePDF(domain, certData, scoreData, summary);
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="bg-white/80 dark:bg-darker/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-primary" size={32} />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              CertVis Pro
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {certData && (
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
              >
                <Download size={18} />
                <span className="hidden sm:inline">Export PDF</span>
              </button>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            Visualize Web Security <span className="text-primary">In Real-Time</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
            Analyze SSL certificates, watch the HTTPS handshake in action, and understand encryption with AI-powered insights.
          </p>
          
          <SearchBar onSearch={handleSearch} isLoading={loading} />
        </div>

        {/* Results Section */}
        {certData && scoreData && (
          <div className="space-y-8 animate-fade-in">
            
            {/* 1. Visualizer (Novel Feature) */}
            <div className="w-full">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">Live Handshake Simulation</h2>
              <HttpsVisualizer isRunning={visualizerRunning} onComplete={handleVisualizerComplete} />
            </div>

            {/* 2. Analysis Grid */}
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 transition-opacity duration-700 ${visualizerComplete ? 'opacity-100' : 'opacity-50 blur-sm'}`}>
              <CertificateCard data={certData} />
              <div className="space-y-8">
                <SecurityScore scoreData={scoreData} />
                {domain && <ExplanationBox domain={domain} />}
              </div>
            </div>

          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 mt-12 bg-white dark:bg-darker">
        <div className="container mx-auto px-4 text-center text-slate-500 dark:text-slate-400">
          <p className="mb-2">© {new Date().getFullYear()} CertVis Pro. Educational Security Tool.</p>
          <p className="text-sm flex justify-center items-center gap-2">
            <Github size={14} /> Open Source Student Project
          </p>
        </div>
      </footer>
    </div>
  );
}