
import React, { useState } from 'react';
import Header from './components/Header';
import TabButton from './components/TabButton';
import ImageGenerator from './components/ImageGenerator';
import ImageEditor from './components/ImageEditor';
import { GenerateIcon, EditIcon } from './components/Icon';
import { useLanguage } from './contexts/LanguageContext';

type ActiveView = 'generate' | 'edit';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('generate');
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-transparent font-sans">
      <Header />
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-center mb-8">
            <div className="flex space-x-2 bg-base-200/80 backdrop-blur-sm p-1.5 rounded-xl shadow-md">
                <TabButton
                isActive={activeView === 'generate'}
                onClick={() => setActiveView('generate')}
                >
                <GenerateIcon className="w-5 h-5 mr-2" />
                {t.tab_generate}
                </TabButton>
                <TabButton
                isActive={activeView === 'edit'}
                onClick={() => setActiveView('edit')}
                >
                <EditIcon className="w-5 h-5 mr-2" />
                {t.tab_edit}
                </TabButton>
            </div>
        </div>
        
        <div className="animate-fade-in-up" key={activeView}>
          {activeView === 'generate' && <ImageGenerator />}
          {activeView === 'edit' && <ImageEditor />}
        </div>
      </main>
      <footer className="text-center p-4 text-base-content-secondary text-sm">
        <p>{t.footer_text}</p>
      </footer>
    </div>
  );
};

export default App;
