import React from 'react';
import { CertificateDetails } from '../types';
import { Shield, Calendar, Key, FileText, Lock } from 'lucide-react';

interface Props {
  data: CertificateDetails;
}

const DetailRow = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700 last:border-0">
    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
      <Icon size={18} />
      <span className="text-sm font-medium">{label}</span>
    </div>
    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 text-right">{value}</span>
  </div>
);

export const CertificateCard: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-white dark:bg-dark rounded-2xl shadow-xl p-6 border border-slate-200 dark:border-slate-800 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary">
          <Shield size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Certificate Details</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Analysis Result</p>
        </div>
      </div>

      <div className="flex-1">
        <DetailRow icon={Lock} label="Common Name" value={data.commonName} />
        <DetailRow icon={Shield} label="Issuer Organization" value={data.issuer} />
        <DetailRow icon={Calendar} label="Valid From" value={new Date(data.validFrom).toLocaleDateString()} />
        <DetailRow icon={Calendar} label="Expires On" value={new Date(data.validTo).toLocaleDateString()} />
        <DetailRow icon={Key} label="Public Key" value={`${data.algorithm} (${data.keySize})`} />
        <DetailRow icon={FileText} label="Signature" value={data.signatureAlgorithm} />
      </div>
    </div>
  );
};