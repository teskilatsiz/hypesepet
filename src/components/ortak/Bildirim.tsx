import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface BildirimProps {
  mesaj: string;
  tip: 'success' | 'error' | 'info';
  ikon: LucideIcon;
}

export function Bildirim({ mesaj, tip, ikon: Icon }: BildirimProps) {
  const stiller = {
    success: 'bg-green-50 border-green-200 text-green-600',
    error: 'bg-red-50 border-red-200 text-red-600',
    info: 'bg-blue-50 border-blue-200 text-blue-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex items-center space-x-2 px-4 py-3 rounded-lg border ${stiller[tip]}`}
    >
      <Icon className="h-5 w-5" />
      <span className="font-medium">{mesaj}</span>
    </motion.div>
  );
}