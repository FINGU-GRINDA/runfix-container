import React, { useState } from 'react';
import {
  fitAndTranslate,
  getAllElementsToBeTranslated,
  checkContainerOverflow,
} from 'runfix-container';
import * as Icons from 'react-icons/fi';

const MultiplePage: React.FC = () => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [overflowStatus, setOverflowStatus] = useState<string[] | null>(null);

  const checkOverflow = () => {
    const elemetsToTranslate = getAllElementsToBeTranslated();

    const containers = elemetsToTranslate.reduce((acc, el) => {
      const container = el.parentElement;
      if (!container) return acc;
      if (container.tagName === 'BODY') return acc;
      acc.add(container);
      return acc;
    }, new Set<HTMLElement>());

    const containerArr = Array.from(containers);
    const overflowContainers = containerArr.reduce((acc, curr) => {
      const status = checkContainerOverflow({
        container: curr as HTMLElement,
      });
      if (status.hasOverflow) {
        const textContent = Array.from(curr.children)
          .map((child) => child.textContent?.trim())
          .filter(Boolean)
          .join(' | ');
        acc.push(JSON.stringify({ ...status, elementText: textContent }));
      }
      return acc;
    }, new Array<string>());

    setOverflowStatus(overflowContainers);
    console.log('Overflow status:', overflowContainers);
  };

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
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <button
          onClick={checkOverflow}
          disabled={isTranslating}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icons.FiSearch className="w-4 h-4" />
          Check Overflow
        </button>
        <button
          onClick={handleFitAndTranslate}
          disabled={isTranslating}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icons.FiGlobe
            className="animate-spin"
            style={{ animationPlayState: isTranslating ? 'running' : 'paused' }}
          />
          {isTranslating ? 'Translating...' : 'Translate'}
        </button>
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
                        {parsed.elementText}
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
          Test Cases for Text Fitting
        </h1>

        <div className="space-y-8">
          {/* Test Case 1: Original Problem */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">
              Test Case 1: Original Problem
            </h2>
            <div className="flex flex-wrap gap-4">
              <div
                style={{
                  width: '73.5938px',
                  height: '52px',
                  border: '1px dashed #cbd5e1',
                }}
              >
                <p className="text-sm font-medium text-slate-500">
                  Total users
                </p>
                <p className="text-2xl font-bold text-slate-900">12,345</p>
              </div>
              {/* Same structure but different content lengths */}
              <div
                style={{
                  width: '73.5938px',
                  height: '52px',
                  border: '1px dashed #cbd5e1',
                }}
              >
                <p className="text-sm font-medium text-slate-500">Active</p>
                <p className="text-2xl font-bold text-slate-900">2,456</p>
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
                  width: '100px',
                  height: '60px',
                  border: '1px dashed #cbd5e1',
                }}
              >
                <p className="text-sm font-medium text-slate-500">
                  Total revenue
                </p>
                <p className="text-2xl font-bold text-slate-900">$1,234,567</p>
              </div>
              <div
                style={{
                  width: '80px',
                  height: '50px',
                  border: '1px dashed #cbd5e1',
                }}
              >
                <p className="text-sm font-medium text-slate-500">Orders</p>
                <p className="text-2xl font-bold text-slate-900">891</p>
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
                  width: '90px',
                  height: '75px',
                  border: '1px dashed #cbd5e1',
                }}
              >
                <p className="text-xs font-medium text-slate-400">Category</p>
                <p className="text-sm font-medium text-slate-500">
                  Electronics
                </p>
                <p className="text-2xl font-bold text-slate-900">458</p>
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
                  width: '73.5938px',
                  height: '52px',
                  border: '1px dashed #cbd5e1',
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
                  width: '73.5938px',
                  height: '52px',
                  border: '1px dashed #cbd5e1',
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
