import { Link, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text } from 'react-native';
import { colors, Header, screen } from '../../components/ui';
export default function Help() { const params = useLocalSearchParams<{ slug?: string[] }>(); return <ScrollView style={screen.container} contentContainerStyle={screen.scroll}><Header eyebrow="Centro de ayuda" title={params.slug?.length ? params.slug.join(' / ') : 'Ayuda.'} /><Text style={{ color: colors.muted, fontSize: 17, lineHeight: 26 }}>Revisá los pedidos por horario, marcá cada turno y usá el menú lateral para volver a cocina.</Text><Link href="/cocina" style={{ color: colors.coral, fontWeight: '800' }}>Volver a cocina →</Link></ScrollView>; }
