import { useState } from 'react';
import { fitAndTranslate } from 'runfix-container';
import { DefaultLayout } from '../../components/DefaultLayout';

const TranslationDemo = () => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('es');

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
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Translation Demo</h1>

        {/* Language Selection */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4 items-center">
            <label className="w-32">Source Language:</label>
            <select
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          <div className="flex gap-4 items-center">
            <label className="w-32">Target Language:</label>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </div>

        {/* Demo Content */}
        <div className="space-y-8">
          {/* Text in containers */}
          <div className="border p-4 rounded-lg shadow-sm w-64 h-24 flex items-center justify-center">
            <p>This text will be translated and resized to fit</p>
          </div>

          {/* Button with text */}
          <div 
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center"
            style={{
              width: '192px',
              height: '48px',
            }}
          >
            <button className="w-full h-full px-6 py-3">
              Click me - I'll resize!
            </button>
          </div>

          {/* Input with placeholder */}
          <input
            type="text"
            placeholder="This placeholder will be translated"
            className="border p-2 rounded w-full"
          />

          {/* Heading in a constrained space */}
          <div className="border p-4 rounded-lg shadow-sm w-48 h-20 flex items-center justify-center">
            <h2 className="text-xl font-bold">Heading Demo</h2>
          </div>

          {/* Long text in a small container */}
          <div className="border p-4 rounded-lg shadow-sm w-32 h-32 flex items-center justify-center">
            <p>
              This is a longer piece of text that will need significant resizing
              to fit in this small container
            </p>
          </div>
        </div>

        {/* Translation Button */}
        <div className="mt-8">
          <button
            onClick={handleTranslate}
            disabled={isTranslating}
            className="bg-green-500 text-white px-8 py-3 rounded-lg disabled:bg-gray-400"
          >
            {isTranslating ? 'Translating...' : 'Translate All'}
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default TranslationDemo;
