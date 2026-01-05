import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, TextInput, SafeAreaView, ActivityIndicator, Dimensions, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Centralizing everything in one file for absolute reliability
const Theme = {
  primary: '#7F00FF',
  secondary: '#FF00FF',
  accent: '#A020F0',
  darkBg: '#121212',
  cardBg: '#FFFFFF',
  textMain: '#1A1A1A',
  textMuted: '#999999',
  red: '#FF3B30',
  gold: '#FFD700',
  whatsapp: '#25D366'
};

const MOCK_EVENTS = [
  { 
    id: 1, 
    name: 'Soweto Derby: Chiefs vs Pirates', 
    venue: 'FNB Stadium (Soccer City), Johannesburg', 
    date: 'Oct 26, 2026', 
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800', 
    price: 350, 
    category: 'Sports',
    description: 'The biggest rivalry in African football. Experience the passion and energy of the Soweto Derby.'
  },
  { 
    id: 2, 
    name: 'Black Coffee: Africa Rising II', 
    venue: 'Moses Mabhida Stadium, Durban', 
    date: 'Dec 15, 2026', 
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800', 
    price: 450, 
    category: 'Concert',
    description: 'Grammy winner Black Coffee returns to his roots for an orchestral experience like no other.'
  },
  { 
    id: 3, 
    name: 'Spring Fiesta 2026', 
    venue: 'Wild Waters, Boksburg', 
    date: 'Oct 05, 2026', 
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800', 
    price: 550, 
    category: 'Festival',
    description: 'The ultimate dance music festival returns. Multiple stages, international acts, pure vibes.'
  }
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [cart, setCart] = useState({});
  const [deliveryMethod, setDeliveryMethod] = useState('digital');
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [searchQuery, setSearchQuery] = useState('');

  const cartTickets = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = Object.entries(cart).reduce((total, [id, count]) => {
    const event = events.find(e => e.id === parseInt(id));
    return total + (event?.price || 0) * count;
  }, 0);

  const NavigationBar = () => (
    <View style={styles.navContainer}>
      <View style={styles.navInner}>
        <TouchableOpacity style={styles.navBtn} onPress={() => setCurrentScreen('home')}>
          <Ionicons name={currentScreen === 'home' ? "home" : "home-outline"} size={26} color={currentScreen === 'home' ? Theme.primary : Theme.textMuted} />
          <Text style={[styles.navBtnText, currentScreen === 'home' && styles.navBtnTextActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} onPress={() => setCurrentScreen('search')}>
          <Ionicons name={currentScreen === 'search' ? "search" : "search-outline"} size={26} color={currentScreen === 'search' ? Theme.primary : Theme.textMuted} />
          <Text style={[styles.navBtnText, currentScreen === 'search' && styles.navBtnTextActive]}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} onPress={() => setCurrentScreen('cart')}>
          <View>
            <Ionicons name={currentScreen === 'cart' ? "cart" : "cart-outline"} size={26} color={currentScreen === 'cart' ? Theme.primary : Theme.textMuted} />
            {cartTickets > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{cartTickets}</Text></View>}
          </View>
          <Text style={[styles.navBtnText, currentScreen === 'cart' && styles.navBtnTextActive]}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} onPress={() => setCurrentScreen('profile')}>
          <Ionicons name={currentScreen === 'profile' ? "person" : "person-outline"} size={26} color={currentScreen === 'profile' ? Theme.primary : Theme.textMuted} />
          <Text style={[styles.navBtnText, currentScreen === 'profile' && styles.navBtnTextActive]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const HomeScreen = () => (
    <View style={styles.screen}>
      <LinearGradient colors={[Theme.accent, Theme.secondary]} style={styles.topHeader}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <Text style={styles.logo}>Ticketza</Text>
            <View style={styles.headerIcons}>
              <TouchableOpacity onPress={() => setCurrentScreen('search')} style={{ marginRight: 20 }}>
                <Ionicons name="search" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setCurrentScreen('profile')}>
                <Image source={{ uri: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400" }} style={styles.avatar} />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.mainScroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.heroText}>South Africa's Finest 🇿🇦</Text>
        {events.map(event => (
          <TouchableOpacity key={event.id} style={styles.eventCard} onPress={() => { setSelectedEvent(event); setCurrentScreen('detail'); }}>
            <View style={styles.imageBox}>
               <Image source={{ uri: event.image }} style={styles.eventImg} resizeMode="cover" />
               <View style={styles.catTag}><Text style={styles.catTagText}>{event.category}</Text></View>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.eventName}>{event.name}</Text>
              <View style={styles.eventLine}>
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                  <Ionicons name="location" size={12} color={Theme.primary} />
                  <Text style={styles.eventLoc} numberOfLines={1}> {event.venue}</Text>
                </View>
                <Text style={styles.eventPrice}>R{event.price}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 160 }} />
      </ScrollView>
      <NavigationBar />
    </View>
  );

  const DetailScreen = () => (
    <View style={[styles.screen, { backgroundColor: '#000' }]}>
      <Image source={{ uri: selectedEvent?.image }} style={styles.heroDetail} />
      <SafeAreaView style={styles.detailBack}>
        <TouchableOpacity style={styles.backButton} onPress={() => setCurrentScreen('home')}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>

      <View style={styles.detailSheet}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.detailTitle}>{selectedEvent?.name}</Text>
          <View style={styles.detailRow}><Ionicons name="calendar-outline" size={20} color={Theme.primary} /><Text style={styles.detailText}>{selectedEvent?.date}</Text></View>
          <View style={styles.detailRow}><Ionicons name="location-outline" size={20} color={Theme.primary} /><Text style={styles.detailText}>{selectedEvent?.venue}</Text></View>
          <Text style={styles.aboutTitle}>Description</Text>
          <Text style={styles.aboutText}>{selectedEvent?.description}</Text>
          <View style={{ height: 200 }} />
        </ScrollView>
      </View>

      <View style={styles.bottomBar}>
        <View style={styles.bottomInner}>
          <Text style={styles.bottomPrice}>R{selectedEvent?.price}</Text>
          <View style={styles.stepper}>
            <TouchableOpacity onPress={() => {
               const currentCount = cart[selectedEvent.id] || 0;
               if (currentCount > 0) {
                 setCart({...cart, [selectedEvent.id]: currentCount - 1});
               }
            }}><Ionicons name="remove" size={20} color="#fff" /></TouchableOpacity>
            <Text style={styles.stepperText}>{cart[selectedEvent.id] || 0}</Text>
            <TouchableOpacity onPress={() => {
               setCart({...cart, [selectedEvent.id]: (cart[selectedEvent.id] || 0) + 1});
            }}><Ionicons name="add" size={20} color="#fff" /></TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.payBtn} onPress={() => setCurrentScreen('cart')}>
            <Text style={styles.payBtnText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {currentScreen === 'home' && <HomeScreen />}
      {currentScreen === 'detail' && <DetailScreen />}
      {currentScreen === 'cart' && <HomeScreen />} {/* Simplified for debugging */}
      {currentScreen === 'search' && <HomeScreen />}
      {currentScreen === 'profile' && <HomeScreen />}
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F0F2F5' },
  topHeader: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0, paddingBottom: 15 },
  headerContent: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight + 10 : 10
  },
  logo: { fontSize: 32, fontWeight: '900', color: '#fff', letterSpacing: -1.5 },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 38, height: 38, borderRadius: 19, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' },
  mainScroll: { flex: 1, paddingHorizontal: 20 },
  heroText: { fontSize: 24, fontWeight: '900', color: '#111', marginVertical: 20 },
  eventCard: { backgroundColor: '#fff', borderRadius: 25, marginBottom: 25, overflow: 'hidden', elevation: 12, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 15 },
  imageBox: { height: 220, width: '100%', position: 'relative', backgroundColor: '#EEE' },
  eventImg: { height: '100%', width: '100%' },
  catTag: { position: 'absolute', top: 15, right: 15, backgroundColor: 'rgba(255,255,255,0.95)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  catTagText: { color: Theme.primary, fontSize: 12, fontWeight: '900' },
  cardInfo: { padding: 18 },
  eventName: { fontSize: 20, fontWeight: '900', color: '#111', marginBottom: 10 },
  eventLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eventLoc: { fontSize: 13, color: '#666', fontWeight: '500' },
  eventPrice: { fontSize: 22, fontWeight: '900', color: Theme.primary },
  navContainer: { position: 'absolute', bottom: 30, left: 20, right: 20 },
  navInner: { flexDirection: 'row', backgroundColor: '#fff', height: 75, borderRadius: 37, elevation: 30, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 20, paddingHorizontal: 20 },
  navBtn: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  navBtnText: { fontSize: 10, color: Theme.textMuted, marginTop: 4, fontWeight: '800' },
  navBtnTextActive: { color: Theme.primary },
  badge: { position: 'absolute', top: -5, right: -10, backgroundColor: Theme.red, width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '900' },
  heroDetail: { width: '100%', height: height * 0.45 },
  detailBack: { position: 'absolute', top: 0, left: 20 },
  backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center', marginTop: 15 },
  detailSheet: { flex: 1, backgroundColor: '#000', borderTopLeftRadius: 35, borderTopRightRadius: 35, marginTop: -35, padding: 25 },
  detailTitle: { color: '#fff', fontSize: 30, fontWeight: '900', marginBottom: 20 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  detailText: { color: '#fff', marginLeft: 12, fontSize: 16, fontWeight: '600' },
  aboutTitle: { color: Theme.primary, fontSize: 18, fontWeight: '900', marginTop: 25, marginBottom: 12 },
  aboutText: { color: '#AAA', fontSize: 15, lineHeight: 24 },
  bottomBar: { position: 'absolute', bottom: 30, left: 20, right: 20 },
  bottomInner: { backgroundColor: Theme.primary, height: 80, borderRadius: 40, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 25 },
  bottomPrice: { color: '#fff', fontSize: 26, fontWeight: '900', flex: 1 },
  stepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: 5, marginRight: 15 },
  stepperText: { color: '#fff', paddingHorizontal: 12, fontWeight: '900', fontSize: 18 },
  payBtn: { backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 25 },
  payBtnText: { color: Theme.primary, fontWeight: '900', fontSize: 14 }
});
