import React, { useState } from 'react';

import * as Icons from 'react-icons/fi';
import { OverflowDetector } from '~/components/overflow-detector';
import { fitAndTranslate } from 'runfix-container';
const MultiplePage: React.FC = () => {
  const [overflowStatus, setOverflowStatus] = useState<string[] | null>(null);
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
    <div className="min-h-screen bg-slate-50 p-8 text-black">
      {/* Fixed Action Buttons */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-4 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-200">
        <div className="flex flex-col gap-2">
          <OverflowDetector />
        </div>
        <div className="flex justify-end border-t pt-4">
          <button
            onClick={handleFitAndTranslate}
            disabled={isTranslating}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center"
          >
            <Icons.FiGlobe
              className="animate-spin"
              style={{
                animationPlayState: isTranslating ? 'running' : 'paused',
              }}
            />
            {isTranslating ? 'Translating...' : 'Translate'}
          </button>
        </div>
      </div>

      {overflowStatus && overflowStatus.length > 0 && (
        <div className=" text-black fixed top-20 right-4 z-50 w-96 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-900">
              Overflow Status ({overflowStatus.length} elements)
            </h3>
            <button
              onClick={() => setOverflowStatus(null)}
              className="text-gray-400 hover:text-gray-500"
            >
              <Icons.FiX className="w-4 h-4" />
            </button>
          </div>
          <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-96">
            {overflowStatus.map((status, index) => (
              <div
                key={index}
                className="mb-2 pb-2 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0"
              >
                {(() => {
                  const parsed = JSON.parse(status);
                  return (
                    <div>
                      <div className="font-medium text-gray-700 mb-1">
                        <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-xs mr-2">
                          {parsed.elementTag}
                        </span>
                        {parsed.elementText}
                      </div>
                      <div className="text-xs text-gray-500 mb-1">
                        {parsed.className}
                      </div>
                      <div className="text-gray-600">
                        {JSON.stringify(
                          {
                            hasOverflow: parsed.hasOverflow,
                            overflowX: parsed.overflowX,
                            overflowY: parsed.overflowY,
                            availableWidth: parsed.availableWidth,
                            availableHeight: parsed.availableHeight,
                          },
                          null,
                          2,
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            ))}
          </pre>
        </div>
      )}
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-8">
          Test Cases for Translation and Text Fitting
        </h1>

        <div className="space-y-8">
          {/* Test Case 1: Original Problem */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">
              Test Case 1: Original Problem
            </h2>
            <div className="flex flex-wrap gap-4 border-8">
              <div
                style={{
                  width: '130px',
                  height: '80px',
                  padding: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  border: '1px dashed #cbd5e1',
                  overflow: 'hidden',
                }}
              >
                <p className="text-[9px] font-medium text-slate-500 truncate mb-auto">
                  Total users
                </p>
                <p className="text-sm font-bold text-slate-900 leading-none mt-auto">
                  12,345
                </p>
              </div>
              {/* Same structure but different content lengths */}
              <div
                style={{
                  width: '130px',
                  height: '80px',
                  padding: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  border: '1px dashed #cbd5e1',
                  overflow: 'hidden',
                }}
              >
                <p className="text-[9px] font-medium text-slate-500 truncate mb-auto">
                  Active
                </p>
                <p className="text-sm font-bold text-slate-900 leading-none mt-auto">
                  2,456
                </p>
              </div>
            </div>
          </div>

          {/* Test Case 2: Different Container Sizes */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">
              Test Case 2: Different Container Sizes
            </h2>
            <div className="flex flex-wrap gap-4">
              <div
                style={{
                  width: '180px',
                  height: '90px',
                  padding: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  border: '1px dashed #cbd5e1',
                  overflow: 'hidden',
                }}
              >
                <p className="text-[9px] font-medium text-slate-500 truncate mb-auto">
                  Total revenue
                </p>
                <p className="text-sm font-bold text-slate-900 leading-none mt-auto">
                  $1,234,567
                </p>
              </div>
              <div
                style={{
                  width: '130px',
                  height: '80px',
                  padding: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  border: '1px dashed #cbd5e1',
                  overflow: 'hidden',
                }}
              >
                <p className="text-[9px] font-medium text-slate-500 truncate mb-auto">
                  Orders
                </p>
                <p className="text-sm font-bold text-slate-900 leading-none mt-auto">
                  891
                </p>
              </div>
            </div>
          </div>

          {/* Test Case 3: Three Lines of Text */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">
              Test Case 3: Three Lines of Text
            </h2>
            <div className="flex flex-wrap gap-4">
              <div
                style={{
                  width: '160px',
                  height: '110px',
                  padding: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  border: '1px dashed #cbd5e1',
                  overflow: 'hidden',
                }}
              >
                <p className="text-[9px] font-medium text-slate-400 truncate mb-auto">
                  Category
                </p>
                <p className="text-[9px] font-medium text-slate-500 truncate mb-auto">
                  Electronics
                </p>
                <p className="text-sm font-bold text-slate-900 leading-none mt-auto">
                  458
                </p>
              </div>
            </div>
          </div>

          {/* Test Case 4: Very Long Text */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">
              Test Case 4: Very Long Text
            </h2>
            <div className="flex flex-wrap gap-4">
              <div
                style={{
                  width: '130px',
                  height: '80px',
                  padding: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  border: '1px dashed #cbd5e1',
                  overflow: 'hidden',
                }}
              >
                <p className="text-sm font-medium text-slate-500">
                  Extraordinary long label
                </p>
                <p className="text-2xl font-bold text-slate-900">999,999</p>
              </div>
            </div>
          </div>

          {/* Test Case 5: Mixed Font Sizes */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">
              Test Case 5: Mixed Font Sizes
            </h2>
            <div className="flex flex-wrap gap-4">
              <div
                style={{
                  width: '130px',
                  height: '80px',
                  padding: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  border: '1px dashed #cbd5e1',
                  overflow: 'hidden',
                }}
              >
                <p className="text-xs font-medium text-slate-500">
                  Tiny header
                </p>
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
