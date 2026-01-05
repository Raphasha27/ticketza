import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, TextInput, SafeAreaView, ActivityIndicator, Dimensions, Platform, BlurView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const API_BASE_URL = 'http://192.168.18.65:8000';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [cart, setCart] = useState({});
  const [deliveryMethod, setDeliveryMethod] = useState('digital');
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [userProfile] = useState({
    name: "Raphasha",
    email: "raphasha@ticketza.co.za",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400",
    loyaltyPoints: 1250,
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const response = await fetch(`${API_BASE_URL}/api/v1/events/`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      const formattedEvents = data.map(event => ({
        id: event.id,
        name: event.title,
        date: event.date ? event.date.split('T')[0] : '2026-03-12',
        venue: event.venue ? `${event.venue.name}, ${event.venue.city}` : 'FNB Stadium, JHB',
        image: event.image_url || `https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&sig=${event.id}`,
        price: 350,
        category: 'Concert',
        description: event.description || 'Join thousands of fans for this spectacular live experience.',
      }));
      setEvents(formattedEvents);
      setError(null);
    } catch (err) {
      setError('Offline');
      setEvents([
        { id: 1, name: 'Coldplay: Music of the Spheres', venue: 'Wembley Stadium', date: 'Oct 26-28, 2026', image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800', price: 1100, category: 'Music' },
        { id: 2, name: 'NBA Finals: Lakers vs Celtics', venue: 'Crypto.com Arena', date: 'Jun 14, 2026', image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=800', price: 2500, category: 'Sports' },
        { id: 3, name: 'The Lion King Musical', venue: 'Lyceum Theatre', date: 'Daily Show', image: 'https://images.unsplash.com/photo-1503095396549-80705a6207a2?w=800', price: 850, category: 'Musical' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCart = (eventId, delta) => {
    setCart(prev => {
      const newCount = (prev[eventId] || 0) + delta;
      if (newCount <= 0) {
        const { [eventId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [eventId]: newCount };
    });
  };

  const getTotalTicketsCount = () => Object.values(cart).reduce((a, b) => a + b, 0);
  const getTotalAmount = () => Object.entries(cart).reduce((total, [id, count]) => {
    const event = events.find(e => e.id === parseInt(id));
    return total + (event?.price || 0) * count;
  }, 0);

  // --- Nav Bar ---
  const NavigationBar = () => (
    <View style={styles.navContainer}>
      <View style={styles.navInner}>
        <TouchableOpacity style={styles.navBtn} onPress={() => setCurrentScreen('home')}>
          <Ionicons name={currentScreen === 'home' ? "home" : "home-outline"} size={24} color={currentScreen === 'home' ? "#7F00FF" : "#999"} />
          <Text style={[styles.navText, currentScreen === 'home' && styles.navTextActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} onPress={() => setCurrentScreen('search')}>
          <Ionicons name="search-outline" size={24} color="#999" />
          <Text style={styles.navText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} onPress={() => setCurrentScreen('cart')}>
          <View>
            <Ionicons name={currentScreen === 'cart' ? "cart" : "cart-outline"} size={24} color={currentScreen === 'cart' ? "#7F00FF" : "#999"} />
            {getTotalTicketsCount() > 0 && <View style={styles.cartBadgeSmall}><Text style={styles.cartBadgeTextSmall}>{getTotalTicketsCount()}</Text></View>}
          </View>
          <Text style={[styles.navText, currentScreen === 'cart' && styles.navTextActive]}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} onPress={() => setCurrentScreen('profile')}>
          <Ionicons name={currentScreen === 'profile' ? "person" : "person-outline"} size={24} color={currentScreen === 'profile' ? "#7F00FF" : "#999"} />
          <Text style={[styles.navText, currentScreen === 'profile' && styles.navTextActive]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // --- Screens ---

  const HomeScreen = () => (
    <View style={styles.screen}>
      <LinearGradient colors={['#A020F0', '#FF00FF']} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.homeHeader}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <Text style={styles.logoText}>Ticketza</Text>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.headerIcon}><Ionicons name="search" size={24} color="#fff" /></TouchableOpacity>
              <TouchableOpacity onPress={() => setCurrentScreen('profile')}><Image source={{ uri: userProfile.avatar }} style={styles.headerAvatar} /></TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.homeContent} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#7F00FF" style={{ marginTop: 50 }} />
        ) : (
          <>
            <View style={styles.homeSection}>
              {events.map(event => (
                <TouchableOpacity key={event.id} style={styles.mockCard} onPress={() => { setSelectedEvent(event); setCurrentScreen('detail'); }}>
                  <Image source={{ uri: event.image }} style={styles.mockCardImage} />
                  <View style={styles.mockCategoryBadge}><Text style={styles.mockCategoryText}>{event.category}</Text></View>
                  <View style={styles.mockCardBody}>
                    <Text style={styles.mockCardTitle}>{event.name}</Text>
                    <Text style={styles.mockCardLoc}><Ionicons name="location-outline" size={14} /> {event.venue}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ height: 120 }} />
          </>
        )}
      </ScrollView>
      <NavigationBar />
    </View>
  );

  const DetailScreen = () => (
    <View style={[styles.screen, { backgroundColor: '#000' }]}>
      <Image source={{ uri: selectedEvent?.image }} style={styles.detailHero} />
      <SafeAreaView style={styles.detailBackContainer}>
        <TouchableOpacity style={styles.detailCircleBack} onPress={() => setCurrentScreen('home')}>
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView style={styles.detailContentDark}>
        <Text style={styles.detailH1}>{selectedEvent?.name}</Text>
        <View style={styles.detailMetaRow}>
          <Ionicons name="calendar-outline" size={20} color="#7F00FF" />
          <Text style={styles.detailMetaText}>{selectedEvent?.date}</Text>
        </View>
        <View style={styles.detailMetaRow}>
          <Ionicons name="location-outline" size={20} color="#7F00FF" />
          <Text style={styles.detailMetaText}>{selectedEvent?.venue}</Text>
        </View>

        <Text style={styles.detailBodyText}>
          Experience the ultimate music event of the year with top international artists, gourmet food stalls, and immersive art installations. Don't miss out!
        </Text>
        <View style={{ height: 150 }} />
      </ScrollView>

      <View style={styles.stickyPayContainer}>
        <View style={styles.stickyPayInner}>
          <Text style={styles.stickyPrice}>R{selectedEvent?.price}</Text>
          <View style={styles.stickyQuantity}>
            <TouchableOpacity style={styles.stickyQBtn} onPress={() => updateCart(selectedEvent.id, -1)}>
              <Ionicons name="remove" size={20} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.stickyQText}>{cart[selectedEvent.id] || 0}</Text>
            <TouchableOpacity style={styles.stickyQBtn} onPress={() => updateCart(selectedEvent.id, 1)}>
              <Ionicons name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.stickyBuyBtn} onPress={() => setCurrentScreen('cart')}>
            <Text style={styles.stickyBuyText}>Buy Tickets</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const CartScreen = () => {
    const items = Object.entries(cart).map(([id, count]) => ({
      event: events.find(e => e.id === parseInt(id)),
      count
    })).filter(i => i.event);

    return (
      <View style={[styles.screen, { backgroundColor: '#1A1A1A' }]}>
        <SafeAreaView>
          <View style={styles.cartHeader}>
            <TouchableOpacity onPress={() => setCurrentScreen('home')}><Ionicons name="chevron-back" size={24} color="#fff" /></TouchableOpacity>
            <Text style={styles.cartTitle}>Shopping Cart</Text>
            <Ionicons name="person-circle-outline" size={24} color="#fff" />
          </View>
        </SafeAreaView>

        <ScrollView style={styles.cartScroll}>
          {items.map(item => (
            <View key={item.event.id} style={styles.cartItemRow}>
              <Image source={{ uri: item.event.image }} style={styles.cartImg} />
              <View style={styles.cartInfo}>
                <Text style={styles.cartItemTitle}>{item.event.name}</Text>
                <Text style={styles.cartItemMeta}>General Admission, Fri 29 Nov, 19:30</Text>
                <Text style={styles.cartItemPrice}>R{item.event.price}.00</Text>
              </View>
              <View style={styles.cartStepper}>
                <TouchableOpacity onPress={() => updateCart(item.event.id, -1)}><Ionicons name="remove-circle-outline" size={20} color="#666" /></TouchableOpacity>
                <Text style={styles.cartStepNum}>{item.count}</Text>
                <TouchableOpacity onPress={() => updateCart(item.event.id, 1)}><Ionicons name="add-circle-outline" size={20} color="#666" /></TouchableOpacity>
              </View>
            </View>
          ))}

          <Text style={styles.cartSectionHeading}>Receiving Method</Text>
          <View style={styles.methodContainer}>
            <TouchableOpacity 
              style={[styles.methodBtn, deliveryMethod === 'digital' && styles.methodBtnActive]} 
              onPress={() => setDeliveryMethod('digital')}
            >
              <View style={styles.methodIconBox}><Ionicons name="mail" size={32} color={deliveryMethod === 'digital' ? '#7F00FF' : '#999'} /></View>
              <Text style={styles.methodLabel}>Email</Text>
              {deliveryMethod === 'digital' && <View style={styles.methodCheck}><Ionicons name="checkmark-circle" size={16} color="#7F00FF" /></View>}
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.methodBtn, deliveryMethod === 'whatsapp' && styles.methodBtnActive]} 
              onPress={() => setDeliveryMethod('whatsapp')}
            >
              <View style={styles.methodIconBox}><Ionicons name="logo-whatsapp" size={32} color={deliveryMethod === 'whatsapp' ? '#25D366' : '#999'} /></View>
              <Text style={styles.methodLabel}>WhatsApp</Text>
              {deliveryMethod === 'whatsapp' && <View style={styles.methodCheck}><Ionicons name="checkmark-circle" size={16} color="#7F00FF" /></View>}
            </TouchableOpacity>
          </View>

          <View style={styles.cartSummary}>
            <View style={styles.sRow}><Text style={styles.sLabel}>Subtotal</Text><Text style={styles.sVal}>R{getTotalAmount()}.00</Text></View>
            <View style={styles.sRow}><Text style={styles.sLabel}>Service Fee</Text><Text style={styles.sVal}>R100.00</Text></View>
            <View style={styles.sRowTotal}><Text style={styles.sTotalLabel}>Total:</Text><Text style={styles.sTotalVal}>R{getTotalAmount() + 100}.00</Text></View>
          </View>

          <TouchableOpacity style={styles.secureCheckoutBtn} onPress={() => setCurrentScreen('payment')}>
            <Ionicons name="lock-closed" size={18} color="#fff" />
            <Text style={styles.secureText}>Secure Checkout</Text>
          </TouchableOpacity>
          <View style={{ height: 100 }} />
        </ScrollView>
        <NavigationBar />
      </View>
    );
  };

  const ProfileScreen = () => (
    <View style={[styles.screen, { backgroundColor: '#121212' }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.profileTop}>
          <View style={styles.avatarRings}>
            <Image source={{ uri: userProfile.avatar }} style={styles.profileImg} />
          </View>
        </View>

        <ScrollView style={styles.profileBody}>
          <LinearGradient colors={['#1E1E1E', '#111']} style={styles.pointsBadge}>
            <Text style={styles.pNum}>1250 pts</Text>
            <Text style={styles.pLabel}>LOYALTY TIER: GOLD</Text>
          </LinearGradient>

          <View style={styles.profileList}>
            <ProfileRow icon="ticket" label="My Tickets" />
            <ProfileRow icon="card" label="Payment Methods" />
            <ProfileRow icon="options" label="Preferences" />
            <ProfileRow icon="help-circle" label="Support" />
          </View>
          <Text style={{ textAlign: 'center', color: '#555', marginTop: 10, fontSize: 12, fontWeight: '800' }}>Built by Kid Of Dynamic 🇿🇦</Text>
        </ScrollView>
        <NavigationBar />
      </SafeAreaView>
    </View>
  );

  const ProfileRow = ({ icon, label }) => (
    <TouchableOpacity style={styles.pRow}>
      <View style={styles.pIconBg}><Ionicons name={icon} size={22} color="#A020F0" /></View>
      <Text style={styles.pRowLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color="#333" />
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      {currentScreen === 'home' && <HomeScreen />}
      {currentScreen === 'detail' && <DetailScreen />}
      {currentScreen === 'cart' && <CartScreen />}
      {currentScreen === 'profile' && <ProfileScreen />}
      {currentScreen === 'payment' && (
        <View style={styles.screenCenter}>
          <Ionicons name="checkmark-circle" size={100} color="#00C853" />
          <Text style={styles.successText}>Payment Successful!</Text>
          <TouchableOpacity style={styles.backHomeBtn} onPress={() => {setCart({}); setCurrentScreen('home');}}>
            <Text style={styles.btnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      )}
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  homeHeader: { paddingBottom: 20 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10 },
  logoText: { fontSize: 26, fontWeight: '800', color: '#fff' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  headerIcon: { marginRight: 20 },
  headerAvatar: { width: 36, height: 36, borderRadius: 18, borderSize: 2, borderColor: 'rgba(255,255,255,0.5)' },
  homeContent: { flex: 1, padding: 20 },
  mockCard: { backgroundColor: '#fff', borderRadius: 20, marginBottom: 25, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5, overflow: 'hidden' },
  mockCardImage: { width: '100%', height: 180 },
  mockCategoryBadge: { position: 'absolute', top: 15, right: 15, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 12 },
  mockCategoryText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  mockCardBody: { padding: 15 },
  mockCardTitle: { fontSize: 18, fontWeight: '800', marginBottom: 5 },
  mockCardLoc: { fontSize: 14, color: '#666' },
  navContainer: { position: 'absolute', bottom: 70, left: 20, right: 20 },
  navInner: { flexDirection: 'row', backgroundColor: '#fff', height: 70, borderRadius: 35, elevation: 20, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 15, paddingHorizontal: 20 },
  navBtn: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  navText: { fontSize: 11, color: '#999', marginTop: 4, fontWeight: '700' },
  navTextActive: { color: '#7F00FF' },
  detailHero: { width: '100%', height: 400 },
  detailBackContainer: { position: 'absolute', top: 0, left: 20 },
  detailCircleBack: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  detailContentDark: { flex: 1, backgroundColor: '#000', borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30, padding: 25 },
  detailH1: { color: '#fff', fontSize: 28, fontWeight: '900', marginBottom: 20 },
  detailMetaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  detailMetaText: { color: '#fff', marginLeft: 10, fontSize: 16, fontWeight: '600' },
  detailBodyText: { color: '#ccc', fontSize: 15, lineHeight: 24, marginTop: 15 },
  stickyPayContainer: { position: 'absolute', bottom: 30, left: 20, right: 20 },
  stickyPayInner: { backgroundColor: '#7F00FF', height: 75, borderRadius: 38, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 25 },
  stickyPrice: { color: '#fff', fontSize: 24, fontWeight: '900', flex: 1 },
  stickyQuantity: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: 4, marginRight: 15 },
  stickyQBtn: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  stickyQText: { color: '#fff', paddingHorizontal: 12, fontWeight: '800', fontSize: 16 },
  stickyBuyBtn: { backgroundColor: '#000', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 25 },
  stickyBuyText: { color: '#fff', fontWeight: '800' },
  cartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 10 },
  cartTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
  cartScroll: { paddingHorizontal: 20 },
  cartItemRow: { flexDirection: 'row', backgroundColor: '#222', padding: 12, borderRadius: 18, marginBottom: 15 },
  cartImg: { width: 70, height: 70, borderRadius: 12 },
  cartInfo: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  cartItemTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  cartItemMeta: { color: '#777', fontSize: 11, marginTop: 4 },
  cartItemPrice: { color: '#fff', fontSize: 14, fontWeight: '800', marginTop: 6 },
  cartStepper: { alignItems: 'center', justifyContent: 'center', marginLeft: 10 },
  cartStepNum: { color: '#fff', marginVertical: 4, fontWeight: '800' },
  cartSectionHeading: { color: '#fff', fontSize: 18, fontWeight: '800', marginTop: 25, marginBottom: 15 },
  methodContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  methodBtn: { flex: 1, backgroundColor: '#222', borderRadius: 20, padding: 15, alignItems: 'center', marginHorizontal: 5, position: 'relative' },
  methodBtnActive: { borderWidth: 2, borderColor: '#7F00FF' },
  methodIconBox: { marginBottom: 10 },
  methodLabel: { color: '#fff', fontWeight: '800' },
  methodCheck: { position: 'absolute', top: 10, right: 10 },
  cartSummary: { marginTop: 30, backgroundColor: '#222', padding: 20, borderRadius: 20 },
  sRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  sLabel: { color: '#999', fontWeight: '600' },
  sVal: { color: '#fff', fontWeight: '700' },
  sRowTotal: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderColor: '#333', paddingTop: 15, marginTop: 5 },
  sTotalLabel: { color: '#fff', fontSize: 18, fontWeight: '800' },
  sTotalVal: { color: '#7F00FF', fontSize: 22, fontWeight: '900' },
  secureCheckoutBtn: { backgroundColor: '#7F00FF', height: 60, borderRadius: 30, marginTop: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', shadowColor: '#7F00FF', shadowOpacity: 0.4, shadowRadius: 15 },
  secureText: { color: '#fff', fontSize: 18, fontWeight: '900', marginLeft: 10 },
  profileTop: { height: 250, justifyContent: 'center', alignItems: 'center' },
  avatarRings: { width: 160, height: 160, borderRadius: 80, borderWidth: 2, borderColor: '#7F00FF', justifyContent: 'center', alignItems: 'center' },
  profileImg: { width: 130, height: 130, borderRadius: 65, borderWidth: 3, borderColor: '#FFD700' },
  profileBody: { flex: 1, paddingHorizontal: 25 },
  pointsBadge: { padding: 25, borderRadius: 25, alignItems: 'center', marginBottom: 30 },
  pNum: { color: '#fff', fontSize: 40, fontWeight: '900' },
  pLabel: { color: '#FFD700', fontSize: 11, fontWeight: '800', letterSpacing: 2, marginTop: 5 },
  profileList: { marginBottom: 50 },
  pRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E1E1E', padding: 18, borderRadius: 20, marginBottom: 15 },
  pIconBg: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(160, 32, 240, 0.1)', justifyContent: 'center', alignItems: 'center' },
  pRowLabel: { flex: 1, color: '#fff', marginLeft: 15, fontSize: 16, fontWeight: '700' },
  screenCenter: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  successText: { color: '#fff', fontSize: 24, fontWeight: '800', marginTop: 20 },
  backHomeBtn: { backgroundColor: '#7F00FF', paddingHorizontal: 40, paddingVertical: 15, borderRadius: 30, marginTop: 40 },
  btnText: { color: '#fff', fontWeight: '900' },
  cartBadgeSmall: { position: 'absolute', top: -5, right: -10, backgroundColor: '#FF3B30', width: 16, height: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  cartBadgeTextSmall: { color: '#fff', fontSize: 9, fontWeight: 'bold' }
});
