import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, TextInput, SafeAreaView, ActivityIndicator, Dimensions, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Organized Imports
import { Colors, Spacing, Shadows } from './src/constants/theme';
import { FALLBACK_EVENTS } from './src/data/fallback';

const { width, height } = Dimensions.get('window');
const API_BASE_URL = 'http://192.168.18.65:8000';

export default function App() {
  // --- State Management ---
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [cart, setCart] = useState({});
  const [deliveryMethod, setDeliveryMethod] = useState('digital');
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [userProfile] = useState({
    name: "Kid Of Dynamic",
    email: "kod@ticketza.co.za",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    loyaltyPoints: 1250,
  });

  // --- Effects ---
  useEffect(() => {
    fetchEvents();
  }, []);

  // --- API Methods ---
  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
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
        description: event.description || 'Welcome to the most anticipated show of the year.',
      }));
      setEvents(formattedEvents);
      setError(null);
    } catch (err) {
      setError('Offline');
      setEvents(FALLBACK_EVENTS);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Cart Helpers ---
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

  const cartItems = Object.entries(cart).map(([id, count]) => ({
    event: events.find(e => e.id === parseInt(id)),
    count
  })).filter(i => i.event);

  const totalAmount = cartItems.reduce((acc, item) => acc + (item.event.price * item.count), 0);
  const totalTickets = Object.values(cart).reduce((a, b) => a + b, 0);

  // --- Shared Components ---
  const NavButton = ({ screen, icon, label, badge = 0 }) => {
    const active = currentScreen === screen;
    return (
      <TouchableOpacity style={styles.navBtn} onPress={() => setCurrentScreen(screen)}>
        <View>
          <Ionicons name={active ? icon : `${icon}-outline`} size={24} color={active ? Colors.primary : Colors.textMuted} />
          {badge > 0 && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          )}
        </View>
        <Text style={[styles.navBtnText, active && styles.navBtnTextActive]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  const NavigationBar = () => (
    <View style={styles.navWrapper}>
      <View style={styles.navContent}>
        <NavButton screen="home" icon="home" label="Home" />
        <NavButton screen="search" icon="search" label="Search" />
        <NavButton screen="cart" icon="cart" label="Cart" badge={totalTickets} />
        <NavButton screen="profile" icon="person" label="Profile" />
      </View>
    </View>
  );

  // --- Screen Renderers ---

  const renderHome = () => (
    <View style={styles.flexContainer}>
      <LinearGradient colors={[Colors.accent, Colors.secondary]} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.headerGradient}>
        <SafeAreaView>
          <View style={styles.topHeader}>
            <Text style={styles.logo}>Ticketza</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.searchIcon} onPress={() => setCurrentScreen('search')}><Ionicons name="search" size={24} color={Colors.white} /></TouchableOpacity>
              <TouchableOpacity onPress={() => setCurrentScreen('profile')}><Image source={{ uri: userProfile.avatar }} style={styles.headerAvatar} /></TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>South Africa's Finest 🇿🇦</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 50 }} />
        ) : (
          events.map(event => (
            <TouchableOpacity key={event.id} style={styles.eventCard} onPress={() => { setSelectedEvent(event); setCurrentScreen('detail'); }}>
              <Image source={{ uri: event.image }} style={styles.eventCardImage} />
              <View style={styles.categoryBadge}><Text style={styles.categoryText}>{event.category}</Text></View>
              <View style={styles.eventCardBody}>
                <Text style={styles.eventName}>{event.name}</Text>
                <View style={styles.eventMeta}>
                  <Text style={styles.eventVenue}><Ionicons name="location-outline" size={14} /> {event.venue}</Text>
                  <Text style={styles.eventPrice}>R{event.price}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
        <View style={{ height: 160 }} />
      </ScrollView>
      <NavigationBar />
    </View>
  );

  const renderSearch = () => (
    <View style={[styles.flexContainer, { backgroundColor: Colors.darkBg }]}>
      <SafeAreaView>
        <View style={styles.searchHeader}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color={Colors.textMuted} />
            <TextInput 
              placeholder="Events, artists, venues..." 
              placeholderTextColor={Colors.textSecondary} 
              style={styles.searchTextInput} 
              autoFocus
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity onPress={() => setCurrentScreen('home')}><Text style={styles.cancelLink}>Cancel</Text></TouchableOpacity>
        </View>
      </SafeAreaView>
      <ScrollView style={styles.padding20}>
        <Text style={styles.searchHeading}>Trending Vibes</Text>
        {['Jazz In Jozie', 'Soweto Derby', 'Cape Town Jazz', 'Amapiano Live'].map((trend, i) => (
          <TouchableOpacity key={i} style={styles.trendRow}>
            <Ionicons name="trending-up" size={18} color={Colors.primary} />
            <Text style={styles.trendText}>{trend}</Text>
          </TouchableOpacity>
        ))}
        <Text style={[styles.searchHeading, { marginTop: 30 }]}>By Category</Text>
        <View style={styles.grid}>
          {['Music', 'Sports', 'Comedy', 'Theater', 'Festivals', 'Virtual'].map((cat, i) => (
            <TouchableOpacity key={i} style={styles.gridItem}><Text style={styles.gridText}>{cat}</Text></TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <NavigationBar />
    </View>
  );

  const renderDetail = () => (
    <View style={[styles.flexContainer, { backgroundColor: Colors.black }]}>
      <Image source={{ uri: selectedEvent?.image }} style={styles.heroImage} />
      <SafeAreaView style={styles.backBtnPos}><TouchableOpacity style={styles.circleBack} onPress={() => setCurrentScreen('home')}><Ionicons name="chevron-back" size={20} color={Colors.white} /></TouchableOpacity></SafeAreaView>
      <View style={styles.detailSheet}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.detailTitle}>{selectedEvent?.name}</Text>
          <View style={styles.metaRow}><Ionicons name="calendar-outline" size={20} color={Colors.primary} /><Text style={styles.metaLabel}>{selectedEvent?.date}</Text></View>
          <View style={styles.metaRow}><Ionicons name="location-outline" size={20} color={Colors.primary} /><Text style={styles.metaLabel}>{selectedEvent?.venue}</Text></View>
          <Text style={styles.aboutHeader}>Description</Text>
          <Text style={styles.aboutBody}>{selectedEvent?.description}</Text>
          <View style={{ height: 200 }} />
        </ScrollView>
      </View>
      <View style={styles.payBarWrapper}>
        <View style={styles.payBarContainer}>
          <Text style={styles.payPrice}>R{selectedEvent?.price}</Text>
          <View style={styles.stepperContainer}>
            <TouchableOpacity onPress={() => updateCart(selectedEvent.id, -1)}><Ionicons name="remove" size={20} color={Colors.white} /></TouchableOpacity>
            <Text style={styles.stepperVal}>{cart[selectedEvent.id] || 0}</Text>
            <TouchableOpacity onPress={() => updateCart(selectedEvent.id, 1)}><Ionicons name="add" size={20} color={Colors.white} /></TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.buyBtn} onPress={() => setCurrentScreen('cart')}><Text style={styles.buyBtnText}>Get Tickets</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderCart = () => (
    <View style={[styles.flexContainer, { backgroundColor: Colors.darkBg }]}>
      <SafeAreaView><View style={styles.cartHeader}><TouchableOpacity onPress={() => setCurrentScreen('home')}><Ionicons name="chevron-back" size={24} color={Colors.white} /></TouchableOpacity><Text style={styles.cartHeaderTitle}>Shopping Cart</Text><Ionicons name="person-circle-outline" size={32} color={Colors.white} /></View></SafeAreaView>
      <ScrollView style={styles.padding20}>
        {cartItems.map(item => (
          <View key={item.event.id} style={styles.cartItem}>
            <Image source={{ uri: item.event.image }} style={styles.cartItemImg} />
            <View style={styles.cartItemInfo}><Text style={styles.cartItemName}>{item.event.name}</Text><Text style={styles.cartItemMeta}>General • {item.event.date}</Text><Text style={styles.cartItemPrice}>R{item.event.price}</Text></View>
            <View style={styles.cartItemStepper}><TouchableOpacity onPress={() => updateCart(item.event.id, -1)}><Ionicons name="remove-circle-outline" size={22} color={Colors.textSecondary} /></TouchableOpacity><Text style={styles.cartItemCount}>{item.count}</Text><TouchableOpacity onPress={() => updateCart(item.event.id, 1)}><Ionicons name="add-circle-outline" size={22} color={Colors.textSecondary} /></TouchableOpacity></View>
          </View>
        ))}
        <Text style={styles.methodHeading}>Receiving Method</Text>
        <View style={styles.methodRow}>
          <TouchableOpacity style={[styles.methodItem, deliveryMethod === 'digital' && styles.methodItemActive]} onPress={() => setDeliveryMethod('digital')}><Ionicons name="mail" size={32} color={deliveryMethod === 'digital' ? Colors.primary : Colors.textSecondary} /><Text style={[styles.methodItemText, deliveryMethod === 'digital' && styles.methodItemTextActive]}>Email</Text>{deliveryMethod === 'digital' && <View style={styles.methodCheck} />}</TouchableOpacity>
          <TouchableOpacity style={[styles.methodItem, deliveryMethod === 'whatsapp' && styles.methodItemActive]} onPress={() => setDeliveryMethod('whatsapp')}><Ionicons name="logo-whatsapp" size={32} color={deliveryMethod === 'whatsapp' ? Colors.whatsapp : Colors.textSecondary} /><Text style={[styles.methodItemText, deliveryMethod === 'whatsapp' && styles.methodItemTextActive]}>WhatsApp</Text>{deliveryMethod === 'whatsapp' && <View style={styles.methodCheck} />}</TouchableOpacity>
        </View>
        <View style={styles.summaryContainer}>
          <View style={styles.sumRow}><Text style={styles.sumLbl}>Subtotal</Text><Text style={styles.sumVal}>R{totalAmount}</Text></View>
          <View style={styles.sumRow}><Text style={styles.sumLbl}>Service Fee</Text><Text style={styles.sumVal}>R100</Text></View>
          <View style={styles.sumTotalRow}><Text style={styles.sumTotalLbl}>Total:</Text><Text style={styles.sumTotalVal}>R{totalAmount + 100}</Text></View>
        </View>
        <TouchableOpacity style={styles.checkoutBtn} onPress={() => setCurrentScreen('payment')}><Ionicons name="lock-closed" size={20} color={Colors.white} /><Text style={styles.checkoutBtnText}>Secure Checkout</Text></TouchableOpacity>
        <View style={{ height: 160 }} />
      </ScrollView>
      <NavigationBar />
    </View>
  );

  const renderProfile = () => (
    <View style={[styles.flexContainer, { backgroundColor: '#0A0A0A' }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.profileHeader}>
          <View style={styles.profileAvatarContainer}><Image source={{ uri: userProfile.avatar }} style={styles.profileAvatarLarge} /></View>
          <Text style={styles.profileName}>{userProfile.name}</Text>
          <Text style={styles.profileEmail}>{userProfile.email}</Text>
        </View>
        <ScrollView style={styles.padding20}>
          <LinearGradient colors={['#222', '#111']} style={styles.pointsContainer}>
            <Text style={styles.pointsVal}>{userProfile.loyaltyPoints} pts</Text>
            <Text style={styles.tierLbl}>GOLD LOYALTY TIER</Text>
          </LinearGradient>
          <View style={styles.profileLinks}>
            {['My Bookings', 'Payment Data', 'Preferences', 'Live Support'].map((link, i) => (
              <TouchableOpacity key={i} style={styles.profileRow}><View style={styles.profileRowIcon}><Ionicons name="chevron-forward" size={18} color="#222" /></View><Text style={styles.profileRowText}>{link}</Text><Ionicons name="chevron-forward" size={18} color="#222" /></TouchableOpacity>
            ))}
          </View>
          <Text style={styles.brandingFooter}>Kid Of Dynamic 🇿🇦</Text>
          <View style={{ height: 160 }} />
        </ScrollView>
        <NavigationBar />
      </SafeAreaView>
    </View>
  );

  const renderPayment = () => (
    <View style={styles.successScreen}>
      <View style={styles.successCircle}><Ionicons name="checkmark" size={60} color={Colors.white} /></View>
      <Text style={styles.successText}>Success!</Text>
      <Text style={styles.successSub}>Your tickets are in your wallet.</Text>
      <TouchableOpacity style={styles.successBtn} onPress={() => {setCart({}); setCurrentScreen('home');}}><Text style={styles.successBtnText}>Finish</Text></TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      {currentScreen === 'home' && renderHome()}
      {currentScreen === 'search' && renderSearch()}
      {currentScreen === 'detail' && renderDetail()}
      {currentScreen === 'cart' && renderCart()}
      {currentScreen === 'profile' && renderProfile()}
      {currentScreen === 'payment' && renderPayment()}
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  flexContainer: { flex: 1 },
  scrollView: { flex: 1, padding: Spacing.xl },
  padding20: { padding: Spacing.lg },
  // Header
  headerGradient: { paddingBottom: Spacing.lg },
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingTop: Spacing.sm },
  logo: { fontSize: 30, fontWeight: '900', color: Colors.white, letterSpacing: -1 },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  searchIcon: { marginRight: Spacing.lg },
  headerAvatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' },
  // Home
  sectionTitle: { fontSize: 24, fontWeight: '900', color: Colors.textMain, marginBottom: Spacing.xl },
  eventCard: { backgroundColor: Colors.white, borderRadius: 28, marginBottom: Spacing.xxl, ...Shadows.light, overflow: 'hidden' },
  eventCardImage: { width: '100%', height: 220 },
  categoryBadge: { position: 'absolute', top: 18, right: 18, backgroundColor: 'rgba(255,255,255,0.95)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  categoryText: { color: Colors.primary, fontSize: 12, fontWeight: '900' },
  eventCardBody: { padding: Spacing.lg },
  eventName: { fontSize: 20, fontWeight: '900', color: Colors.textMain, marginBottom: 8 },
  eventMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eventVenue: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500' },
  eventPrice: { fontSize: 22, fontWeight: '900', color: Colors.primary },
  // Navigation
  navWrapper: { position: 'absolute', bottom: 70, left: Spacing.xl, right: Spacing.xl },
  navContent: { flexDirection: 'row', backgroundColor: Colors.white, height: 75, borderRadius: 38, ...Shadows.medium, paddingHorizontal: Spacing.xl },
  navBtn: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  navBtnText: { fontSize: 11, color: Colors.textMuted, marginTop: 4, fontWeight: '800' },
  navBtnTextActive: { color: Colors.primary },
  badgeContainer: { position: 'absolute', top: -5, right: -12, backgroundColor: Colors.red, width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: Colors.white },
  badgeText: { color: Colors.white, fontSize: 9, fontWeight: '900' },
  // Search
  searchHeader: { flexDirection: 'row', alignItems: 'center', padding: Spacing.xl, paddingTop: Spacing.sm },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.darkSurface, borderRadius: 16, height: 55, paddingHorizontal: Spacing.md, marginRight: Spacing.md },
  searchTextInput: { flex: 1, marginLeft: 12, color: Colors.white, fontSize: 16, fontWeight: '600' },
  cancelLink: { color: Colors.primary, fontWeight: '800' },
  searchHeading: { color: Colors.white, fontSize: 20, fontWeight: '900', marginBottom: Spacing.lg },
  trendRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  trendText: { color: Colors.textDarkBody, marginLeft: 12, fontSize: 16, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '48%', backgroundColor: Colors.darkSurface, padding: 20, borderRadius: 18, marginBottom: 15, alignItems: 'center' },
  gridText: { color: Colors.white, fontWeight: '800' },
  // Detail
  heroImage: { width: '100%', height: height * 0.5 },
  backBtnPos: { position: 'absolute', top: 0, left: Spacing.xl },
  circleBack: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  detailSheet: { flex: 1, backgroundColor: Colors.black, borderTopLeftRadius: 35, borderTopRightRadius: 35, marginTop: -35, padding: 30 },
  detailTitle: { color: Colors.white, fontSize: 32, fontWeight: '900', marginBottom: 25 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  metaLabel: { color: Colors.white, marginLeft: 12, fontSize: 16, fontWeight: '600' },
  aboutHeader: { color: Colors.primary, fontSize: 18, fontWeight: '900', marginTop: 25, marginBottom: 15 },
  aboutBody: { color: Colors.textDarkBody, fontSize: 16, lineHeight: 26 },
  payBarWrapper: { position: 'absolute', bottom: 30, left: Spacing.xl, right: Spacing.xl },
  payBarContainer: { backgroundColor: Colors.primary, height: 80, borderRadius: 40, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 25 },
  payPrice: { color: Colors.white, fontSize: 26, fontWeight: '900', flex: 1 },
  stepperContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 22, padding: 5, marginRight: 20 },
  stepperVal: { color: Colors.white, paddingHorizontal: 15, fontWeight: '900', fontSize: 18 },
  buyBtn: { backgroundColor: Colors.white, paddingHorizontal: 22, paddingVertical: 14, borderRadius: 28 },
  buyBtnText: { color: Colors.primary, fontWeight: '900', fontSize: 15 },
  // Cart
  cartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.xl, paddingTop: Spacing.sm },
  cartHeaderTitle: { color: Colors.white, fontSize: 24, fontWeight: '900' },
  cartItem: { flexDirection: 'row', backgroundColor: Colors.darkSurface, padding: 15, borderRadius: 24, marginBottom: 20 },
  cartItemImg: { width: 85, height: 85, borderRadius: 18 },
  cartItemInfo: { flex: 1, marginLeft: 18, justifyContent: 'center' },
  cartItemName: { color: Colors.white, fontSize: 18, fontWeight: '900' },
  cartItemMeta: { color: Colors.textSecondary, fontSize: 12, marginTop: 4 },
  cartItemPrice: { color: Colors.white, fontSize: 16, fontWeight: '800', marginTop: 8 },
  cartItemStepper: { alignItems: 'center', justifyContent: 'center', marginLeft: 10 },
  cartItemCount: { color: Colors.white, marginVertical: 6, fontWeight: '900', fontSize: 16 },
  methodHeading: { color: Colors.white, fontSize: 20, fontWeight: '900', marginTop: 25, marginBottom: 20 },
  methodRow: { flexDirection: 'row', justifyContent: 'space-between' },
  methodItem: { flex: 1, backgroundColor: Colors.darkSurface, borderRadius: 24, padding: 20, alignItems: 'center', marginHorizontal: 6, position: 'relative', borderWidth: 2, borderColor: 'transparent' },
  methodItemActive: { borderColor: Colors.primary },
  methodItemText: { color: Colors.textSecondary, fontWeight: '900', marginTop: 12, fontSize: 14 },
  methodItemTextActive: { color: Colors.white },
  methodCheck: { position: 'absolute', top: 12, right: 12, width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  summaryContainer: { marginTop: 35, backgroundColor: Colors.darkSurface, padding: 25, borderRadius: 28 },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  sumLbl: { color: Colors.textSecondary, fontWeight: '700' },
  sumVal: { color: Colors.white, fontWeight: '800' },
  sumTotalRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderColor: Colors.darkBorder, paddingTop: 20, marginTop: 10 },
  sumTotalLbl: { color: Colors.white, fontSize: 20, fontWeight: '900' },
  sumTotalVal: { color: Colors.primary, fontSize: 26, fontWeight: '900' },
  checkoutBtn: { backgroundColor: Colors.primary, height: 75, borderRadius: 38, marginTop: 35, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  checkoutBtnText: { color: Colors.white, fontSize: 20, fontWeight: '900', marginLeft: 12 },
  // Profile
  profileHeader: { height: 320, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0A' },
  profileAvatarContainer: { width: 170, height: 170, borderRadius: 85, borderWidth: 3, borderColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  profileAvatarLarge: { width: 145, height: 145, borderRadius: 72, borderWidth: 4, borderColor: Colors.gold },
  profileName: { color: Colors.white, fontSize: 28, fontWeight: '900' },
  profileEmail: { color: '#555', fontSize: 15, fontWeight: '700', marginTop: 4 },
  pointsContainer: { padding: 30, borderRadius: 30, alignItems: 'center', marginBottom: 40 },
  pointsVal: { color: Colors.white, fontSize: 48, fontWeight: '900' },
  tierLbl: { color: Colors.gold, fontSize: 12, fontWeight: '900', letterSpacing: 4, marginTop: 8 },
  profileLinks: { marginBottom: 30 },
  profileRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', padding: 20, borderRadius: 22, marginBottom: 18 },
  profileRowIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(127, 0, 255, 0.15)', justifyContent: 'center', alignItems: 'center' },
  profileRowText: { flex: 1, color: '#DDD', marginLeft: 18, fontSize: 17, fontWeight: '800' },
  brandingFooter: { textAlign: 'center', color: '#444', marginTop: 30, fontSize: 13, fontWeight: '900' },
  // Success
  successScreen: { flex: 1, backgroundColor: Colors.black, justifyContent: 'center', alignItems: 'center', padding: 40 },
  successCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: Colors.success, justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  successText: { color: Colors.white, fontSize: 32, fontWeight: '900', marginBottom: 15 },
  successSub: { color: '#777', fontSize: 16, textAlign: 'center', lineHeight: 24, marginBottom: 50 },
  successBtn: { backgroundColor: Colors.white, paddingHorizontal: 50, paddingVertical: 18, borderRadius: 35 },
  successBtnText: { color: Colors.black, fontSize: 18, fontWeight: '900' }
});
