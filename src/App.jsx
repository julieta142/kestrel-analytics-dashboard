import { Route, Routes } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import Overview from './pages/Overview';
import Invoices from './pages/Invoices';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Overview />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
