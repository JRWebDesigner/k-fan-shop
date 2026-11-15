import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BadgeCheck, ChevronDown, ChevronLeft, ChevronRight, Flame, Menu, MessageCircle, Minus,
  Plus, QrCode, Search, ShoppingBag, ShoppingCart, Sparkles, Trash2, Truck, X, Zap,
} from 'lucide-react';

type Cat = 'musica' | 'beauty' | 'merch';
type Product = { id: number; name: string; price: number; oldPrice?: number; reserve?: number; image: string; cat: Cat; date: string; sold: number };
type CartItem = Product & { qty: number };

// ⚠️ Número real de la tienda (código de país + número, sin + ni espacios)
const WHATSAPP = '59100000000';
const img = (n: string) => `/img/${n}.jpg`;

// Paleta tomada de las fotos de producto
const C = { deep: '#5B0F7A', deepHover: '#46085E', orchid: '#E2A9F1', orchid2: '#CB9BDD', pill: '#EBDAF3', pink: '#FFF0F7', accent: '#A63BC8' };
const STRIPES = `repeating-linear-gradient(90deg, ${C.orchid} 0 22px, ${C.orchid2} 22px 44px)`;
const display = "font-['Bebas_Neue',Impact,sans-serif] uppercase tracking-wide";

// Agrega aquí más productos (imagen en public/img/).
// date: fecha de ingreso (define "Últimos productos") · sold: unidades vendidas (define "Más vendidos")
// oldPrice: precio anterior; si lo pones, el producto aparece en "En oferta" (valores actuales de ejemplo, edítalos)
const PRODUCTS: Product[] = [
  { id: 1, name: 'Harper Bazaar Korea RM', price: 260, reserve: 150, image: img('harper-bazaar-rm'), cat: 'merch', date: '2026-11-14', sold: 12 },
  { id: 2, name: 'Dalmajung 2022 RM', price: 150, image: img('dalmajung-rm'), cat: 'musica', date: '2026-11-10', sold: 30 },
  { id: 3, name: 'Layover', price: 340, oldPrice: 380, reserve: 150, image: img('layover'), cat: 'musica', date: '2026-11-05', sold: 21 },
];

// Slides del hero: últimas promociones
const PROMOS: { tag: string; title: string; text: string; product?: Product }[] = [
  { tag: 'Nuevo ingreso', title: 'Harper Bazaar Korea RM', text: 'Elige entre Type A, B o C. Entrega inmediata.', product: PRODUCTS[0] },
  { tag: 'Más pedido', title: 'Layover', text: 'Las tres versiones disponibles. Reserva con 150 Bs.', product: PRODUCTS[2] },
  { tag: 'Precio especial', title: 'Dalmajung 2022 RM', text: 'Solo 150 Bs por unidad. Entrega inmediata.', product: PRODUCTS[1] },
  { tag: 'Envíos', title: 'Llegamos a toda Bolivia', text: 'Paga con QR Simple y recibe en tu ciudad.' },
];

const LATEST = [...PRODUCTS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
const BEST = [...PRODUCTS].sort((a, b) => b.sold - a.sold).slice(0, 3);
const DEALS = PRODUCTS.filter((p) => p.oldPrice).sort((a, b) => (b.oldPrice! - b.price) / b.oldPrice! - (a.oldPrice! - a.price) / a.oldPrice!).slice(0, 3);

const CATS: { key: Cat | 'todo'; label: string }[] = [
  { key: 'todo', label: 'Todo' }, { key: 'musica', label: 'Música y álbumes' },
  { key: 'beauty', label: 'K-Beauty' }, { key: 'merch', label: 'Merch oficial' },
];
const FAQS = [
  ['¿Los productos son originales?', 'Sí. Vienen sellados de fábrica y cuentan para Hanteo y Circle Chart.'],
  ['¿Cómo funciona la reserva con 150 Bs?', 'Apartas el producto con un adelanto por QR Simple. El saldo lo pagas cuando llega o antes del despacho.'],
  ['¿Qué métodos de pago aceptan?', 'QR Simple, transferencia y Tigo Money.'],
  ['¿Envían a todo el país?', 'Sí, a los 9 departamentos por courier o flota de terminal.'],
];

const bs = (n: number) => `${n} Bs`;
const waUrl = (t: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(t)}`;
const orderText = (items: CartItem[]) =>
  `Hola K-Fan Shop, quiero hacer este pedido:\n${items.map((i) => `• ${i.qty}x ${i.name} — ${bs(i.price * i.qty)}`).join('\n')}\nTotal: ${bs(items.reduce((s, i) => s + i.price * i.qty, 0))}`;
const loadCart = (): CartItem[] => { try { return JSON.parse(localStorage.getItem('kfan-cart') || '[]'); } catch { return []; } };

const btn = 'inline-flex items-center justify-center gap-1.5 rounded-xl text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A63BC8] active:scale-95';
const solid = { backgroundColor: C.deep, color: '#fff' };

export default function App() {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<Cat | 'todo'>('todo');
  const [cart, setCart] = useState<CartItem[]>(loadCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [faq, setFaq] = useState(0);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef(0);

  useEffect(() => { try { localStorage.setItem('kfan-cart', JSON.stringify(cart)); } catch { /* sin storage */ } }, [cart]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(''), 2200); return () => clearTimeout(t); }, [toast]);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % PROMOS.length), 5000);
    return () => clearInterval(t);
  }, [paused]);

  const count = cart.reduce((s, i) => s + i.qty, 0);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter((p) => (cat === 'todo' || p.cat === cat) && p.name.toLowerCase().includes(q));
  }, [query, cat]);

  const add = (p: Product, open = false) => {
    setCart((c) => c.some((i) => i.id === p.id) ? c.map((i) => i.id === p.id ? { ...i, qty: i.qty + 1 } : i) : [...c, { ...p, qty: 1 }]);
    if (open) setCartOpen(true); else setToast(`${p.name} agregado al carrito`);
  };
  const setQty = (id: number, d: number) => setCart((c) => c.map((i) => i.id === id ? { ...i, qty: i.qty + d } : i).filter((i) => i.qty > 0));
  const goCatalog = (k: Cat | 'todo') => { setCat(k); setMenuOpen(false); document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' }); };
  const go = (d: number) => setSlide((s) => (s + d + PROMOS.length) % PROMOS.length);

  return (
    <div className="min-h-screen text-[#3B0A52] antialiased" style={{ backgroundColor: C.pink }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');`}</style>
      {/* Manchas de color detrás del contenido: dan profundidad al efecto glass */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-24 top-1/4 h-96 w-96 rounded-full bg-[#E2A9F1]/60 blur-3xl" />
        <div className="absolute -right-24 top-1/2 h-96 w-96 rounded-full bg-[#F9B8DD]/60 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-[#CB9BDD]/50 blur-3xl" />
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="px-4 py-1.5 text-center text-xs text-white" style={{ backgroundColor: C.deep }}>
          <Truck className="mr-1.5 inline h-3.5 w-3.5" />Envíos a toda Bolivia · Paga con QR Simple
        </div>
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <button className="rounded-lg p-2 hover:bg-[#EBDAF3] lg:hidden" aria-label="Menú" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <a href="#" className={`${display} flex items-center gap-2 text-2xl`} style={{ color: C.deep }}>
            <span className="grid h-9 w-9 place-items-center rounded-xl text-white" style={{ background: STRIPES, color: C.deep }}><Sparkles className="h-4 w-4" /></span>
            K-Fan Shop
          </a>
          <form className="relative mx-2 hidden flex-1 md:block" onSubmit={(e) => { e.preventDefault(); goCatalog(cat); }}>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A63BC8]" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar álbumes, revistas, photocards…"
              className="w-full rounded-full border border-[#E2A9F1] bg-[#FFF0F7] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#A63BC8] focus:bg-white" />
          </form>
          <div className="ml-auto flex items-center gap-1">
            <a href={waUrl('Hola K-Fan Shop, tengo una consulta')} target="_blank" rel="noreferrer"
              className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 sm:flex">
              <MessageCircle className="h-4 w-4" />Soporte
            </a>
            <button onClick={() => setCartOpen(true)} aria-label={`Abrir carrito, ${count} productos`}
              className="relative flex items-center gap-2 rounded-full py-2 pl-3 pr-4 text-sm font-bold text-white" style={{ backgroundColor: C.deep }}>
              <ShoppingBag className="h-5 w-5" /><span className="hidden sm:inline">{bs(total)}</span>
              {count > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full px-1 text-xs font-bold text-white" style={{ backgroundColor: C.accent }}>{count}</span>}
            </button>
          </div>
        </div>
        <div className="px-4 pb-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A63BC8]" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar productos…"
              className="w-full rounded-full border border-[#E2A9F1] bg-[#FFF0F7] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#A63BC8]" />
          </div>
        </div>
        <nav className={`border-t border-[#EBDAF3] ${menuOpen ? 'block' : 'hidden'} lg:block`}>
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-2 text-sm font-semibold lg:flex-row lg:items-center lg:gap-6">
            {CATS.map((c) => (
              <button key={c.key} onClick={() => goCatalog(c.key)} className="rounded-md px-2 py-1.5 text-left hover:text-[#A63BC8]" style={{ color: cat === c.key ? C.accent : C.deep }}>{c.label}</button>
            ))}
            <a href="#ultimos" onClick={() => setMenuOpen(false)} className="px-2 py-1.5" style={{ color: C.deep }}>Últimos</a>
            <a href="#vendidos" onClick={() => setMenuOpen(false)} className="px-2 py-1.5" style={{ color: C.deep }}>Más vendidos</a>
            <a href="#ofertas" onClick={() => setMenuOpen(false)} className="flex items-center gap-1 px-2 py-1.5 text-[#A63BC8]"><Flame className="h-4 w-4" />Ofertas</a>
            <span className="ml-auto hidden items-center gap-1 text-xs text-emerald-700 lg:flex"><BadgeCheck className="h-4 w-4" />100% original de Corea</span>
          </div>
        </nav>
      </header>

      <main className="relative z-10">
        {/* HERO SLIDER */}
        <section style={{ background: STRIPES }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
          onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => { const d = e.changedTouches[0].clientX - touchX.current; if (Math.abs(d) > 50) go(d < 0 ? 1 : -1); }}>
          <div className="relative mx-auto max-w-7xl overflow-hidden">
            <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${slide * 100}%)` }}>
              {PROMOS.map((s, i) => (
                <div key={i} className="grid w-full shrink-0 items-center gap-6 px-12 py-8 md:grid-cols-2 md:px-20 md:py-12" aria-hidden={slide !== i}>
                  <div className="order-2 text-center md:order-1 md:text-left">
                    <span className={`${display} inline-block rounded-full bg-white px-4 py-1 text-lg`} style={{ color: C.deep }}>{s.tag}</span>
                    <h1 className={`${display} mt-3 text-5xl leading-none md:text-7xl`} style={{ color: C.deep }}>{s.title}</h1>
                    <p className="mx-auto mt-3 max-w-md text-base font-medium md:mx-0" style={{ color: C.deep }}>{s.text}</p>
                    {s.product && <p className={`${display} mt-3 text-4xl`} style={{ color: C.deep }}>Precio: {bs(s.product.price)}</p>}
                    <div className="mt-5 flex flex-wrap justify-center gap-3 md:justify-start">
                      {s.product ? (
                        <>
                          <button onClick={() => add(s.product!, true)} className={`${btn} px-5 py-3`} style={solid}><Zap className="h-4 w-4" />Comprar ahora</button>
                          <a href={waUrl(`Hola K-Fan Shop, quiero comprar: ${s.product.name} — ${bs(s.product.price)}`)} target="_blank" rel="noreferrer" className={`${btn} bg-emerald-500 px-5 py-3 text-white hover:bg-emerald-600`}>
                            <MessageCircle className="h-4 w-4" />Comprar por WhatsApp
                          </a>
                        </>
                      ) : (
                        <button onClick={() => goCatalog('todo')} className={`${btn} px-5 py-3`} style={solid}><ShoppingCart className="h-4 w-4" />Ver catálogo</button>
                      )}
                    </div>
                  </div>
                  <div className="order-1 md:order-2">
                    {s.product ? (
                      <div className="mx-auto max-w-sm rounded-3xl bg-white p-4 shadow-xl">
                        <img src={s.product.image} alt={s.product.name} className="aspect-[4/3] w-full object-contain" />
                        <span className={`${display} mt-2 inline-block rounded-lg px-3 py-1 text-lg`} style={{ backgroundColor: C.pill, color: C.deep }}>Entrega inmediata</span>
                      </div>
                    ) : (
                      <div className="mx-auto grid aspect-[4/3] max-w-sm place-items-center rounded-3xl bg-white shadow-xl"><Truck className="h-20 w-20" style={{ color: C.deep }} /></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => go(-1)} aria-label="Anterior" className="absolute left-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white shadow" style={{ color: C.deep }}><ChevronLeft className="h-5 w-5" /></button>
            <button onClick={() => go(1)} aria-label="Siguiente" className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white shadow" style={{ color: C.deep }}><ChevronRight className="h-5 w-5" /></button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
              {PROMOS.map((_, i) => (
                <button key={i} onClick={() => setSlide(i)} aria-label={`Ir a la promoción ${i + 1}`} className="h-2.5 rounded-full transition-all" style={{ width: slide === i ? 28 : 10, backgroundColor: slide === i ? C.deep : '#fff' }} />
              ))}
            </div>
          </div>
        </section>

        {/* BENEFICIOS */}
        <section className="mx-auto grid max-w-7xl gap-3 px-4 py-8 sm:grid-cols-3">
          {([[Zap, 'Entrega inmediata', 'Stock físico en Bolivia, sin aduanas.'], [QrCode, 'Paga con QR Simple', 'Sin comisiones. Confirmación en minutos.'], [Truck, 'Envíos a todo el país', 'Courier o flota de terminal.']] as const).map(([I, t, d]) => (
            <div key={t} className="flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-[#E2A9F1]">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ backgroundColor: C.pill, color: C.deep }}><I className="h-5 w-5" /></span>
              <div><h3 className="font-bold">{t}</h3><p className="text-sm text-[#7a4a8f]">{d}</p></div>
            </div>
          ))}
        </section>

        {/* DESTACADOS DE LA HOME */}
        {!query && (
          <>
            <Showcase id="ultimos" title="Últimos productos" sub="Lo más nuevo que llegó a la tienda" items={LATEST} add={add} tag={() => 'Nuevo'} />
            <Showcase id="vendidos" title="Los más vendidos" sub="Los favoritos de nuestros clientes" items={BEST} add={add} tag={(_, i) => `Top ${i + 1}`} />
            <Showcase id="ofertas" title="En oferta" sub="Precios rebajados por tiempo limitado" items={DEALS} add={add}
              tag={(p) => `-${Math.round(((p.oldPrice! - p.price) / p.oldPrice!) * 100)}%`} />
          </>
        )}

        {/* CATÁLOGO */}
        <section id="catalogo" className="mx-auto max-w-7xl scroll-mt-40 px-4 pb-12">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className={`${display} text-4xl`} style={{ color: C.deep }}>Todos los productos</h2>
            <div className="flex gap-2 overflow-x-auto">
              {CATS.map((c) => (
                <button key={c.key} onClick={() => setCat(c.key)} className="whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold"
                  style={cat === c.key ? solid : { backgroundColor: C.pill, color: C.deep }}>{c.label}</button>
              ))}
            </div>
          </div>
          {visible.length === 0 ? (
            <p className="rounded-2xl bg-white p-10 text-center text-[#7a4a8f]">No encontramos “{query}”. Prueba con otro nombre o categoría.</p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visible.map((p) => <ProductCard key={p.id} p={p} add={add} />)}
            </div>
          )}
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-4 pb-16">
          <h2 className={`${display} mb-4 text-4xl`} style={{ color: C.deep }}>Preguntas frecuentes</h2>
          <div className="divide-y divide-[#EBDAF3] rounded-2xl bg-white ring-1 ring-[#E2A9F1]">
            {FAQS.map(([q, a], i) => (
              <div key={q}>
                <button onClick={() => setFaq(faq === i ? -1 : i)} className="flex w-full items-center justify-between gap-3 p-4 text-left font-semibold" aria-expanded={faq === i}>
                  {q}<ChevronDown className={`h-4 w-4 shrink-0 transition ${faq === i ? 'rotate-180' : ''}`} />
                </button>
                {faq === i && <p className="px-4 pb-4 text-sm text-[#7a4a8f]">{a}</p>}
              </div>
            ))}
          </div>
        </section>
      </main>

      <a href={waUrl('Hola K-Fan Shop, necesito ayuda')} target="_blank" rel="noreferrer" aria-label="Escribir por WhatsApp"
        className="fixed bottom-5 left-5 z-30 grid h-12 w-12 place-items-center rounded-full bg-emerald-500 text-white shadow-lg hover:bg-emerald-600"><MessageCircle className="h-6 w-6" /></a>

      {toast && <div role="status" className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full px-5 py-2.5 text-sm text-white shadow-lg" style={{ backgroundColor: C.deep }}>{toast}</div>}

      {/* CARRITO */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[#3B0A52]/50" onClick={() => setCartOpen(false)}>
          <aside className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4" style={{ background: STRIPES }}>
              <h2 className={`${display} rounded-full bg-white px-4 py-1 text-2xl`} style={{ color: C.deep }}>Tu carrito ({count})</h2>
              <button onClick={() => setCartOpen(false)} aria-label="Cerrar carrito" className="rounded-full bg-white p-2" style={{ color: C.deep }}><X className="h-5 w-5" /></button>
            </div>
            {cart.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center text-[#7a4a8f]">
                <ShoppingBag className="h-10 w-10" /><p>Tu carrito está vacío. Agrega un producto para empezar.</p>
                <button onClick={() => setCartOpen(false)} className={`${btn} px-5 py-2.5`} style={solid}>Ver productos</button>
              </div>
            ) : (
          an>Envíos a toda Bolivia · Entregas inmediatas en La Paz, Cochabamba y Santa Cruz · Paga con QR Simple</span></div>
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

      <footer className="site-footer"><div className="container footer-grid"><div><Logo compact /><p>La tienda K-Pop y cosmética coreana en Bolivia. Importamos álbumes, photocards, lightsticks y skincare con total garantía de autenticidad.</p><span className="footer-chip"><ShieldIcon /> Original sealed</span></div><div><h3>Categorías rápidas</h3><a href="#catalogo-destacado">Álbumes y photocards</a><a href="#catalogo-destacado">Rutina facial & serums</a><a href="#catalogo-destacado">Lightsticks oficiales</a><a href="#catalogo-destacado">Stock inmediato</a></div><div><h3>Atención al cliente</h3><a href="#steps">Cómo comprar paso a paso</a><a href="#ayuda">Pagos con QR Simple</a><a href="#ayuda">Políticas de envío</a><a href="#ayuda">Preguntas frecuentes</a></div><div><h3>Estamos aquí para ayudarte</h3><p>Respondemos consultas todos los días y coordinamos entregas a todo el país.</p><div className="social-links"><a href="#instagram" aria-label="Instagram"><MessageCircle size={17} /></a><a href="#whatsapp" aria-label="WhatsApp"><MessageCircle size={17} /></a><a href="#telegram" aria-label="Telegram"><Send size={17} /></a></div></div></div><div className="container footer-bottom"><span>© 2024 K-Fan Shop Bolivia. Todos los derechos reservados.</span><span>Original de Corea · Hanteo & Circle Chart</span></div></footer>
      <a className="floating-chat" href="#ayuda"><MessageCircle size={18} /> <span>¿Dudas? Chat en vivo</span></a>
      {isCartOpen && <CartDrawer items={cart} close={() => setIsCartOpen(false)} removeOne={removeOne} clear={() => setCart([])} />}
    </div>
  );
}

function ShieldIcon() {
  return <PackageCheck size={14} />;
}

export default App;
