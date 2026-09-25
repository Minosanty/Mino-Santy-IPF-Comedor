import { Tabs } from 'expo-router';
import { colors } from '../../components/ui';
export default function TabsLayout() {
    return <Tabs screenOptions={{ tabBarStyle: { display: 'none' }, headerShown: false }}>
        <Tabs.Screen name="index" options={{ title: 'Inicio', tabBarLabel: 'Inicio' }} />
        <Tabs.Screen name="menu" options={{ title: 'Menú', tabBarLabel: 'Menú' }} />
        <Tabs.Screen name="cart" options={{ title: 'Carrito', tabBarLabel: 'Carrito' }} />
        <Tabs.Screen name="turnos" options={{ title: 'Turnos', tabBarLabel: 'Turnos' }} />
    </Tabs>;
}
