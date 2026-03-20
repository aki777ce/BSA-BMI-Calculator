/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Calculator, Info, Ruler, Weight as WeightIcon, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');

  const results = useMemo(() => {
    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
      return null;
    }

    // BMI: Weight (kg) / [Height (m)]^2
    const bmi = w / Math.pow(h / 100, 2);

    // BSA (DuBois): 0.007184 * Height(cm)^0.725 * Weight(kg)^0.425
    const bsa = 0.007184 * Math.pow(h, 0.725) * Math.pow(w, 0.425);

    return {
      bmi: parseFloat(bmi.toFixed(2)),
      bsa: parseFloat(bsa.toFixed(3)),
    };
  }, [height, weight]);

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: '低体重 (Underweight)', color: 'text-blue-500', bg: 'bg-blue-50' };
    if (bmi < 25) return { label: '普通体重 (Normal)', color: 'text-emerald-500', bg: 'bg-emerald-50' };
    if (bmi < 30) return { label: '肥満(1度) (Overweight)', color: 'text-orange-500', bg: 'bg-orange-50' };
    return { label: '肥満(2度以上) (Obese)', color: 'text-red-500', bg: 'bg-red-50' };
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-emerald-100">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500 text-white mb-6 shadow-lg shadow-emerald-200"
          >
            <Calculator size={32} />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold tracking-tight mb-2"
          >
            BSA & BMI Calculator
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-500"
          >
            身長と体重から体表面積(BSA)とBMIを算出します
          </motion.p>
        </header>

        <main className="space-y-8">
          {/* Input Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
              <label htmlFor="height" className="flex items-center gap-2 text-sm font-medium text-zinc-600 mb-4">
                <Ruler size={16} />
                身長 (Height)
              </label>
              <div className="relative">
                <input
                  id="height"
                  type="number"
                  placeholder="170"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full text-3xl font-light border-none p-0 focus:ring-0 placeholder:text-zinc-200"
                />
                <span className="absolute right-0 bottom-1 text-zinc-400 font-medium">cm</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
              <label htmlFor="weight" className="flex items-center gap-2 text-sm font-medium text-zinc-600 mb-4">
                <WeightIcon size={16} />
                体重 (Weight)
              </label>
              <div className="relative">
                <input
                  id="weight"
                  type="number"
                  placeholder="65"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full text-3xl font-light border-none p-0 focus:ring-0 placeholder:text-zinc-200"
                />
                <span className="absolute right-0 bottom-1 text-zinc-400 font-medium">kg</span>
              </div>
            </div>
          </section>

          {/* Results Section */}
          <AnimatePresence mode="wait">
            {results ? (
              <motion.section
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* BMI Card */}
                <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm overflow-hidden relative group">
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-sm font-semibold uppercase tracking-wider text-zinc-400">BMI</span>
                      <Activity className="text-emerald-500" size={20} />
                    </div>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-6xl font-light tracking-tighter">{results.bmi}</span>
                      <span className="text-zinc-400 text-lg">kg/m²</span>
                    </div>
                    <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${getBMICategory(results.bmi).bg} ${getBMICategory(results.bmi).color}`}>
                      {getBMICategory(results.bmi).label}
                    </div>
                  </div>
                  <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Activity size={120} />
                  </div>
                </div>

                {/* BSA Card */}
                <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm overflow-hidden relative group">
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-sm font-semibold uppercase tracking-wider text-zinc-400">BSA (DuBois)</span>
                      <Info className="text-zinc-400" size={20} />
                    </div>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-6xl font-light tracking-tighter">{results.bsa}</span>
                      <span className="text-zinc-400 text-lg">m²</span>
                    </div>
                    <p className="text-xs text-zinc-400 font-medium">
                      体表面積: 薬用量決定の指標などに用いられます
                    </p>
                  </div>
                  <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Calculator size={120} />
                  </div>
                </div>
              </motion.section>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-zinc-100 border-2 border-dashed border-zinc-200 rounded-3xl p-12 text-center"
              >
                <p className="text-zinc-400 font-medium">身長と体重を入力してください</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info Section */}
          <footer className="pt-12 border-t border-zinc-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-zinc-500">
              <div>
                <h3 className="font-semibold text-zinc-900 mb-2">BMI (Body Mass Index)</h3>
                <p className="leading-relaxed">
                  体重(kg) ÷ 身長(m)² で算出される肥満度の指標です。日本肥満学会の基準では、22が標準体重、25以上が肥満とされています。
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 mb-2">BSA (Body Surface Area)</h3>
                <p className="leading-relaxed">
                  DuBoisの式を用いて算出しています。<br />
                  公式: 0.007184 × 身長(cm)⁰.⁷²⁵ × 体重(kg)⁰.⁴²⁵
                </p>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
