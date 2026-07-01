import { useApp } from '@/context/AppContext';
import { HomeScreen } from './HomeScreen';
import { RepDashboardScreen } from '@/features/rep/RepDashboardScreen';

// A rota "/" leva a experiências diferentes por papel: o médico vê a Home
// de engajamento; o representante vê a carteira de médicos.
export function HomeGate() {
  const { medico } = useApp();
  return medico?.papel === 'representante' ? <RepDashboardScreen /> : <HomeScreen />;
}
