import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, TextInput, SafeAreaView, ActivityIndicator, Dimensions, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Organized Imports - Using absolute paths for logic but relative in code for Expo
import { Colors, Spacing, Shadows } from './src/constants/theme';
import { FALLBACK_EVENTS } from './src/data/fallback';

const { width, height } = Dimensions.get('window');
const API_BASE_URL = 'http://192.168.18.65:8000';

export default function App() {
  // --- State ---
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

  useEffect(() => {
    fetchEvents();
  }, []);

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
        description: event.description || 'Join thousands of fans for this spectacular live experience in the heart of Mzansi.',
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

  const cartTickets = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = Object.entries(cart).reduce((total, [id, count]) => {
    const event = events.find(e => e.id === parseInt(id));
    return total + (event?.price || 0) * count;
  }, 0);

  // --- Components ---

  const NavigationBar = () => (
    <View style={styles.navContainer}>
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentScreen('home')}>
          <Ionicons name={currentScreen === 'home' ? "home" : "home-outline"} size={26} color={currentScreen === 'home' ? Colors.primary : Colors.textMuted} />
          <Text style={[styles.navText, currentScreen === 'home' && styles.navTextActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentScreen('search')}>
          <Ionicons name={currentScreen === 'search' ? "search" : "search-outline"} size={26} color={currentScreen === 'search' ? Colors.primary : Colors.textMuted} />
          <Text style={[styles.navText, currentScreen === 'search' && styles.navTextActive]}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentScreen('cart')}>
          <View>
            <Ionicons name={currentScreen === 'cart' ? "cart" : "cart-outline"} size={26} color={currentScreen === 'cart' ? Colors.primary : Colors.textMuted} />
            {cartTickets > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{cartTickets}</Text></View>}
          </View>
          <Text style={[styles.navText, currentScreen === 'cart' && styles.navTextActive]}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentScreen('profile')}>
          <Ionicons name={currentScreen === 'profile' ? "person" : "person-outline"} size={26} color={currentScreen === 'profile' ? Colors.primary : Colors.textMuted} />
          <Text style={[styles.navText, currentScreen === 'profile' && styles.navTextActive]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // --- Screens ---

  const HomeScreen = () => (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.accent, Colors.secondary]} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerTop}>
            <Text style={styles.headerLogo}>Ticketza</Text>
            <View style={styles.headerIcons}>
              <TouchableOpacity onPress={() => setCurrentScreen('search')} style={styles.headerIconBtn}><Ionicons name="search" size={24} color="#fff" /></TouchableOpacity>
              <TouchableOpacity onPress={() => setCurrentScreen('profile')}><Image source={{ uri: userProfile.avatar }} style={styles.headerAvatar} /></TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.contentTitle}>South Africa's Finest 🇿🇦</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
        ) : (
          events.map(event => (
            <TouchableOpacity key={event.id} style={styles.card} onPress={() => { setSelectedEvent(event); setCurrentScreen('detail'); }}>
              <View style={styles.cardHeader}>
                 <Image source={{ uri: event.image }} style={styles.cardImg} resizeMode="cover" />
                 <View style={styles.cardLabel}><Text style={styles.cardLabelText}>{event.category}</Text></View>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardName}>{event.name}</Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardLoc} numberOfLines={1}><Ionicons name="location" size={12} color={Colors.primary} /> {event.venue}</Text>
                  <Text style={styles.cardPrice}>R{event.price}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
        <View style={{ height: 180 }} />
      </ScrollView>
      <NavigationBar />
    </View>
  );

  const DetailScreen = () => (
    <View style={[styles.container, { backgroundColor: '#000' }]}>
      <Image source={{ uri: selectedEvent?.image }} style={styles.detailHero} />
      <SafeAreaView style={styles.detailBackBox}>
        <TouchableOpacity style={styles.detailBackBtn} onPress={() => setCurrentScreen('home')}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView style={styles.detailSheet} showsVerticalScrollIndicator={false}>
          <Text style={styles.detailTitle}>{selectedEvent?.name}</Text>
          <View style={styles.detailMeta}><Ionicons name="calendar-outline" size={20} color={Colors.primary} /><Text style={styles.detailMetaText}>{selectedEvent?.date}</Text></View>
          <View style={styles.detailMeta}><Ionicons name="location-outline" size={20} color={Colors.primary} /><Text style={styles.detailMetaText}>{selectedEvent?.venue}</Text></View>
          <Text style={styles.detailAboutHeader}>Description</Text>
          <Text style={styles.detailAboutBody}>{selectedEvent?.description}</Text>
          <View style={{ height: 200 }} />
      </ScrollView>

      <View style={styles.detailPayBar}>
        <View style={styles.payBarInner}>
          <Text style={styles.payBarPrice}>R{selectedEvent?.price}</Text>
          <View style={styles.payBarStepper}>
            <TouchableOpacity onPress={() => updateCart(selectedEvent.id, -1)}><Ionicons name="remove" size={20} color="#fff" /></TouchableOpacity>
            <Text style={styles.payBarCount}>{cart[selectedEvent.id] || 0}</Text>
            <TouchableOpacity onPress={() => updateCart(selectedEvent.id, 1)}><Ionicons name="add" size={20} color="#fff" /></TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.payBarAction} onPress={() => setCurrentScreen('cart')}>
            <Text style={styles.payBarActionText}>Get Tickets</Text>
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
      <View style={[styles.container, { backgroundColor: Colors.darkBg }]}>
        <SafeAreaView>
          <View style={styles.pageHeader}>
            <TouchableOpacity onPress={() => setCurrentScreen('home')}><Ionicons name="chevron-back" size={24} color="#fff" /></TouchableOpacity>
            <Text style={styles.pageHeaderTitle}>Shopping Cart</Text>
            <Ionicons name="person-circle-outline" size={30} color="#fff" />
          </View>
        </SafeAreaView>

        <ScrollView style={styles.pageContent}>
          {items.map(item => (
            <View key={item.event.id} style={styles.itemCard}>
              <Image source={{ uri: item.event.image }} style={styles.itemImg} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.event.name}</Text>
                <Text style={styles.itemMeta}>General Admission • {item.event.date}</Text>
                <Text style={styles.itemPrice}>R{item.event.price}</Text>
              </View>
              <View style={styles.itemStepper}>
                <TouchableOpacity onPress={() => updateCart(item.event.id, -1)}><Ionicons name="remove-circle-outline" size={24} color="#666" /></TouchableOpacity>
                <Text style={styles.itemCount}>{item.count}</Text>
                <TouchableOpacity onPress={() => updateCart(item.event.id, 1)}><Ionicons name="add-circle-outline" size={24} color="#666" /></TouchableOpacity>
              </View>
            </View>
          ))}

          <Text style={styles.categoryTitle}>Receiving Method</Text>
          <View style={styles.methodRow}>
            <TouchableOpacity style={[styles.methodBtn, deliveryMethod === 'digital' && styles.methodBtnActive]} onPress={() => setDeliveryMethod('digital')}>
              <Ionicons name="mail" size={32} color={deliveryMethod === 'digital' ? Colors.primary : "#555"} />
              <Text style={[styles.methodText, deliveryMethod === 'digital' && styles.methodTextActive]}>Email</Text>
              {deliveryMethod === 'digital' && <View style={styles.methodDot} />}
            </TouchableOpacity>
            <TouchableOpacity style={[styles.methodBtn, deliveryMethod === 'whatsapp' && styles.methodBtnActive]} onPress={() => setDeliveryMethod('whatsapp')}>
              <Ionicons name="logo-whatsapp" size={32} color={deliveryMethod === 'whatsapp' ? Colors.whatsapp : "#555"} />
              <Text style={[styles.methodText, deliveryMethod === 'whatsapp' && styles.methodTextActive]}>WhatsApp</Text>
              {deliveryMethod === 'whatsapp' && <View style={styles.methodDot} />}
            </TouchableOpacity>
          </View>

          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Subtotal</Text><Text style={styles.summaryValue}>R{cartTotal}</Text></View>
            <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Service Fee</Text><Text style={styles.summaryValue}>R100</Text></View>
            <View style={styles.summaryTotal}><Text style={styles.summaryTotalLabel}>Total:</Text><Text style={styles.summaryTotalValue}>R{cartTotal + 100}</Text></View>
          </View>

          <TouchableOpacity style={styles.confirmBtn} onPress={() => setCurrentScreen('payment')}>
            <Ionicons name="lock-closed" size={20} color="#fff" />
            <Text style={styles.confirmBtnText}>Secure Checkout</Text>
          </TouchableOpacity>
          <View style={{ height: 160 }} />
        </ScrollView>
        <NavigationBar />
      </View>
    );
  };

  const ProfileScreen = () => (
    <View style={[styles.container, { backgroundColor: '#050505' }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.profileTop}>
          <View style={styles.profileAvatarFrame}>
            <Image source={{ uri: userProfile.avatar }} style={styles.profileAvatarImg} />
          </View>
          <Text style={styles.profileNameTxt}>{userProfile.name}</Text>
          <Text style={styles.profileEmailTxt}>{userProfile.email}</Text>
        </View>

        <ScrollView style={styles.profileList}>
          <LinearGradient colors={['#222', '#111']} style={styles.loyaltySheet}>
            <Text style={styles.pointsNum}>{userProfile.loyaltyPoints} pts</Text>
            <Text style={styles.tierName}>GOLD LOYALTY TIER</Text>
          </LinearGradient>

          <View style={styles.linksBox}>
            {['My Bookings', 'Payment Data', 'Preferences', 'Live Support'].map((link, i) => (
              <TouchableOpacity key={i} style={styles.linkLine}>
                <View style={styles.linkIcon}><Ionicons name="ticket-outline" size={22} color={Colors.primary} /></View>
                <Text style={styles.linkText}>{link}</Text>
                <Ionicons name="chevron-forward" size={18} color="#222" />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.creditText}>Kid Of Dynamic 🇿🇦</Text>
          <View style={{ height: 160 }} />
        </ScrollView>
        <NavigationBar />
      </SafeAreaView>
    </View>
  );

  const SearchScreen = () => (
    <View style={[styles.container, { backgroundColor: Colors.darkBg }]}>
      <SafeAreaView>
        <View style={styles.searchHead}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={Colors.textMuted} />
            <TextInput 
              placeholder="Artists, venues, vibes..." 
              placeholderTextColor="#555" 
              style={styles.searchField} 
              autoFocus
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity onPress={() => setCurrentScreen('home')}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.padding20}>
        <Text style={styles.h2White}>Trending Searches</Text>
        {['Jazz In Jozie', 'Soweto Derby', 'Black Coffee', 'Amapiano Kings'].map((item, i) => (
          <TouchableOpacity key={i} style={styles.trendItem}>
            <Ionicons name="trending-up" size={18} color={Colors.primary} />
            <Text style={styles.trendLabel}>{item}</Text>
          </TouchableOpacity>
        ))}
        <Text style={[styles.h2White, { marginTop: 30 }]}>Categories</Text>
        <View style={styles.catWrap}>
          {['Music', 'Sports', 'Comedy', 'Arts', 'Festivals', 'Virtual'].map((c, i) => (
            <TouchableOpacity key={i} style={styles.catBox}><Text style={styles.catBoxText}>{c}</Text></TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <NavigationBar />
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {currentScreen === 'home' && <HomeScreen />}
      {currentScreen === 'search' && <SearchScreen />}
      {currentScreen === 'detail' && <DetailScreen />}
      {currentScreen === 'cart' && <CartScreen />}
      {currentScreen === 'profile' && <ProfileScreen />}
      {currentScreen === 'payment' && (
        <View style={styles.successBox}>
          <View style={styles.successDot}><Ionicons name="checkmark" size={60} color="#fff" /></View>
          <Text style={styles.successTitle}>Done!</Text>
          <Text style={styles.successSub}>Your tickets are in your wallet.</Text>
          <TouchableOpacity style={styles.successBtn} onPress={() => {setCart({}); setCurrentScreen('home');}}><Text style={styles.successBtnTxt}>Finish</Text></TouchableOpacity>
        </View>
      )}
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.lightBg },
  header: { paddingBottom: 20 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight + 10 : 10 },
  headerLogo: { fontSize: 32, fontWeight: '900', color: '#fff', letterSpacing: -1.5 },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  headerIconBtn: { marginRight: 20 },
  headerAvatar: { width: 42, height: 42, borderRadius: 21, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' },
  content: { flex: 1, paddingHorizontal: 25 },
  contentTitle: { fontSize: 24, fontWeight: '900', color: Colors.textMain, marginVertical: 25 },
  loader: { marginTop: 50 },
  card: { backgroundColor: '#fff', borderRadius: 28, marginBottom: 30, ...Shadows.light, overflow: 'hidden' },
  cardHeader: { position: 'relative' },
  cardImg: { width: '100%', height: 240 },
  cardLabel: { position: 'absolute', top: 15, right: 15, backgroundColor: 'rgba(255,255,255,0.95)', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 12 },
  cardLabelText: { color: Colors.primary, fontSize: 13, fontWeight: '900' },
  cardBody: { padding: 20 },
  cardName: { fontSize: 22, fontWeight: '900', color: Colors.textMain, marginBottom: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  cardLoc: { fontSize: 14, color: Colors.textSecondary, flex: 1, marginRight: 10 },
  cardPrice: { fontSize: 24, fontWeight: '900', color: Colors.primary },
  navContainer: { position: 'absolute', bottom: 40, left: 25, right: 25 },
  navBar: { flexDirection: 'row', backgroundColor: '#fff', height: 80, borderRadius: 40, ...Shadows.medium, paddingHorizontal: 25 },
  navItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  navText: { fontSize: 11, color: Colors.textMuted, marginTop: 4, fontWeight: '800' },
  navTextActive: { color: Colors.primary },
  badge: { position: 'absolute', top: -5, right: -12, backgroundColor: Colors.red, width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  detailHero: { width: '100%', height: height * 0.5 },
  detailBackBox: { position: 'absolute', top: 0, left: 25 },
  detailBackBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', marginTop: 15 },
  detailSheet: { flex: 1, backgroundColor: '#000', borderTopLeftRadius: 40, borderTopRightRadius: 40, marginTop: -40, padding: 30 },
  detailTitle: { color: '#fff', fontSize: 34, fontWeight: '900', marginBottom: 25, lineHeight: 40 },
  detailMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  detailMetaText: { color: '#fff', marginLeft: 15, fontSize: 17, fontWeight: '600' },
  detailAboutHeader: { color: Colors.primary, fontSize: 20, fontWeight: '900', marginTop: 30, marginBottom: 15 },
  detailAboutBody: { color: '#BBB', fontSize: 16, lineHeight: 28 },
  detailPayBar: { position: 'absolute', bottom: 30, left: 25, right: 25 },
  payBarInner: { backgroundColor: Colors.primary, height: 85, borderRadius: 42, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 25, ...Shadows.primary },
  payBarPrice: { color: '#fff', fontSize: 28, fontWeight: '900', flex: 1 },
  payBarStepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 25, padding: 6, marginRight: 20 },
  payBarCount: { color: '#fff', paddingHorizontal: 16, fontWeight: '900', fontSize: 20 },
  payBarAction: { backgroundColor: '#fff', paddingHorizontal: 24, paddingVertical: 15, borderRadius: 30 },
  payBarActionText: { color: Colors.primary, fontWeight: '900', fontSize: 16 },
  pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingBottom: 15, paddingTop: 10 },
  pageHeaderTitle: { color: '#fff', fontSize: 26, fontWeight: '900' },
  pageContent: { flex: 1, paddingHorizontal: 25 },
  itemCard: { flexDirection: 'row', backgroundColor: '#1A1A1A', padding: 18, borderRadius: 28, marginBottom: 20 },
  itemImg: { width: 90, height: 90, borderRadius: 18 },
  itemInfo: { flex: 1, marginLeft: 20, justifyContent: 'center' },
  itemName: { color: '#fff', fontSize: 18, fontWeight: '900' },
  itemMeta: { color: '#666', fontSize: 12, marginTop: 4 },
  itemPrice: { color: '#fff', fontSize: 17, fontWeight: '800', marginTop: 8 },
  itemStepper: { alignItems: 'center', justifyContent: 'center', marginLeft: 10 },
  itemCount: { color: '#fff', marginVertical: 8, fontWeight: '900', fontSize: 18 },
  categoryTitle: { color: '#fff', fontSize: 22, fontWeight: '900', marginTop: 25, marginBottom: 20 },
  methodRow: { flexDirection: 'row', justifyContent: 'space-between' },
  methodBtn: { flex: 1, backgroundColor: '#1A1A1A', borderRadius: 28, padding: 25, alignItems: 'center', marginHorizontal: 7, position: 'relative', borderWidth: 2, borderColor: 'transparent' },
  methodBtnActive: { borderColor: Colors.primary },
  methodText: { color: '#666', fontWeight: '900', marginTop: 15, fontSize: 15 },
  methodTextActive: { color: '#fff' },
  methodDot: { position: 'absolute', top: 15, right: 15, width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.primary },
  summaryBox: { marginTop: 40, backgroundColor: '#1A1A1A', padding: 30, borderRadius: 30 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  summaryLabel: { color: '#888', fontWeight: '700' },
  summaryValue: { color: '#fff', fontWeight: '800' },
  summaryTotal: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderColor: '#333', paddingTop: 25, marginTop: 10 },
  summaryTotalLabel: { color: '#fff', fontSize: 22, fontWeight: '900' },
  summaryTotalValue: { color: Colors.primary, fontSize: 28, fontWeight: '900' },
  confirmBtn: { backgroundColor: Colors.primary, height: 85, borderRadius: 42, marginTop: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', ...Shadows.primary },
  confirmBtnText: { color: '#fff', fontSize: 22, fontWeight: '900', marginLeft: 15 },
  profileTop: { height: 350, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' },
  profileAvatarFrame: { width: 180, height: 180, borderRadius: 90, borderWidth: 4, borderColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 25 },
  profileAvatarImg: { width: 155, height: 155, borderRadius: 77, borderWidth: 5, borderColor: Colors.gold },
  profileNameTxt: { color: '#fff', fontSize: 30, fontWeight: '900' },
  profileEmailTxt: { color: '#666', fontSize: 16, fontWeight: '700', marginTop: 6 },
  profileList: { flex: 1, paddingHorizontal: 25 },
  loyaltySheet: { padding: 35, borderRadius: 35, alignItems: 'center', marginBottom: 45 },
  pointsNum: { color: '#fff', fontSize: 52, fontWeight: '900' },
  tierName: { color: Colors.gold, fontSize: 13, fontWeight: '900', letterSpacing: 4, marginTop: 10 },
  linksBox: { marginBottom: 40 },
  linkLine: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', padding: 22, borderRadius: 25, marginBottom: 20 },
  linkIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(127, 0, 255, 0.12)', justifyContent: 'center', alignItems: 'center' },
  linkText: { flex: 1, color: '#DDD', marginLeft: 20, fontSize: 18, fontWeight: '800' },
  creditText: { textAlign: 'center', color: '#333', marginTop: 20, fontSize: 14, fontWeight: '900' },
  searchHead: { flexDirection: 'row', alignItems: 'center', padding: 25, paddingTop: 15 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1A', borderRadius: 20, height: 60, paddingHorizontal: 20, marginRight: 20 },
  searchField: { flex: 1, marginLeft: 15, color: '#fff', fontSize: 17, fontWeight: '600' },
  cancelText: { color: Colors.primary, fontWeight: '900', fontSize: 16 },
  h2White: { color: '#fff', fontSize: 22, fontWeight: '900', marginBottom: 25 },
  trendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 22 },
  trendLabel: { color: '#DDD', marginLeft: 15, fontSize: 17, fontWeight: '600' },
  catWrap: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  catBox: { width: '48%', backgroundColor: '#1A1A1A', padding: 22, borderRadius: 22, marginBottom: 18, alignItems: 'center' },
  catBoxText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  successBox: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', padding: 40 },
  successDot: { width: 130, height: 130, borderRadius: 65, backgroundColor: Colors.success, justifyContent: 'center', alignItems: 'center', marginBottom: 40 },
  successTitle: { color: '#fff', fontSize: 36, fontWeight: '900', marginBottom: 20 },
  successSub: { color: '#666', fontSize: 18, textAlign: 'center', lineHeight: 28, marginBottom: 60 },
  successBtn: { backgroundColor: '#fff', paddingHorizontal: 60, paddingVertical: 20, borderRadius: 40 },
  successBtnTxt: { color: '#000', fontSize: 20, fontWeight: '900' },
  padding20: { padding: 25 }
});
