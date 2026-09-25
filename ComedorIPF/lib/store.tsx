import { createContext, useContext, useState, type ReactNode } from 'react';
import { dishes, type Dish } from './data';

type CartItem = Dish & { quantity: number };
type Turn = { id: number; name: string; time: string; people: number };
type Store = { loggedIn: boolean; cart: CartItem[]; history: CartItem[][]; turns: Turn[]; add: (dish: Dish) => void; remove: (id: string) => void; undo: () => void; clearCart: () => void; login: () => void; logout: () => void; takeTurn: (name: string, people: number) => void };

const StoreContext = createContext<Store | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
    const [loggedIn, setLoggedIn] = useState(false);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [history, setHistory] = useState<CartItem[][]>([]);
    const [turns, setTurns] = useState<Turn[]>([{ id: 1, name: 'Turno disponible', time: '12:30', people: 1 }]);
    const change = (next: CartItem[]) => { setHistory(previous => [...previous, cart]); setCart(next); };
    const add = (dish: Dish) => change(cart.some(item => item.id === dish.id) ? cart.map(item => item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item) : [...cart, { ...dish, quantity: 1 }]);
    const remove = (id: string) => change(cart.flatMap(item => item.id === id ? (item.quantity > 1 ? [{ ...item, quantity: item.quantity - 1 }] : []) : [item]));
    return <StoreContext.Provider value={{ loggedIn, cart, history, turns, add, remove, undo: () => { const previous = history.at(-1); if (previous) { setCart(previous); setHistory(history.slice(0, -1)); } }, clearCart: () => change([]), login: () => setLoggedIn(true), logout: () => setLoggedIn(false), takeTurn: (name, people) => setTurns([...turns, { id: Date.now(), name, people, time: '13:00' }]) }}>{children}</StoreContext.Provider>;
}
export const useStore = () => { const value = useContext(StoreContext); if (!value) throw new Error('StoreProvider missing'); return value; };
