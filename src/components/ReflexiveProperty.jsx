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
  const [selectedFigure, setSelectedFigure] = useState('line');
  const [linePoints, setLinePoints] = useState([
    { x: 150, y: 100 },
    { x: 250, y: 100 }
  ]);
  const [anglePoints, setAnglePoints] = useState([
    { x: 150, y: 120 },
    { x: 250, y: 120 },
    { x: 250, y: 80 }
  ]);
  const [shapePoints, setShapePoints] = useState([
    { x: 200, y: 80 },
    { x: 250, y: 120 },
    { x: 150, y: 120 }
  ]);

  const [dragIndex, setDragIndex] = useState(null);
  const [dragType, setDragType] = useState(null);
  const [activeButton, setActiveButton] = useState(false);
  const [colorChange, setColorChange] = useState(false);
  const [colorChangeTimeout, setColorChangeTimeout] = useState(null);
  const [bottomFigureOffset, setBottomFigureOffset] = useState(220);
  const [textExiting, setTextExiting] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [animationRunning, setAnimationRunning] = useState(false);
  
  // Separate states for each figure type
  const [figureStates, setFigureStates] = useState({
    line: {
      activeButton: false,
      colorChange: false,
      bottomFigureOffset: 220,
      textVisible: false
    },
    angle: {
      activeButton: false,
      colorChange: false,
      bottomFigureOffset: 220,
      textVisible: false
    },
    triangle: {
      activeButton: false,
      colorChange: false,
      bottomFigureOffset: 220,
      textVisible: false
    }
  });

  const svgRef = useRef(null);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (colorChangeTimeout) {
        clearTimeout(colorChangeTimeout);
      }
    };
  }, [colorChangeTimeout]);

  const figureInfo = {
    'line': { name: 'Line Segment', description: 'A straight line with two endpoints' },
    'angle': { name: 'Angle', description: 'Two rays sharing a common endpoint' },
    'triangle': { name: 'Triangle', description: 'A three-sided polygon' }
  };

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
      const x = ((e.clientX - rect.left) / width) * 400;  // Using 400 to match viewBox width
      const y = ((e.clientY - rect.top) / height) * 423;  // Using 423 to match viewBox height
      
      const newPoint = { 
        x: Math.max(10, Math.min(390, x)),
        y: Math.max(10, Math.min(190, y))
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
      } else if (dragType === 'triangle') {
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

  const handleButtonClick = () => {
    const currentState = figureStates[selectedFigure];
    
    if (!currentState.activeButton) {
      setAnimationRunning(true);
      // Update figure-specific state
      setFigureStates(prev => ({
        ...prev,
        [selectedFigure]: {
          ...prev[selectedFigure],
          activeButton: true,
          textVisible: false,
          bottomFigureOffset: 0
        }
      }));
      
      if (colorChangeTimeout) clearTimeout(colorChangeTimeout);
      // First delay: color change after movement animation ends
      setColorChangeTimeout(setTimeout(() => {
        setFigureStates(prev => ({
          ...prev,
          [selectedFigure]: {
            ...prev[selectedFigure],
            colorChange: true
          }
        }));
        
        // Second delay: text appearance after color change
        setTimeout(() => {
          setFigureStates(prev => ({
            ...prev,
            [selectedFigure]: {
              ...prev[selectedFigure],
              textVisible: true
            }
          }));
          // Re-enable button after all animations complete
          setAnimationRunning(false);
        }, 300); // Additional 300ms delay after color change
      }, 500)); // Total: 800ms for complete animation
    } else {
      setAnimationRunning(true);
      // Update figure-specific state
      setFigureStates(prev => ({
        ...prev,
        [selectedFigure]: {
          ...prev[selectedFigure],
          activeButton: false,
          colorChange: false,
          textVisible: false,
          bottomFigureOffset: 220
        }
      }));
      
      if (colorChangeTimeout) clearTimeout(colorChangeTimeout);
      // Re-enable button after movement animation completes
      setTimeout(() => {
        setAnimationRunning(false);
      }, 500); // Movement animation time
    }
  };

  const handleFigureChange = (figure) => {
    setSelectedFigure(figure);
    // Clear any pending timeouts when switching figures
    if (colorChangeTimeout) {
      clearTimeout(colorChangeTimeout);
      setColorChangeTimeout(null);
    }
    // Reset animation running state when switching figures
    setAnimationRunning(false);
  };

  const resetAll = () => {
    setLinePoints([
      { x: 150, y: 100 },
      { x: 250, y: 100 }
    ]);
    setAnglePoints([
      { x: 150, y: 120 },
      { x: 250, y: 120 },
      { x: 250, y: 80 }
    ]);
    setShapePoints([
      { x: 200, y: 80 },
      { x: 250, y: 120 },
      { x: 150, y: 120 }
    ]);
    
    // Clear any pending timeouts
    if (colorChangeTimeout) {
      clearTimeout(colorChangeTimeout);
      setColorChangeTimeout(null);
    }
    
    // Reset animation states
    setAnimationRunning(false);
    
    // Reset all figure states
    setFigureStates({
      line: {
        activeButton: false,
        colorChange: false,
        bottomFigureOffset: 220,
        textVisible: false
      },
      angle: {
        activeButton: false,
        colorChange: false,
        bottomFigureOffset: 220,
        textVisible: false
      },
      triangle: {
        activeButton: false,
        colorChange: false,
        bottomFigureOffset: 220,
        textVisible: false
      }
    });
  };

  const renderFigure = () => {
    const currentState = figureStates[selectedFigure];
    
    switch (selectedFigure) {
      case 'line':
        return (
          <>
            <line 
              x1={linePoints[0].x} 
              y1={linePoints[0].y} 
              x2={linePoints[1].x} 
              y2={linePoints[1].y} 
              stroke={currentState.colorChange ? "#22c55e" : "black"} 
              strokeWidth="4"
            />
            <circle 
              cx={linePoints[0].x} 
              cy={linePoints[0].y} 
              r="8" 
              fill="#0ea5e9"
              stroke="white"
              strokeWidth="2"
              style={{ cursor: 'move' }}
              onMouseDown={() => handleMouseDown(0, 'line')}
            />
            <circle 
              cx={linePoints[1].x} 
              cy={linePoints[1].y} 
              r="8" 
              fill="#0ea5e9"
              stroke="white"
              strokeWidth="2"
              style={{ cursor: 'move' }}
              onMouseDown={() => handleMouseDown(1, 'line')}
            />
          </>
        );
      case 'angle':
        return (
          <>
            <path 
              d={`M ${anglePoints[0].x} ${anglePoints[0].y} L ${anglePoints[1].x} ${anglePoints[1].y} L ${anglePoints[2].x} ${anglePoints[2].y}`}
              fill="none" 
              stroke={currentState.colorChange ? "#22c55e" : "black"}
              strokeWidth="4"
            />
            {[0, 1, 2].map(i => (
              <circle
                key={i}
                cx={anglePoints[i].x}
                cy={anglePoints[i].y}
                r="8"
                fill="#0ea5e9"
                stroke="white"
                strokeWidth="2"
                style={{ cursor: 'move' }}
                onMouseDown={() => handleMouseDown(i, 'angle')}
              />
            ))}
            {figureStates.angle.textVisible && (
              <text
                x="200"
                y="75%"
                textAnchor="middle"
                className="text-sm fill-green-600 font-semibold"
                style={{ 
                  fontSize: '16px'
                }}
              >
                This figure is congruent to itself!
              </text>
            )}
          </>
        );
      case 'triangle':
        return (
          <>
            <polygon 
              points={shapePoints.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none" 
              stroke={currentState.colorChange ? "#22c55e" : "black"}
              strokeWidth="4"
            />
            {[0, 1, 2].map(i => (
              <circle
                key={i}
                cx={shapePoints[i].x}
                cy={shapePoints[i].y}
                r="8"
                fill="#0ea5e9"
                stroke="white"
                strokeWidth="2"
                style={{ cursor: 'move' }}
                onMouseDown={() => handleMouseDown(i, 'triangle')}
              />
            ))}
            {figureStates.triangle.textVisible && (
              <text
                x="200"
                y="75%"
                textAnchor="middle"
                className="text-sm fill-green-600 font-semibold"
                style={{ 
                  fontSize: '16px'
                }}
              >
                This figure is congruent to itself!
              </text>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <style>{`
        @property --r {
          syntax: '<angle>';
          inherits: false;
          initial-value: 0deg;
        }

        .glow-button { 
          min-width: auto; 
          height: auto; 
          position: relative; 
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
          transition: all .3s ease;
          padding: 7px;
        }

        .glow-button::before {
          content: "";
          display: block;
          position: absolute;
          background: white;
          inset: 2px;
          border-radius: 4px;
          z-index: -2;
        }

        .simple-glow {
          background: conic-gradient(
            from var(--r),
            transparent 0%,
            rgb(0, 255, 132) 2%,
            rgb(0, 214, 111) 8%,
            rgb(0, 174, 90) 12%,
            rgb(0, 133, 69) 14%,
            transparent 15%
          );
          animation: rotating 3s linear infinite;
          transition: animation 0.3s ease;
        }

        .simple-glow.stopped {
          animation: none;
          background: none;
        }

        @keyframes rotating {
          0% {
            --r: 0deg;
          }
          100% {
            --r: 360deg;
          }
        }

        .mirror-figure {
          transition: all 0.5s ease;
        }

        .mirror-figure-no-transition {
          transition: none;
        }
      `}</style>
      <div className="w-[500px] h-auto mx-auto mt-5 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] bg-white rounded-lg overflow-hidden select-none">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[#5750E3] text-sm font-medium select-none">The Reflexive Property of Congruence</h2>
            <button
              onClick={resetAll}
              className="text-gray-500 hover:text-gray-700 text-sm px-3 py-1 rounded border border-gray-300 hover:border-gray-400 transition-colors"
            >
              Reset
            </button>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <div className="flex">
                <div className="flex flex-col space-y-2 mr-4">
                  {Object.entries(figureInfo).map(([figure, info]) => (
                    <button
                      key={figure}
                      onClick={() => handleFigureChange(figure)}
                      className={`px-4 py-3 rounded-lg transition-colors text-sm ${
                        selectedFigure === figure
                          ? 'bg-[#008545] text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {info.name}
                    </button>
                  ))}
                  
                  <div className="pt-[100%]">
                    <div className="glow-button simple-glow">
                      <Button 
                        onClick={handleButtonClick}
                        disabled={animationRunning}
                        className="bg-[#00783E] hover:bg-[#006633] text-white text-sm px-4 py-2 rounded w-full disabled:opacity-50"
                      >
                        {figureStates[selectedFigure].activeButton ? 'Separate' : 'Overlap'}
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="border border-gray-200 rounded-lg flex-1 min-w-[300px] min-h-[350px] w-full">
                    <svg 
                      ref={svgRef}
                      width="400" 
                      height="423" 
                      viewBox="0 0 400 423"
                      className="w-full h-full select-none"
                      style={{ touchAction: 'none' }}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                    >
                      {renderFigure()}
                      <text
                        x="200"
                        y="210"
                        textAnchor="middle"
                        className="text-sm fill-gray-600"
                        style={{ fontSize: '12px' }}
                      >
                        - - - - - - - - - - Drag the points to move the figures - - - - - - - - - -
                      </text>
                      
                      {/* Duplicate figure below text */}
                      {selectedFigure === 'line' && (
                        <>
                          <path 
                            d={`M ${linePoints[0].x} ${linePoints[0].y + figureStates.line.bottomFigureOffset} L ${linePoints[1].x} ${linePoints[1].y + figureStates.line.bottomFigureOffset}`}
                            fill="none"
                            stroke={figureStates.line.colorChange ? "#22c55e" : "black"} 
                            strokeWidth="4"
                            className={dragIndex !== null ? 'mirror-figure-no-transition' : 'mirror-figure'}
                          />
                          <circle 
                            cx={linePoints[0].x} 
                            cy={linePoints[0].y + figureStates.line.bottomFigureOffset} 
                            r="8" 
                            fill="black"
                            stroke="white"
                            strokeWidth="2"
                            className={dragIndex !== null ? 'mirror-figure-no-transition' : 'mirror-figure'}
                          />
                          <circle 
                            cx={linePoints[1].x} 
                            cy={linePoints[1].y + figureStates.line.bottomFigureOffset} 
                            r="8" 
                            fill="black"
                            stroke="white"
                            strokeWidth="2"
                            className={dragIndex !== null ? 'mirror-figure-no-transition' : 'mirror-figure'}
                          />
                          {figureStates.line.textVisible && (
                            <text
                              x="200"
                              y="75%"
                              textAnchor="middle"
                              className="text-sm fill-green-600 font-semibold"
                              style={{ 
                                fontSize: '16px'
                              }}
                            >
                              This figure is congruent to itself!
                            </text>
                          )}
                        </>
                      )}
                      
                      {selectedFigure === 'angle' && (
                        <>
                          <path 
                            d={`M ${anglePoints[0].x} ${anglePoints[0].y + figureStates.angle.bottomFigureOffset} L ${anglePoints[1].x} ${anglePoints[1].y + figureStates.angle.bottomFigureOffset} L ${anglePoints[2].x} ${anglePoints[2].y + figureStates.angle.bottomFigureOffset}`}
                            fill="none" 
                            stroke={figureStates.angle.colorChange ? "#22c55e" : "black"}
                            strokeWidth="4"
                            className={dragIndex !== null ? 'mirror-figure-no-transition' : 'mirror-figure'}
                          />
                          {[0, 1, 2].map(i => (
                            <circle
                              key={`duplicate-${i}`}
                              cx={anglePoints[i].x}
                              cy={anglePoints[i].y + figureStates.angle.bottomFigureOffset}
                              r="8"
                              fill="black"
                              stroke="white"
                              strokeWidth="2"
                              className={dragIndex !== null ? 'mirror-figure-no-transition' : 'mirror-figure'}
                            />
                          ))}
                          {figureStates.angle.textVisible && (
                            <text
                              x="200"
                              y="75%"
                              textAnchor="middle"
                              className="text-sm fill-green-600 font-semibold"
                              style={{ 
                                fontSize: '16px'
                              }}
                            >
                              This figure is congruent to itself!
                            </text>
                          )}
                        </>
                      )}
                      
                      {selectedFigure === 'triangle' && (
                        <>
                          <path 
                            d={`M ${shapePoints[0].x} ${shapePoints[0].y + figureStates.triangle.bottomFigureOffset} L ${shapePoints[1].x} ${shapePoints[1].y + figureStates.triangle.bottomFigureOffset} L ${shapePoints[2].x} ${shapePoints[2].y + figureStates.triangle.bottomFigureOffset} Z`}
                            fill="none" 
                            stroke={figureStates.triangle.colorChange ? "#22c55e" : "black"}
                            strokeWidth="4"
                            className={dragIndex !== null ? 'mirror-figure-no-transition' : 'mirror-figure'}
                          />
                          {[0, 1, 2].map(i => (
                            <circle
                              key={`duplicate-${i}`}
                              cx={shapePoints[i].x}
                              cy={shapePoints[i].y + figureStates.triangle.bottomFigureOffset}
                              r="8"
                              fill="black"
                              stroke="white"
                              strokeWidth="2"
                              className={dragIndex !== null ? 'mirror-figure-no-transition' : 'mirror-figure'}
                            />
                          ))}
                          {figureStates.triangle.textVisible && (
                            <text
                              x="200"
                              y="75%"
                              textAnchor="middle"
                              className="text-sm fill-green-600 font-semibold"
                              style={{ 
                                fontSize: '16px'
                              }}
                            >
                              This figure is congruent to itself!
                            </text>
                          )}
                        </>
                      )}
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReflexiveProperty;