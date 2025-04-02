import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';

const renderExample = (type, dragHandlers = null) => {
  switch (type) {
    case 'line_no_points':
      return (
        <div className="relative w-48">
          <svg viewBox="0 0 100 10" className="w-full h-full">
            <line x1="10" y1="5" x2="90" y2="5" stroke="black" strokeWidth="2"/>
          </svg>
        </div>
      );
    case 'line':
      return (
        <div className="relative w-48">
          <svg viewBox="0 0 200 100" className="w-full h-full">
            <line 
              x1={dragHandlers?.points?.[0]?.x ?? 10} 
              y1={dragHandlers?.points?.[0]?.y ?? 50} 
              x2={dragHandlers?.points?.[1]?.x ?? 90} 
              y2={dragHandlers?.points?.[1]?.y ?? 50} 
              stroke={dragHandlers?.lineStyle?.stroke ?? "black"} 
              strokeWidth="4"
            />
            <circle 
              cx={dragHandlers?.points?.[0]?.x ?? 10} 
              cy={dragHandlers?.points?.[0]?.y ?? 50} 
              r="4" 
              fill={dragHandlers?.pointStyle?.fill ?? "#0ea5e9"}
              stroke={dragHandlers?.pointStyle?.fill ? "none" : "white"}
              strokeWidth={dragHandlers?.pointStyle?.fill ? "0" : "2"}
              style={{ cursor: dragHandlers ? 'move' : 'default' }}
              onMouseDown={dragHandlers?.onMouseDown ? () => dragHandlers.onMouseDown(0) : undefined}
            />
            <circle 
              cx={dragHandlers?.points?.[1]?.x ?? 90} 
              cy={dragHandlers?.points?.[1]?.y ?? 50} 
              r="4" 
              fill={dragHandlers?.pointStyle?.fill ?? "#0ea5e9"}
              stroke={dragHandlers?.pointStyle?.fill ? "none" : "white"}
              strokeWidth={dragHandlers?.pointStyle?.fill ? "0" : "2"}
              style={{ cursor: dragHandlers ? 'move' : 'default' }}
              onMouseDown={dragHandlers?.onMouseDown ? () => dragHandlers.onMouseDown(1) : undefined}
            />
          </svg>
        </div>
      );
    case 'angle':
      return (
        <div className="relative w-16">
          <svg viewBox="0 0 100 100">
            <path d="M 10 90 L 90 90 L 90 10" 
                  fill="none" 
                  stroke="black" 
                  strokeWidth="4"/>
          </svg>
        </div>
      );
    case 'triangle':
      return (
        <div className="relative w-16">
          <svg viewBox="0 0 100 100">
            <polygon points="10,90 90,90 50,10" 
                     fill="none" 
                     stroke="black" 
                     strokeWidth="4"/>
          </svg>
        </div>
      );
    case 'shape':
      return (
        <div className="relative w-16">
          <svg viewBox="0 0 100 100">
            <polygon points="50,10 90,90 10,90" 
                     fill="none" 
                     stroke="black" 
                     strokeWidth="4"/>
          </svg>
        </div>
      );
    case 'angle_with_points':
      return (
        <div className="relative w-48">
          <svg viewBox="0 0 200 100" className="w-full h-full">
            <path d={`M ${dragHandlers?.points?.[0]?.x ?? 67} ${dragHandlers?.points?.[0]?.y ?? 90} L ${dragHandlers?.points?.[1]?.x ?? 133} ${dragHandlers?.points?.[1]?.y ?? 90} L ${dragHandlers?.points?.[2]?.x ?? 133} ${dragHandlers?.points?.[2]?.y ?? 10}`}
                  fill="none" 
                  stroke={dragHandlers?.lineStyle?.stroke ?? "black"}
                  strokeWidth="4"/>
            {[0, 1, 2].map(i => (
              <circle
                key={i}
                cx={dragHandlers?.points?.[i]?.x ?? (i === 0 ? 67 : 133)}
                cy={dragHandlers?.points?.[i]?.y ?? (i === 2 ? 10 : 90)}
                r="4"
                fill={dragHandlers?.pointStyle?.fill ?? "#0ea5e9"}
                stroke={dragHandlers?.pointStyle?.fill ? "none" : "white"}
                strokeWidth={dragHandlers?.pointStyle?.fill ? "0" : "2"}
                style={{ cursor: dragHandlers ? 'move' : 'default' }}
                onMouseDown={dragHandlers?.onMouseDown ? () => dragHandlers.onMouseDown(i, 'angle') : undefined}
              />
            ))}
          </svg>
        </div>
      );
    case 'shape_with_points':
      return (
        <div className="relative w-48">
          <svg viewBox="0 0 200 100" className="w-full h-full">
            <polygon 
              points={dragHandlers?.points?.map(p => `${p.x},${p.y}`).join(' ') ?? "100,10 133,90 67,90"}
              fill="none" 
              stroke={dragHandlers?.lineStyle?.stroke ?? "black"}
              strokeWidth="4"/>
            {[0, 1, 2].map(i => (
              <circle
                key={i}
                cx={dragHandlers?.points?.[i]?.x ?? (i === 0 ? 100 : (i === 1 ? 133 : 67))}
                cy={dragHandlers?.points?.[i]?.y ?? (i === 0 ? 10 : 90)}
                r="4"
                fill={dragHandlers?.pointStyle?.fill ?? "#0ea5e9"}
                stroke={dragHandlers?.pointStyle?.fill ? "none" : "white"}
                strokeWidth={dragHandlers?.pointStyle?.fill ? "0" : "2"}
                style={{ cursor: dragHandlers ? 'move' : 'default' }}
                onMouseDown={dragHandlers?.onMouseDown ? () => dragHandlers.onMouseDown(i, 'shape') : undefined}
              />
            ))}
          </svg>
        </div>
      );
    default:
      return null;
  }
};

const ReflexiveProperty = () => {
  const [linePoints, setLinePoints] = useState([
    { x: 67, y: 50 },
    { x: 133, y: 50 }
  ]);
  const [anglePoints, setAnglePoints] = useState([
    { x: 67, y: 90 },
    { x: 133, y: 90 },
    { x: 133, y: 10 }
  ]);

  const [shapePoints, setShapePoints] = useState([
    { x: 100, y: 10 },
    { x: 133, y: 90 },
    { x: 67, y: 90 }
  ]);

  const [dragIndex, setDragIndex] = useState(null);
  const [dragType, setDragType] = useState(null);

  const handleMouseDown = (index, type = 'line') => {
    setDragIndex(index);
    setDragType(type);
  };

  const handleMouseMove = (e) => {
    if (dragIndex !== null) {
      const svg = e.target.closest('svg');
      if (!svg) return;
      
      const rect = svg.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const x = ((e.clientX - rect.left) / width) * 200;  // Changed to match viewBox width
      const y = ((e.clientY - rect.top) / height) * 100;
      
      const newPoint = { 
        x: Math.max(5, Math.min(195, x)),  // Adjusted bounds for wider viewBox
        y: Math.max(5, Math.min(95, y))
      };

      if (dragType === 'line') {
        setLinePoints(prev => {
          const newPoints = [...prev];
          newPoints[dragIndex] = newPoint;
          return newPoints;
        });
      } else if (dragType === 'angle') {
        setAnglePoints(prev => {
          const newPoints = [...prev];
          newPoints[dragIndex] = newPoint;
          return newPoints;
        });
      } else if (dragType === 'shape') {
        setShapePoints(prev => {
          const newPoints = [...prev];
          newPoints[dragIndex] = newPoint;
          return newPoints;
        });
      }
    }
  };

  const handleMouseUp = () => {
    setDragIndex(null);
  };
  const [animations, setAnimations] = useState({
    row1: false,
    row2: false,
    row3: false
  });
  
  const [activeButtons, setActiveButtons] = useState({
    row1: false,
    row2: false,
    row3: false
  });
  
  const containerRefs = {
    row1: useRef(null),
    row2: useRef(null),
    row3: useRef(null)
  };
  
  const [translations, setTranslations] = useState({
    row1: 0,
    row2: 0,
    row3: 0
  });

  useEffect(() => {
    const updateTranslations = () => {
      Object.keys(containerRefs).forEach(row => {
        const container = containerRefs[row].current;
        if (container) {
          const firstBox = container.querySelector('.figure-box');
          const secondBox = container.querySelectorAll('.figure-box')[1];
          if (firstBox && secondBox) {
            const distance = secondBox.getBoundingClientRect().left - firstBox.getBoundingClientRect().left;
            setTranslations(prev => ({
              ...prev,
              [row]: distance
            }));
          }
        }
      });
    };

    updateTranslations();
    window.addEventListener('resize', updateTranslations);
    return () => window.removeEventListener('resize', updateTranslations);
  }, []);

  const [colorChangeTimeout, setColorChangeTimeout] = useState(null);
  
  const handleButtonClick = (row) => {
    if (!activeButtons[row]) {
      setAnimations(prev => ({ ...prev, [row]: true }));
      setActiveButtons(prev => ({ ...prev, [row]: true }));
      if (colorChangeTimeout) clearTimeout(colorChangeTimeout);
      setColorChangeTimeout(setTimeout(() => {
        setColorChange(prev => ({ ...prev, [row]: true }));
      }, 600));
    } else {
      setAnimations(prev => ({ ...prev, [row]: false }));
      setActiveButtons(prev => ({ ...prev, [row]: false }));
      setColorChange(prev => ({ ...prev, [row]: false }));
      if (colorChangeTimeout) clearTimeout(colorChangeTimeout);
    }
  };

  const [colorChange, setColorChange] = useState({
    row1: false,
    row2: false,
    row3: false
  });

  return (
    <div className="bg-gray-100 p-8 w-full overflow-auto">
      <Card className="max-w-4xl mx-auto shadow-md bg-white mb-4">
        <div className="bg-sky-50 p-6 rounded-t-lg">
          <h1 className="text-sky-900 text-2xl font-bold">The Reflexive Property of Congruence</h1>
          <p className="text-sky-800">Learn about geometric figures and their congruence to themselves!</p>
        </div>

        <CardContent className="space-y-6 pt-6">
          <div className="bg-blue-50 p-4 rounded border border-blue-200">
            <h2 className="text-blue-900 font-bold mb-2">What is the Reflexive Property?</h2>
            <p className="text-blue-600 mb-4">
              The reflexive property of congruence states that any geometric figure (a line, an angle, a shape) 
              is always congruent to itself.
            </p>
            <p className="text-blue-600 mb-4">
              In other words: For any geometric figure X, X ≅ X
            </p>
            <p className="text-blue-600">
              Each of the below figures have identical copies which will follow any changes you make. Compare these pairs of geometric figures to see the reflexive property in action!
            </p>
          </div>

          <div className="space-y-12">
            <div>
              <div className="grid grid-cols-2 gap-6" ref={containerRefs.row1}>
                <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center figure-box h-40 w-full">
                  <div className="font-semibold mb-4">Line Segment 1</div>
                  <div 
                    className="transition-transform duration-500 flex items-center justify-center h-20"
                    style={{
                      transform: animations.row1 ? `translateX(${translations.row1}px)` : 'translateX(0)'
                    }}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    {renderExample('line', {
                      points: linePoints,
                      onMouseDown: handleMouseDown
                    })}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center figure-box h-40 w-full">
                  <div className="font-semibold mb-4">Line Segment 2</div>
                  <div className="flex items-center justify-center h-20">
                    {renderExample('line', {
                      points: linePoints,
                      pointStyle: { fill: 'black' },
                      lineStyle: { stroke: colorChange.row1 ? '#22c55e' : 'black' }
                    })}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center mt-4">
                {colorChange.row1 && (
                  <p className="text-green-600 font-semibold mb-2">
                    This figure is congruent to itself!
                  </p>
                )}
                <Button 
                  onClick={() => handleButtonClick('row1')}
                  className="w-24"
                >
                  {activeButtons.row1 ? 'Separate' : 'Overlap'}
                </Button>
              </div>
            </div>

            <div>
              <div className="grid grid-cols-2 gap-6" ref={containerRefs.row2}>
                <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center figure-box h-40 w-full">
                  <div className="font-semibold mb-4">Angle 1</div>
                  <div 
                    className="transition-transform duration-500 flex items-center justify-center h-20"
                    style={{
                      transform: animations.row2 ? `translateX(${translations.row2}px)` : 'translateX(0)'
                    }}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    {renderExample('angle_with_points', {
                      points: anglePoints,
                      onMouseDown: handleMouseDown
                    })}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center figure-box h-40 w-full">
                  <div className="font-semibold mb-4">Angle 2</div>
                  <div className="flex items-center justify-center h-20">
                    {renderExample('angle_with_points', {
                      points: anglePoints,
                      pointStyle: { fill: 'black' },
                      lineStyle: { stroke: colorChange.row2 ? '#22c55e' : 'black' }
                    })}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center mt-4">
                {colorChange.row2 && (
                  <p className="text-green-600 font-semibold mb-2">
                    This figure is congruent to itself!
                  </p>
                )}
                <Button 
                  onClick={() => handleButtonClick('row2')}
                  className="w-24"
                >
                  {activeButtons.row2 ? 'Separate' : 'Overlap'}
                </Button>
              </div>
            </div>

            <div>
              <div className="grid grid-cols-2 gap-6" ref={containerRefs.row3}>
                <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center figure-box h-40 w-full">
                  <div className="font-semibold mb-4">Triangle 1</div>
                  <div 
                    className="transition-transform duration-500 flex items-center justify-center h-20"
                    style={{
                      transform: animations.row3 ? `translateX(${translations.row3}px)` : 'translateX(0)'
                    }}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    {renderExample('shape_with_points', {
                      points: shapePoints,
                      onMouseDown: handleMouseDown
                    })}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center figure-box h-40 w-full">
                  <div className="font-semibold mb-4">Triangle 2</div>
                  <div className="flex items-center justify-center h-20">
                    {renderExample('shape_with_points', {
                      points: shapePoints,
                      pointStyle: { fill: 'black' },
                      lineStyle: { stroke: colorChange.row3 ? '#22c55e' : 'black' }
                    })}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center mt-4">
                {colorChange.row3 && (
                  <p className="text-green-600 font-semibold mb-2">
                    This figure is congruent to itself!
                  </p>
                )}
                <Button 
                  onClick={() => handleButtonClick('row3')}
                  className="w-24"
                >
                  {activeButtons.row3 ? 'Separate' : 'Overlap'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-gray-600 mt-4">
        Understanding the reflexive property of congruence is essential for geometry!
      </p>
    </div>
  );
};

export default ReflexiveProperty;