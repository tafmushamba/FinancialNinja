import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface AnimatedChartProps {
  data: ChartData[];
  title?: string;
  subtitle?: string;
  height?: number;
  className?: string;
  animationDuration?: number;
  variant?: 'bar' | 'line' | 'pie';
  showTooltip?: boolean;
  showLegend?: boolean;
  showValues?: boolean;
  isLoading?: boolean;
}

export function AnimatedChart({
  data,
  title,
  subtitle,
  height = 250,
  className,
  animationDuration = 1000,
  variant = 'bar',
  showTooltip = true,
  showLegend = true,
  showValues = true,
  isLoading = false
}: AnimatedChartProps) {
  const [animatedData, setAnimatedData] = useState<ChartData[]>(
    data.map(item => ({ ...item, value: 0 }))
  );
  const [tooltipData, setTooltipData] = useState<{ label: string; value: number; x: number; y: number } | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Default colors if not provided in data
  const defaultColors = [
    'var(--neon-green)', 
    'var(--neon-cyan)', 
    'var(--neon-purple)', 
    '#00D8FF', 
    '#FF8A00'
  ];
  
  // Process data to ensure all items have colors
  const processedData = data.map((item, index) => ({
    ...item,
    color: item.color || defaultColors[index % defaultColors.length]
  }));

  // Animation of chart values
  useEffect(() => {
    if (isLoading) return;
    
    const maxValue = Math.max(...data.map(item => item.value));
    const startTime = Date.now();
    
    const animateValues = () => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;
      
      if (elapsedTime < animationDuration) {
        const progress = elapsedTime / animationDuration;
        
        setAnimatedData(
          data.map(item => ({
            ...item,
            value: item.value * progress
          }))
        );
        
        requestAnimationFrame(animateValues);
      } else {
        setAnimatedData(data);
      }
    };
    
    animateValues();
  }, [data, animationDuration, isLoading]);

  // Handle tooltip display
  const handleMouseMove = (e: React.MouseEvent, item: ChartData, index: number) => {
    if (!showTooltip) return;
    
    const chart = chartRef.current;
    if (!chart) return;
    
    const chartRect = chart.getBoundingClientRect();
    const barElement = e.currentTarget as HTMLElement;
    const barRect = barElement.getBoundingClientRect();
    
    setTooltipData({
      label: item.label,
      value: item.value,
      x: barRect.left + barRect.width / 2 - chartRect.left,
      y: barRect.top - chartRect.top
    });
  };

  const handleMouseLeave = () => {
    setTooltipData(null);
  };

  const renderBarChart = () => {
    const maxValue = Math.max(...data.map(item => item.value));
    
    return (
      <div className="h-full flex items-end space-x-2">
        {isLoading ? (
          // Loading skeleton
          Array(5).fill(0).map((_, index) => (
            <div 
              key={index} 
              className="flex-1 flex flex-col items-center"
            >
              <div className="w-full bg-dark-700/50 animate-pulse rounded-t-md h-32"></div>
              <div className="w-3/4 h-4 mt-2 bg-dark-700/50 animate-pulse rounded-md"></div>
            </div>
          ))
        ) : (
          processedData.map((item, index) => (
            <div 
              key={item.label} 
              className="flex-1 flex flex-col items-center"
              onMouseMove={(e) => handleMouseMove(e, item, index)}
              onMouseLeave={handleMouseLeave}
            >
              <div 
                className="w-full bg-dark-700/50 group relative rounded-t-md overflow-hidden transition-all duration-300 hover:brightness-110"
                style={{ height: `${(animatedData[index].value / maxValue) * 100}%` }}
              >
                <div 
                  className="absolute bottom-0 left-0 w-full transition-all duration-300 rounded-t-md"
                  style={{ 
                    height: `${(animatedData[index].value / maxValue) * 100}%`,
                    backgroundColor: item.color,
                    boxShadow: `0 0 10px ${item.color}44`
                  }}
                >
                  {/* Shimmering effect */}
                  <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-20 bg-gradient-to-t from-white to-transparent"></div>
                </div>
                
                {showValues && (
                  <div className="absolute -top-6 left-0 w-full text-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.value.toLocaleString()}
                  </div>
                )}
              </div>
              <div className="text-xs mt-2 text-center">{item.label}</div>
            </div>
          ))
        )}
      </div>
    );
  };

  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let startAngle = 0;
    
    return (
      <div className="relative w-full h-full flex justify-center items-center">
        {isLoading ? (
          <div className="w-full h-full rounded-full animate-pulse bg-dark-700/50"></div>
        ) : (
          <>
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <g transform="translate(50,50)">
                {processedData.map((item, index) => {
                  const percentage = item.value / total;
                  const angle = percentage * 360;
                  const largeArcFlag = angle > 180 ? 1 : 0;
                  
                  // Calculate coordinates
                  const startX = Math.cos((startAngle * Math.PI) / 180) * 40;
                  const startY = Math.sin((startAngle * Math.PI) / 180) * 40;
                  
                  const endAngle = startAngle + angle;
                  const endX = Math.cos((endAngle * Math.PI) / 180) * 40;
                  const endY = Math.sin((endAngle * Math.PI) / 180) * 40;
                  
                  // Create path
                  const path = `M 0 0 L ${startX} ${startY} A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
                  
                  // Store current angle as the next start angle
                  const currentStartAngle = startAngle;
                  startAngle += angle;
                  
                  return (
                    <path
                      key={item.label}
                      d={path}
                      fill={item.color}
                      stroke="#111"
                      strokeWidth="0.5"
                      className="transition-opacity hover:opacity-90"
                      style={{ 
                        opacity: animatedData[index].value / item.value,
                        filter: `drop-shadow(0 0 2px ${item.color}88)`
                      }}
                      onMouseMove={(e) => {
                        const svgElement = e.currentTarget.ownerSVGElement;
                        if (!svgElement) return;
                        
                        const rect = svgElement.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        
                        setTooltipData({
                          label: item.label,
                          value: item.value,
                          x: x,
                          y: y
                        });
                      }}
                      onMouseLeave={handleMouseLeave}
                    />
                  );
                })}
              </g>
            </svg>
            
            {/* Center hole for donut chart */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] rounded-full bg-dark-900 flex items-center justify-center border border-dark-700">
              <span className="text-xs font-bold text-center">
                {total.toLocaleString()}
              </span>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderLineChart = () => {
    const maxValue = Math.max(...data.map(item => item.value));
    const chartWidth = 100;
    const chartHeight = 50;
    const pointWidth = chartWidth / (data.length - 1);
    
    // Calculate points
    const points = processedData.map((item, index) => ({
      x: index * pointWidth,
      y: chartHeight - (animatedData[index].value / maxValue) * chartHeight,
      ...item
    }));
    
    // Create SVG path from points
    const linePath = points.map((point, i) => 
      `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ');
    
    // Create area path (fill beneath the line)
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight} L 0 ${chartHeight} Z`;
    
    return (
      <div className="w-full h-full relative">
        {isLoading ? (
          // Loading skeleton
          <div className="w-full h-full">
            <div className="w-full h-1/2 bg-dark-700/30 animate-pulse rounded-md"></div>
            <div className="w-full h-px mt-2 bg-dark-700/50"></div>
            <div className="w-full flex justify-between mt-2">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="w-10 h-4 bg-dark-700/30 animate-pulse rounded-md"></div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <svg width="100%" height="80%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
              {/* Area fill */}
              <path
                d={areaPath}
                fill="url(#gradient)"
                opacity="0.2"
              />
              
              {/* Line */}
              <path
                d={linePath}
                fill="none"
                stroke={processedData[0].color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-md"
              />
              
              {/* Gradient definition */}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={processedData[0].color} stopOpacity="0.8" />
                  <stop offset="100%" stopColor={processedData[0].color} stopOpacity="0.1" />
                </linearGradient>
              </defs>
              
              {/* Data points */}
              {points.map((point, i) => (
                <g 
                  key={i}
                  transform={`translate(${point.x}, ${point.y})`}
                  onMouseMove={(e) => {
                    const svgElement = e.currentTarget.ownerSVGElement;
                    if (!svgElement) return;
                    
                    const rect = svgElement.getBoundingClientRect();
                    const pointRect = e.currentTarget.getBoundingClientRect();
                    
                    setTooltipData({
                      label: point.label,
                      value: point.value,
                      x: pointRect.left + pointRect.width / 2 - rect.left,
                      y: pointRect.top - rect.top
                    });
                  }}
                  onMouseLeave={handleMouseLeave}
                >
                  <circle
                    r="3"
                    fill={point.color}
                    stroke="#111"
                    strokeWidth="0.5"
                    className="hover:r-4 transition-all cursor-pointer"
                  />
                </g>
              ))}
            </svg>
            
            {/* X-axis labels */}
            <div className="flex justify-between px-2 mt-2 text-xs text-gray-400">
              {processedData.map((item, i) => (
                <div key={i}>{item.label}</div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div 
      ref={chartRef}
      className={cn(
        "relative w-full bg-dark-800/30 backdrop-blur-sm rounded-lg p-4 border border-dark-600/50",
        "shadow-lg hover:shadow-xl transition-shadow duration-300",
        className
      )}
      style={{ height: `${height}px` }}
    >
      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-md font-bold">{title}</h3>}
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
      )}
      
      {/* Chart container */}
      <div className="h-[calc(100%-2rem)] w-full">
        {variant === 'bar' && renderBarChart()}
        {variant === 'pie' && renderPieChart()}
        {variant === 'line' && renderLineChart()}
      </div>
      
      {/* Tooltip */}
      {tooltipData && (
        <div 
          className="absolute z-10 bg-dark-700/90 backdrop-blur-sm px-3 py-2 rounded-md shadow-lg border border-dark-600 text-sm pointer-events-none transition-opacity"
          style={{
            left: `${tooltipData.x}px`,
            top: `${tooltipData.y - 40}px`,
            transform: 'translateX(-50%)',
            opacity: tooltipData ? 1 : 0
          }}
        >
          <div className="font-bold">{tooltipData.label}</div>
          <div>{tooltipData.value.toLocaleString()}</div>
          
          {/* Triangle pointer */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-dark-700/90 border-r border-b border-dark-600 rotate-45"></div>
        </div>
      )}
      
      {/* Legend */}
      {showLegend && !isLoading && (
        <div className="absolute bottom-2 right-2 flex flex-wrap justify-end gap-2">
          {processedData.map((item) => (
            <div key={item.label} className="flex items-center text-xs">
              <div 
                className="w-3 h-3 rounded-sm mr-1"
                style={{ backgroundColor: item.color }}
              ></div>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
