import { Navigate, Route, Routes } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import { ToastProvider } from '@/components/ui/Toast';
import { AppLayout } from '@/components/AppLayout';
import { RequireAuth } from '@/components/RequireAuth';
import { LoginScreen } from '@/features/auth/LoginScreen';
import { HomeGate } from '@/features/home/HomeGate';
import { AssistantScreen } from '@/features/assistant/AssistantScreen';
import { ContentDetail } from '@/features/content/ContentDetail';
import { SamplesScreen } from '@/features/samples/SamplesScreen';
import { QuizScreen } from '@/features/quiz/QuizScreen';
import { VisitaGuiadaScreen } from '@/features/visita/VisitaGuiadaScreen';

export default function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route
            element={
              <RequireAuth>
                <AppLayout />
              </RequireAuth>
            }
          >
            <Route path="/" element={<HomeGate />} />
            <Route path="/assistente" element={<AssistantScreen />} />
            <Route path="/conteudo/:id" element={<ContentDetail />} />
            <Route path="/amostras" element={<SamplesScreen />} />
            <Route path="/quiz" element={<QuizScreen />} />
            <Route path="/visita" element={<VisitaGuiadaScreen />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </AppProvider>
  );
}
