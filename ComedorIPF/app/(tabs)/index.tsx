import { Link, useRouter } from "expo-router";
import {
    ImageBackground,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
    useWindowDimensions,
} from "react-native";
import { Button, colors, DishCard, Header, screen } from "../../components/ui";
import { dishes } from "../../lib/data";
import { useStore } from "../../lib/store";
export default function Home() {
    const router = useRouter();
    const { cart, loggedIn } = useStore();
    const { width } = useWindowDimensions();
    const compact = width < 620;
    return (
        <ScrollView style={screen.container} contentContainerStyle={[styles.page, compact && styles.compactPage]}>
            <ImageBackground
                source={{
                    uri: "https://ipfconecta.formosa.gob.ar/optimized/landing/hero.webp",
                }}
                imageStyle={styles.heroImage}
                style={[styles.hero, compact && styles.compactHero]}
            >
                <View style={styles.heroShade} />
                <View style={styles.heroContent}>
                    <Text style={styles.heroKicker}>
                        IMPULSANDO TU FUTURO · COMEDOR IPF
                    </Text>
                    <Text style={[styles.heroTitle, compact && styles.compactHeroTitle]}>Comé rico,{`\n`}seguí tu ritmo.</Text>
                    <Text style={styles.heroText}>
                        Almuerzos de 12:30 a 14:00 para acompañar tu jornada de formación.
                    </Text>
                    <Button onPress={() => router.push("/menu")}>Conocer el menú</Button>
                </View>
            </ImageBackground>
            <View style={styles.infoStrip}>
                <View>
                    <Text style={styles.metric}>{cart.length}</Text>
                    <Text style={styles.label}>platos en carrito</Text>
                </View>
                <View>
                    <Text style={styles.metric}>{loggedIn ? "Sí" : "No"}</Text>
                    <Text style={styles.label}>sesión activa</Text>
                </View>
                <Pressable onPress={() => router.push("/turnos")}>
                    <Text style={styles.stripAction}>Reservar turno →</Text>
                </Pressable>
            </View>
            <Text style={styles.section}>Menú de hoy</Text>
            <Text style={styles.sectionIntro}>Clásico, celíaco y vegetariano.</Text>
            {dishes.slice(0, 3).map((dish) => (
                <DishCard key={dish.id} dish={dish} />
            ))}
            <Text style={styles.section}>Para cerrar</Text>
            <Text style={styles.sectionIntro}>Postres clásicos, sin TACC y vegetarianos.</Text>
            {dishes.filter((dish) => dish.mealType === "Postre").slice(0, 3).map((dish) => (
                <DishCard key={dish.id} dish={dish} />
            ))}
            <Link href="/cocina" asChild>
                <Pressable>
                    <Text style={styles.link}>Abrir cocina en el drawer →</Text>
                </Pressable>
            </Link>
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    page: { paddingBottom: 40 },
    compactPage: { paddingBottom: 24 },
    hero: { minHeight: 360, justifyContent: "flex-end", overflow: "hidden" },
    compactHero: { minHeight: 300 },
    heroImage: { resizeMode: "cover" },
    heroShade: {
        ...StyleSheet.absoluteFill,
        backgroundColor: "rgba(16, 61, 70, 0.66)",
    },
    heroContent: { padding: 22, gap: 10, maxWidth: 550 },
    heroKicker: {
        color: "#e9d38b",
        letterSpacing: 2.4,
        fontSize: 11,
        fontWeight: "900",
    },
    heroTitle: { color: "#fff", fontSize: 34, lineHeight: 37, fontWeight: "900" },
    compactHeroTitle: { fontSize: 30, lineHeight: 33 },
    heroText: { color: "#edf8f6", fontSize: 15, lineHeight: 21, maxWidth: 420 },
    infoStrip: {
        backgroundColor: colors.paper,
        paddingHorizontal: 22,
        paddingVertical: 18,
        flexDirection: "row",
        gap: 28,
        alignItems: "center",
        flexWrap: "wrap",
        borderBottomWidth: 1,
        borderBottomColor: colors.line,
    },
    metric: { fontSize: 25, color: colors.ink, fontWeight: "900" },
    label: { color: colors.muted, fontSize: 12 },
    stripAction: { color: colors.coral, fontWeight: "900" },
    section: {
        color: colors.ink,
        fontWeight: "900",
        fontSize: 24,
        marginHorizontal: 20,
        marginTop: 22,
    },
    sectionIntro: { color: colors.muted, marginHorizontal: 20, marginTop: -8 },
    link: {
        color: colors.coral,
        fontWeight: "800",
        paddingHorizontal: 20,
        paddingVertical: 8,
    },
});
