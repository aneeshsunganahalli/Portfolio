'use client'

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Define the types for our props and logo data
interface Logo {
  id: string;
  name: string;
  imageUrl: string;
}

interface AnimatedTechLogosProps {
  logos: Logo[];
  speed?: number;
  size?: number;
  backgroundColor?: string;
}

const AnimatedTechLogos: React.FC<AnimatedTechLogosProps> = ({
  logos = [],
  speed = 25,
  size = 60,
  backgroundColor = '#f3f4f6',
}) => {
  // Create three arrays of logos with unique keys
  const getLogoSets = () => {
    // Make sure we have enough logos for three rows
    const extendedLogos = [...logos];
    while (extendedLogos.length < 15) {
      // Add duplicates with modified IDs to ensure uniqueness
      extendedLogos.push(...logos.map(logo => ({
        ...logo,
        id: `${logo.id}-dup-${Math.random().toString(36).substring(2, 9)}`
      })));
    }
    
    // Shuffle the logos for more visual interest
    const shuffled = [...extendedLogos].sort(() => 0.5 - Math.random());
    
    // Create three sets with appropriate lengths
    return [
      shuffled.slice(0, 8),
      shuffled.slice(8, 16),
      shuffled.slice(16, 24),
    ];
  };
  
  const [logoSets, setLogoSets] = useState<Logo[][]>([]);
  
  useEffect(() => {
    setLogoSets(getLogoSets());
  }, [logos]);

  // Animation variants
  const rightToLeftVariants = {
    animate: {
      x: [0, -100],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop" as const,
          duration: speed,
          ease: "linear",
        },
      },
    },
  };

  const leftToRightVariants = {
    animate: {
      x: [-100, 0],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop" as const,
          duration: speed,
          ease: "linear",
        },
      },
    },
  };

  // Function to render a single logo
  const renderLogo = (logo: Logo) => (
    <div 
      key={logo.id} 
      className="flex items-center justify-center mx-4"
      style={{ width: size, height: size, flexShrink: 0 }}
    >
      <div 
        className="flex items-center justify-center rounded-full p-2 shadow-md"
        style={{ 
          width: size, 
          height: size, 
          backgroundColor: backgroundColor 
        }}
      >
        <img 
          src={logo.imageUrl} 
          alt={logo.name} 
          className="rounded-full object-contain"
          style={{ width: size * 0.7, height: size * 0.7 }}
        />
      </div>
    </div>
  );

  // Function to render duplicated logos with unique keys
  const renderDuplicateRow = (logos: Logo[], rowIndex: number) => {
    return (
      <>
        <div className="flex">
          {logos.map(logo => (
            <div 
              key={`${logo.id}-row${rowIndex}-1`} 
              className="flex items-center justify-center mx-4"
              style={{ width: size, height: size, flexShrink: 0 }}
            >
              <div 
                className="flex items-center justify-center rounded-full p-2 shadow-md"
                style={{ 
                  width: size, 
                  height: size, 
                  backgroundColor: backgroundColor 
                }}
              >
                <img 
                  src={logo.imageUrl} 
                  alt={logo.name} 
                  className="rounded-full object-contain"
                  style={{ width: size * 0.7, height: size * 0.7 }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex">
          {logos.map(logo => (
            <div 
              key={`${logo.id}-row${rowIndex}-2`} 
              className="flex items-center justify-center mx-4"
              style={{ width: size, height: size, flexShrink: 0 }}
            >
              <div 
                className="flex items-center justify-center rounded-full p-2 shadow-md"
                style={{ 
                  width: size, 
                  height: size, 
                  backgroundColor: backgroundColor 
                }}
              >
                <img 
                  src={logo.imageUrl} 
                  alt={logo.name} 
                  className="rounded-full object-contain"
                  style={{ width: size * 0.7, height: size * 0.7 }}
                />
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="w-full overflow-hidden py-16">
      <div className="flex flex-col gap-8">
        {/* Row 1 - Right to Left */}
        <div className="relative w-full overflow-hidden">
          <motion.div 
            className="flex absolute"
            variants={rightToLeftVariants}
            animate="animate"
            style={{ width: "200%" }}
          >
            {logoSets[0] && renderDuplicateRow(logoSets[0], 0)}
          </motion.div>
        </div>
        
        {/* Row 2 - Left to Right */}
        <div className="relative w-full overflow-hidden">
          <motion.div 
            className="flex absolute"
            variants={leftToRightVariants}
            animate="animate"
            style={{ width: "200%" }}
          >
            {logoSets[1] && renderDuplicateRow(logoSets[1], 1)}
          </motion.div>
        </div>
        
        {/* Row 3 - Right to Left */}
        <div className="relative w-full overflow-hidden">
          <motion.div 
            className="flex absolute"
            variants={rightToLeftVariants}
            animate="animate"
            style={{ width: "200%" }}
          >
            {logoSets[2] && renderDuplicateRow(logoSets[2], 2)}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedTechLogos;