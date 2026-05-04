import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/page';
import NotFound from './pages/NotFound';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </I18nextProvider>
  );
}
export default App;
