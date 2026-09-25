import { useState } from "react";
import { Link } from "expo-router";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { colors, DishCard, Header, screen } from "../../components/ui";
import { dishes } from "../../lib/data";
export default function Menu() {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("Todos");
    const [mealType, setMealType] = useState<"Plato" | "Postre">("Plato");
    const filtered = dishes.filter(
        (d) =>
            d.mealType === mealType &&
            (category === "Todos" || d.category === category) &&
            `${d.name} ${d.category} ${d.tags.join(" ")}`
                .toLowerCase()
                .includes(query.toLowerCase()),
    );
    const categories = ["Todos", "Clásico", "Celíaco", "Vegetariano"];
    return (
        <ScrollView style={screen.container} contentContainerStyle={screen.scroll}>
            <Header eyebrow="Almuerzo · 12:30 a 14:00" title="Elegí tu almuerzo." />
            <Text style={styles.intro}>
                Platos y postres preparados para cada forma de comer.
            </Text>
            <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Buscar plato..."
                placeholderTextColor={colors.muted}
                style={styles.input}
            />
            <View style={styles.typeFilters}>
                {(["Plato", "Postre"] as const).map((item) => (
                    <Pressable
                        key={item}
                        onPress={() => setMealType(item)}
                        style={[styles.typeFilter, mealType === item && styles.activeTypeFilter]}
                    >
                        <Text style={[styles.typeFilterText, mealType === item && styles.activeTypeFilterText]}>
                            {item === "Plato" ? "Platos principales" : "Postres"}
                        </Text>
                    </Pressable>
                ))}
            </View>
            <Text style={styles.filterLabel}>Filtrar por modalidad</Text>
            <View style={styles.filters}>
                {categories.map((item) => (
                    <Pressable
                        key={item}
                        onPress={() => setCategory(item)}
                        style={[styles.filter, category === item && styles.activeFilter]}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                category === item && styles.activeFilterText,
                            ]}
                        >
                            {item}
                        </Text>
                    </Pressable>
                ))}
            </View>
            {filtered.length === 0 && (
                <Text style={styles.empty}>No encontramos ese plato.</Text>
            )}
            {filtered.map((dish) => (
                <DishCard key={dish.id} dish={dish} />
            ))}
            {query.length > 0 && (
                <Link
                    href={{ pathname: "/search/[...term]", params: { term: query } }}
                    style={styles.link}
                >
                    Ver búsqueda avanzada →
                </Link>
            )}
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    intro: { color: colors.muted, fontSize: 16 },
    input: {
        backgroundColor: colors.paper,
        borderColor: colors.line,
        borderWidth: 1,
        borderRadius: 6,
        padding: 15,
        color: colors.ink,
        fontSize: 16,
    },
    typeFilters: { flexDirection: "row", backgroundColor: "#dcecea", borderRadius: 7, padding: 4, gap: 4 },
    typeFilter: { flex: 1, paddingVertical: 12, alignItems: "center", borderRadius: 5 },
    activeTypeFilter: { backgroundColor: colors.paper },
    typeFilterText: { color: colors.muted, fontWeight: "800" },
    activeTypeFilterText: { color: colors.coral },
    filterLabel: { color: colors.ink, fontWeight: "800", fontSize: 13, marginTop: 2 },
    filters: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
    filter: {
        backgroundColor: "#e0eeec",
        paddingVertical: 10,
        paddingHorizontal: 13,
        borderRadius: 22,
    },
    activeFilter: { backgroundColor: colors.coral },
    filterText: { color: colors.green, fontWeight: "700" },
    activeFilterText: { color: "#fff" },
    empty: { color: colors.muted, paddingVertical: 12 },
    link: { color: colors.coral, fontWeight: "800" },
});
