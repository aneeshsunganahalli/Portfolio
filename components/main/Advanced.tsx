'use client'

// components/AdvancedTechLogoAnimation.tsx
import React, { useEffect, useRef } from 'react';

interface TechLogo {
  id: string;
  name: string;
  imagePath: string;
  size: number;
  position: {
    x: number;
    y: number;
  };
  velocity: {
    x: number;
    y: number;
  };
  mass: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  targetOpacity: number;
}

const AdvancedTechLogoAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const logosRef = useRef<TechLogo[]>([]);
  const imagesRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const mouseRef = useRef<{ x: number; y: number; isDown: boolean }>({
    x: 0,
    y: 0,
    isDown: false,
  });

  // Canvas dimensions
  const canvasWidth = 800;
  const canvasHeight = 600;

  // Define your tech logos here
  const techLogos = [
    { id: 'react', name: 'React', imagePath: 'react.png' },
    { id: 'typescript', name: 'TypeScript', imagePath: 'ts.png' },
    { id: 'nextjs', name: 'Next.js', imagePath: '/next.png' },
    { id: 'tailwind', name: 'Tailwind CSS', imagePath: 'tailwind.png' },
    { id: 'nodejs', name: 'Node.js', imagePath: '/node-js.png' },
    { id: 'javascript', name: 'JavaScript', imagePath: 'js.png' },
    { id: 'html', name: 'HTML5', imagePath: 'html.png' },
    { id: 'css', name: 'CSS3', imagePath: 'css.png' },
    // Add more logos as needed
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas size
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Initialize logos
    logosRef.current = techLogos.map((logo) => {
      const size = Math.random() * 40 + 40; // Random size between 40-80px
      const mass = size / 20; // Mass proportional to size
      return {
        ...logo,
        size,
        mass,
        position: {
          x: Math.random() * (canvasWidth - size),
          y: Math.random() * (canvasHeight - size),
        },
        velocity: {
          x: (Math.random() - 0.5) * 1.5,
          y: (Math.random() - 0.5) * 1.5,
        },
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.03,
        opacity: 0.7 + Math.random() * 0.3,
        targetOpacity: 0.7 + Math.random() * 0.3,
      };
    });

    // Set up mouse event listeners
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * canvas.width;
      mouseRef.current.y = ((event.clientY - rect.top) / rect.height) * canvas.height;
    };

    const handleMouseDown = () => {
      mouseRef.current.isDown = true;
    };

    const handleMouseUp = () => {
      mouseRef.current.isDown = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);

    // Load images
    const loadImages = async () => {
      const imagePromises = techLogos.map((logo) => {
        return new Promise<[string, HTMLImageElement]>((resolve, reject) => {
          const img = new Image();
          img.src = logo.imagePath;
          img.onload = () => resolve([logo.id, img]);
          img.onerror = reject;
        });
      });

      try {
        const loadedImages = await Promise.all(imagePromises);
        imagesRef.current = new Map(loadedImages);
        // Start animation after images are loaded
        startAnimation();
      } catch (error) {
        console.error('Error loading images:', error);
      }
    };

    loadImages();

    return () => {
      cancelAnimationFrame(animationRef.current);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
    };
  }, []);

  const startAnimation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const animate = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Handle logo interactions
      logosRef.current.forEach((logo, index) => {
        // Apply gravity toward mouse when mouse is down
        if (mouseRef.current.isDown) {
          const dx = mouseRef.current.x - (logo.position.x + logo.size / 2);
          const dy = mouseRef.current.y - (logo.position.y + logo.size / 2);
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 5) { // Prevent extreme acceleration when very close
            const force = 0.5 / (distance * distance); // Inverse square law
            logo.velocity.x += (dx / distance) * force;
            logo.velocity.y += (dy / distance) * force;
            logo.targetOpacity = 1.0; // Brighten when attracted
          }
        } else {
          logo.targetOpacity = 0.7 + Math.random() * 0.3; // Return to normal opacity
        }
        
        // Apply friction
        logo.velocity.x *= 0.99;
        logo.velocity.y *= 0.99;
        
        // Update position
        logo.position.x += logo.velocity.x;
        logo.position.y += logo.velocity.y;
        
        // Update rotation
        logo.rotation += logo.rotationSpeed;
        
        // Bounce off edges with some energy loss
        if (logo.position.x <= 0) {
          logo.position.x = 0;
          logo.velocity.x *= -0.8;
        } else if (logo.position.x + logo.size >= canvas.width) {
          logo.position.x = canvas.width - logo.size;
          logo.velocity.x *= -0.8;
        }
        
        if (logo.position.y <= 0) {
          logo.position.y = 0;
          logo.velocity.y *= -0.8;
        } else if (logo.position.y + logo.size >= canvas.height) {
          logo.position.y = canvas.height - logo.size;
          logo.velocity.y *= -0.8;
        }
        
        // Handle collisions between logos
        for (let j = index + 1; j < logosRef.current.length; j++) {
          const otherLogo = logosRef.current[j];
          const dx = (otherLogo.position.x + otherLogo.size / 2) - (logo.position.x + logo.size / 2);
          const dy = (otherLogo.position.y + otherLogo.size / 2) - (logo.position.y + logo.size / 2);
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = (logo.size + otherLogo.size) / 2;
          
          if (distance < minDistance) {
            // Collision detected - implement momentum conservation
            const angle = Math.atan2(dy, dx);
            const targetX = logo.position.x + logo.size / 2 + Math.cos(angle) * minDistance;
            const targetY = logo.position.y + logo.size / 2 + Math.sin(angle) * minDistance;
            const ax = (targetX - (otherLogo.position.x + otherLogo.size / 2)) * 0.05;
            const ay = (targetY - (otherLogo.position.y + otherLogo.size / 2)) * 0.05;
            
            // Apply forces based on mass
            const massRatio1 = otherLogo.mass / (logo.mass + otherLogo.mass);
            const massRatio2 = logo.mass / (logo.mass + otherLogo.mass);
            
            logo.velocity.x -= ax * massRatio1;
            logo.velocity.y -= ay * massRatio1;
            otherLogo.velocity.x += ax * massRatio2;
            otherLogo.velocity.y += ay * massRatio2;
            
            // Visual effect on collision
            logo.targetOpacity = 1.0;
            otherLogo.targetOpacity = 1.0;
            
            // Add a small spin on collision
            logo.rotationSpeed += (Math.random() - 0.5) * 0.01;
            otherLogo.rotationSpeed += (Math.random() - 0.5) * 0.01;
          }
        }
        
        // Transition opacity towards target
        logo.opacity += (logo.targetOpacity - logo.opacity) * 0.1;
        
        // Draw the logo
        const img = imagesRef.current.get(logo.id);
        if (img) {
          context.save();
          
          // Set position to center of logo
          context.translate(
            logo.position.x + logo.size / 2,
            logo.position.y + logo.size / 2
          );
          
          // Apply rotation
          context.rotate(logo.rotation);
          
          // Set opacity
          context.globalAlpha = logo.opacity;
          
          // Draw centered image
          context.drawImage(
            img, 
            -logo.size / 2, 
            -logo.size / 2, 
            logo.size, 
            logo.size
          );
          
          // Add subtle glow effect for logos being attracted
          if (logo.opacity > 0.9) {
            context.shadowBlur = 15;
            context.shadowColor = 'rgba(255, 255, 255, 0.5)';
            context.drawImage(
              img, 
              -logo.size / 2, 
              -logo.size / 2, 
              logo.size, 
              logo.size
            );
            context.shadowBlur = 0;
          }
          
          context.restore();
          
          // Draw name on hover (if close to mouse)
          const dx = mouseRef.current.x - (logo.position.x + logo.size / 2);
          const dy = mouseRef.current.y - (logo.position.y + logo.size / 2);
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < logo.size) {
            context.fillStyle = 'rgba(255, 255, 255, 0.9)';
            context.font = '14px Arial';
            context.textAlign = 'center';
            context.fillText(
              logo.name,
              logo.position.x + logo.size / 2,
              logo.position.y - 10
            );
          }
        }
      });
      
      // Draw instruction text
      context.fillStyle = 'rgba(255, 255, 255, 0.5)';
      context.font = '16px Arial';
      context.textAlign = 'center';
      context.fillText(
        'Click and hold to attract logos',
        canvas.width / 2,
        canvas.height - 20
      );
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
  };

  return (
    <div className="tech-logo-animation">
      <canvas
        ref={canvasRef}
        className="tech-logo-canvas"
        width={canvasWidth}
        height={canvasHeight}
      />
      <style jsx>{`
        .tech-logo-animation {
          position: relative;
          width: 100%;
          display: flex;
          justify-content: center;
          margin: 2rem 0;
        }
        .tech-logo-canvas {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 12px;
          max-width: 100%;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

export default AdvancedTechLogoAnimation;