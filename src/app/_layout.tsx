import { Redirect, Slot } from 'expo-router';
import AuthProvider, { useAuth } from '../providers/AuthProvider';

const RootLayout = () => {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
};

export default RootLayout;
