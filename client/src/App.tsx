import { Routes, Route, useLocation } from 'react-router-dom';
import TopBar from './components/TopBar';
import ProfileView from './views/Profile';
import FeedView from './views/Feed';
import ShareView from './views/NewPost';
import LoginView from './views/Login';
import RegistrationView from './views/Registration';
import ProtectedRoute from './components/ProtectedRoute';
import { GoogleOAuthProvider } from '@react-oauth/google';

const App = () => {
  const location = useLocation();

  const noTopBarRoutes = ['/login', '/register'];

  return (
    <GoogleOAuthProvider clientId="377932721805-eqjcgh79s8ihem5c53cqls924k25i836.apps.googleusercontent.com">
      {!noTopBarRoutes.includes(location.pathname) && <TopBar />}
      <Routes>
        <Route index path="/login" element={<LoginView />} />
        <Route path="/register" element={<RegistrationView />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/"/>
          <Route path="/explore" element={<FeedView />} />
          <Route path="/profile" element={<ProfileView />} />
          <Route path="/post" element={<ShareView />} />
        </Route>
      </Routes>
    </GoogleOAuthProvider>
  );
};

export default App;
