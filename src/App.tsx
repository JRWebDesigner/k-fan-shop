import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  Clock3,
  CreditCard,
  Disc3,
  ExternalLink,
  Flame,
  Instagram,
  Menu,
  MessageCircle,
  Minus,
  PackageCheck,
  Plus,
  QrCode,
  Search,
  Send,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  TimerReset,
  Truck,
  UserRound,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react';

type Product = {
  id: number;
  name: string;
  artist: string;
  edition: string;
  price: number;
  reserve: number;
  stock: string;
  image: string;
  badge: string;
  badgeTone: 'purple' | 'pink' | 'gold';
  action: string;
};

type SmallProduct = {
  id: number;
  name: string;
  label: string;
  price: number;
  oldPrice?: number;
  image: string;
};

type IconType = LucideIcon;

const images = {
  persona:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAFkbtGSkZglcrQ657y7NOMuyX9gjaSZiC2SG7WpSA3D7Tlg-Ve8ac-4d5Z0Jrz6TdwSEc2nonFW4tV14z1Z-fqEENBtzpKBLSon2S-Ua5OpbG7lu0z9w6-lslkkuuVq47V5t4ltln-n2HHazuhxM-WOSgbZA4yNz4P6-ov7UWvKnT8YmbJsYlaRCn-krMRYcZ2f0th-OiJE_RlPWfbtyag1rrpgbAEnWdTxqGbAimjddtTlsDHTpVBDw',
  wings:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAOZe9TyS1YSD_OA8w2xhcBskB-5_MJRgBrqOvOkyzTDeY-8A23E7YkQFMBrJCJsBONRS846VKDQTwY661r31n7AYtVnCj5Tj1LTz4wqO5V1ANV1c17fAsBxkt_ClvQM1acZkMKC7-AKGaOP1MHhINSJJRpikhLnsCiQEe-F5bmX7eejxKCAoEYuh57PplXAMZp_Zxh5ueNg0SYVGio6shJfQpbF0bi7i0OulkkgDozhSTEeVW8DjgJSA',
  mostBeautiful:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD7uQ3C1z7rpC4ShaS0uTsh_lW922i4xUgWzCrNWwIZe5X-n8y4ieUqoNVaYr3R3NXtyDRqjKHRLS1OWvrVY8MKqzAGD07VGKPdJcbiGOExvi_tSkfox9j386kXs1M-M8jUvymwY2IB1SvOi-TyfQe8gbUiX2PSXKWodtoE7hPYvX_hK5FaTUY7sZc2OF05lZSpqiHN8fXLHJt7wBAe9kd7AFwjbwr2xe6_AW8gY5fFKEYyDUb0RiLdaQ',
  skool:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAltbH6QVgNhmW7vJ65AXACH_5gViLCxR87rLDm2fN1ePEXSe_0CPOo-ZNbqe65XWLBUnx556pqCBk3zZDY1bgD1xRhYbJ41idkZBeDOQUs_wmRwFjbpyVw996CNGhuSb2kdfy8iDCAr3tAeRzC3QQ9o60K5WZPc-ZMjkQkRl5_BUfJ_Poyvbim6oJ-65S7XP2IHKqgWP9ZanEG_V8DfSjiu9FkQ4S1grZb9KWq2h3jVJGszfgQDmbOHw',
  lightstick:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC1qYYD0E0j2YJBi6jNFYUhHjN1uYwue98zOMVIj7QbjR21SvK0gDUXag_PYJwmp-S67RxJxHMfZk7hQ9H3h1lttIPPvqkgySOAGKuj6Sp_KsezKoTn23LKhMAanY3qUnhci0DpHbjwQLejauDzkCipwhnaKGKTcIuUQMbMIJq3nOJiqfrHYsO7NoUMq-gsGvHrcHF79KL-I8ibImrQU35oMjn8R36qHj_uyRThaemP',
  serum:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBdMh-nTWqzCjHTRz5y-7LwthgyHAAekHrksXlXbqZUItencTSdw4X8NmjOIpq2jgOxphtKOD_Y8kzb7qf1hD-1BC0yZASYS60D0NRpds6yiWIgiw84d6mO3LAnP6twx1FPsbEo1oaUfzapcFAfsknzjh7fCzSFy1E3OMBiyA4W0-E0RYT00f9XJdUMIvFtCu432PEVfsIRVsLWXrhnmf82TAWYs3S-SH8k3oZMM6VS',
  binder:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAp7_tRUo5GexcjphM4E5d8OXne51Quo-DAea7JP0paoVtA2suLMhCXqii5voM0K-P_GYs-iRJAN-zYVjKjvLMljxN1tA_ihjIazeQRjqPlJQdNDFoScYS8YcVOrQVI4D3412ymAMaJZhimHxLpmI4cwy9XM3rbqMkp9G3mWGqX80CrtPl2x1M3n76gAHtVid-FM1fPMdCkQ3gj457Po0eN4wbCPXVnkvOc4UQYKUK_',
  strayKids:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAADjQ5L1DOKSnBDMamx5u5p9h2XXP3Iyx69tdb5mTmsnQRihJONCz7Bz01SiHN-EOsodEwx9sOzEzBscmKyhGkjPumVBQYJX8kFJ5lFI2e-eY5HgG2b5-D8vMtzJloWZ1DhxLTN1UWtkOIzGBjMJk2k4c5j6eYzGLkhaODNfIOnNG5ABgw6hwGkG8ywLIKAgRXGOShWeKdpGNErYbIssWc7NmjR-SQJNqirouAbj8t',
  newJeans:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAYW1P7W9GMHQfISIdMabkTtX7QhUgJvIY0gDp6qnKgssz0sw9aCIoXO6EsTualdMw_9cl_sqMdW8scWYyAgKLDadhtPKXNbHt7VoEgKMumvlSQSQorqpmf3sMxq4uiJlIBJD4M15V1bGIOH8TSe11Y36fuyaga9OPLWjEbu3UdSHwtIzAwPyPLVCMOj_Ts7g3qG0x-x07hsaYkhk1iDeeBy50J9d3oozvSfNbfOv38',
  joseon:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDH4zRYfHF6Rsl8ewxT-z47DqIAMmTnpUZakw-oxVuRDtjZbzEJnXHsBpMjx05W1RHJdwkxXj5vqY54EWx1kfMANzfENyJZlo7S0cczEAMEZ179qcqYFoBG2eZl71CyhEsQeeCU4xQq5lPVyt8DHEYp7IOrA9NG4wOsGAaDEgp6yY3lFXTKVJY9YANFJNLjDXstgPImi0jPDzvDHVcFT7g8YU8AWL4BD6ekp2IO480O',
  txt: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCH5agCFiSeW1XHye1I0MBreqVhSbKRLXEz3F3bVJjtuASRqwDcqWWYakgMj_pADRldK4VJV-_QbPkajW7LS7qjMFYUKPFlBropdiq3CzUPrOHmb2qIKzfXxDkufkdUMJXSDHdGLtxgPxN1t05n4hahz4fMbUEiTF2u3Kt-kFBqBFVv9M4QO_Y7vvZAYPhhsVy18G3gKwiMuzdhNPBbZ6CfIwewDHjfqgBlZFCgp0-5',
};

const products: Product[] = [
  { id: 1, name: 'BTS - Wings (Vol. 2)', artist: 'BTS (방탄소년단)', edition: 'VOL. 2', price: 250, reserve: 150, stock: '3 disponibles en stock', image: images.wings, badge: 'Entrega inmediata', badgeTone: 'purple', action: 'Agregar al carrito' },
  { id: 2, name: 'BTS - Map of the Soul: Persona', artist: 'BTS (방탄소년단)', edition: 'MINI ALBUM', price: 295, reserve: 150, stock: '2 unidades listas para envío', image: images.persona, badge: 'Entrega inmediata', badgeTone: 'purple', action: 'Agregar al carrito' },
  { id: 3, name: 'BTS - The Most Beautiful Moment in Life', artist: 'BTS (방탄소년단)', edition: '3RD MINI ALBUM', price: 350, reserve: 150, stock: 'Última unidad en almacén', image: images.mostBeautiful, badge: 'Pink version', badgeTone: 'pink', action: 'Agregar al carrito' },
  { id: 4, name: 'BTS - Skool Luv Affair Special Edition', artist: 'BTS (방탄소년단)', edition: 'SPECIAL EDITION', price: 380, reserve: 150, stock: 'Despacho hoy en Bolivia', image: images.skool, badge: 'Oferta especial', badgeTone: 'gold', action: 'Aprovechar oferta' },
];

const arrivals: SmallProduct[] = [
  { id: 5, name: 'Stray Kids - ROCK-STAR (Postcard Ver.)', label: 'JYP ENTERTAINMENT', price: 230, image: images.strayKids },
  { id: 6, name: "NewJeans - 2nd EP 'Get Up' (Bunny Bag)", label: 'ADOR / HYBE', price: 310, image: images.newJeans },
  { id: 7, name: 'Relief Sun: Rice + Probiotics SPF50+', label: 'BEAUTY OF JOSEON', price: 135, image: images.joseon },
  { id: 8, name: 'TXT - The Name Chapter: FREEFALL', label: 'BIGHIT MUSIC', price: 275, image: images.txt },
];

const deals: SmallProduct[] = [
  { id: 9, name: 'Lightstick Oficial Ver. 3', label: '-20% OFF', price: 420, oldPrice: 525, image: images.lightstick },
  { id: 10, name: 'Sérum Centella Calming 50ml', label: '-30% OFF', price: 115, oldPrice: 165, image: images.serum },
  { id: 11, name: 'Photocard Binder Book + Sleeves', label: '-15% OFF', price: 95, oldPrice: 112, image: images.binder },
];

const preorderItems = [
  { name: "SEVENTEEN - Best Album '17 IS RIGHT HERE'", detail: 'Incluye POB oficial de Weverse y photocard aleatoria exclusiva.', total: 390, days: 15 },
  { name: 'TWICE - With YOU-th (Digipack Ver.)', detail: 'Edición individual a elección con poster plegado oficial.', total: 210, days: 20 },
  { name: 'IVE - IVE SWITCH (Photobook Ver.)', detail: 'Importación directa Starship Square con beneficio de preventa.', total: 285, days: 25 },
];

const categoryItems: { title: string; subtitle: string; icon: IconType; color: string; target: string }[] = [
  { title: 'Música & Álbumes', subtitle: 'BTS, Blackpink, Stray Kids, TXT', icon: Disc3, color: 'lavender', target: 'catalogo-destacado' },
  { title: 'K-Beauty Skincare', subtitle: 'Sérums, tónicos & mascarillas', icon: Sparkles, color: 'rose', target: 'catalogo-destacado' },
  { title: 'Souvenirs & Merch', subtitle: 'Lightsticks oficiales, photocards', icon: Zap, color: 'lilac', target: 'catalogo-destacado' },
  { title: 'Entrega inmediata', subtitle: 'Despacho en 24 horas en Bolivia', icon: Truck, color: 'mint', target: 'catalogo-destacado' },
];

const faqs = [
  { question: '¿Los productos son 100% originales de Corea?', answer: 'Totalmente originales y nuevos. Todos nuestros álbumes y lightsticks vienen sellados de fábrica con su sticker holográfico oficial de KOMCA y sus ventas cuentan para los rankings de Hanteo y Circle Chart.' },
  { question: '¿Cómo funciona la opción de reserva con 150 Bs?', answer: 'Puedes apartar cualquier producto o álbum en preventa depositando un adelanto de 150 Bs mediante QR Simple. El saldo restante lo pagas cuando el producto llegue al país o antes de coordinar tu despacho final.' },
  { question: '¿Qué métodos de pago aceptan en Bolivia?', answer: 'Aceptamos QR Simple interbancario sin costo adicional, transferencias directas y Tigo Money. También coordinamos pago contra entrega en puntos céntricos de La Paz.' },
  { question: '¿Hacen envíos a todos los departamentos de Bolivia?', answer: 'Sí. Realizamos despachos a La Paz, Cochabamba, Santa Cruz, Sucre, Tarija, Oruro, Potosí, Beni y Pando mediante courier privado o flotas de terminal confiables.' },
  { question: '¿Qué significa la etiqueta “Entrega inmediata”?', answer: 'Significa que el producto ya se encuentra físicamente en nuestros almacenes en Bolivia. Lo pagas hoy y se despacha de inmediato, normalmente en menos de 24 horas.' },
];

const formatBs = (value: number) => `${value} Bs`;

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <a className={`brand ${compact ? 'brand-compact' : ''}`} href="#inicio" aria-label="K-Fan Shop inicio">
      <span className="brand-mark"><Sparkles size={compact ? 16 : 18} strokeWidth={2.5} /></span>
      <span><strong>K-FAN</strong> <em>SHOP</em></span>
    </a>
  );
}

function SectionHeading({ eyebrow, title, copy, action }: { eyebrow: string; title: string; copy?: string; action?: string }) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        {copy && <p>{copy}</p>}
      </div>
      {action && <a className="text-link" href="#catalogo-destacado">{action}<ArrowRight size={16} /></a>}
    </div>
  );
}

function Header({ query, setQuery, cartCount, onCart }: { query: string; setQuery: (value: string) => void; cartCount: number; onCart: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    document.getElementById('catalogo-destacado')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="site-header">
      <div className="announcement"><Truck size={14} /><span>Envíos a toda Bolivia · Entregas inmediatas en La Paz, Cochabamba y Santa Cruz · Paga con QR Simple</span></div>
      <div className="header-main container">
        <button className="mobile-menu" aria-label="Abrir menú" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X size={21} /> : <Menu size={21} />}</button>
        <Logo />
        <form className="search-bar" onSubmit={submitSearch}>
          <Search size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar álbumes, lightsticks, skincare..." aria-label="Buscar productos" />
          <button type="submit">Buscar</button>
        </form>
        <div className="header-actions">
          <a className="support-link" href="#ayuda"><MessageCircle size={16} /> <span>+591 Soporte</span></a>
          <nav className="desktop-nav"><a href="#pedidos">Mis pedidos</a><a href="#deseos">Lista de deseos</a></nav>
          <button className="cart-button" onClick={onCart} aria-label="Abrir carrito"><ShoppingBag size={19} /><span><small>CARRITO ({cartCount})</small><strong>{formatBs(cartCount ? 545 : 0)}</strong></span></button>
          <button className="account-button" aria-label="Mi cuenta"><UserRound size={17} /></button>
        </div>
      </div>
      <div className={`category-bar ${mobileOpen ? 'category-bar-open' : ''}`}>
        <div className="container category-inner">
          <a className="category-active" href="#catalogo-destacado">Todas las categorías <ChevronDown size={13} /></a>
          <a href="#catalogo-destacado">Música & Álbumes <span className="hot-tag">HOT</span></a>
          <a href="#kbeauty">K-Beauty & Skincare</a>
          <a href="#souvenirs">Souvenirs & Merch oficial</a>
          <a href="#catalogo-destacado"><Zap size={14} /> Entrega inmediata</a>
          <a href="#ofertas"><Flame size={14} /> Ofertas</a>
          <a href="#preventas-section">Preventas / Reservas</a>
          <span className="verified-note"><BadgeCheck size={15} /> 100% original Corea</span>
        </div>
      </div>
    </header>
  );
}

function BenefitCard({ icon: Icon, title, copy, tone }: { icon: IconType; title: string; copy: string; tone: string }) {
  return <div className="benefit-card"><div className={`benefit-icon ${tone}`}><Icon size={22} /></div><div><h3>{title}</h3><p>{copy}</p></div></div>;
}

function ProductCard({ product, addToCart }: { product: Product; addToCart: (product: Product) => void }) {
  return (
    <article className={`product-card ${product.badgeTone === 'gold' ? 'product-card-featured' : ''}`}>
      <span className={`product-badge ${product.badgeTone}`}><Zap size={12} /> {product.badge}</span>
      <div className="product-image-wrap"><img src={product.image} alt={product.name} /></div>
      <div className="product-info">
        <span className="product-meta">{product.artist} <i>·</i> {product.edition}</span>
        <h3>{product.name}</h3>
        <span className={`stock-pill ${product.badgeTone === 'gold' ? 'stock-warm' : ''}`}><span />{product.stock}</span>
        <div className="price-row"><span>{product.badgeTone === 'gold' ? 'Antes: 450 Bs' : 'Precio unidad'}</span><strong className={product.badgeTone === 'gold' ? 'price-pink' : ''}>{formatBs(product.price)}</strong></div>
        <div className="reserve-row"><span>{product.badgeTone === 'gold' ? 'Ahorras' : 'Reserva con'}</span><strong>{product.badgeTone === 'gold' ? '70 Bs OFF' : formatBs(product.reserve)}</strong></div>
        <div className="product-actions"><button className={product.badgeTone === 'gold' ? 'button-pink' : 'button-primary'} onClick={() => addToCart(product)}>{product.badgeTone === 'gold' ? <Zap size={16} /> : <ShoppingCart size={16} />}{product.action}</button><button className="button-soft" onClick={() => addToCart(product)}><MessageCircle size={15} /> {product.badgeTone === 'gold' ? 'Agregar al carrito' : 'Comprar por WhatsApp'}</button></div>
      </div>
    </article>
  );
}

function MiniProductCard({ item, compact = false, addToCart }: { item: SmallProduct; compact?: boolean; addToCart: (item: SmallProduct) => void }) {
  return <article className={`mini-product-card ${compact ? 'mini-product-compact' : ''}`}><div className="mini-image"><img src={item.image} alt={item.name} /></div><div className="mini-product-copy"><span className="discount-tag">{item.label}</span><h3>{item.name}</h3><div className="mini-price"><strong>{formatBs(item.price)}</strong>{item.oldPrice && <del>{formatBs(item.oldPrice)}</del>}</div>{!compact && <span className="mini-stock">{item.oldPrice ? 'Últimas unidades disponibles' : 'Despacho rápido en Bolivia'}</span>}{!compact && <button className="mini-add" onClick={() => addToCart(item)}><Plus size={15} /> Añadir</button>}</div></article>;
}

function CartDrawer({ items, close, removeOne, clear }: { items: Product[]; close: () => void; removeOne: (id: number) => void; clear: () => void }) {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  return <div className="drawer-backdrop" onClick={close}><aside className="cart-drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-head"><div><span className="eyebrow">Tu selección</span><h2>Carrito de compra</h2></div><button className="icon-button" onClick={close} aria-label="Cerrar carrito"><X size={20} /></button></div>{items.length === 0 ? <div className="empty-cart"><ShoppingBag size={38} /><h3>Tu carrito está vacío</h3><p>Agrega tus favoritos y los tendrás listos para comprar.</p><button className="button-primary" onClick={close}>Explorar productos</button></div> : <><div className="drawer-items">{items.map((item) => <div className="drawer-item" key={item.id}><img src={item.image} alt={item.name} /><div><h3>{item.name}</h3><strong>{formatBs(item.price)}</strong></div><button className="remove-item" onClick={() => removeOne(item.id)} aria-label={`Quitar ${item.name}`}><Minus size={14} /></button></div>)}</div><div className="drawer-summary"><div><span>Total</span><strong>{formatBs(total)}</strong></div><button className="button-primary"><CreditCard size={17} /> Continuar con mi pedido</button><button className="clear-button" onClick={clear}>Vaciar carrito</button></div></>}</aside></div>;
}

function App() {
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'arrivals' | 'preorders'>('arrivals');
  const [openFaq, setOpenFaq] = useState(0);
  const [seconds, setSeconds] = useState(33);

  useEffect(() => {
    const timer = window.setInterval(() => setSeconds((value) => value === 0 ? 59 : value - 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return products;
    return products.filter((product) => `${product.name} ${product.artist} ${product.edition}`.toLowerCase().includes(normalized));
  }, [query]);

  const addToCart = (product: Product) => setCart((current) => [...current, product]);
  const addSmallProduct = (item: SmallProduct) => setCart((current) => [...current, { id: item.id, name: item.name, artist: item.label, edition: 'SELECCIÓN', price: item.price, reserve: 150, stock: 'Disponible', image: item.image, badge: 'Tu selección', badgeTone: 'purple', action: 'Agregar' }]);
  const removeOne = (id: number) => setCart((current) => { const index = current.findIndex((item) => item.id === id); return index === -1 ? current : current.filter((_, itemIndex) => itemIndex !== index); });

  return (
    <div className="app-shell" id="inicio">
      <Header query={query} setQuery={setQuery} cartCount={cart.length} onCart={() => setIsCartOpen(true)} />
      <main>
        <section className="flash-strip"><div className="container flash-inner"><span className="flash-message"><span className="flash-dot">!</span><strong>COMEBACK FLASH SALE</strong><span>Descuentos exclusivos y reservas abiertas con solo 150 Bs</span></span><span className="countdown"><TimerReset size={15} /> Termina en <b>04h</b><i>:</i><b>22m</b><i>:</i><b>{String(seconds).padStart(2, '0')}s</b></span></div></section>

        <section className="hero-section"><div className="hero-glow hero-glow-one" /><div className="hero-glow hero-glow-two" /><div className="container hero-grid"><div className="hero-copy"><div className="hero-badges"><span className="badge-solid">Super liquidación K-Pop</span><span className="badge-pale">Entrega inmediata en Bolivia</span></div><h1>Álbumes BTS, Photocards <span>& Merch Oficial</span></h1><p>Artículos 100% sellados de Corea del Sur, computables en Hanteo Chart. Stock listo para entrega hoy mismo en La Paz, Cochabamba y Santa Cruz.</p><div className="hero-actions"><a className="button-primary" href="#catalogo-destacado"><ShoppingCart size={17} /> Comprar con descuento</a><a className="button-white" href="#preventas-section"><Clock3 size={17} /> Reservar con 150 Bs</a></div><div className="hero-dots"><span className="active">1</span><span>2</span><span>3</span><small>Stock original, atención cercana y entregas a todo el país.</small></div></div><div className="hero-product"><span className="hot-deal">Hot deal</span><img src={images.persona} alt="BTS Map of the Soul Persona" /><div className="hero-product-caption"><div><span>BTS · MAP OF THE SOUL</span><small><Zap size={12} /> Entrega inmediata</small></div><strong>295 Bs</strong></div></div></div></section>

        <section className="benefits-section"><div className="container benefits-grid"><BenefitCard icon={Zap} title="Entrega inmediata" copy="Stock físico en Bolivia sin esperas ni aduanas adicionales." tone="benefit-purple" /><BenefitCard icon={QrCode} title="Paga con QR Simple" copy="Cero comisiones bancarias. Confirmación en 5 minutos." tone="benefit-lilac" /><BenefitCard icon={Truck} title="Envíos a toda Bolivia" copy="Despachos asegurados a los 9 departamentos." tone="benefit-pink" /><BenefitCard icon={BadgeCheck} title="100% original Corea" copy="Álbumes sellados y registrados en Hanteo." tone="benefit-gold" /></div></section>

        <section className="content-section" id="categorias"><div className="container"><SectionHeading eyebrow="Descubre tu pasión" title="Explora por categorías" action="Ver todo" /><div className="category-grid">{categoryItems.map(({ title, subtitle, icon: Icon, color, target }) => <a href={`#${target}`} className="category-card" key={title}><span className={`category-icon ${color}`}><Icon size={25} /></span><h3>{title}</h3><p>{subtitle}</p><span className="category-link">Ver selección <ArrowRight size={14} /></span></a>)}</div></div></section>

        <section className="content-section products-section" id="catalogo-destacado"><div className="container"><SectionHeading eyebrow="Disponibilidad inmediata & coleccionables" title="Productos destacados K-Pop" copy="Ediciones originales selladas listas para envío a tu ciudad en Bolivia." /><div className="product-toolbar"><span><span className="live-dot" /> Envíos diarios</span>{query && <button onClick={() => setQuery('')}>Limpiar búsqueda <X size={14} /></button>}</div>{filteredProducts.length > 0 ? <div className="products-grid">{filteredProducts.map((product) => <ProductCard product={product} addToCart={addToCart} key={product.id} />)}</div> : <div className="no-results"><Search size={28} /><h3>No encontramos ese producto</h3><p>Prueba con BTS, skincare o lightsticks.</p></div>}</div></section>

        <section className="content-section" id="ofertas"><div className="container deal-panel"><SectionHeading eyebrow="Liquidación relámpago" title="Ofertas que expiran pronto" copy="Unidades limitadas por cambio de lote" /><div className="deals-grid">{deals.map((item) => <MiniProductCard item={item} compact addToCart={addSmallProduct} key={item.id} />)}</div></div></section>

        <section className="content-section arrivals-section" id="preventas-section"><div className="container"><div className="section-heading arrivals-heading"><div><span className="eyebrow">Novedades directas desde Seúl</span><h2>Recién llegados & preventas</h2></div><div className="tabs"><button className={activeTab === 'arrivals' ? 'active' : ''} onClick={() => setActiveTab('arrivals')}>Recién llegados</button><button className={activeTab === 'preorders' ? 'active' : ''} onClick={() => setActiveTab('preorders')}>Próximas preventas <small>Reserva 150 Bs</small></button></div></div>{activeTab === 'arrivals' ? <div className="arrivals-grid">{arrivals.map((item) => <MiniProductCard item={item} addToCart={addSmallProduct} key={item.id} />)}</div> : <div className="preorders-grid">{preorderItems.map((item) => <article className="preorder-card" key={item.name}><span className="preorder-tag">Llega en {item.days} días</span><h3>{item.name}</h3><p>{item.detail}</p><div className="preorder-price"><span>Total: <strong>{formatBs(item.total)}</strong></span><span>Reserva: <strong>150 Bs</strong></span></div><button className="button-primary"><Send size={15} /> Reservar por QR</button></article>)}</div>}</div></section>

        <section className="community-section"><div className="container"><div className="center-heading"><span className="eyebrow">Favoritos de la comunidad</span><h2>Los más vendidos en Bolivia</h2><p>Conoce los productos más pedidos y valorados por ARMY y fans de todo el país.</p></div><div className="reviews-grid">{products.slice(1).map((product, index) => <article className="review-card" key={product.id}><span className={`rank rank-${index + 1}`}>#{index + 1}</span><div className="review-product"><img src={product.image} alt={product.name} /><div><div className="stars"><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /></div><h3>{product.name.replace(' (Vol. 2)', '')}</h3><strong>{formatBs(product.price)}</strong></div></div><blockquote>{index === 0 ? 'Me llegó súper rápido a Cochabamba, completamente sellado y me salió la photocard de Jimin. 100% confiable.' : index === 1 ? 'Excelente atención por WhatsApp, pagué con QR y al día siguiente recogí mi paquete.' : 'La oferta está increíble, un álbum difícil de encontrar en Bolivia y con sello original.'}<cite>— {['Camila R., Cochabamba', 'Andrea M., La Paz', 'Daniela T., Santa Cruz'][index]}</cite></blockquote></article>)}</div></div></section>

        <section className="content-section steps-section" id="steps"><div className="container"><div className="center-heading"><span className="eyebrow">Rápido, seguro y transparente</span><h2>¿Cómo comprar en 3 pasos sencillos?</h2><p>Diseñado para que compres con total tranquilidad desde cualquier punto de Bolivia.</p></div><div className="steps-grid"><article><span className="step-number purple">1</span><h3>Elige tu álbum o merch</h3><p>Revisa el stock con la etiqueta de <strong>Entrega inmediata</strong> o aparta tu edición con 150 Bs.</p></article><article><span className="step-number pink">2</span><h3>Paga con QR Simple</h3><p>Sin recargos bancarios. Escanea el QR desde cualquier aplicación bancaria boliviana.</p></article><article><span className="step-number lilac">3</span><h3>Envío express inmediato</h3><p>Recibe tu número de guía y fotos del empaque por WhatsApp. Entrega en 24 a 48 horas.</p></article></div></div></section>

        <section className="faq-section" id="ayuda"><div className="container faq-container"><div className="center-heading"><span className="eyebrow">Resolvemos tus inquietudes</span><h2>Preguntas frecuentes</h2></div><div className="faq-list">{faqs.map((faq, index) => <div className={`faq-item ${openFaq === index ? 'open' : ''}`} key={faq.question}><button onClick={() => setOpenFaq(openFaq === index ? -1 : index)}><span>{faq.question}</span><ChevronDown size={17} /></button>{openFaq === index && <p>{faq.answer}</p>}</div>)}</div></div></section>

        <section className="contact-section"><div className="container contact-banner"><div><span className="eyebrow">Atención personalizada</span><h2>¿Buscas un álbum específico o tienes dudas sobre photocards?</h2><p>Chatea directamente con nuestro equipo por WhatsApp. Te enviamos fotos reales del producto sellado y resolvemos tus preguntas al instante.</p></div><a className="button-white" href="#ayuda"><MessageCircle size={18} /> Escribir al WhatsApp oficial <ExternalLink size={15} /></a></div></section>
      </main>

      <footer className="site-footer"><div className="container footer-grid"><div><Logo compact /><p>La tienda K-Pop y cosmética coreana en Bolivia. Importamos álbumes, photocards, lightsticks y skincare con total garantía de autenticidad.</p><span className="footer-chip"><ShieldIcon /> Original sealed</span></div><div><h3>Categorías rápidas</h3><a href="#catalogo-destacado">Álbumes y photocards</a><a href="#catalogo-destacado">Rutina facial & serums</a><a href="#catalogo-destacado">Lightsticks oficiales</a><a href="#catalogo-destacado">Stock inmediato</a></div><div><h3>Atención al cliente</h3><a href="#steps">Cómo comprar paso a paso</a><a href="#ayuda">Pagos con QR Simple</a><a href="#ayuda">Políticas de envío</a><a href="#ayuda">Preguntas frecuentes</a></div><div><h3>Estamos aquí para ayudarte</h3><p>Respondemos consultas todos los días y coordinamos entregas a todo el país.</p><div className="social-links"><a href="#instagram" aria-label="Instagram"><Instagram size={17} /></a><a href="#whatsapp" aria-label="WhatsApp"><MessageCircle size={17} /></a><a href="#telegram" aria-label="Telegram"><Send size={17} /></a></div></div></div><div className="container footer-bottom"><span>© 2024 K-Fan Shop Bolivia. Todos los derechos reservados.</span><span>Original de Corea · Hanteo & Circle Chart</span></div></footer>
      <a className="floating-chat" href="#ayuda"><MessageCircle size={18} /> <span>¿Dudas? Chat en vivo</span></a>
      {isCartOpen && <CartDrawer items={cart} close={() => setIsCartOpen(false)} removeOne={removeOne} clear={() => setCart([])} />}
    </div>
  );
}

function ShieldIcon() {
  return <PackageCheck size={14} />;
}

export default App;
