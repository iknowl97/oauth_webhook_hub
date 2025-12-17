import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Providers from './pages/Providers';
import Webhooks from './pages/Webhooks';
import Tokens from './pages/Tokens';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/providers" element={<Providers />} />
        <Route path="/webhooks" element={<Webhooks />} />
        <Route path="/tokens" element={<Tokens />} />
      </Routes>
    </Layout>
  );
}

export default App;
