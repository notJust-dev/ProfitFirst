import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../providers/AuthProvider';

const AuthLayout = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Redirect href={'/'} />;
  }

  return <Stack />;
};

export default AuthLayout;
