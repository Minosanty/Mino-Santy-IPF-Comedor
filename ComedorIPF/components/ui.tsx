import { Link, usePathname } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View, useWindowDimensions, type ViewStyle } from 'react-native';
import { formatPrice, type Dish } from '../lib/data';

export const colors = { ink: '#244c4b', cream: '#f4f8f7', paper: '#ffffff', green: '#008f89', coral: '#0a9f98', gold: '#d6b35a', muted: '#647978', line: '#d8e6e3', navy: '#173f4a' };
export function Header({ title, eyebrow }: { title: string; eyebrow?: string }) { return <View style={styles.header}>{eyebrow && <Text style={styles.eyebrow}>{eyebrow}</Text>}<Text style={styles.title}>{title}</Text></View>; }
export function InstitutionalHeader() {
    const { width } = useWindowDimensions();
    const pathname = usePathname();
    const [hoveredHref, setHoveredHref] = useState<string | null>(null);
    const compact = width < 620;
    const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(`${href}/`));
    const navItem = (href: '/' | '/menu' | '/cart' | '/turnos', label: string) => (
        <Link href={href} asChild key={href}>
            <Pressable onHoverIn={() => setHoveredHref(href)} onHoverOut={() => setHoveredHref(null)}>
                <Text style={[
                    styles.navLink,
                    compact && styles.compactNav,
                    (isActive(href) || hoveredHref === href) && styles.activeLink,
                ]}>{label}</Text>
            </Pressable>
        </Link>
    );

    return (
        <View style={[styles.institutionalHeader, compact && styles.compactHeader]}>
            <Link href="/" asChild>
                <Pressable style={styles.identity}>
                    <Image source={{ uri: 'https://ipfconecta.formosa.gob.ar/logoipf.png' }} style={[styles.logo, compact && styles.compactLogo]} resizeMode="contain" />
                    <View>
                        <Text style={[styles.institution, compact && styles.compactInstitution]}>Instituto Politécnico Formosa</Text>
                        <Text style={[styles.product, compact && styles.compactProduct]}>Comedor IPF</Text>
                    </View>
                </Pressable>
            </Link>
            <View style={[styles.links, compact && styles.compactLinks]}>
                {navItem('/', 'Inicio')}
                {navItem('/menu', 'Menú')}
                {navItem('/cart', 'Carrito')}
                {navItem('/turnos', 'Turnos')}
            </View>
        </View>
    );
}
export function DishCard({ dish }: { dish: Dish }) { return <Link href={{ pathname: '/menu/[id]', params: { id: dish.id } }} asChild><Pressable style={styles.card}><Text style={styles.emoji}>{dish.emoji}</Text><View style={{ flex: 1 }}><Text style={styles.cardTitle}>{dish.name}</Text><Text style={styles.cardDesc} numberOfLines={2}>{dish.description}</Text><Text style={styles.price}>{formatPrice(dish.price)}</Text></View></Pressable></Link>; }
export function Button({ children, onPress, secondary, style }: { children: string; onPress?: () => void; secondary?: boolean; style?: ViewStyle }) { return <Pressable onPress={onPress} style={[styles.button, secondary && styles.secondary, style]}><Text style={[styles.buttonText, secondary && styles.secondaryText]}>{children}</Text></Pressable>; }
export const screen = StyleSheet.create({ container: { flex: 1, backgroundColor: colors.cream }, content: { padding: 20, gap: 16 }, scroll: { padding: 20, gap: 16, paddingBottom: 40 } });
const styles = StyleSheet.create({ institutionalHeader: { backgroundColor: colors.paper, borderBottomColor: colors.line, borderBottomWidth: 1, paddingHorizontal: 20, paddingVertical: 14, minHeight: 82, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 20 }, compactHeader: { paddingHorizontal: 16, paddingVertical: 10, minHeight: 0, flexDirection: 'column', alignItems: 'stretch', gap: 8 }, identity: { flexDirection: 'row', alignItems: 'center', gap: 12, flexShrink: 1 }, logo: { width: 72, height: 58 }, compactLogo: { width: 44, height: 42 }, institution: { color: colors.navy, fontSize: 16, fontWeight: '900' }, compactInstitution: { display: 'none' }, compactText: { fontSize: 12 }, product: { color: colors.coral, fontSize: 14, fontWeight: '900', marginTop: 3 }, compactProduct: { fontSize: 11, marginTop: 0 }, links: { flexDirection: 'row', alignItems: 'center', gap: 22 }, compactLinks: { width: '100%', justifyContent: 'space-between', gap: 0 }, activeLink: { color: colors.coral, fontWeight: '900' }, navLink: { color: colors.muted, fontSize: 16, fontWeight: '800' }, compactNav: { fontSize: 16 }, header: { gap: 4, marginBottom: 8 }, eyebrow: { color: colors.coral, fontWeight: '800', letterSpacing: 2, textTransform: 'uppercase', fontSize: 12 }, title: { color: colors.ink, fontSize: 34, fontWeight: '900' }, card: { backgroundColor: colors.paper, borderColor: colors.line, borderWidth: 1, borderRadius: 4, padding: 16, flexDirection: 'row', gap: 14, alignItems: 'center' }, emoji: { fontSize: 38 }, cardTitle: { color: colors.ink, fontSize: 18, fontWeight: '800' }, cardDesc: { color: colors.muted, lineHeight: 20, marginTop: 4 }, price: { color: colors.green, fontWeight: '900', marginTop: 8 }, button: { backgroundColor: colors.coral, padding: 15, borderRadius: 24, alignItems: 'center' }, buttonText: { color: '#fff', fontWeight: '800', fontSize: 16 }, secondary: { backgroundColor: 'transparent', borderColor: colors.coral, borderWidth: 1 }, secondaryText: { color: colors.coral } });
