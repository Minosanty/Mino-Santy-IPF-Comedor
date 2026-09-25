import { Stack } from 'expo-router';
import { colors } from '../../components/ui';
export default function CocinaLayout() { return <Stack screenOptions={{ headerStyle: { backgroundColor: colors.green }, headerTintColor: '#fff' }}><Stack.Screen name="index" options={{ title: 'Pedidos en cocina' }} /><Stack.Screen name="ayuda" options={{ title: 'Ayuda' }} /></Stack>; }
