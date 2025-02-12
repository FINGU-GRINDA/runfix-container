import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import * as Icons from 'react-icons/fi';
import dynamic from 'next/dynamic';
import { fitAndTranslate } from 'runfix-container';

const LandingPage: React.FC = () => {
  const [isCodeVisible, setIsCodeVisible] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const handleFitAndTranslate = async () => {
    try {
      setIsTranslating(true);
      await fitAndTranslate({
        targetLanguage: 'id', // Spanish as an example
        sourceLanguage: 'en',
      });
    } catch (error) {
      console.error('Error during fit and translate:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  useEffect(() => {
    // Enable smooth scrolling for anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' &&
        target.getAttribute('href')?.startsWith('#')
      ) {
        e.preventDefault();
        const id = target.getAttribute('href');
        const element = document.querySelector(id!);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 overflow-x-hidden text-black">
      {/* Fixed Translate Button */}
      <button
        onClick={handleFitAndTranslate}
        disabled={isTranslating}
        className="fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-indigo-700 text-white rounded-md shadow-lg hover:bg-indigo-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Icons.FiGlobe
          className="animate-spin"
          style={{ animationPlayState: isTranslating ? 'running' : 'paused' }}
        />
        {isTranslating ? 'Translating...' : 'Translate'}
      </button>
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm fixed w-full z-50 top-0 left-0 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <span className="text-xl font-bold text-indigo-800 no-prose">
                RunFix
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="#features"
                className="text-slate-700 hover:text-slate-900 font-medium no-prose"
              >
                Features
              </Link>
              <Link
                href="#demo"
                className="text-slate-700 hover:text-slate-900 font-medium no-prose"
              >
                Demo
              </Link>
              <Link
                href="#docs"
                className="text-slate-700 hover:text-slate-900 font-medium no-prose"
              >
                Documentation
              </Link>
              <a
                href="https://github.com/your-repo/runfix-container"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-700 hover:text-slate-900 font-medium no-prose flex items-center gap-2"
              >
                <Icons.FiGithub /> GitHub
              </a>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        {/* Hero Section */}
        <div className="text-center opacity-0 translate-y-5 animate-fade-in">
          <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl md:text-6xl">
            RunFix Container
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-slate-800 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            <span className="bg-white/80 px-4 py-2 rounded-lg shadow-sm inline-block">
              A powerful npm library to apply fixed width / height to a
              container at runtime
            </span>
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                href="/docs"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-900 md:py-4 md:text-lg md:px-10"
              >
                Get Started
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Link
                href="/examples"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-slate-50 md:py-4 md:text-lg md:px-10"
              >
                View Examples
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 bg-white/80 py-4 rounded-lg shadow-sm">
            Powerful Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/90 p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <Icons.FiZap className="text-2xl text-indigo-700 mr-3" />
                <h3 className="text-xl font-semibold text-slate-900">
                  Runtime Optimization
                </h3>
              </div>
              <p className="text-slate-700">
                Automatically adjusts container dimensions for optimal
                performance at runtime.
              </p>
            </div>
            <div className="bg-white/90 p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <Icons.FiLayout className="text-2xl text-indigo-700 mr-3" />
                <h3 className="text-xl font-semibold text-slate-900">
                  Responsive Design
                </h3>
              </div>
              <p className="text-slate-700">
                Seamlessly adapts to different screen sizes and orientations.
              </p>
            </div>
            <div className="bg-white/90 p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <Icons.FiSettings className="text-2xl text-indigo-700 mr-3" />
                <h3 className="text-xl font-semibold text-slate-900">
                  Easy Integration
                </h3>
              </div>
              <p className="text-slate-700">
                Simple API with TypeScript support for quick implementation.
              </p>
            </div>
          </div>
        </div>

        {/* Code Preview Section */}
        <div
          id="demo"
          className="mt-20 bg-slate-900 rounded-lg p-8 overflow-hidden"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white text-lg font-semibold">Quick Start</h3>
            <button
              onClick={() => setIsCodeVisible(!isCodeVisible)}
              className="text-slate-300 hover:text-white transition-colors font-medium"
            >
              {isCodeVisible ? 'Hide Code' : 'Show Code'}
            </button>
          </div>
          <div
            className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${isCodeVisible ? 'max-h-96' : 'max-h-0'}`}
          >
            <pre className="text-slate-100 overflow-x-auto">
              <code>{`import { RunFixContainer } from 'runfix-container';

const MyComponent = () => {
  return (
    <RunFixContainer
      width={300}
      height={200}
      onResize={(dimensions) => {
        console.log('New dimensions:', dimensions);
      }}
    >
      <div>Your content here</div>
    </RunFixContainer>
  );
};`}</code>
            </pre>
          </div>
        </div>

        {/* Installation Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 bg-white/80 py-4 rounded-lg shadow-sm">
            Get Started in Minutes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <Icons.FiPackage className="text-2xl text-indigo-700 mr-3" />
                <h3 className="text-xl font-semibold text-slate-900">
                  Install Package
                </h3>
              </div>
              <pre className="bg-slate-900 p-4 rounded-md overflow-x-auto">
                <code className="text-slate-50">
                  npm install runfix-container
                </code>
              </pre>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <Icons.FiCode className="text-2xl text-indigo-700 mr-3" />
                <h3 className="text-xl font-semibold text-slate-900">
                  Import and Use
                </h3>
              </div>
              <pre className="bg-slate-900 p-4 rounded-md overflow-x-auto">
                <code className="text-slate-50">
                  {"import { RunFixContainer } from 'runfix-container';"}
                </code>
              </pre>
            </div>
          </div>
        </div>

        {/* Documentation Section */}
        <div id="docs" className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 bg-white/80 py-4 rounded-lg shadow-sm">
            Comprehensive Documentation
          </h2>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="prose prose-slate prose-headings:text-slate-900 prose-p:text-slate-700 prose-strong:text-slate-900 prose-code:text-slate-900 max-w-none">
              <h3 className="flex items-center gap-2 text-xl font-semibold mb-4">
                <Icons.FiBook className="text-indigo-700" /> API Reference
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Props</h4>
                  <ul className="list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      <code>width</code>: number (required)
                    </li>
                    <li>
                      <code>height</code>: number (required)
                    </li>
                    <li>
                      <code>onResize</code>: (dimensions) ={'>'} void
                    </li>
                    <li>
                      <code>className</code>: string
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Events</h4>
                  <ul className="list-disc pl-5 space-y-2 text-slate-700">
                    <li>Resize callback</li>
                    <li>Mount events</li>
                    <li>Update triggers</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Link
                  href="/docs"
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
                >
                  View Full Documentation{' '}
                  <Icons.FiArrowRight className="ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Powerful Features
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                title: 'Easy Integration',
                description:
                  'Simple to integrate with any React project with minimal configuration required.',
              },
              {
                title: 'Runtime Optimization',
                description:
                  'Efficiently manages container dimensions during runtime for optimal performance.',
              },
              {
                title: 'TypeScript Support',
                description:
                  'Built with TypeScript for better development experience and type safety.',
              },
            ].map((feature) => (
              <div key={feature.title} className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default dynamic(() => Promise.resolve(LandingPage), {
  ssr: false,
});
