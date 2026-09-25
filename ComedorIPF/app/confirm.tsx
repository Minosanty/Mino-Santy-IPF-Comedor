import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button, colors, screen } from '../components/ui';
import { useStore } from '../lib/store';
export default function Confirm() { const router = useRouter(); const { cart, clearCart } = useStore(); return <View style={screen.content}><Text style={styles.emoji}>✓</Text><Text style={styles.title}>¿Confirmamos tu pedido?</Text><Text style={styles.copy}>{cart.reduce((sum, item) => sum + item.quantity, 0)} plato(s) listos para retirar en el comedor.</Text><Button onPress={() => { clearCart(); router.dismiss(); }}>Confirmar y cerrar</Button><Button secondary onPress={() => router.dismiss()}>Seguir editando</Button></View>; }
const styles = StyleSheet.create({ emoji: { color: colors.green, fontSize: 68, fontWeight: '900' }, title: { color: colors.ink, fontSize: 30, fontWeight: '900' }, copy: { color: colors.muted, fontSize: 17, lineHeight: 25 } });
