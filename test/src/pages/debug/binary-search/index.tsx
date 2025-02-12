import React, { useRef, useState, useEffect } from 'react';

interface OverflowDetails {
  hasOverflow: boolean;
  totalHeight: number;
  maxWidth: number;
  availableHeight: number;
  availableWidth: number;
  overflowAmount: {
    height: number;
    width: number;
  };
}

interface ContainerDimensions {
  width: number;
  height: number;
  padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

const getContainerDimensions = (
  container: HTMLElement,
): ContainerDimensions => {
  const style = window.getComputedStyle(container);
  return {
    width: container.clientWidth,
    height: container.clientHeight,
    padding: {
      top: parseFloat(style.paddingTop),
      right: parseFloat(style.paddingRight),
      bottom: parseFloat(style.paddingBottom),
      left: parseFloat(style.paddingLeft),
    },
  };
};

const checkOverflow = (
  container: HTMLElement,
  textElements: HTMLElement[],
): OverflowDetails => {
  const dimensions = getContainerDimensions(container);

  // Calculate available space
  const availableWidth =
    dimensions.width - dimensions.padding.left - dimensions.padding.right;
  const availableHeight =
    dimensions.height - dimensions.padding.top - dimensions.padding.bottom;

  // Get actual content height by measuring distance between first and last elements
  let totalHeight = 0;
  if (textElements.length > 0) {
    const firstRect = textElements[0].getBoundingClientRect();
    const lastRect =
      textElements[textElements.length - 1].getBoundingClientRect();
    totalHeight = lastRect.bottom - firstRect.top;

    // Add margins of first and last elements
    const firstStyle = window.getComputedStyle(textElements[0]);
    const lastStyle = window.getComputedStyle(
      textElements[textElements.length - 1],
    );
    totalHeight += parseFloat(firstStyle.marginTop) || 0;
    totalHeight += parseFloat(lastStyle.marginBottom) || 0;
  }

  // Find maximum content width
  const maxWidth = Math.max(
    ...textElements.map((el) => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return (
        rect.width +
        (parseFloat(style.marginLeft) || 0) +
        (parseFloat(style.marginRight) || 0)
      );
    }),
  );

  return {
    hasOverflow: totalHeight > availableHeight || maxWidth > availableWidth,
    totalHeight,
    maxWidth,
    availableHeight,
    availableWidth,
    overflowAmount: {
      height: Math.max(0, totalHeight - availableHeight),
      width: Math.max(0, maxWidth - availableWidth),
    },
  };
};

interface SearchRange {
  low: number;
  high: number;
}

interface ScaleResult {
  scale: number;
  hasOverflow: boolean;
  totalHeight: number;
  availableHeight: number;
}

interface ScaleStep extends ScaleResult, SearchRange {}

const SCALE_CONFIG = {
  MIN: 0.01,   // 1% of original size
  MAX: 1.0,    // 100% of original size
  PRECISION: 0.001, // 0.1% precision
  MAX_ITERATIONS: 50
} as const;

export default function BinarySearchDebug() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [steps, setSteps] = useState<ScaleStep[]>([]);
  // const [currentScale, setCurrentScale] = useState(1);
  const [precision] = useState(0.1);
  const [originalSizes, setOriginalSizes] = useState<Record<string, number>>(
    {},
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const textElements = Array.from(container.children) as HTMLElement[];

    // Store original font sizes
    const sizes: Record<string, number> = {};
    textElements.forEach((el, i) => {
      const fontSize = parseFloat(window.getComputedStyle(el).fontSize);
      sizes[`element${i}`] = fontSize;
    });
    setOriginalSizes(sizes);
  }, []);

  const applyScale = (elements: HTMLElement[], scale: number) => {
    elements.forEach((el, i) => {
      el.style.fontSize = `${originalSizes[`element${i}`] * scale}px`;
    });
  };

  const testScale = (container: HTMLElement, elements: HTMLElement[], scale: number): ScaleResult => {
    applyScale(elements, scale);
    const result = checkOverflow(container, elements);
    return {
      scale,
      hasOverflow: result.hasOverflow,
      totalHeight: result.totalHeight,
      availableHeight: result.availableHeight
    };
  };

  const updateSearchRange = (range: SearchRange, result: ScaleResult, bestScale: number): SearchRange => {
    if (result.hasOverflow) {
      return { ...range, high: result.scale };
    }
    return { low: result.scale, high: range.high };
  };

  const runBinarySearch = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const elements = Array.from(container.children) as HTMLElement[];
    const steps: ScaleStep[] = [];
    
    // Start with original size
    const initialResult = testScale(container, elements, SCALE_CONFIG.MAX);
    let range: SearchRange = {
      low: SCALE_CONFIG.MIN,
      high: SCALE_CONFIG.MAX
    };
    
    steps.push({ ...initialResult, ...range });
    
    // If no overflow at max scale, we're done
    if (!initialResult.hasOverflow) {
      setSteps(steps);
      return;
    }
    
    let bestScale = SCALE_CONFIG.MIN;
    let iterations = 0;
    
    while (iterations < SCALE_CONFIG.MAX_ITERATIONS && 
           (range.high - range.low) > SCALE_CONFIG.PRECISION) {
      
      const scale = (range.low + range.high) / 2;
      const result = testScale(container, elements, scale);
      
      if (!result.hasOverflow) {
        bestScale = scale;
      }
      
      range = updateSearchRange(range, result, bestScale);
      steps.push({ ...result, ...range });
      
      iterations++;
    }
    
    // Apply best scale found
    applyScale(elements, bestScale);
    setSteps(steps);
  };



  return (
    <div className="p-4 bg-neutral-700 text-white min-h-screen">
      <h1 className="text-2xl mb-8">Binary Search Debug</h1>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl mb-4">Test Container</h2>
          <div
            ref={containerRef}
            className="border-2 border-blue-500 p-4 mb-4 overflow-hidden"
            style={{
              width: '300px',
              height: '200px',
              background: 'rgba(0,0,255,0.1)',
            }}
          >
            <p style={{ fontSize: '16px' }}>Small text (16px)</p>
            <p style={{ fontSize: '20px' }}>Medium text (20px)</p>
            <p style={{ fontSize: '24px' }}>Large text (24px)</p>
            <p style={{ fontSize: '32px' }}>Extra large text (32px)</p>
          </div>

          <div className="space-x-4">
            <button
              onClick={runBinarySearch}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Run Binary Search
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-xl mb-4">Binary Search Steps</h2>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`p-4 rounded ${
                  step.hasOverflow ? 'bg-red-900' : 'bg-green-900'
                }`}
              >
                <p className="font-bold">Step {i + 1}</p>
                <p>Scale: {step.scale.toFixed(3)}</p>
                <p>
                  Range: [{step.low.toFixed(3)}, {step.high.toFixed(3)}]
                </p>
                <p>Total Height: {Math.round(step.totalHeight)}px</p>
                <p>Available Height: {Math.round(step.availableHeight)}px</p>
                <p>Overflow: {step.hasOverflow ? 'Yes' : 'No'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
