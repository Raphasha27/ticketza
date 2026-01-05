import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  TextInput, 
  SafeAreaView, 
  ActivityIndicator, 
  Dimensions, 
  Platform, 
  StatusBar as RNStatusBar,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// --- THEME ---
const Theme = {
  primary: '#7F00FF',
  secondary: '#FF00FF',
  accent: '#A020F0',
  darkBg: '#0F0F1A',
  cardBg: '#FFFFFF',
  textMain: '#1A1A1A',
  textSecondary: '#666666',
  textMuted: '#999999',
  red: '#FF3B30',
  gold: '#FFD700',
  whatsapp: '#25D366',
  white: '#FFFFFF',
  shadow: 'rgba(0,0,0,0.1)'
};

const MOCK_EVENTS = [
  { 
    id: 1, 
    name: 'Soweto Derby: Kaizer Chiefs vs Orlando Pirates - The Ultimate Showdown', 
    venue: 'FNB Stadium (Soccer City), Johannesburg', 
    date: 'Oct 26, 2026', 
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800', 
    price: 350, 
    category: 'Sports',
    description: 'The biggest rivalry in African football. Experience the passion and energy of the Soweto Derby live at Soccer City.'
  },
  { 
    id: 2, 
    name: 'Black Coffee: Africa Rising II - Live Orchestral Performance', 
    venue: 'Moses Mabhida Stadium, Durban', 
    date: 'Dec 15, 2026', 
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800', 
    price: 450, 
    category: 'Concert',
    description: 'Grammy winner Black Coffee returns to his roots for an orchestral experience like no other.'
  },
  { 
    id: 3, 
    name: 'Spring Fiesta 2026: The Soul of the City Music Festival', 
    venue: 'Wild Waters, Boksburg', 
    date: 'Oct 05, 2026', 
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800', 
    price: 550, 
    category: 'Festival',
    description: 'The ultimate dance music festival returns. Multiple stages, international acts, pure vibes.'
  }
];

export default function App() {
  // --- STATE ---
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [cart, setCart] = useState({});
  const [deliveryMethod, setDeliveryMethod] = useState('digital');
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [searchQuery, setSearchQuery] = useState('');

  // --- BUTTON HELPERS ---
  const handleFeatureAlert = (title) => {
    Alert.alert("Kid Of Dynamic Premium", `${title} feature is currently in production for the next update! 🚀🇿🇦`, [{ text: "Can't wait!" }]);
  };

  const logout = () => {
    Alert.alert("Logout", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => setCurrentScreen('home'), style: "destructive" }
    ]);
  };

  // --- CART CALCS ---
  const cartTickets = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = Object.entries(cart).reduce((total, [id, count]) => {
    const event = events.find(e => e.id === parseInt(id));
    return total + (event?.price || 0) * count;
  }, 0);

  // --- NAVIGATION COMPONENT ---
  const NavigationBar = () => (
    <View style={styles.navContainer}>
      <View style={styles.navInner}>
        <TouchableOpacity style={styles.navBtn} onPress={() => setCurrentScreen('home')}>
          <Ionicons name={currentScreen === 'home' ? "home" : "home-outline"} size={24} color={currentScreen === 'home' ? Theme.primary : Theme.textMuted} />
          <Text style={[styles.navBtnText, currentScreen === 'home' && styles.navBtnTextActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} onPress={() => setCurrentScreen('search')}>
          <Ionicons name={currentScreen === 'search' ? "search" : "search-outline"} size={24} color={currentScreen === 'search' ? Theme.primary : Theme.textMuted} />
          <Text style={[styles.navBtnText, currentScreen === 'search' && styles.navBtnTextActive]}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} onPress={() => setCurrentScreen('cart')}>
          <View>
            <Ionicons name={currentScreen === 'cart' ? "cart" : "cart-outline"} size={24} color={currentScreen === 'cart' ? Theme.primary : Theme.textMuted} />
            {cartTickets > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{cartTickets}</Text></View>}
          </View>
          <Text style={[styles.navBtnText, currentScreen === 'cart' && styles.navBtnTextActive]}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} onPress={() => setCurrentScreen('profile')}>
          <Ionicons name={currentScreen === 'profile' ? "person" : "person-outline"} size={24} color={currentScreen === 'profile' ? Theme.primary : Theme.textMuted} />
          <Text style={[styles.navBtnText, currentScreen === 'profile' && styles.navBtnTextActive]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // --- RENDERERS ---

  const renderHome = () => (
    <View style={styles.flex}>
      <LinearGradient colors={[Theme.accent, Theme.secondary]} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.mainHeader}>
        <SafeAreaView>
          <View style={styles.headerTop}>
            <Text style={styles.logoText}>Ticketza</Text>
            <View style={styles.headerIcons}>
              <TouchableOpacity onPress={() => setCurrentScreen('search')} style={{ marginRight: 20 }}>
                <Ionicons name="search" size={24} color={Theme.white} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setCurrentScreen('profile')}>
                <Image source={{ uri: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400" }} style={styles.avatarMini} />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>South Africa's Finest 🇿🇦</Text>
        {events.map(event => (
          <TouchableOpacity key={event.id} style={styles.card} onPress={() => { setSelectedEvent(event); setCurrentScreen('detail'); }}>
            <View style={styles.cardImgContainer}>
              <Image source={{ uri: event.image }} style={styles.cardImg} resizeMode="cover" />
              <View style={styles.cardBadge}><Text style={styles.cardBadgeText}>{event.category}</Text></View>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{event.name}</Text>
              <View style={styles.cardFooter}>
                <View style={styles.cardLocContainer}>
                  <Ionicons name="location" size={14} color={Theme.primary} />
                  <Text style={styles.cardLocText} numberOfLines={1}> {event.venue}</Text>
                </View>
                <Text style={styles.cardPriceText}>R{event.price}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 180 }} />
      </ScrollView>
      <NavigationBar />
    </View>
  );

  const renderSearch = () => (
    <View style={[styles.flex, { backgroundColor: Theme.darkBg }]}>
      <SafeAreaView>
        <View style={styles.searchBarContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={Theme.textMuted} />
            <TextInput 
              placeholder="Search artists or events..." 
              placeholderTextColor="#555" 
              style={styles.searchField} 
              autoFocus
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity onPress={() => setCurrentScreen('home')}><Text style={styles.cancelLink}>Cancel</Text></TouchableOpacity>
        </View>
      </SafeAreaView>
      <ScrollView styles={styles.padding20}>
         <Text style={styles.searchHeading}>Trending Categories</Text>
         <View style={styles.categoryWrap}>
            {['Music', 'Sports', 'Comedy', 'Arts', 'Festivals', 'Virtual'].map(c => (
              <TouchableOpacity key={c} style={styles.categoryItem} onPress={() => handleFeatureAlert(`${c} Discovery`)}>
                <Text style={styles.categoryItemText}>{c}</Text>
              </TouchableOpacity>
            ))}
         </View>
      </ScrollView>
      <NavigationBar />
    </View>
  );

  const renderDetail = () => (
    <View style={[styles.flex, { backgroundColor: '#000' }]}>
      <Image source={{ uri: selectedEvent?.image }} style={styles.detailHero} />
      <SafeAreaView style={styles.backBtnPos}>
        <TouchableOpacity style={styles.circleBtn} onPress={() => setCurrentScreen('home')}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>

      <View style={styles.detailContent}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.detailName}>{selectedEvent?.name}</Text>
          <View style={styles.detailRow}><Ionicons name="calendar-outline" size={22} color={Theme.primary} /><Text style={styles.detailMetaText}>{selectedEvent?.date}</Text></View>
          <View style={styles.detailRow}><Ionicons name="location-outline" size={22} color={Theme.primary} /><Text style={styles.detailMetaText}>{selectedEvent?.venue}</Text></View>
          <Text style={styles.detailSecH}>Description</Text>
          <Text style={styles.detailBody}>{selectedEvent?.description}</Text>
          <View style={styles.detailShareBox}>
            <TouchableOpacity style={styles.shareBtn} onPress={() => handleFeatureAlert('Social Share')}><Ionicons name="share-social" size={20} color="#fff" /><Text style={styles.shareTxt}>Share Event</Text></TouchableOpacity>
          </View>
          <View style={{ height: 200 }} />
        </ScrollView>
      </View>

      <View style={styles.stickyBar}>
        <View style={styles.stickyInner}>
          <Text style={styles.stickyPrice}>R{selectedEvent?.price}</Text>
          <View style={styles.stickyStepper}>
            <TouchableOpacity onPress={() => setCart({...cart, [selectedEvent.id]: Math.max(0, (cart[selectedEvent.id] || 0) - 1)})}><Ionicons name="remove" size={22} color="#fff" /></TouchableOpacity>
            <Text style={styles.stickyCount}>{cart[selectedEvent.id] || 0}</Text>
            <TouchableOpacity onPress={() => setCart({...cart, [selectedEvent.id]: (cart[selectedEvent.id] || 0) + 1})}><Ionicons name="add" size={22} color="#fff" /></TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.stickyBuy} onPress={() => setCurrentScreen('cart')}>
            <Text style={styles.stickyBuyText}>Buy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderCart = () => (
    <View style={[styles.flex, { backgroundColor: Theme.darkBg }]}>
      <SafeAreaView>
        <View style={styles.scHeader}>
          <TouchableOpacity onPress={() => setCurrentScreen('home')}><Ionicons name="chevron-back" size={24} color="#fff" /></TouchableOpacity>
          <Text style={styles.scTitle}>Cart</Text>
          <TouchableOpacity onPress={() => handleFeatureAlert('Digital Wallet')}><Ionicons name="wallet-outline" size={24} color="#fff" /></TouchableOpacity>
        </View>
      </SafeAreaView>
      <ScrollView style={styles.padding20}>
        {Object.entries(cart).map(([id, count]) => {
          const event = events.find(e => e.id === parseInt(id));
          if (!event || count === 0) return null;
          return (
            <View key={id} style={styles.cartCard}>
              <Image source={{ uri: event.image }} style={styles.cartCardImg} />
              <View style={styles.cartCardContent}>
                <Text style={styles.cartCardName} numberOfLines={2}>{event.name}</Text>
                <Text style={styles.cartCardPrice}>R{event.price} x {count}</Text>
              </View>
            </View>
          );
        })}
        
        {cartTickets === 0 ? (
          <View style={styles.emptyCart}>
            <Ionicons name="cart-outline" size={80} color="#333" />
            <Text style={styles.emptyCartText}>Your cart is empty</Text>
            <TouchableOpacity style={styles.contBtn} onPress={() => setCurrentScreen('home')}><Text style={styles.contBtnTxt}>Browse Events</Text></TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.scH2}>Delivery Option</Text>
            <View style={styles.methodFlex}>
              <TouchableOpacity style={[styles.mBtn, deliveryMethod === 'digital' && styles.mBtnActive]} onPress={() => setDeliveryMethod('digital')}>
                <Ionicons name="mail" size={28} color="#fff" /><Text style={styles.mBtnTxt}>Email</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.mBtn, deliveryMethod === 'whatsapp' && styles.mBtnActive]} onPress={() => setDeliveryMethod('whatsapp')}>
                <Ionicons name="logo-whatsapp" size={28} color="#fff" /><Text style={styles.mBtnTxt}>WhatsApp</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>Total Amount:</Text>
              <Text style={styles.totalValue}>R{cartTotal}.00</Text>
            </View>

            <TouchableOpacity style={styles.checkoutBtn} onPress={() => setCurrentScreen('payment')}>
              <Text style={styles.checkoutBtnText}>Secure Checkout</Text>
            </TouchableOpacity>
          </>
        )}
        <View style={{ height: 160 }} />
      </ScrollView>
      <NavigationBar />
    </View>
  );

  const renderProfile = () => (
    <View style={[styles.flex, { backgroundColor: '#050505' }]}>
      <SafeAreaView style={styles.flex}>
        <View style={styles.profileTop}>
          <TouchableOpacity onPress={() => handleFeatureAlert('Profile Picture Edit')} style={styles.avatarCircle}>
             <Image source={{ uri: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400" }} style={styles.avatarLarge} />
          </TouchableOpacity>
          <Text style={styles.profileName}>Kid Of Dynamic</Text>
          <Text style={styles.profileTag}>PLATINUM MEMBER</Text>
        </View>
        <ScrollView style={styles.padding20}>
           <TouchableOpacity style={styles.pItem} onPress={() => handleFeatureAlert('My Tickets')}><Ionicons name="ticket-outline" size={22} color={Theme.primary} /><Text style={styles.pItemTxt}>My Tickets</Text></TouchableOpacity>
           <TouchableOpacity style={styles.pItem} onPress={() => handleFeatureAlert('Payments')}><Ionicons name="card-outline" size={22} color={Theme.primary} /><Text style={styles.pItemTxt}>Payments</Text></TouchableOpacity>
           <TouchableOpacity style={styles.pItem} onPress={() => handleFeatureAlert('Liked Events')}><Ionicons name="heart-outline" size={22} color={Theme.primary} /><Text style={styles.pItemTxt}>Liked Events</Text></TouchableOpacity>
           <TouchableOpacity style={styles.pItem} onPress={logout}><Ionicons name="log-out-outline" size={22} color={Theme.red} /><Text style={styles.pItemTxt}>Logout</Text></TouchableOpacity>
           <View style={styles.footerBranding}>
             <Text style={styles.footerBrandingText}>Built with ❤️ by Kid Of Dynamic 🇿🇦</Text>
           </View>
           <View style={{ height: 160 }} />
        </ScrollView>
        <NavigationBar />
      </SafeAreaView>
    </View>
  );

  return (
    <View style={styles.flex}>
      {currentScreen === 'home' && renderHome()}
      {currentScreen === 'search' && renderSearch()}
      {currentScreen === 'detail' && renderDetail()}
      {currentScreen === 'cart' && renderCart()}
      {currentScreen === 'profile' && renderProfile()}
      {currentScreen === 'payment' && (
        <View style={styles.successScreen}>
          <Ionicons name="checkmark-circle" size={100} color={Theme.whatsapp} />
          <Text style={styles.scH1}>Payment Successful!</Text>
          <TouchableOpacity style={styles.scHomeBtn} onPress={() => {setCart({}); setCurrentScreen('home');}}>
            <Text style={styles.scHomeBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      )}
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  mainHeader: { paddingBottom: 15 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight + 10 : 15 },
  logoText: { fontSize: 32, fontWeight: '900', color: Theme.white, letterSpacing: -1.5 },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  avatarMini: { width: 36, height: 36, borderRadius: 18, borderSize: 2, borderColor: 'rgba(255,255,255,0.4)' },
  scrollView: { flex: 1, paddingHorizontal: 25 },
  pageTitle: { fontSize: 22, fontWeight: '900', color: '#111', marginVertical: 20 },
  card: { backgroundColor: '#fff', borderRadius: 25, marginBottom: 25, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 15, elevation: 8, overflow: 'hidden' },
  cardImgContainer: { height: 200, width: '100%', position: 'relative' },
  cardImg: { width: '100%', height: '100%' },
  cardBadge: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(255,255,255,0.95)', paddingVertical: 5, paddingHorizontal: 12, borderRadius: 10 },
  cardBadgeText: { color: Theme.primary, fontSize: 11, fontWeight: '900' },
  cardBody: { padding: 18 },
  cardTitle: { fontSize: 18, fontWeight: '900', color: '#111', marginBottom: 12, lineHeight: 24 }, // Allowed wrapping
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLocContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', marginRight: 15 },
  cardLocText: { fontSize: 13, color: '#666', fontWeight: '500' },
  cardPriceText: { fontSize: 20, fontWeight: '900', color: Theme.primary },
  navContainer: { position: 'absolute', bottom: 35, left: 20, right: 20 },
  navInner: { flexDirection: 'row', backgroundColor: '#fff', height: 75, borderRadius: 37, elevation: 25, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 20, paddingHorizontal: 20 },
  navBtn: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  navBtnText: { fontSize: 10, color: Theme.textMuted, marginTop: 4, fontWeight: '800' },
  navBtnTextActive: { color: Theme.primary },
  badge: { position: 'absolute', top: -5, right: -12, backgroundColor: Theme.red, width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '900' },
  detailHero: { width: '100%', height: height * 0.45 },
  backBtnPos: { position: 'absolute', top: 0, left: 20 },
  circleBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', marginTop: 15 },
  detailContent: { flex: 1, backgroundColor: '#000', borderTopLeftRadius: 35, borderTopRightRadius: 35, marginTop: -35, padding: 25 },
  detailName: { color: '#fff', fontSize: 28, fontWeight: '900', marginBottom: 20, lineHeight: 36 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  detailMetaText: { color: '#fff', marginLeft: 15, fontSize: 16, fontWeight: '600' },
  detailSecH: { color: Theme.primary, fontSize: 18, fontWeight: '900', marginTop: 25, marginBottom: 12 },
  detailBody: { color: '#BBB', fontSize: 15, lineHeight: 24 },
  detailShareBox: { marginTop: 20, alignItems: 'center' },
  shareBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#222', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 15 },
  shareTxt: { color: '#fff', marginLeft: 10, fontWeight: '700' },
  stickyBar: { position: 'absolute', bottom: 30, left: 20, right: 20 },
  stickyInner: { backgroundColor: Theme.primary, height: 80, borderRadius: 40, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 25, ...Shadows.primary },
  stickyPrice: { color: '#fff', fontSize: 24, fontWeight: '900', flex: 1 },
  stickyStepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: 5, marginRight: 20 },
  stickyCount: { color: '#fff', paddingHorizontal: 15, fontWeight: '900', fontSize: 18 },
  stickyBuy: { backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 25 },
  stickyBuyText: { color: Theme.primary, fontWeight: '900' },
  searchBarContainer: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 10 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1A', height: 55, borderRadius: 15, paddingHorizontal: 15, marginRight: 15 },
  searchField: { flex: 1, marginLeft: 10, color: '#fff', fontSize: 16 },
  cancelLink: { color: Theme.primary, fontWeight: '800' },
  padding20: { padding: 25 },
  searchHeading: { color: '#fff', fontSize: 18, fontWeight: '900', marginBottom: 20, marginHorizontal: 20 },
  categoryWrap: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 15 },
  categoryItem: { backgroundColor: '#1A1A1A', padding: 15, borderRadius: 12, margin: 5, width: '45%', alignItems: 'center' },
  categoryItemText: { color: '#fff', fontWeight: '700' },
  scHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 25, borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
  scTitle: { color: '#fff', fontSize: 24, fontWeight: '900' },
  cartCard: { flexDirection: 'row', backgroundColor: '#1A1A1A', borderRadius: 20, padding: 15, marginBottom: 15 },
  cartCardImg: { width: 70, height: 70, borderRadius: 12 },
  cartCardContent: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  cartCardName: { color: '#fff', fontSize: 16, fontWeight: '800', lineHeight: 22 },
  cartCardPrice: { color: Theme.primary, marginTop: 5, fontWeight: '700' },
  emptyCart: { marginTop: 100, alignItems: 'center' },
  emptyCartText: { color: '#444', fontSize: 18, marginTop: 20, fontWeight: '700' },
  contBtn: { backgroundColor: Theme.primary, marginTop: 30, paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25 },
  contBtnTxt: { color: '#fff', fontWeight: '800' },
  scH2: { color: '#fff', fontSize: 18, fontWeight: '900', marginTop: 25, marginBottom: 15 },
  methodFlex: { flexDirection: 'row', justifyContent: 'space-between' },
  mBtn: { flex: 1, backgroundColor: '#1A1A1A', padding: 20, borderRadius: 15, marginHorizontal: 5, alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
  mBtnActive: { borderColor: Theme.primary },
  mBtnTxt: { color: '#fff', marginTop: 10, fontWeight: '800' },
  totalBox: { marginTop: 30, padding: 20, backgroundColor: '#1A1A1A', borderRadius: 15 },
  totalLabel: { color: '#999', fontSize: 14 },
  totalValue: { color: Theme.primary, fontSize: 32, fontWeight: '900', marginTop: 5 },
  checkoutBtn: { backgroundColor: Theme.primary, height: 65, borderRadius: 32, marginTop: 30, justifyContent: 'center', alignItems: 'center' },
  checkoutBtnText: { color: '#fff', fontSize: 18, fontWeight: '900' },
  profileTop: { height: 300, justifyContent: 'center', alignItems: 'center' },
  avatarCircle: { width: 150, height: 150, borderRadius: 75, borderWidth: 3, borderColor: Theme.primary, padding: 5 },
  avatarLarge: { width: '100%', height: '100%', borderRadius: 75 },
  profileName: { color: '#fff', fontSize: 24, fontWeight: '900', marginTop: 20 },
  profileTag: { color: Theme.gold, fontSize: 11, fontWeight: '800', marginTop: 5, letterSpacing: 2 },
  pItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', padding: 18, borderRadius: 15, marginBottom: 12 },
  pItemTxt: { flex: 1, color: '#fff', marginLeft: 15, fontSize: 16, fontWeight: '700' },
  footerBranding: { marginTop: 40, alignItems: 'center' },
  footerBrandingText: { color: '#444', fontSize: 12, fontWeight: '800' },
  successScreen: { flex: 1, backgroundColor: Theme.darkBg, justifyContent: 'center', alignItems: 'center', padding: 40 },
  scH1: { color: '#fff', fontSize: 28, fontWeight: '900', marginTop: 20 },
  scHomeBtn: { backgroundColor: Theme.primary, paddingHorizontal: 40, paddingVertical: 15, borderRadius: 30, marginTop: 40 },
  scHomeBtnText: { color: '#fff', fontWeight: '900' }
});
