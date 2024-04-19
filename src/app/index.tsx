import { Redirect } from 'expo-router';
import { View, Text } from 'react-native';

const HomeScreen = () => {
  return <Redirect href={'/allocations'} />;
};

export default HomeScreen;
