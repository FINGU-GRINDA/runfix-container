import { useState, useEffect } from 'react';
import { fitAndTranslate } from 'runfix-container';
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
  { code: 'he', name: 'Hebrew', dir: 'rtl' }
];

const TranslationDemo = () => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [dynamicText, setDynamicText] = useState('Dynamic content will appear here');
  const [currentTime, setCurrentTime] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  // Handle client-side only features
  useEffect(() => {
    setIsMounted(true);
    setCurrentTime(new Date().toLocaleTimeString());
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    const timer = setInterval(() => {
      setDynamicText(`Dynamic text: ${Math.random().toString(36).substring(7)}`);
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
      <div className="max-w-4xl mx-auto p-6 bg-gray-900" dir={LANGUAGES.find(l => l.code === targetLanguage)?.dir || 'ltr'}>
        <h1 className="text-3xl font-bold mb-8 text-white">Translation & Resize Test Cases</h1>
        {isMounted && <p className="text-sm text-gray-300 mb-4">Current time: {currentTime}</p>}

        {/* Language Selection */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4 items-center">
            <label className="w-32 text-white">Source Language:</label>
            <select
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
              className="border p-2 rounded bg-gray-700 text-white border-gray-600"
            >
              {LANGUAGES.map(lang => (
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
              {LANGUAGES.map(lang => (
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
          <div className="border p-4 rounded-lg shadow-sm w-64 h-24 flex items-center justify-center bg-gray-800 border-gray-600 text-white">
            <p>{dynamicText}</p>
          </div>

          {/* Test Case 2: Special Characters & Symbols */}
          <div className="border p-4 rounded-lg shadow-sm w-48 h-24 flex items-center justify-center bg-blue-900 border-blue-700 text-white">
            <p>Special chars: ©®™€£¥§¶†‡</p>
          </div>

          {/* Test Case 3: Mixed Content */}
          <div className="border p-4 rounded-lg shadow-sm w-64 h-32 flex items-center justify-center bg-green-900 border-green-700 text-white">
            <div>
              <h3 className="font-bold mb-2">Mixed Content</h3>
              <p>Text with <strong>bold</strong>, <em>italic</em>, and <code>code</code></p>
            </div>
          </div>

          {/* Test Case 4: Nested Elements */}
          <div className="border p-6 rounded-lg shadow-sm w-96 h-48 flex items-center justify-center bg-yellow-900 border-yellow-700 text-white">
            <div className="text-center w-full max-w-[300px]">
              <h4 className="text-lg font-bold mb-3 whitespace-nowrap overflow-hidden text-ellipsis">Nested Elements</h4>
              <div className="border p-4 bg-gray-800 rounded">
                <p className="text-base text-white">Child element with its own styling</p>
              </div>
            </div>
          </div>

          {/* Test Case 5: Various HTML Elements */}
          <div className="space-y-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg w-64 text-base hover:bg-blue-700">
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
            <div className="border p-2 rounded-lg shadow-sm w-16 h-16 flex items-center justify-center bg-red-900 border-red-700 text-white">
              <p className="text-xs">Tiny box</p>
            </div>
            <div className="border p-4 rounded-lg shadow-sm w-96 h-24 flex items-center justify-center bg-purple-900 border-purple-700 text-white">
              <p>This is a very wide container that might need different handling for various languages and scripts</p>
            </div>
          </div>

          {/* Test Case 7: Empty and Whitespace */}
          <div className="border p-4 rounded-lg shadow-sm w-48 h-24 flex items-center justify-center bg-gray-800 border-gray-600 text-white">
            <p>   Spaces   and   tabs   </p>
          </div>

          {/* Test Case 8: Numbers and Mixed Content */}
          <div className="border p-4 rounded-lg shadow-sm w-64 h-24 flex items-center justify-center bg-pink-900 border-pink-700 text-white">
            <p>Mix of 123 numbers and text 456</p>
          </div>

          {/* Test Case 9: Long Words */}
          <div className="border p-4 rounded-lg shadow-sm w-48 h-32 flex items-center justify-center bg-indigo-900 border-indigo-700 text-white">
            <p>Supercalifragilisticexpialidocious</p>
          </div>

          {/* Test Case 10: HTML Entities */}
          <div className="border p-4 rounded-lg shadow-sm w-56 h-24 flex items-center justify-center bg-orange-900 border-orange-700 text-white">
            <p>&copy; 2024 &bull; &trade; &reg;</p>
          </div>
        </div>

        {/* Translation Button */}
        <div className="mt-8">
          <button
            onClick={handleTranslate}
            disabled={isTranslating}
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-600 disabled:text-gray-300 min-w-[180px] h-[48px] text-base flex items-center justify-center overflow-hidden"
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
