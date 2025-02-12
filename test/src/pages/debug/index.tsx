import React, { useEffect, useRef, useState } from 'react';
import { fitText, checkOverflow } from 'runfix-container';

const DebugPage = () => {
  const overflowTestRef = useRef<HTMLDivElement>(null);
  const groupTestRef = useRef<HTMLDivElement>(null);
  const [overflowResults, setOverflowResults] = useState<any>(null);
  const [currentScale, setCurrentScale] = useState(1);

  // Test 1: Overflow Detection
  const testOverflowDetection = (testId: 'test1' | 'test2') => {
    const ref = testId === 'test1' ? overflowTestRef : groupTestRef;
    if (!ref.current) return;

    const container = ref.current;
    const textElements = Array.from(container.children) as HTMLElement[];

    // Log container and element dimensions
    console.log(`${testId} - Container:`, {
      width: container.offsetWidth,
      height: container.offsetHeight,
      scrollWidth: container.scrollWidth,
      scrollHeight: container.scrollHeight,
      clientWidth: container.clientWidth,
      clientHeight: container.clientHeight,
    });

    textElements.forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      console.log(`${testId} - Element ${i}:`, {
        text: el.textContent,
        width: rect.width,
        height: rect.height,
        fontSize: style.fontSize,
        marginTop: style.marginTop,
        marginBottom: style.marginBottom,
      });
    });

    const results = checkOverflow(container, textElements);
    console.log(`${testId} - Overflow results:`, results);

    if (testId === 'test1') {
      setOverflowResults(results);
    }
  };

  // Test 2: Manual Group Scaling
  const adjustGroupScale = (scale: number) => {
    if (!groupTestRef.current) return;

    const container = groupTestRef.current;
    const textElements = Array.from(container.children) as HTMLElement[];

    textElements.forEach((el) => {
      const originalSize = parseFloat(
        el.getAttribute('data-original-size') || '16',
      );
      el.style.fontSize = `${originalSize * scale}px`;
    });

    setCurrentScale(scale);
    testOverflowDetection('test2');
  };

  useEffect(() => {
    // Store original font sizes
    if (groupTestRef.current) {
      const textElements = Array.from(
        groupTestRef.current.children,
      ) as HTMLElement[];
      textElements.forEach((el) => {
        const size = parseFloat(window.getComputedStyle(el).fontSize);
        el.setAttribute('data-original-size', size.toString());
      });
    }
  }, []);

  return (
    <div className="p-4 text-white bg-neutral-700">
      <h1 className="text-2xl mb-8">Debug Tests</h1>

      {/* Test 1: Overflow Detection */}
      <div className="mb-8">
        <h2 className="text-xl mb-4">Test 1: Overflow Detection</h2>
        <div
          ref={overflowTestRef}
          className="border-2 border-red-500 p-4 mb-4 overflow-hidden"
          style={{
            width: '200px',
            height: '100px',
            background: 'rgba(255,0,0,0.1)',
          }}
        >
          <p
            className="text-lg border border-blue-500 my-1"
            style={{ background: 'rgba(0,0,255,0.1)' }}
          >
            This is a long first paragraph that should definitely cause some
            overflow in this small container
          </p>
          <p
            className="text-xl border border-blue-500 my-1"
            style={{ background: 'rgba(0,0,255,0.1)' }}
          >
            Second paragraph with even more text that goes on and on
          </p>
          <p
            className="text-2xl border border-blue-500 my-1"
            style={{ background: 'rgba(0,0,255,0.1)' }}
          >
            Third very large text
          </p>
        </div>
        <button
          onClick={() => testOverflowDetection('test1')}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Test Overflow
        </button>
        {overflowResults && (
          <pre className="mt-4 p-4 bg-gray-100 rounded">
            {JSON.stringify(overflowResults, null, 2)}
          </pre>
        )}
      </div>

      {/* Test 2: Group Scaling */}
      <div className="mb-8">
        <h2 className="text-xl mb-4">Test 2: Group Scaling</h2>
        <div
          ref={groupTestRef}
          className="border-2 border-green-500 p-4 mb-4 overflow-hidden"
          style={{
            width: '300px',
            height: '150px',
            background: 'rgba(0,255,0,0.1)',
          }}
        >
          <p style={{ fontSize: '16px' }}>Small text (16px)</p>
          <p style={{ fontSize: '20px' }}>Medium text (20px)</p>
          <p style={{ fontSize: '24px' }}>Large text (24px)</p>
        </div>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => adjustGroupScale(Math.max(0.1, currentScale - 0.1))}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Scale Down (-0.1)
          </button>
          <span className="font-mono">Scale: {currentScale.toFixed(2)}</span>
          <button
            onClick={() => adjustGroupScale(currentScale + 0.1)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Scale Up (+0.1)
          </button>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;
