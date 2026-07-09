import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import AboutStack from '@/components/AboutStack';
import ApproachGrid from '@/components/ApproachGrid';
import WordCloud from '@/components/WordCloud';
import ArticlesSection from '@/components/ArticlesSection';
import ToolsSection from '@/components/ToolsSection';
import ContactSection from '@/components/ContactSection';
import ScrollToTop from '@/components/ScrollToTop';

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <AboutStack />
        <ApproachGrid />
        <WordCloud />
        <ArticlesSection />
        <ToolsSection />
        <ContactSection />
      </main>
      <ScrollToTop />
    </>
  );
}
