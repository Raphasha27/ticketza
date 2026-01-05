import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, TextInput, SafeAreaView, ActivityIndicator, Dimensions, Platform, KeyboardAvoidingView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const API_BASE_URL = 'http://192.168.18.65:8000';

export default function App() {
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
        description: event.description || 'Welcome to the most anticipated show of the year. Experience world-class talent and production right here in Mzansi.',
      }));
      setEvents(formattedEvents);
      setError(null);
    } catch (err) {
      setError('Offline');
      setEvents([
        { id: 1, name: 'Coldplay: Music of the Spheres', venue: 'Wembley Stadium', date: 'Oct 26-28, 2026', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800', price: 1100, category: 'Music' },
        { id: 2, name: 'NBA Finals: Lakers vs Celtics', venue: 'Crypto.com Arena', date: 'Jun 14, 2026', image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=800', price: 2500, category: 'Sports' },
        { id: 3, name: 'The Lion King Musical', venue: 'Lyceum Theatre', date: 'Daily Show', image: 'https://images.unsplash.com/photo-1503095396549-80705a6207a2?w=800', price: 850, category: 'Musical' },
        { id: 4, name: 'Black Coffee H2O', venue: 'Wild Waters', date: 'Feb 15, 2026', image: 'https://images.unsplash.com/photo-1514525253361-bee8718a74a1?w=800', price: 450, category: 'Electronic' }
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

  const getTotalAmount = () => Object.entries(cart).reduce((total, [id, count]) => {
    const event = events.find(e => e.id === parseInt(id));
    return total + (event?.price || 0) * count;
  }, 0);

  const getTotalTicketsCount = () => Object.values(cart).reduce((a, b) => a + b, 0);

  // --- Nav Bar ---
  const NavigationBar = () => (
    <View style={styles.navContainer}>
      <View style={styles.navInner}>
        <NavButton screen="home" icon="home" label="Home" active={currentScreen === 'home'} />
        <NavButton screen="search" icon="search" label="Search" active={currentScreen === 'search'} />
        <NavButton screen="cart" icon="cart" label="Cart" active={currentScreen === 'cart'} badge={getTotalTicketsCount()} />
        <NavButton screen="profile" icon="person" label="Profile" active={currentScreen === 'profile'} />
      </View>
    </View>
  );

  const NavButton = ({ screen, icon, label, active, badge }) => (
    <TouchableOpacity style={styles.navBtn} onPress={() => setCurrentScreen(screen)}>
      <View>
        <Ionicons name={active ? icon : `${icon}-outline`} size={24} color={active ? "#7F00FF" : "#999"} />
        {badge > 0 && <View style={styles.cartBadgeSmall}><Text style={styles.cartBadgeTextSmall}>{badge}</Text></View>}
      </View>
      <Text style={[styles.navText, active && styles.navTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  // --- Screens ---

  const HomeScreen = () => (
    <View style={styles.screen}>
      <LinearGradient colors={['#A020F0', '#FF00FF']} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.homeHeader}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <Text style={styles.logoText}>Ticketza</Text>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.headerIcon} onPress={() => setCurrentScreen('search')}><Ionicons name="search" size={24} color="#fff" /></TouchableOpacity>
              <TouchableOpacity onPress={() => setCurrentScreen('profile')}><Image source={{ uri: userProfile.avatar }} style={styles.headerAvatar} /></TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.homeContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionHeading}>South Africa's Finest 🇿🇦</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color="#7F00FF" style={{ marginTop: 50 }} />
        ) : (
          events.map(event => (
            <TouchableOpacity key={event.id} style={styles.eventCardFull} onPress={() => { setSelectedEvent(event); setCurrentScreen('detail'); }}>
              <Image source={{ uri: event.image }} style={styles.eventCardImageFull} />
              <View style={styles.cardCategoryBadge}><Text style={styles.cardCategoryText}>{event.category}</Text></View>
              <View style={styles.eventCardBodyFull}>
                <Text style={styles.eventCardTitleFull}>{event.name}</Text>
                <View style={styles.eventCardMetaRow}>
                  <Text style={styles.eventCardLocFull}><Ionicons name="location-outline" size={14} /> {event.venue}</Text>
                  <Text style={styles.eventCardPriceFull}>R{event.price}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
        <View style={{ height: 150 }} />
      </ScrollView>
      <NavigationBar />
    </View>
  );

  const SearchScreen = () => (
    <View style={[styles.screen, { backgroundColor: '#121212' }]}>
      <SafeAreaView>
        <View style={styles.searchHeader}>
          <View style={styles.searchBarContainer}>
            <Ionicons name="search" size={20} color="#999" />
            <TextInput 
              placeholder="Artists, venues, or vibes..." 
              placeholderTextColor="#666" 
              style={styles.searchBarInput} 
              autoFocus={true}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity onPress={() => setCurrentScreen('home')}><Text style={{ color: '#7F00FF', fontWeight: '800' }}>Cancel</Text></TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView style={{ padding: 20 }}>
        <Text style={styles.searchSectionTitle}>Trending Today</Text>
        {['Jazz In Jozie', 'Soweto Derby', 'Cape Town Jazz', 'Amapiano Live'].map((trend, i) => (
          <TouchableOpacity key={i} style={styles.trendingRow}>
            <Ionicons name="trending-up" size={18} color="#7F00FF" />
            <Text style={styles.trendingText}>{trend}</Text>
          </TouchableOpacity>
        ))}
        <Text style={[styles.searchSectionTitle, { marginTop: 30 }]}>Categories</Text>
        <View style={styles.categoryGrid}>
          {['Music', 'Sports', 'Comedy', 'Theater', 'Festivals', 'Virtual'].map((cat, i) => (
            <TouchableOpacity key={i} style={styles.categoryGridItem}>
              <Text style={styles.categoryGridText}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <NavigationBar />
    </View>
  );

  const DetailScreen = () => (
    <View style={[styles.screen, { backgroundColor: '#000' }]}>
      <Image source={{ uri: selectedEvent?.image }} style={styles.detailHeroFull} />
      <SafeAreaView style={styles.detailBackContainer}>
        <TouchableOpacity style={styles.detailCircleBack} onPress={() => setCurrentScreen('home')}>
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>

      <View style={styles.detailBodyDark}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.detailNameFull}>{selectedEvent?.name}</Text>
          <View style={styles.detailMetaRowFull}>
            <Ionicons name="calendar-outline" size={20} color="#7F00FF" />
            <Text style={styles.detailMetaTextFull}>{selectedEvent?.date}</Text>
          </View>
          <View style={styles.detailMetaRowFull}>
            <Ionicons name="location-outline" size={20} color="#7F00FF" />
            <Text style={styles.detailMetaTextFull}>{selectedEvent?.venue}</Text>
          </View>
          <Text style={styles.detailAboutHeader}>Description</Text>
          <Text style={styles.detailAboutBody}>{selectedEvent?.description}</Text>
          <View style={{ height: 200 }} />
        </ScrollView>
      </View>

      <View style={styles.bottomPayBar}>
        <View style={styles.bottomPayInner}>
          <Text style={styles.bottomPrice}>R{selectedEvent?.price}</Text>
          <View style={styles.bottomQuantity}>
            <TouchableOpacity style={styles.bottomQBtn} onPress={() => updateCart(selectedEvent.id, -1)}><Ionicons name="remove" size={20} color="#fff" /></TouchableOpacity>
            <Text style={styles.bottomQText}>{cart[selectedEvent.id] || 0}</Text>
            <TouchableOpacity style={styles.bottomQBtn} onPress={() => updateCart(selectedEvent.id, 1)}><Ionicons name="add" size={20} color="#fff" /></TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.bottomBuyBtn} onPress={() => setCurrentScreen('cart')}>
            <Text style={styles.bottomBuyText}>Buy Tickets</Text>
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
      <View style={[styles.screen, { backgroundColor: '#121212' }]}>
        <SafeAreaView>
          <View style={styles.cartHeaderFull}>
            <TouchableOpacity onPress={() => setCurrentScreen('home')}><Ionicons name="chevron-back" size={24} color="#fff" /></TouchableOpacity>
            <Text style={styles.cartHeaderTitleFull}>Shopping Cart</Text>
            <Ionicons name="person-circle-outline" size={32} color="#fff" />
          </View>
        </SafeAreaView>

        <ScrollView style={styles.cartScrollFull}>
          {items.map(item => (
            <View key={item.event.id} style={styles.cartCardItem}>
              <Image source={{ uri: item.event.image }} style={styles.cartCardImg} />
              <View style={styles.cartCardInfo}>
                <Text style={styles.cartCardName}>{item.event.name}</Text>
                <Text style={styles.cartCardSub}>General Ticket • {item.event.date}</Text>
                <Text style={styles.cartCardPrice}>R{item.event.price}</Text>
              </View>
              <View style={styles.cartCardStepper}>
                <TouchableOpacity onPress={() => updateCart(item.event.id, -1)}><Ionicons name="remove-circle-outline" size={22} color="#666" /></TouchableOpacity>
                <Text style={styles.cartCardCount}>{item.count}</Text>
                <TouchableOpacity onPress={() => updateCart(item.event.id, 1)}><Ionicons name="add-circle-outline" size={22} color="#666" /></TouchableOpacity>
              </View>
            </View>
          ))}

          <Text style={styles.cartH2}>Receiving Method</Text>
          <View style={styles.methodFlexRow}>
            <TouchableOpacity style={[styles.selMethod, deliveryMethod === 'digital' && styles.selMethodActive]} onPress={() => setDeliveryMethod('digital')}>
              <Ionicons name="mail" size={32} color={deliveryMethod === 'digital' ? '#7F00FF' : '#555'} />
              <Text style={[styles.selText, deliveryMethod === 'digital' && styles.selTextActive]}>Email</Text>
              {deliveryMethod === 'digital' && <View style={styles.dotCheck} />}
            </TouchableOpacity>
            <TouchableOpacity style={[styles.selMethod, deliveryMethod === 'whatsapp' && styles.selMethodActive]} onPress={() => setDeliveryMethod('whatsapp')}>
              <Ionicons name="logo-whatsapp" size={32} color={deliveryMethod === 'whatsapp' ? '#25D366' : '#555'} />
              <Text style={[styles.selText, deliveryMethod === 'whatsapp' && styles.selTextActive]}>WhatsApp</Text>
              {deliveryMethod === 'whatsapp' && <View style={styles.dotCheck} />}
            </TouchableOpacity>
          </View>

          <View style={styles.cartTotals}>
            <View style={styles.totalRow}><Text style={styles.totalLbl}>Subtotal</Text><Text style={styles.totalVal}>R{getTotalAmount()}</Text></View>
            <View style={styles.totalRow}><Text style={styles.totalLbl}>Service Fee</Text><Text style={styles.totalVal}>R100</Text></View>
            <View style={styles.grandTotalLine}><Text style={styles.grandTotalLbl}>Total:</Text><Text style={styles.grandTotalVal}>R{getTotalAmount() + 100}</Text></View>
          </View>

          <TouchableOpacity style={styles.bigCheckoutBtn} onPress={() => setCurrentScreen('payment')}>
            <Ionicons name="lock-closed" size={20} color="#fff" />
            <Text style={styles.bigCheckoutTxt}>Secure Checkout</Text>
          </TouchableOpacity>
          <View style={{ height: 150 }} />
        </ScrollView>
        <NavigationBar />
      </View>
    );
  };

  const ProfileScreen = () => (
    <View style={[styles.screen, { backgroundColor: '#0A0A0A' }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.profileAvatarSection}>
          <View style={styles.avatarMainRing}>
            <Image source={{ uri: userProfile.avatar }} style={styles.avatarActual} />
          </View>
          <Text style={styles.profileNameTxt}>{userProfile.name}</Text>
          <Text style={styles.profileEmailTxt}>{userProfile.email}</Text>
        </View>

        <ScrollView style={styles.profileScrollBody}>
          <LinearGradient colors={['#222', '#111']} style={styles.loyaltyCard}>
            <Text style={styles.pointsLarge}>{userProfile.loyaltyPoints} pts</Text>
            <Text style={styles.tierName}>GOLD LOYALTY TIER</Text>
          </LinearGradient>

          <View style={styles.accountLinks}>
            <AccountRow icon="ticket-outline" label="My Bookings" />
            <AccountRow icon="card-outline" label="Payment Data" />
            <AccountRow icon="settings-outline" label="Preferences" />
            <AccountRow icon="help-buoy-outline" label="Live Support" />
          </View>
          <Text style={{ textAlign: 'center', color: '#444', marginTop: 30, fontSize: 13, fontWeight: '900' }}>Kid Of Dynamic 🇿🇦</Text>
          <View style={{ height: 150 }} />
        </ScrollView>
        <NavigationBar />
      </SafeAreaView>
    </View>
  );

  const AccountRow = ({ icon, label }) => (
    <TouchableOpacity style={styles.accRow}>
      <View style={styles.accIconBox}><Ionicons name={icon} size={22} color="#7F00FF" /></View>
      <Text style={styles.accLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color="#222" />
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      {currentScreen === 'home' && <HomeScreen />}
      {currentScreen === 'search' && <SearchScreen />}
      {currentScreen === 'detail' && <DetailScreen />}
      {currentScreen === 'cart' && <CartScreen />}
      {currentScreen === 'profile' && <ProfileScreen />}
      {currentScreen === 'payment' && (
        <View style={styles.successScreen}>
          <View style={styles.successCircle}><Ionicons name="checkmark" size={60} color="#fff" /></View>
          <Text style={styles.successH1}>Success!</Text>
          <Text style={styles.successSub}>Your tickets are ready in your wallet.</Text>
          <TouchableOpacity style={styles.successBtn} onPress={() => {setCart({}); setCurrentScreen('home');}}><Text style={styles.successBtnTxt}>Finish</Text></TouchableOpacity>
        </View>
      )}
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8F9FF' },
  homeHeader: { paddingBottom: 20 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingTop: 10 },
  logoText: { fontSize: 30, fontWeight: '900', color: '#fff', letterSpacing: -1 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  headerIcon: { marginRight: 20 },
  headerAvatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' },
  homeContent: { flex: 1, padding: 25 },
  sectionHeading: { fontSize: 24, fontWeight: '900', color: '#1A1A1A', marginBottom: 25 },
  eventCardFull: { backgroundColor: '#fff', borderRadius: 28, marginBottom: 30, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20, elevation: 8, overflow: 'hidden' },
  eventCardImageFull: { width: '100%', height: 220 },
  cardCategoryBadge: { position: 'absolute', top: 18, right: 18, backgroundColor: 'rgba(255,255,255,0.95)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  cardCategoryText: { color: '#7F00FF', fontSize: 12, fontWeight: '900' },
  eventCardBodyFull: { padding: 20 },
  eventCardTitleFull: { fontSize: 20, fontWeight: '900', color: '#1A1A1A', marginBottom: 8 },
  eventCardMetaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eventCardLocFull: { fontSize: 14, color: '#666', fontWeight: '500' },
  eventCardPriceFull: { fontSize: 22, fontWeight: '900', color: '#7F00FF' },
  navContainer: { position: 'absolute', bottom: 70, left: 25, right: 25 },
  navInner: { flexDirection: 'row', backgroundColor: '#fff', height: 75, borderRadius: 38, elevation: 25, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 20, paddingHorizontal: 25 },
  navBtn: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  navText: { fontSize: 11, color: '#999', marginTop: 4, fontWeight: '800' },
  navTextActive: { color: '#7F00FF' },
  cartBadgeSmall: { position: 'absolute', top: -5, right: -12, backgroundColor: '#FF3B30', width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
  cartBadgeTextSmall: { color: '#fff', fontSize: 9, fontWeight: '900' },
  detailHeroFull: { width: '100%', height: height * 0.5 },
  detailBackContainer: { position: 'absolute', top: 0, left: 25 },
  detailCircleBack: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  detailBodyDark: { flex: 1, backgroundColor: '#000', borderTopLeftRadius: 35, borderTopRightRadius: 35, marginTop: -35, padding: 30 },
  detailNameFull: { color: '#fff', fontSize: 32, fontWeight: '900', marginBottom: 25 },
  detailMetaRowFull: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  detailMetaTextFull: { color: '#fff', marginLeft: 12, fontSize: 16, fontWeight: '600' },
  detailAboutHeader: { color: '#7F00FF', fontSize: 18, fontWeight: '900', marginTop: 25, marginBottom: 15 },
  detailAboutBody: { color: '#BBB', fontSize: 16, lineHeight: 26 },
  bottomPayBar: { position: 'absolute', bottom: 30, left: 25, right: 25 },
  bottomPayInner: { backgroundColor: '#7F00FF', height: 80, borderRadius: 40, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 25 },
  bottomPrice: { color: '#fff', fontSize: 26, fontWeight: '900', flex: 1 },
  bottomQuantity: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 22, padding: 5, marginRight: 20 },
  bottomQBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  bottomQText: { color: '#fff', paddingHorizontal: 15, fontWeight: '900', fontSize: 18 },
  bottomBuyBtn: { backgroundColor: '#fff', paddingHorizontal: 22, paddingVertical: 14, borderRadius: 28 },
  bottomBuyText: { color: '#7F00FF', fontWeight: '900', fontSize: 15 },
  searchHeader: { flexDirection: 'row', alignItems: 'center', padding: 25, paddingTop: 10 },
  searchBarContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#222', borderRadius: 16, height: 55, paddingHorizontal: 15, marginRight: 15 },
  searchBarInput: { flex: 1, marginLeft: 12, color: '#fff', fontSize: 16, fontWeight: '600' },
  searchSectionTitle: { color: '#fff', fontSize: 20, fontWeight: '900', marginBottom: 20 },
  trendingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  trendingText: { color: '#DDD', marginLeft: 12, fontSize: 16, fontWeight: '600' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  categoryGridItem: { width: '48%', backgroundColor: '#222', padding: 20, borderRadius: 18, marginBottom: 15, alignItems: 'center' },
  categoryGridText: { color: '#fff', fontWeight: '800' },
  cartHeaderFull: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 25, paddingTop: 10 },
  cartHeaderTitleFull: { color: '#fff', fontSize: 24, fontWeight: '900' },
  cartScrollFull: { paddingHorizontal: 25 },
  cartCardItem: { flexDirection: 'row', backgroundColor: '#1E1E1E', padding: 15, borderRadius: 24, marginBottom: 20 },
  cartCardImg: { width: 85, height: 85, borderRadius: 18 },
  cartCardInfo: { flex: 1, marginLeft: 18, justifyContent: 'center' },
  cartCardName: { color: '#fff', fontSize: 18, fontWeight: '900' },
  cartCardSub: { color: '#777', fontSize: 12, marginTop: 4 },
  cartCardPrice: { color: '#fff', fontSize: 16, fontWeight: '800', marginTop: 8 },
  cartCardStepper: { alignItems: 'center', justifyContent: 'center', marginLeft: 10 },
  cartCardCount: { color: '#fff', marginVertical: 6, fontWeight: '900', fontSize: 16 },
  cartH2: { color: '#fff', fontSize: 20, fontWeight: '900', marginTop: 25, marginBottom: 20 },
  methodFlexRow: { flexDirection: 'row', justifyContent: 'space-between' },
  selMethod: { flex: 1, backgroundColor: '#1E1E1E', borderRadius: 24, padding: 20, alignItems: 'center', marginHorizontal: 6, position: 'relative', borderWidth: 2, borderColor: 'transparent' },
  selMethodActive: { borderColor: '#7F00FF' },
  selText: { color: '#666', fontWeight: '900', marginTop: 12, fontSize: 14 },
  selTextActive: { color: '#fff' },
  dotCheck: { position: 'absolute', top: 12, right: 12, width: 10, height: 10, borderRadius: 5, backgroundColor: '#7F00FF' },
  cartTotals: { marginTop: 35, backgroundColor: '#1E1E1E', padding: 25, borderRadius: 28 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  totalLbl: { color: '#999', fontWeight: '700' },
  totalVal: { color: '#fff', fontWeight: '800' },
  grandTotalLine: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderColor: '#333', paddingTop: 20, marginTop: 10 },
  grandTotalLbl: { color: '#fff', fontSize: 20, fontWeight: '900' },
  grandTotalVal: { color: '#7F00FF', fontSize: 26, fontWeight: '900' },
  bigCheckoutBtn: { backgroundColor: '#7F00FF', height: 75, borderRadius: 38, marginTop: 35, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  bigCheckoutTxt: { color: '#fff', fontSize: 20, fontWeight: '900', marginLeft: 12 },
  profileAvatarSection: { height: 320, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0A' },
  avatarMainRing: { width: 170, height: 170, borderRadius: 85, borderWidth: 3, borderColor: '#7F00FF', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  avatarActual: { width: 145, height: 145, borderRadius: 72, borderWidth: 4, borderColor: '#FFD700' },
  profileNameTxt: { color: '#fff', fontSize: 28, fontWeight: '900' },
  profileEmailTxt: { color: '#555', fontSize: 15, fontWeight: '700', marginTop: 4 },
  profileScrollBody: { flex: 1, paddingHorizontal: 25 },
  loyaltyCard: { padding: 30, borderRadius: 30, alignItems: 'center', marginBottom: 40 },
  pointsLarge: { color: '#fff', fontSize: 48, fontWeight: '900' },
  tierName: { color: '#FFD700', fontSize: 12, fontWeight: '900', letterSpacing: 4, marginTop: 8 },
  accountLinks: { marginBottom: 30 },
  accRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', padding: 20, borderRadius: 22, marginBottom: 18 },
  accIconBox: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(127, 0, 255, 0.15)', justifyContent: 'center', alignItems: 'center' },
  accLabel: { flex: 1, color: '#DDD', marginLeft: 18, fontSize: 17, fontWeight: '800' },
  successScreen: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', padding: 40 },
  successCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#00C853', justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  successH1: { color: '#fff', fontSize: 32, fontWeight: '900', marginBottom: 15 },
  successSub: { color: '#777', fontSize: 16, textAlign: 'center', lineHeight: 24, marginBottom: 50 },
  successBtn: { backgroundColor: '#fff', paddingHorizontal: 50, paddingVertical: 18, borderRadius: 35 },
  successBtnTxt: { color: '#000', fontSize: 18, fontWeight: '900' }
});
