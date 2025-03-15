import AdvancedTechLogoAnimation from "@/components/main/Advanced";
import AnimatedTechLogos from "@/components/main/Animated";
import Hero from "@/components/main/Hero";
import Skills from "@/components/main/Skills";

export default function Home() {
  const techLogos = [
    { id: "1", name: "React", imageUrl: "/react.png" },
    { id: "2", name: "TypeScript", imageUrl: "/ts.png" },
    { id: "3", name: "NextJS", imageUrl: "/next.png" },
    { id: "4", name: "JavaScript", imageUrl: "/js.png" },
    { id: "5", name: "HTML", imageUrl: "/html.png" },
    { id: "6", name: "CSS", imageUrl: "/css.png" },
    { id: "7", name: "Node.js", imageUrl: "/node-js.png" },
  ];
  return (
    <main className="h-full w-full">
      <div className="flex flex-col gap-20">
        <Hero />
        <Skills />
        <AnimatedTechLogos logos={techLogos} />
       
      </div>
    </main>
  );
}
