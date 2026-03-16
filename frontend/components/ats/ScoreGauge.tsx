import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ScoreGaugeProps {
    score: number;
    grade: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function ScoreGauge({ score, grade, size = 'md', className }: ScoreGaugeProps) {
    const [animatedScore, setAnimatedScore] = useState(0);

    // Animate score on mount or when it changes
    useEffect(() => {
        const duration = 1000;
        const steps = 60;
        const stepTime = Math.abs(Math.floor(duration / steps));
        let current = 0;

        const timer = setInterval(() => {
            current += score / steps;
            if (current >= score) {
                setAnimatedScore(score);
                clearInterval(timer);
            } else {
                setAnimatedScore(Math.floor(current));
            }
        }, stepTime);

        return () => clearInterval(timer);
    }, [score]);

    // Determine color based on score
    let colorClass = 'text-red-500';
    let strokeClass = 'stroke-red-500';
    if (score > 70) {
        colorClass = 'text-green-500';
        strokeClass = 'stroke-green-500';
    } else if (score > 40) {
        colorClass = 'text-yellow-500';
        strokeClass = 'stroke-yellow-500';
    }

    // Size configurations
    const sizeConfig = {
        sm: { radius: 28, stroke: 4, text: 'text-xl', gradeText: 'text-sm' },
        md: { radius: 48, stroke: 8, text: 'text-4xl', gradeText: 'text-lg' },
        lg: { radius: 72, stroke: 12, text: 'text-6xl', gradeText: 'text-2xl' },
    };

    const { radius, stroke, text, gradeText } = sizeConfig[size];
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

    // Center is radius, so svg viewbox is 2*radius
    const svgSize = radius * 2;

    return (
        <div className={cn('relative flex items-center justify-center', className)} style={{ width: svgSize, height: svgSize }}>
            <svg
                height={svgSize}
                width={svgSize}
                className="-rotate-90 transform"
            >
                {/* Background Circle */}
                <circle
                    stroke="currentColor"
                    fill="transparent"
                    strokeWidth={stroke}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    className="text-muted/20"
                />
                {/* Progress Circle */}
                <circle
                    stroke="currentColor"
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-out' }}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    className={strokeClass}
                    strokeLinecap="round"
                />
            </svg>

            {/* Absolute positioned centered text */}
            <div className="absolute flex flex-col items-center justify-center">
                <span className={cn('font-bold leading-none', text, colorClass)}>
                    {animatedScore}
                </span>
                <span className={cn('font-medium text-muted-foreground mt-1', gradeText)}>
                    Grade {grade}
                </span>
            </div>
        </div>
    );
}
