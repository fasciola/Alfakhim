import { LanguageProvider } from '@/contexts/LanguageContext';
import Home from '@/pages/Home';

export default function App() {
  return (
    <LanguageProvider>
      <Home />
    </LanguageProvider>
  );
}
