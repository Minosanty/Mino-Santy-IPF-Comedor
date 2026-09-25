import { useLocalSearchParams } from 'expo-router';
import { ScrollView, Text } from 'react-native';
import { DishCard, Header, screen } from '../../components/ui';
import { dishes } from '../../lib/data';
export default function SearchResults() { const params = useLocalSearchParams<{ term?: string | string[] }>(); const term = Array.isArray(params.term) ? params.term.join(' ') : params.term ?? ''; const results = dishes.filter(dish => `${dish.name} ${dish.category} ${dish.description}`.toLowerCase().includes(term.toLowerCase())); return <ScrollView style={screen.container} contentContainerStyle={screen.scroll}><Header eyebrow={`Búsqueda · ${term}`} title={`${results.length} resultado${results.length === 1 ? '' : 's'}.`} />{results.map(dish => <DishCard key={dish.id} dish={dish} />)}{results.length === 0 && <Text>No encontramos ese plato. Probá con otra palabra.</Text>}</ScrollView>; }
