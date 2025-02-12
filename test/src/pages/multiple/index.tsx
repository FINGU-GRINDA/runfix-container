import React, { useState } from 'react';
import { fitAndTranslate } from 'runfix-container';
import * as Icons from 'react-icons/fi';

const MultiplePage: React.FC = () => {
  const [isTranslating, setIsTranslating] = useState(false);

  const handleFitAndTranslate = async () => {
    try {
      setIsTranslating(true);
      await fitAndTranslate({
        targetLanguage: 'id',
        sourceLanguage: 'en',
      });
    } catch (error) {
      console.error('Error during fit and translate:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* Fixed Translate Button */}
      <button
        onClick={handleFitAndTranslate}
        disabled={isTranslating}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Icons.FiGlobe
          className="animate-spin"
          style={{ animationPlayState: isTranslating ? 'running' : 'paused' }}
        />
        {isTranslating ? 'Translating...' : 'Translate'}
      </button>

      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-8">Test Cases for Text Fitting</h1>

        <div className="space-y-8">
          {/* Test Case 1: Original Problem */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Test Case 1: Original Problem</h2>
            <div className="flex flex-wrap gap-4">
              <div style={{ width: '73.5938px', height: '52px', border: '1px dashed #cbd5e1' }}>
                <p className="text-sm font-medium text-slate-500">Total users</p>
                <p className="text-2xl font-bold text-slate-900">12,345</p>
              </div>
              {/* Same structure but different content lengths */}
              <div style={{ width: '73.5938px', height: '52px', border: '1px dashed #cbd5e1' }}>
                <p className="text-sm font-medium text-slate-500">Active</p>
                <p className="text-2xl font-bold text-slate-900">2,456</p>
              </div>
            </div>
          </div>

          {/* Test Case 2: Different Container Sizes */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Test Case 2: Different Container Sizes</h2>
            <div className="flex flex-wrap gap-4">
              <div style={{ width: '100px', height: '60px', border: '1px dashed #cbd5e1' }}>
                <p className="text-sm font-medium text-slate-500">Total revenue</p>
                <p className="text-2xl font-bold text-slate-900">$1,234,567</p>
              </div>
              <div style={{ width: '80px', height: '50px', border: '1px dashed #cbd5e1' }}>
                <p className="text-sm font-medium text-slate-500">Orders</p>
                <p className="text-2xl font-bold text-slate-900">891</p>
              </div>
            </div>
          </div>

          {/* Test Case 3: Three Lines of Text */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Test Case 3: Three Lines of Text</h2>
            <div className="flex flex-wrap gap-4">
              <div style={{ width: '90px', height: '75px', border: '1px dashed #cbd5e1' }}>
                <p className="text-xs font-medium text-slate-400">Category</p>
                <p className="text-sm font-medium text-slate-500">Electronics</p>
                <p className="text-2xl font-bold text-slate-900">458</p>
              </div>
            </div>
          </div>

          {/* Test Case 4: Very Long Text */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Test Case 4: Very Long Text</h2>
            <div className="flex flex-wrap gap-4">
              <div style={{ width: '73.5938px', height: '52px', border: '1px dashed #cbd5e1' }}>
                <p className="text-sm font-medium text-slate-500">Extraordinary long label</p>
                <p className="text-2xl font-bold text-slate-900">999,999</p>
              </div>
            </div>
          </div>

          {/* Test Case 5: Mixed Font Sizes */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Test Case 5: Mixed Font Sizes</h2>
            <div className="flex flex-wrap gap-4">
              <div style={{ width: '73.5938px', height: '52px', border: '1px dashed #cbd5e1' }}>
                <p className="text-xs font-medium text-slate-500">Tiny header</p>
                <p className="text-lg font-medium text-slate-700">Mid size</p>
                <p className="text-3xl font-bold text-slate-900">XL</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiplePage;
