import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../components/ui';
export default function NotFound() { return <View style={styles.container}><Text style={styles.code}>404</Text><Text style={styles.title}>Esta ruta no existe.</Text><Link href="/" style={styles.link}>Volver al inicio →</Link></View>; }
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: colors.cream, padding: 24, justifyContent: 'center', gap: 12 }, code: { color: colors.coral, fontSize: 70, fontWeight: '900' }, title: { color: colors.ink, fontSize: 26, fontWeight: '900' }, link: { color: colors.green, fontWeight: '800', fontSize: 17 } });
