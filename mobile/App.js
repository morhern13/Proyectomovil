import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import * as SecureStore from 'expo-secure-store'

const API_URL = (process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1').replace(/\/$/, '')

async function request(path, token, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  const payload = await response.json()
  if (!response.ok) {
    const message = payload.message || payload.detail || payload.email?.[0] || 'No se pudo completar la solicitud.'
    throw new Error(message)
  }
  return payload
}

export default function App() {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [view, setView] = useState('dashboard')
  const [stats, setStats] = useState(null)
  const [products, setProducts] = useState([])
  const [customers, setCustomers] = useState([])
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    SecureStore.getItemAsync('candace_token')
      .then(async savedToken => {
        if (!savedToken) return
        const result = await request('/auth/me', savedToken)
        setToken(savedToken)
        setUser(result.user)
      })
      .catch(async () => SecureStore.deleteItemAsync('candace_token'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!token) return
    setError('')
    const paths = {
      products: '/products?per_page=50',
      customers: '/customers?per_page=50',
      invoices: '/invoices?per_page=50',
    }
    const path = paths[view] || '/dashboard/stats'
    request(path, token)
      .then(result => {
        if (view === 'products') setProducts(result.data || [])
        else if (view === 'customers') setCustomers(result.data || [])
        else if (view === 'invoices') setInvoices(result.data || [])
        else setStats(result)
      })
      .catch(reason => setError(reason.message))
  }, [token, view])

  async function signIn() {
    setLoading(true)
    setError('')
    try {
      const result = await request('/auth/login', null, {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), password }),
      })
      await SecureStore.setItemAsync('candace_token', result.token)
      setToken(result.token)
      setUser(result.user)
    } catch (reason) {
      setError(reason.message)
    } finally {
      setLoading(false)
    }
  }

  async function signOut() {
    try {
      await request('/auth/logout', token, { method: 'POST' })
    } finally {
      await SecureStore.deleteItemAsync('candace_token')
      setToken(null)
      setUser(null)
      setStats(null)
      setProducts([])
    }
  }

  if (loading && !token) {
    return <Centered><ActivityIndicator size="large" color="#0f766e" /></Centered>
  }

  if (!token) {
    return (
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.login}>
          <Text style={styles.brand}>Candace</Text>
          <Text style={styles.subtitle}>Gestión de negocio, en cualquier lugar.</Text>
          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} style={styles.input} />
          <Text style={styles.label}>Contraseña</Text>
          <TextInput secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TouchableOpacity style={styles.primaryButton} onPress={signIn} disabled={loading}>
            <Text style={styles.primaryText}>{loading ? 'Ingresando...' : 'Iniciar sesión'}</Text>
          </TouchableOpacity>
          <Text style={styles.help}>Crea tu cuenta desde la versión web para comenzar.</Text>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View>
          <Text style={styles.brandSmall}>Candace</Text>
          <Text style={styles.greeting}>Hola, {user?.name || 'usuario'}</Text>
        </View>
        <TouchableOpacity onPress={signOut}><Text style={styles.link}>Salir</Text></TouchableOpacity>
      </View>
      <View style={styles.tabs}>
        <Tab title="Resumen" active={view === 'dashboard'} onPress={() => setView('dashboard')} />
        <Tab title="Productos" active={view === 'products'} onPress={() => setView('products')} />
        <Tab title="Clientes" active={view === 'customers'} onPress={() => setView('customers')} />
        <Tab title="Facturas" active={view === 'invoices'} onPress={() => setView('invoices')} />
      </View>
      {error ? <Text style={styles.errorBanner}>{error}</Text> : null}
      {view === 'dashboard' ? (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.sectionTitle}>Panel principal</Text>
          {stats ? (
            <View style={styles.grid}>
              <Metric title="Productos" value={stats.products_count} />
              <Metric title="Stock bajo" value={stats.low_stock_count} />
              <Metric title="Clientes" value={stats.customers_count} />
              <Metric title="Facturas pendientes" value={stats.pending_invoices} />
              <Metric title="Ventas del mes" value={Number(stats.month_sales || 0).toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })} wide />
            </View>
          ) : <ActivityIndicator color="#0f766e" />}
        </ScrollView>
      ) : (
        <FlatList
          contentContainerStyle={styles.content}
          data={view === 'products' ? products : view === 'customers' ? customers : invoices}
          keyExtractor={item => String(item.id)}
          ListHeaderComponent={<Text style={styles.sectionTitle}>{view === 'products' ? 'Productos' : view === 'customers' ? 'Clientes' : 'Facturas'}</Text>}
          ListEmptyComponent={error ? null : <ActivityIndicator color="#0f766e" />}
          renderItem={({ item }) => {
            if (view === 'customers') {
              return <ResourceCard title={item.name} subtitle={`${item.code || 'Sin código'} · ${item.phone || item.email || 'Sin contacto'}`} />
            }
            if (view === 'invoices') {
              return <ResourceCard title={`Factura ${item.number}`} subtitle={`${item.date} · ${item.status} · ${Number(item.total).toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}`} />
            }
            return <ResourceCard title={item.name} subtitle={`${item.code} · Existencia: ${item.stock} ${item.unit} · Precio: ${Number(item.price).toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}`} />
          }}
        />
      )}
    </SafeAreaView>
  )
}

function Centered({ children }) {
  return <SafeAreaView style={[styles.safe, styles.centered]}>{children}</SafeAreaView>
}

function Metric({ title, value, wide }) {
  return (
    <View style={[styles.metric, wide && styles.metricWide]}>
      <Text style={styles.metricTitle}>{title}</Text>
      <Text style={styles.metricValue}>{value ?? '—'}</Text>
    </View>
  )
}

function Tab({ title, active, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.tab, active && styles.activeTab]}>
      <Text style={[styles.tabText, active && styles.activeTabText]}>{title}</Text>
    </TouchableOpacity>
  )
}

function ResourceCard({ title, subtitle }) {
  return (
    <View style={styles.product}>
      <Text style={styles.productName}>{title}</Text>
      <Text style={styles.productMeta}>{subtitle}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8fafc' },
  centered: { justifyContent: 'center', alignItems: 'center' },
  login: { flex: 1, justifyContent: 'center', padding: 28 },
  brand: { color: '#0f766e', fontSize: 36, fontWeight: '800' },
  brandSmall: { color: '#0f766e', fontSize: 21, fontWeight: '800' },
  subtitle: { color: '#64748b', fontSize: 16, marginTop: 6, marginBottom: 34 },
  label: { color: '#334155', fontWeight: '600', marginBottom: 7, marginTop: 16 },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 12, padding: 13, backgroundColor: '#fff', fontSize: 16 },
  primaryButton: { backgroundColor: '#0f766e', borderRadius: 12, padding: 15, alignItems: 'center', marginTop: 24 },
  primaryText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  help: { textAlign: 'center', color: '#64748b', marginTop: 20 },
  error: { color: '#b91c1c', marginTop: 12 },
  errorBanner: { color: '#991b1b', backgroundColor: '#fee2e2', marginHorizontal: 18, marginTop: 10, padding: 12, borderRadius: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  greeting: { color: '#475569', marginTop: 3 },
  link: { color: '#0f766e', fontWeight: '700', padding: 8 },
  tabs: { flexDirection: 'row', marginHorizontal: 18, padding: 4, backgroundColor: '#e2e8f0', borderRadius: 12 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 9 },
  activeTab: { backgroundColor: '#fff' },
  tabText: { color: '#64748b', fontWeight: '600' },
  activeTabText: { color: '#0f766e' },
  content: { padding: 18, paddingBottom: 36 },
  sectionTitle: { fontSize: 23, fontWeight: '700', color: '#0f172a', marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  metric: { backgroundColor: '#fff', borderRadius: 16, padding: 18, width: '48%', minHeight: 112, justifyContent: 'space-between', borderWidth: 1, borderColor: '#e2e8f0' },
  metricWide: { width: '100%' },
  metricTitle: { color: '#64748b', fontSize: 14 },
  metricValue: { color: '#0f172a', fontSize: 25, fontWeight: '700', marginTop: 10 },
  product: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 14, padding: 16, marginBottom: 10 },
  productHeading: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  productName: { flex: 1, color: '#0f172a', fontSize: 16, fontWeight: '700' },
  productCode: { color: '#64748b' },
  productMeta: { color: '#64748b', marginTop: 8 },
})
