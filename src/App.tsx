import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { PlaybookEditor } from '@/pages/PlaybookEditor';
import { PlaybookViewer } from '@/pages/PlaybookViewer';
import { Layout } from '@/components/Layout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/editor" element={<PlaybookEditor />} />
          <Route path="/playbook/:id" element={<PlaybookViewer />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
