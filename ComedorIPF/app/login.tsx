import { useRouter } from 'expo-router';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, colors, screen } from '../components/ui';
import { useStore } from '../lib/store';
export default function Login() { const router = useRouter(); const { login } = useStore(); return <View style={screen.content}><Text style={styles.eyebrow}>Área de cocina</Text><Text style={styles.title}>Ingresá al panel.</Text><Text style={styles.copy}>Usá cualquier nombre para la demo del TP.</Text><TextInput placeholder="Usuario" placeholderTextColor={colors.muted} style={styles.input} /><TextInput placeholder="Contraseña" placeholderTextColor={colors.muted} secureTextEntry style={styles.input} /><Button onPress={() => { login(); router.replace('/cocina'); }}>Entrar</Button></View>; }
const styles = StyleSheet.create({ eyebrow: { color: colors.coral, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.3 }, title: { color: colors.ink, fontSize: 34, fontWeight: '900' }, copy: { color: colors.muted, fontSize: 16 }, input: { backgroundColor: colors.paper, borderColor: colors.line, borderWidth: 1, borderRadius: 12, padding: 15, color: colors.ink } });
