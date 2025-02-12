import { detectOverflow, fitText } from 'runfix-container';
import React, { useEffect, useRef, useState } from 'react';

interface TestCase {
  id: string;
  type: 'button' | 'div' | 'span';
  label: string;
  className?: string;
  style?: React.CSSProperties;
  renderContent?: (text: string) => React.ReactNode;
}

export default function OverflowDemo() {
  const [text, setText] = useState('Click me!');
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(60);
  const [fontSize, setFontSize] = useState(16);
  const [padding, setPadding] = useState(8);
  const [margin, setMargin] = useState(0);
  const [results, setResults] = useState<Record<string, any>>({});

  const testCases: TestCase[] = [
    {
      id: 'basic-button',
      type: 'button',
      label: 'Basic Button',
      className:
        'border border-slate-600 rounded bg-slate-700 text-white hover:bg-slate-600 transition-colors',
    },
    {
      id: 'margin-button',
      type: 'button',
      label: 'Button with Margin',
      className:
        'border border-slate-600 rounded bg-slate-700 text-white hover:bg-slate-600 transition-colors',
      style: { margin: '10px' },
    },
    {
      id: 'basic-div',
      type: 'div',
      label: 'Basic Div',
      className: 'border border-slate-600 rounded bg-slate-700',
    },
    {
      id: 'inline-div',
      type: 'div',
      label: 'Inline Div',
      className: 'border border-slate-600 rounded bg-slate-700 inline-block',
    },
    {
      id: 'span',
      type: 'span',
      label: 'Span Element',
      className: 'border border-slate-600 rounded bg-slate-700 inline-block',
    },
    {
      id: 'nested-div',
      type: 'div',
      label: 'Div with Nested Paragraph',
      className:
        'border border-slate-600 rounded bg-slate-700 flex items-center justify-center',
      renderContent: (text) => (
        <p
          ref={(el) => {
            if (el) elementRefs.current['nested-div-p'] = el;
          }}
        >
          {text}
        </p>
      ),
    },
    {
      id: 'styled-button',
      type: 'button',
      label: 'Styled Button with Fixed Size',
      className:
        'bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors',
      style: {
        width: '192px',
        height: '48px',
        padding: '0.75rem 1.5rem', // py-3 px-6
      },
    },
    {
      id: 'em-units',
      type: 'div',
      label: 'EM Units Example',
      className: 'border border-slate-600 rounded bg-slate-700 text-white',
      style: {
        fontSize: '1.2em',
        padding: '1.5em',
        margin: '1em',
        width: '15em'
      },
    },
    {
      id: 'rem-units',
      type: 'div',
      label: 'REM Units Example',
      className: 'border border-slate-600 rounded bg-slate-700 text-white',
      style: {
        fontSize: '1.2rem',
        padding: '1.5rem',
        margin: '2rem',
        width: '20rem',
        height: '10rem'
      },
    },
    {
      id: 'mixed-units',
      type: 'div',
      label: 'Mixed Units Example',
      className: 'border border-slate-600 rounded bg-slate-700 text-white',
      style: {
        fontSize: '16px',
        padding: '1rem 1.5em',
        marginTop: '20px',
        marginBottom: '2rem',
        marginLeft: '1em',
        marginRight: '16px',
        width: 'calc(100% - 2rem)'
      },
    },
    {
      id: 'spacing-example',
      type: 'div',
      label: 'Complex Spacing Example',
      className: 'border border-slate-600 rounded bg-slate-700 text-white',
      style: {
        padding: '1rem 2rem 1.5rem 1em',
        margin: '10px 1rem 1.2em 8px',
        width: '300px'
      },
    },
  ];

  const elementRefs = useRef<Record<string, HTMLElement | null>>({});

  const checkOverflow = () => {
    const newResults: Record<string, any> = {};
    Object.entries(elementRefs.current).forEach(([id, element]) => {
      if (element) {
        newResults[id] = detectOverflow(element, element);
      }
    });
    setResults(newResults);
  };

  const fitTextForAll = () => {
    Object.entries(elementRefs.current).forEach(([id, element]) => {
      if (element) {
        const pEl = id === 'nested-div' ? elementRefs.current['nested-div-p'] : null;
        fitText({
          elements: pEl ? [pEl] : [element],
          containerElements: id === 'nested-div' ? [element] : [element],
          onlyResizeDown: true,
          precision: 0.5,
        });
      }
    });
  };

  useEffect(() => {
    // First check if elements are ready
    if (Object.values(elementRefs.current).some(el => el)) {
      // Wait for next frame to ensure styles are applied
      requestAnimationFrame(() => {
        fitTextForAll();
        // Check overflow after fitting
        requestAnimationFrame(() => {
          checkOverflow();
        });
      });
    }
  }, [text, width, height, fontSize, padding, margin]);

  return (
    <div className="p-4 max-w-4xl mx-auto bg-slate-800 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4 text-white">
        Overflow Detection Demo
      </h1>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block mb-2 text-white">Text Content:</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="border p-2 rounded w-full bg-slate-700 text-white border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block mb-2 text-white">Width (px):</label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="border p-2 rounded w-full bg-slate-700 text-white border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-2 text-white">Height (px):</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="border p-2 rounded w-full bg-slate-700 text-white border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-2 text-white">Margin (px):</label>
            <input
              type="number"
              value={margin}
              onChange={(e) => setMargin(Number(e.target.value))}
              className="border p-2 rounded w-full bg-slate-700 text-white border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-2 text-white">
              Font Size: {fontSize}px
            </label>
            <input
              type="range"
              min="8"
              max="72"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full accent-blue-500 bg-slate-700 h-2 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>8px</span>
              <span>72px</span>
            </div>
          </div>
          <div>
            <label className="block mb-2 text-white">Padding (px):</label>
            <input
              type="number"
              value={padding}
              onChange={(e) => setPadding(Number(e.target.value))}
              className="border p-2 rounded w-full bg-slate-700 text-white border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {testCases.map((testCase) => (
          <div key={testCase.id} className="space-y-4">
            <h3 className="font-semibold text-lg">{testCase.label}</h3>

            <div className="space-y-2">
              {React.createElement(
                testCase.type,
                {
                  ref: (el: HTMLElement | null) =>
                    (elementRefs.current[testCase.id] = el),
                  className: testCase.className,
                  style: {
                    width: `${width}px`,
                    height: `${height}px`,
                    fontSize: `${fontSize}px`,
                    padding: `${padding}px`,
                    margin: `${margin}px`,
                    ...testCase.style,
                  },
                },
                testCase.renderContent ? testCase.renderContent(text) : text,
              )}
              <button
                onClick={() => {
                  requestAnimationFrame(() => {
                    fitTextForAll();
                    requestAnimationFrame(() => {
                      checkOverflow();
                    });
                  });
                }}
                className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
              >
                Fit Text
              </button>
            </div>

            {results[testCase.id] && (
              <div className="space-y-2 p-4 bg-slate-700 rounded border border-slate-600 text-sm">
                <div>
                  Has Overflow:{' '}
                  <span
                    className={
                      results[testCase.id].hasOverflow
                        ? 'text-red-400'
                        : 'text-green-400'
                    }
                  >
                    {results[testCase.id].hasOverflow ? '✓' : '✗'}
                  </span>
                </div>
                <div>
                  Overflow X:{' '}
                  <span
                    className={
                      results[testCase.id].overflowX
                        ? 'text-red-400'
                        : 'text-green-400'
                    }
                  >
                    {results[testCase.id].overflowX ? '✓' : '✗'}
                  </span>
                </div>
                <div>
                  Overflow Y:{' '}
                  <span
                    className={
                      results[testCase.id].overflowY
                        ? 'text-red-400'
                        : 'text-green-400'
                    }
                  >
                    {results[testCase.id].overflowY ? '✓' : '✗'}
                  </span>
                </div>
                <div>
                  Overflow Amount X:{' '}
                  <span className="text-blue-400">
                    {results[testCase.id].overflowAmount.x}px
                  </span>
                </div>
                <div>
                  Overflow Amount Y:{' '}
                  <span className="text-blue-400">
                    {results[testCase.id].overflowAmount.y}px
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
