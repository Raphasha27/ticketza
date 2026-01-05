import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, TextInput, SafeAreaView, ActivityIndicator, FlatList, Dimensions, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const API_BASE_URL = 'http://192.168.18.65:8000';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [cart, setCart] = useState({});
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Profile data
  const [userProfile] = useState({
    name: "Raphasha",
    email: "raphasha@ticketza.co.za",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400",
    loyaltyPoints: 1250,
    upcomingTickets: 2
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
        time: event.date ? (event.date.split('T')[1]?.substring(0, 5) || '19:00') : '19:00',
        venue: event.venue ? `${event.venue.name}, ${event.venue.city}` : 'FNB Stadium, JHB',
        image: event.image_url || `https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&sig=${event.id}`,
        price: 350,
        category: 'Live Concert',
        description: event.description || 'Join thousands of fans for this spectacular live experience in the heart of South Africa.',
        organizer: 'Ticketza Premium'
      }));
      setEvents(formattedEvents);
      setError(null);
    } catch (err) {
      console.log('Using fallback data');
      setError('Mode: Offline');
      setEvents([
        { id: 1, name: 'Soweto Derby: Chiefs vs Pirates', date: '2026-02-15', time: '15:30', venue: 'FNB Stadium, Johannesburg', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800', price: 150, category: 'Sports', description: 'Experience the Calabash roaring with the biggest rivalry in African football.', organizer: 'PSL Official' },
        { id: 2, name: 'Black Coffee @ H2O', date: '2026-03-20', time: '14:00', venue: 'Wild Waters, Boksburg', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800', price: 450, category: 'Music', description: 'Grammy winner Black Coffee brings his global tour back home.', organizer: 'H2O SA' },
        { id: 3, name: 'Trevor Noah Live', date: '2026-04-05', time: '20:00', venue: 'SunBet Arena, Pretoria', image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800', price: 350, category: 'Comedy', description: 'The son of Patricia returns home for a night of world-class comedy.', organizer: 'Savanna Laughter' }
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

  const getCartItems = () => {
    return Object.entries(cart).map(([eventId, count]) => ({
      event: events.find(e => e.id === parseInt(eventId)),
      count
    })).filter(item => item.event);
  };

  const getTotalAmount = () => {
    return getCartItems().reduce((total, item) => total + (item.event.price * item.count), 0);
  };

  const getTotalTicketsCount = () => {
    return Object.values(cart).reduce((a, b) => a + b, 0);
  };

  // --- Components ---

  const NavItem = ({ screen, icon, label }) => {
    const isActive = currentScreen === screen;
    return (
      <TouchableOpacity style={styles.navItem} onPress={() => setCurrentScreen(screen)}>
        <Ionicons name={isActive ? icon : `${icon}-outline`} size={24} color={isActive ? "#7F00FF" : "#666"} />
        <Text style={[styles.navText, isActive && styles.navTextActive]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  const NavigationBar = () => (
    <View style={styles.navBarWrapper}>
      <View style={styles.navBar}>
        <NavItem screen="home" icon="home" label="Explore" />
        <NavItem screen="cart" icon="cart" label="Cart" />
        <NavItem screen="profile" icon="person" label="Profile" />
      </View>
      {getTotalTicketsCount() > 0 && currentScreen !== 'cart' && (
        <View style={styles.cartBadge}>
          <Text style={styles.cartBadgeText}>{getTotalTicketsCount()}</Text>
        </View>
      )}
    </View>
  );

  // --- Screens ---

  const HomeScreen = () => (
    <SafeAreaView style={styles.safeContainer}>
      <LinearGradient colors={['#7F00FF', '#E100FF']} style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Ticketza 🇿🇦</Text>
          <TouchableOpacity onPress={() => setCurrentScreen('profile')}>
            <Image source={{ uri: userProfile.avatar }} style={styles.smallAvatar} />
          </TouchableOpacity>
        </View>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#999" />
          <TextInput placeholder="Find your next vibe..." style={styles.searchInput} placeholderTextColor="#999" />
        </View>
      </LinearGradient>

      {isLoading ? (
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color="#7F00FF" />
          <Text style={styles.loadingMsg}>Fetching the hottest events...</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {error && <View style={styles.offlineBanner}><Text style={styles.offlineText}>🌍 Using Cached Content</Text></View>}
          
          <Text style={styles.screenSectionTitle}>South Africa's Finest</Text>
          {events.map(event => (
            <TouchableOpacity key={event.id} style={styles.eventCard} onPress={() => { setSelectedEvent(event); setCurrentScreen('detail'); }}>
              <Image source={{ uri: event.image }} style={styles.eventCardImage} />
              <View style={styles.eventCardOverlay}>
                <View style={styles.eventCategoryBadge}><Text style={styles.eventCategoryText}>{event.category}</Text></View>
              </View>
              <View style={styles.eventCardInfo}>
                <Text style={styles.eventCardName} numberOfLines={1}>{event.name}</Text>
                <Text style={styles.eventCardMeta}>📅 {event.date} • 📍 {event.venue}</Text>
                <View style={styles.eventCardFooter}>
                  <Text style={styles.eventCardPrice}>R{event.price}</Text>
                  <View style={styles.bookBtn}><Text style={styles.bookBtnText}>Book Now</Text></View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          <View style={{ height: 100 }} />
        </ScrollView>
      )}
      <NavigationBar />
    </SafeAreaView>
  );

  const DetailScreen = () => (
    <View style={styles.safeContainer}>
      <ScrollView bounce={false}>
        <Image source={{ uri: selectedEvent?.image }} style={styles.detailHeroImage} />
        <LinearGradient colors={['rgba(0,0,0,0.6)', 'transparent']} style={styles.detailHeaderOverlap}>
          <TouchableOpacity style={styles.detailBackBtn} onPress={() => setCurrentScreen('home')}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.detailBody}>
          <View style={styles.detailCategoryTag}><Text style={styles.detailCategoryTagText}>{selectedEvent?.category}</Text></View>
          <Text style={styles.detailHeroTitle}>{selectedEvent?.name}</Text>
          
          <View style={styles.detailQuickInfo}>
            <View style={styles.qInfoItem}>
              <Ionicons name="calendar" size={20} color="#7F00FF" />
              <Text style={styles.qInfoText}>{selectedEvent?.date}</Text>
            </View>
            <View style={styles.qInfoItem}>
              <Ionicons name="location" size={20} color="#7F00FF" />
              <Text style={styles.qInfoText}>{selectedEvent?.venue}</Text>
            </View>
          </View>

          <Text style={styles.detailAboutHeading}>About this event</Text>
          <Text style={styles.detailAboutText}>{selectedEvent?.description}</Text>

          <View style={styles.detailTicketBox}>
            <View>
              <Text style={styles.priceMiniLabel}>Price / Ticket</Text>
              <Text style={styles.priceValueText}>R{selectedEvent?.price}</Text>
            </View>
            <View style={styles.detailStepControl}>
              <TouchableOpacity style={styles.stepBtn} onPress={() => updateCart(selectedEvent.id, -1)}>
                <Ionicons name="remove" size={24} color="#333" />
              </TouchableOpacity>
              <Text style={styles.stepText}>{cart[selectedEvent?.id] || 0}</Text>
              <TouchableOpacity style={[styles.stepBtn, { backgroundColor: '#7F00FF' }]} onPress={() => updateCart(selectedEvent.id, 1)}>
                <Ionicons name="add" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{ height: Platform.OS === 'ios' ? 120 : 150 }} />
      </ScrollView>

      <TouchableOpacity 
        style={[styles.floatingActionBtn, (cart[selectedEvent?.id] || 0) === 0 && { backgroundColor: '#ccc' }]}
        disabled={(cart[selectedEvent?.id] || 0) === 0}
        onPress={() => setCurrentScreen('cart')}
      >
        <Text style={styles.floatingActionBtnText}>Go to Cart (R{getTotalAmount()})</Text>
      </TouchableOpacity>
    </View>
  );

  const CartScreen = () => {
    const items = getCartItems();
    return (
      <SafeAreaView style={styles.safeContainer}>
        <LinearGradient colors={['#7F00FF', '#E100FF']} style={styles.miniHeader}>
          <Text style={styles.miniHeaderTitle}>Your Cart</Text>
        </LinearGradient>

        {items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=600' }} style={styles.emptyImg} />
            <Text style={styles.emptyMainText}>Empty Bag!</Text>
            <Text style={styles.emptySubText}>Looks like you haven't picked a vibe yet.</Text>
            <TouchableOpacity style={styles.emptyActionBtn} onPress={() => setCurrentScreen('home')}>
              <Text style={styles.emptyActionBtnText}>Find Events</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.cartListContent}>
            {items.map(item => (
              <View key={item.event.id} style={styles.cartCard}>
                <Image source={{ uri: item.event.image }} style={styles.cartCardImg} />
                <View style={styles.cartCardInfo}>
                  <Text style={styles.cartCardTitle}>{item.event.name}</Text>
                  <Text style={styles.cartCardMeta}>{item.event.date} • R{item.event.price}</Text>
                  <View style={styles.cartStepRow}>
                    <TouchableOpacity onPress={() => updateCart(item.event.id, -1)} style={styles.cartStepBtn}>
                      <Ionicons name="remove" size={18} />
                    </TouchableOpacity>
                    <Text style={styles.cartStepValue}>{item.count}</Text>
                    <TouchableOpacity onPress={() => updateCart(item.event.id, 1)} style={[styles.cartStepBtn, { backgroundColor: '#F0E6FF' }]}>
                      <Ionicons name="add" size={18} color="#7F00FF" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Subtotal</Text><Text style={styles.summaryValue}>R{getTotalAmount()}</Text></View>
              <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Service Fee (5%)</Text><Text style={styles.summaryValue}>R{(getTotalAmount() * 0.05).toFixed(2)}</Text></View>
              <View style={[styles.summaryRow, { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderColor: '#eee' }]}>
                <Text style={styles.summaryTotalLabel}>Total</Text>
                <Text style={styles.summaryTotalValue}>R{(getTotalAmount() * 1.05).toFixed(2)}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.checkoutBtn} onPress={() => setCurrentScreen('payment')}>
              <Text style={styles.checkoutBtnText}>Secure Checkout</Text>
            </TouchableOpacity>
            <View style={{ height: 100 }} />
          </ScrollView>
        )}
        <NavigationBar />
      </SafeAreaView>
    );
  };

  const ProfileScreen = () => (
    <SafeAreaView style={styles.safeContainer}>
       <LinearGradient colors={['#7F00FF', '#E100FF']} style={styles.profileHero}>
          <Image source={{ uri: userProfile.avatar }} style={styles.profileAvatar} />
          <Text style={styles.profileName}>{userProfile.name}</Text>
          <Text style={styles.profileEmail}>{userProfile.email}</Text>
       </LinearGradient>

       <ScrollView style={styles.scrollView} contentContainerStyle={styles.profileScroll}>
          <View style={styles.loyaltyBox}>
             <Ionicons name="star" size={24} color="#FFD700" />
             <View style={{ marginLeft: 15 }}>
                <Text style={styles.loyaltyLabel}>Ticketza Points</Text>
                <Text style={styles.loyaltyValue}>{userProfile.loyaltyPoints} pts</Text>
             </View>
          </View>

          <Text style={styles.profileSectionTitle}>My Account</Text>
          <TouchableOpacity style={styles.profileRow}><Ionicons name="ticket" size={22} color="#7F00FF" /><Text style={styles.profileRowText}>My Tickets</Text><Ionicons name="chevron-forward" size={18} color="#ccc" /></TouchableOpacity>
          <TouchableOpacity style={styles.profileRow}><Ionicons name="heart" size={22} color="#7F00FF" /><Text style={styles.profileRowText}>Wishlist</Text><Ionicons name="chevron-forward" size={18} color="#ccc" /></TouchableOpacity>
          <TouchableOpacity style={styles.profileRow}><Ionicons name="card" size={22} color="#7F00FF" /><Text style={styles.profileRowText}>Payment Methods</Text><Ionicons name="chevron-forward" size={18} color="#ccc" /></TouchableOpacity>
          <TouchableOpacity style={styles.profileRow}><Ionicons name="settings" size={22} color="#7F00FF" /><Text style={styles.profileRowText}>Preferences</Text><Ionicons name="chevron-forward" size={18} color="#ccc" /></TouchableOpacity>

          <TouchableOpacity style={[styles.profileRow, { marginTop: 40 }]}><Ionicons name="log-out-outline" size={22} color="#FF3B30" /><Text style={[styles.profileRowText, { color: '#FF3B30' }]}>Sign Out</Text></TouchableOpacity>
          <View style={{ height: 120 }} />
       </ScrollView>
       <NavigationBar />
    </SafeAreaView>
  );

  return (
    <View style={{ flex: 1 }}>
      {currentScreen === 'home' && <HomeScreen />}
      {currentScreen === 'detail' && <DetailScreen />}
      {currentScreen === 'cart' && <CartScreen />}
      {currentScreen === 'profile' && <ProfileScreen />}
      {currentScreen === 'payment' && <View style={styles.safeContainer}><Text style={{padding: 100, textAlign: 'center'}}>Payment Complete! 🎉</Text><TouchableOpacity onPress={() => {setCart({}); setCurrentScreen('home');}}><Text style={{color: 'blue', textAlign: 'center'}}>Back Home</Text></TouchableOpacity></View>}
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#F8F9FF' },
  header: { padding: 25, paddingTop: Platform.OS === 'ios' ? 20 : 60, paddingBottom: 30, borderBottomLeftRadius: 35, borderBottomRightRadius: 35 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 32, fontWeight: '900', color: '#fff', letterSpacing: -1 },
  smallAvatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 15, height: 54, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 16, fontWeight: '500' },
  loadingCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingMsg: { marginTop: 15, color: '#666', fontWeight: '800' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20 },
  screenSectionTitle: { fontSize: 24, fontWeight: '900', color: '#1A1A1A', marginBottom: 20, paddingTop: 10 },
  eventCard: { backgroundColor: '#fff', borderRadius: 28, marginBottom: 25, overflow: 'hidden', shadowColor: '#7F00FF', shadowOpacity: 0.12, shadowRadius: 20, elevation: 8 },
  eventCardImage: { width: '100%', height: 220 },
  eventCardOverlay: { position: 'absolute', top: 15, left: 15 },
  eventCategoryBadge: { backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  eventCategoryText: { fontSize: 12, fontWeight: '800', color: '#7F00FF' },
  eventCardInfo: { padding: 20 },
  eventCardName: { fontSize: 22, fontWeight: '900', color: '#1A1A1A', marginBottom: 6 },
  eventCardMeta: { fontSize: 14, color: '#777', fontWeight: '500', marginBottom: 15 },
  eventCardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderColor: '#F5F5F5', paddingTop: 15 },
  eventCardPrice: { fontSize: 26, fontWeight: '900', color: '#7F00FF' },
  bookBtn: { backgroundColor: '#7F00FF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 14 },
  bookBtnText: { color: '#fff', fontWeight: '800' },
  offlineBanner: { backgroundColor: '#333', padding: 8, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  offlineText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  navBarWrapper: { position: 'absolute', bottom: 45, left: 20, right: 20 },
  navBar: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 25, height: 70, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 25, elevation: 15, paddingHorizontal: 20 },
  navItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  navText: { fontSize: 11, fontWeight: '700', color: '#666', marginTop: 4 },
  navTextActive: { color: '#7F00FF' },
  cartBadge: { position: 'absolute', top: 10, left: width*0.58, backgroundColor: '#FF3B30', width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', borderSize: 2, borderColor: '#fff' },
  cartBadgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  detailHeroImage: { width: '100%', height: 450 },
  detailHeaderOverlap: { position: 'absolute', top: 0, left: 0, right: 0, padding: 20, paddingTop: 50 },
  detailBackBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center' },
  detailBody: { marginTop: -40, backgroundColor: '#F8F9FF', borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 30 },
  detailCategoryTag: { backgroundColor: '#F0E6FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, alignSelf: 'flex-start', marginBottom: 15 },
  detailCategoryTagText: { color: '#7F00FF', fontWeight: '800', fontSize: 12 },
  detailHeroTitle: { fontSize: 32, fontWeight: '900', color: '#1A1A1A', marginBottom: 20, lineHeight: 36 },
  detailQuickInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  qInfoItem: { flexDirection: 'row', alignItems: 'center' },
  qInfoText: { marginLeft: 10, fontWeight: '600', color: '#555' },
  detailAboutHeading: { fontSize: 20, fontWeight: '800', marginBottom: 12 },
  detailAboutText: { fontSize: 16, color: '#666', lineHeight: 26, marginBottom: 30 },
  detailTicketBox: { backgroundColor: '#fff', padding: 25, borderRadius: 25, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  priceMiniLabel: { fontSize: 12, color: '#999', fontWeight: '700', marginBottom: 4 },
  priceValueText: { fontSize: 30, fontWeight: '900', color: '#7F00FF' },
  detailStepControl: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 18, padding: 6 },
  stepBtn: { width: 48, height: 48, borderRadius: 15, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  stepText: { fontSize: 22, fontWeight: '900', marginHorizontal: 20 },
  floatingActionBtn: { position: 'absolute', bottom: 30, left: 30, right: 30, backgroundColor: '#7F00FF', height: 70, borderRadius: 25, justifyContent: 'center', alignItems: 'center', shadowColor: '#7F00FF', shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
  floatingActionBtnText: { color: '#fff', fontSize: 18, fontWeight: '900' },
  miniHeader: { padding: 25, paddingTop: Platform.OS === 'ios' ? 20 : 60, paddingBottom: 25, borderBottomLeftRadius: 25, borderBottomRightRadius: 25 },
  miniHeaderTitle: { fontSize: 24, fontWeight: '900', color: '#fff', textAlign: 'center' },
  cartListContent: { padding: 20 },
  cartCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 22, padding: 15, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  cartCardImg: { width: 90, height: 90, borderRadius: 18 },
  cartCardInfo: { flex: 1, paddingLeft: 15, justifyContent: 'center' },
  cartCardTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A', marginBottom: 4 },
  cartCardMeta: { fontSize: 14, color: '#777', marginBottom: 10 },
  cartStepRow: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' },
  cartStepBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center' },
  cartStepValue: { marginHorizontal: 15, fontWeight: '800', fontSize: 16 },
  summaryCard: { backgroundColor: '#fff', borderRadius: 25, padding: 25, marginTop: 10 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { color: '#777', fontWeight: '600' },
  summaryValue: { color: '#333', fontWeight: '800' },
  summaryTotalLabel: { fontSize: 20, fontWeight: '900' },
  summaryTotalValue: { fontSize: 24, fontWeight: '900', color: '#7F00FF' },
  checkoutBtn: { backgroundColor: '#7F00FF', height: 65, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginTop: 30 },
  checkoutBtnText: { color: '#fff', fontSize: 18, fontWeight: '900' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyImg: { width: 220, height: 220, marginBottom: 30, borderRadius: 110 },
  emptyMainText: { fontSize: 28, fontWeight: '900', color: '#1A1A1A', marginBottom: 10 },
  emptySubText: { textAlign: 'center', fontSize: 16, color: '#777', lineHeight: 24, marginBottom: 30 },
  emptyActionBtn: { backgroundColor: '#7F00FF', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 20 },
  emptyActionBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  profileHero: { padding: 40, paddingTop: 80, alignItems: 'center', borderBottomLeftRadius: 50, borderBottomRightRadius: 50 },
  profileAvatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 5, borderColor: 'rgba(255,255,255,0.3)', marginBottom: 15 },
  profileName: { fontSize: 28, fontWeight: '900', color: '#fff' },
  profileEmail: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '600' },
  profileScroll: { padding: 25 },
  loyaltyBox: { backgroundColor: '#fff', borderRadius: 25, padding: 25, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 15, elevation: 10, marginTop: -50, marginBottom: 30 },
  loyaltyLabel: { fontSize: 14, color: '#777', fontWeight: '700' },
  loyaltyValue: { fontSize: 22, fontWeight: '900', color: '#7F00FF' },
  profileSectionTitle: { fontSize: 18, fontWeight: '900', color: '#1A1A1A', marginBottom: 15 },
  profileRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 18, borderRadius: 18, marginBottom: 15 },
  profileRowText: { flex: 1, marginLeft: 15, fontSize: 16, fontWeight: '700', color: '#333' }
});
