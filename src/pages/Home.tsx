import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import HeroSection from '@/sections/HeroSection';
import ServicesSection from '@/sections/ServicesSection';
import PartnersSection from '@/sections/PartnersSection';
import AboutSection from '@/sections/AboutSection';
import ContactSection from '@/sections/ContactSection';

export default function Home() {
  const { isTransitioning } = useLanguage();

  return (
    <div
      className="transition-opacity duration-150"
      style={{ opacity: isTransitioning ? 0 : 1 }}
    >
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <PartnersSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
