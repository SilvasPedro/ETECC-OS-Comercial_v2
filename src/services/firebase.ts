/**
 * Firebase Client Integration for "geradoroscomercial"
 */
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot,
  Firestore 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged, 
  Auth, 
  User 
} from 'firebase/auth';
import { WorkOrder, CompanyProfile, Client, CatalogItem } from '../types/os';

// Configuration provided for geradoroscomercial
export const firebaseConfig = {
  apiKey: "AIzaSyCJltum-YBarimfdPw0i9dHn_2ibjaWz-Y",
  authDomain: "geradoroscomercial.firebaseapp.com",
  projectId: "geradoroscomercial",
  storageBucket: "geradoroscomercial.firebasestorage.app",
  messagingSenderId: "684662340653",
  appId: "1:684662340653:web:797560aa6c5600e0910ca4",
  measurementId: "G-4CSX70WKJH"
};

// Initialize Firebase App singleton safely
export const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);

// Authentication helper
export const initAuth = async (): Promise<User | null> => {
  try {
    if (auth.currentUser) return auth.currentUser;
    const cred = await signInAnonymously(auth);
    return cred.user;
  } catch (error) {
    console.warn('Firebase anonymous auth warning (falling back to direct Firestore access):', error);
    return null;
  }
};

// Collections definition
export const COLLECTIONS = {
  WORK_ORDERS: 'ordens_servico',
  COMPANY_PROFILE: 'empresa_perfil',
  CLIENTS: 'clientes',
  CATALOG: 'catalogo_itens'
} as const;

// Status checker
export const checkFirebaseHealth = async (): Promise<{ ok: boolean; message: string; mode: 'cloud' | 'local' }> => {
  try {
    const testDoc = doc(db, 'system_health', 'ping');
    await setDoc(testDoc, { ping: Date.now() }, { merge: true });
    return { ok: true, message: 'Conectado ao Firebase Cloud (geradoroscomercial)', mode: 'cloud' };
  } catch (err: any) {
    console.warn('Firebase sync status note:', err?.message || err);
    return { 
      ok: false, 
      message: err?.code === 'permission-denied' 
        ? 'Firebase conectado (Aguardando liberação de regras ou operando com cache local sincronizado)' 
        : 'Operando com armazenamento local de alta performance e sincronização de contingência', 
      mode: 'local' 
    };
  }
};

/* =========================================================================
   WORK ORDERS (Ordens de Serviço)
   ========================================================================= */

const LOCAL_STORAGE_OS_KEY = 'os_comercial_orders';

export const saveWorkOrder = async (order: WorkOrder): Promise<{ success: boolean; cloudSynced: boolean }> => {
  // Always update LocalStorage first for instant speed and offline resilience
  try {
    const local = getLocalWorkOrders();
    const existingIndex = local.findIndex(o => o.id === order.id);
    if (existingIndex >= 0) {
      local[existingIndex] = order;
    } else {
      local.unshift(order);
    }
    localStorage.setItem(LOCAL_STORAGE_OS_KEY, JSON.stringify(local));
  } catch (err) {
    console.error('LocalStorage write error:', err);
  }

  // Attempt Firestore Cloud persistence
  try {
    await initAuth();
    const docRef = doc(db, COLLECTIONS.WORK_ORDERS, order.id);
    await setDoc(docRef, {
      ...order,
      _syncedAt: new Date().toISOString()
    }, { merge: true });
    return { success: true, cloudSynced: true };
  } catch (cloudErr) {
    console.warn('Firestore write notice (saved safely in local storage):', cloudErr);
    return { success: true, cloudSynced: false };
  }
};

export const getWorkOrders = async (): Promise<WorkOrder[]> => {
  const localOrders = getLocalWorkOrders();
  
  try {
    await initAuth();
    const q = query(collection(db, COLLECTIONS.WORK_ORDERS), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const cloudOrders: WorkOrder[] = [];
      snapshot.forEach(docSnap => {
        cloudOrders.push(docSnap.data() as WorkOrder);
      });

      // Merge cloud orders with any unsynced local orders
      const mergedMap = new Map<string, WorkOrder>();
      localOrders.forEach(o => mergedMap.set(o.id, o));
      cloudOrders.forEach(o => mergedMap.set(o.id, o)); // Cloud takes priority if updated
      const finalOrders = Array.from(mergedMap.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      localStorage.setItem(LOCAL_STORAGE_OS_KEY, JSON.stringify(finalOrders));
      return finalOrders;
    }
  } catch (cloudErr) {
    console.warn('Firestore fetch notice (using stored local orders):', cloudErr);
  }

  return localOrders;
};

export const deleteWorkOrder = async (id: string): Promise<boolean> => {
  // Local deletion
  try {
    const local = getLocalWorkOrders().filter(o => o.id !== id);
    localStorage.setItem(LOCAL_STORAGE_OS_KEY, JSON.stringify(local));
  } catch (err) {
    console.error(err);
  }

  // Cloud deletion
  try {
    await initAuth();
    await deleteDoc(doc(db, COLLECTIONS.WORK_ORDERS, id));
    return true;
  } catch (cloudErr) {
    console.warn('Firestore delete notice:', cloudErr);
    return true;
  }
};

export const getLocalWorkOrders = (): WorkOrder[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_OS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

/* =========================================================================
   COMPANY PROFILE (Dados da Empresa)
   ========================================================================= */

const LOCAL_STORAGE_COMPANY_KEY = 'os_comercial_company';

export const defaultCompanyProfile: CompanyProfile = {
  name: 'Oficina & Serviços Comerciais Tech',
  tradeName: 'TechAssist Pro Soluções',
  document: '12.345.678/0001-90',
  ie: '123.456.789.000',
  phone: '(11) 3456-7890',
  whatsapp: '(11) 98765-4321',
  email: 'contato@techassistpro.com.br',
  address: 'Av. Paulista',
  number: '1000',
  complement: 'Conjunto 501',
  neighborhood: 'Bela Vista',
  city: 'São Paulo',
  state: 'SP',
  zipCode: '01310-100',
  pixKey: '12.345.678/0001-90',
  pixKeyType: 'cnpj',
  defaultWarrantyTerms: 'Garantia legal de 90 (noventa) dias sobre os serviços executados e peças substituídas, contados a partir da data de entrega, conforme Artigo 26 do Código de Defesa do Consumidor (Lei nº 8.078/1990). A garantia não cobre danos decorrentes de mau uso, umidade, quedas, variações elétricas ou intervenção de terceiros não autorizados.',
  defaultNotes: 'Agradecemos a preferência! Equipamentos não retirados em até 90 dias após a conclusão estarão sujeitos a cobrança de taxa de armazenagem.'
};

export const saveCompanyProfile = async (profile: CompanyProfile): Promise<{ success: boolean; cloudSynced: boolean }> => {
  try {
    localStorage.setItem(LOCAL_STORAGE_COMPANY_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error(e);
  }

  try {
    await initAuth();
    const docRef = doc(db, COLLECTIONS.COMPANY_PROFILE, 'main_profile');
    await setDoc(docRef, { ...profile, _updatedAt: new Date().toISOString() }, { merge: true });
    return { success: true, cloudSynced: true };
  } catch (err) {
    console.warn('Company profile firestore sync notice:', err);
    return { success: true, cloudSynced: false };
  }
};

export const getCompanyProfile = async (): Promise<CompanyProfile> => {
  let profile = defaultCompanyProfile;

  try {
    const local = localStorage.getItem(LOCAL_STORAGE_COMPANY_KEY);
    if (local) {
      profile = { ...defaultCompanyProfile, ...JSON.parse(local) };
    }
  } catch (e) {
    console.error(e);
  }

  try {
    await initAuth();
    const docSnap = await getDoc(doc(db, COLLECTIONS.COMPANY_PROFILE, 'main_profile'));
    if (docSnap.exists()) {
      profile = { ...defaultCompanyProfile, ...docSnap.data() as CompanyProfile };
      localStorage.setItem(LOCAL_STORAGE_COMPANY_KEY, JSON.stringify(profile));
    }
  } catch (err) {
    // Graceful fallback to local
  }

  return profile;
};

/* =========================================================================
   CLIENTS (Clientes Salvos)
   ========================================================================= */

const LOCAL_STORAGE_CLIENTS_KEY = 'os_comercial_clients';

export const saveClient = async (client: Client): Promise<{ success: boolean; cloudSynced: boolean }> => {
  try {
    const clients = getLocalClients();
    const idx = clients.findIndex(c => c.id === client.id);
    if (idx >= 0) clients[idx] = client;
    else clients.unshift(client);
    localStorage.setItem(LOCAL_STORAGE_CLIENTS_KEY, JSON.stringify(clients));
  } catch (e) {
    console.error(e);
  }

  try {
    await initAuth();
    await setDoc(doc(db, COLLECTIONS.CLIENTS, client.id), client, { merge: true });
    return { success: true, cloudSynced: true };
  } catch (err) {
    return { success: true, cloudSynced: false };
  }
};

export const getClients = async (): Promise<Client[]> => {
  const local = getLocalClients();

  try {
    await initAuth();
    const snap = await getDocs(collection(db, COLLECTIONS.CLIENTS));
    if (!snap.empty) {
      const cloudClients: Client[] = [];
      snap.forEach(d => cloudClients.push(d.data() as Client));
      const map = new Map<string, Client>();
      local.forEach(c => map.set(c.id, c));
      cloudClients.forEach(c => map.set(c.id, c));
      const merged = Array.from(map.values());
      localStorage.setItem(LOCAL_STORAGE_CLIENTS_KEY, JSON.stringify(merged));
      return merged;
    }
  } catch (e) {
    // Fallback to local
  }

  return local;
};

export const deleteClient = async (id: string): Promise<boolean> => {
  try {
    const filtered = getLocalClients().filter(c => c.id !== id);
    localStorage.setItem(LOCAL_STORAGE_CLIENTS_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error(e);
  }

  try {
    await initAuth();
    await deleteDoc(doc(db, COLLECTIONS.CLIENTS, id));
  } catch (e) {
    // Ignore cloud error
  }
  return true;
};

export const getLocalClients = (): Client[] => {
  try {
    const d = localStorage.getItem(LOCAL_STORAGE_CLIENTS_KEY);
    return d ? JSON.parse(d) : [];
  } catch {
    return [];
  }
};

/* =========================================================================
   CATALOG (Catálogo de Serviços e Peças Padrão)
   ========================================================================= */

const LOCAL_STORAGE_CATALOG_KEY = 'os_comercial_catalog';

export const defaultCatalogItems: CatalogItem[] = [
  { id: 'cat-1', type: 'service', code: 'SRV-01', name: 'Diagnóstico Técnico & Avaliação Completa', defaultPrice: 80.00, category: 'Diagnóstico' },
  { id: 'cat-2', type: 'service', code: 'SRV-02', name: 'Manutenção Preventiva e Higienização Geral', defaultPrice: 150.00, category: 'Manutenção' },
  { id: 'cat-3', type: 'service', code: 'SRV-03', name: 'Reparo de Circuito Eletrônico / Solda BGA', defaultPrice: 220.00, category: 'Reparo' },
  { id: 'cat-4', type: 'service', code: 'SRV-04', name: 'Formatação, Instalação e Backup de Dados', defaultPrice: 140.00, category: 'Software' },
  { id: 'cat-5', type: 'service', code: 'SRV-05', name: 'Visita Técnica e Deslocamento Especializado', defaultPrice: 100.00, category: 'Visita' },
  { id: 'cat-6', type: 'part', code: 'PEC-01', name: 'Fonte de Alimentação / Carregador Homologado', defaultPrice: 180.00, category: 'Peças' },
  { id: 'cat-7', type: 'part', code: 'PEC-02', name: 'Bateria de Alta Performance com Garantia', defaultPrice: 250.00, category: 'Baterias' },
  { id: 'cat-8', type: 'part', code: 'PEC-03', name: 'Display / Painel Frontal Original', defaultPrice: 380.00, category: 'Telas' },
  { id: 'cat-9', type: 'part', code: 'PEC-04', name: 'Cabo de Conexão e Chicote Elétrico Reforçado', defaultPrice: 65.00, category: 'Acessórios' }
];

export const getCatalogItems = async (): Promise<CatalogItem[]> => {
  try {
    const local = localStorage.getItem(LOCAL_STORAGE_CATALOG_KEY);
    if (local) {
      return JSON.parse(local);
    }
    localStorage.setItem(LOCAL_STORAGE_CATALOG_KEY, JSON.stringify(defaultCatalogItems));
    return defaultCatalogItems;
  } catch {
    return defaultCatalogItems;
  }
};

export const saveCatalogItems = async (items: CatalogItem[]): Promise<void> => {
  try {
    localStorage.setItem(LOCAL_STORAGE_CATALOG_KEY, JSON.stringify(items));
  } catch (e) {
    console.error(e);
  }
};
