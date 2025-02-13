import { useState, useEffect } from 'react';
import { fitAndTranslate } from 'runfix-container';
import { checkContainerOverflow } from 'runfix-container';
import { getAllElementsToBeTranslated } from 'runfix-container';
import { textFitter } from 'runfix-container';
import { DefaultLayout } from '../../components/DefaultLayout';

const LANGUAGES = [
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'es', name: 'Spanish', dir: 'ltr' },
  { code: 'fr', name: 'French', dir: 'ltr' },
  { code: 'de', name: 'German', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', dir: 'rtl' },
  { code: 'ja', name: 'Japanese', dir: 'ltr' },
  { code: 'zh', name: 'Chinese', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', dir: 'ltr' },
  { code: 'ko', name: 'Korean', dir: 'ltr' },
  { code: 'he', name: 'Hebrew', dir: 'rtl' },
];

const TranslationDemo = () => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [dynamicText, setDynamicText] = useState(
    'Dynamic content will appear here',
  );
  const [currentTime, setCurrentTime] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [overflowStatus, setOverflowStatus] = useState<Record<
    string,
    any
  > | null>(null);

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
        acc.push(JSON.stringify(status));
      }
      return acc;
    }, new Array<string>());

    setOverflowStatus(overflowContainers);
    console.log('Overflow status:', overflowContainers);
  };

  const handleFitText = () => {
    const elemetsToTranslate = getAllElementsToBeTranslated();

    const containers = elemetsToTranslate.reduce((acc, el) => {
      const container = el.parentElement;
      if (!container) return acc;
      if (container.tagName === 'BODY') return acc;
      acc.add(container);
      return acc;
    }, new Set<HTMLElement>());

    const containerArr = Array.from(containers);
    const overflowContainers = containerArr.filter((container) => {
      const status = checkContainerOverflow({
        container: container as HTMLElement,
      });
      return status.hasOverflow;
    });
    console.log({ overflowContainers });
    textFitter({
      overflowContainers: overflowContainers as HTMLElement[],
      minScale: 0.1,
      maxScale: 2.0,
      precision: 0.001,
    });
  };

  // Handle client-side only features
  useEffect(() => {
    setIsMounted(true);
    setCurrentTime(new Date().toLocaleTimeString());
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const timer = setInterval(() => {
      setDynamicText(
        `Dynamic text: ${Math.random().toString(36).substring(7)}`,
      );
      setCurrentTime(new Date().toLocaleTimeString());
    }, 5000);

    return () => clearInterval(timer);
  }, [isMounted]);

  const handleTranslate = async () => {
    setIsTranslating(true);
    try {
      await fitAndTranslate({
        sourceLanguage,
        targetLanguage,
      });
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="max-w-4xl mx-auto mb-4 p-4 space-y-4">
        <div className="flex gap-4">
          <button
            onClick={checkOverflow}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            disabled={isTranslating}
          >
            Check Overflow
          </button>
          <button
            onClick={handleFitText}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            disabled={isTranslating}
          >
            Fit Text
          </button>
        </div>
        {overflowStatus && (
          <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto text-sm text-black">
            {JSON.stringify(overflowStatus, null, 2)}
          </pre>
        )}
      </div>
      <div
        className="max-w-4xl mx-auto p-6 bg-gray-900"
        dir={LANGUAGES.find((l) => l.code === targetLanguage)?.dir || 'ltr'}
      >
        <h1 className="text-3xl font-bold mb-8 text-white">
          Translation & Resize Test Cases
        </h1>
        {isMounted && (
          <p className="text-sm text-gray-300 mb-4">
            Current time: {currentTime}
          </p>
        )}

        {/* Language Selection */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4 items-center">
            <label className="w-32 text-white">Source Language:</label>
            <select
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
              className="border p-2 rounded bg-gray-700 text-white border-gray-600"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4 items-center">
            <label className="w-32 text-white">Target Language:</label>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="border p-2 rounded bg-gray-700 text-white border-gray-600"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} ({lang.dir})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Demo Content */}
        <div className="space-y-8">
          {/* Test Case 1: Dynamic Content */}
          <div className="border p-4 rounded-lg shadow-sm w-64 h-24 max-w-[256px] max-h-[96px] flex items-center justify-center bg-gray-800 border-gray-600 text-white overflow-hidden">
            <p>{dynamicText}</p>
          </div>

          {/* Test Case 2: Special Characters & Symbols */}
          <div className="border p-4 rounded-lg shadow-sm w-48 h-24 max-w-[192px] max-h-[96px] flex items-center justify-center bg-blue-900 border-blue-700 text-white overflow-hidden">
            <p>Special chars: ©®™€£¥§¶†‡</p>
          </div>

          {/* Test Case 3: Mixed Content */}
          <div className="border p-4 rounded-lg shadow-sm w-64 h-32 max-w-[256px] max-h-[128px] flex items-center justify-center bg-green-900 border-green-700 text-white overflow-hidden">
            <div>
              <h3 className="font-bold mb-2">Mixed Content</h3>
              <p>
                Text with <strong>bold</strong>, <em>italic</em>, and{' '}
                <code>code</code>
              </p>
            </div>
          </div>

          {/* Test Case 4: Nested Elements */}
          <div className="border p-6 rounded-lg shadow-sm w-96 h-48 max-w-[384px] max-h-[192px] flex items-center justify-center bg-yellow-900 border-yellow-700 text-white overflow-hidden">
            <div className="text-center w-full max-w-[300px]">
              <h4 className="text-lg font-bold mb-3 whitespace-nowrap overflow-hidden text-ellipsis">
                Nested Elements
              </h4>
              <div className="border p-4 bg-gray-800 rounded">
                <p className="text-base text-white">
                  Child element with its own styling
                </p>
              </div>
            </div>
          </div>

          {/* Test Case 5: Various HTML Elements */}
          <div className="space-y-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg w-64 max-w-[256px] h-12 max-h-[48px] text-base hover:bg-blue-700 overflow-hidden">
              Translatable Button
            </button>

            <textarea
              placeholder="Translatable placeholder in textarea"
              className="border p-2 rounded w-full h-20 bg-gray-700 text-white border-gray-600 placeholder-gray-400"
            />

            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox" />
                <span className="ml-2 text-white">Checkbox label</span>
              </label>
              <label className="inline-flex items-center">
                <input type="radio" className="form-radio" />
                <span className="ml-2 text-white">Radio label</span>
              </label>
            </div>
          </div>

          {/* Test Case 6: Extreme Sizes */}
          <div className="flex space-x-4">
            <div className="border p-2 rounded-lg shadow-sm w-16 h-16 max-w-[64px] max-h-[64px] flex items-center justify-center bg-red-900 border-red-700 text-white overflow-hidden">
              <p className="text-xs">Tiny box</p>
            </div>
            <div className="border p-4 rounded-lg shadow-sm w-96 h-24 max-w-[384px] max-h-[96px] flex items-center justify-center bg-purple-900 border-purple-700 text-white overflow-hidden">
              <p>
                This is a very wide container that might need different handling
                for various languages and scripts
              </p>
            </div>
          </div>

          {/* Test Case 7: Empty and Whitespace */}
          <div className="border p-4 rounded-lg shadow-sm w-48 h-24 max-w-[192px] max-h-[96px] flex items-center justify-center bg-gray-800 border-gray-600 text-white overflow-hidden">
            <p> Spaces and tabs </p>
          </div>

          {/* Test Case 8: Numbers and Mixed Content */}
          <div className="border p-4 rounded-lg shadow-sm w-64 h-24 max-w-[256px] max-h-[96px] flex items-center justify-center bg-pink-900 border-pink-700 text-white overflow-hidden">
            <p>Mix of 123 numbers and text 456</p>
          </div>

          {/* Test Case 9: Long Words */}
          <div className="border p-4 rounded-lg shadow-sm w-48 h-32 max-w-[192px] max-h-[128px] flex items-center justify-center bg-indigo-900 border-indigo-700 text-white overflow-hidden">
            <p>Supercalifragilisticexpiali</p>
          </div>

          {/* Test Case 10: HTML Entities */}
          <div className="border p-4 rounded-lg shadow-sm w-56 h-24 max-w-[224px] max-h-[96px] flex items-center justify-center bg-orange-900 border-orange-700 text-white overflow-hidden">
            <p>&copy; 2024 &bull; &trade; &reg;</p>
          </div>
        </div>

        {/* Translation Button */}
        <div className="mt-8">
          <button
            onClick={handleTranslate}
            disabled={isTranslating}
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-600 disabled:text-gray-300 min-w-[180px] max-w-[240px] h-[48px] max-h-[48px] text-base flex items-center justify-center overflow-hidden"
          >
            <span className="block px-2 truncate">
              {isTranslating ? 'Translating...' : 'Translate All'}
            </span>
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default TranslationDemo;
