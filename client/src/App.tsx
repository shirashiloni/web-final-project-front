import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import TopBar from './components/TopBar';
import ProfileView from './views/Profile';
import FeedView from './views/Feed';
import NewPostView from './views/NewPost';

const App = () => {
  return (
    <Router>
      <TopBar />
      <Routes>
        <Route index path="/feed" element={<FeedView />} />
        <Route path="/profile" element={<ProfileView />} />
        <Route path="/post" element={<NewPostView />} />
      </Routes>
    </Router>
  );
};

export default App;