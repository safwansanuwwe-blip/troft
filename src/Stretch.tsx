import { useState, useEffect, useRef, type RefObject } from 'react';
import {
  User,
  Search,
  ShoppingBag,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';

/* ---------- scroll-triggered visibility hook ---------- */
function useInView<T extends HTMLElement>(
  threshold = 0.15
): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
}

const NAV_LINKS = ['shop', 'learn', 'journal', 'theme'];

/* ============================================================ */
export default function Stretch() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-black">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <BestSellers />
      <Categories />
    </div>
  );
}

/* ---------- Navigation ---------- */
function Header({
  menuOpen,
  setMenuOpen,
}: {
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
}) {
  return (
    <header className="relative bg-black text-white h-[104px]">
      {/* Announcement bar */}
      <div className="h-[38px] sm:h-[42px] flex items-center justify-center text-[11px] sm:text-xs tracking-[0.15em] uppercase text-white/80 border-b border-white/10">
        free shipping over €50 · 30-day returns
      </div>

      {/* Nav */}
      <nav className="absolute top-[38px] sm:top-[42px] left-0 right-0 z-30 px-4 sm:px-6 lg:px-10 h-[62px] flex items-center justify-between">
        {/* Left: logo */}
        <span className="text-lg sm:text-xl font-bold tracking-[0.2em] uppercase">
          STRETCH
        </span>

        {/* Center: links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a key={link} href="#" className="group relative text-sm">
              {link}
              <span className="absolute left-0 -bottom-1 w-0 group-hover:w-full h-[1px] bg-white transition-all duration-300" />
            </a>
          ))}
        </div>

        {/* Right: utilities */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden md:flex items-center gap-1.5 text-sm">
            <span className="w-6 h-4 flex overflow-hidden rounded-sm">
              <span className="flex-1 bg-blue-700" />
              <span className="flex-1 bg-white" />
              <span className="flex-1 bg-red-600" />
            </span>
            <span>eur €</span>
            <ChevronDown size={14} />
          </div>

          <span className="hidden md:block w-px h-5 bg-white/30 mx-2" />

          <button aria-label="Account" className="hidden sm:block">
            <User size={20} />
          </button>
          <button aria-label="Search">
            <Search size={20} />
          </button>
          <button aria-label="Cart">
            <ShoppingBag size={20} />
          </button>

          <button
            aria-label="Menu"
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>
    </header>
  );
}

/* ---------- Mobile Menu ---------- */
function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div
      className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center gap-8 transition-opacity duration-500 ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {NAV_LINKS.map((link) => (
        <a
          key={link}
          href="#"
          onClick={onClose}
          className="text-3xl font-light text-white"
        >
          {link}
        </a>
      ))}
    </div>
  );
}

/* ---------- Section 2: Best Sellers ---------- */
type Product = {
  category: string;
  subcategory?: string;
  name: string;
  price: string;
  oldPrice?: string;
  image: string;
};

const IMG_1 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260518_193822_8c95f5ed-b142-454f-ab87-59ad1f09e758.png&w=1280&q=85';
const IMG_2 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260518_194048_278bf3cc-7d1f-43c1-9dc7-73d8fcd9949c.png&w=1280&q=85';
const IMG_3 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260518_194058_d89610de-05f8-45e4-8196-0680296c565a.png&w=1280&q=85';
const IMG_4 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260518_194112_1763cbb2-3171-4ad3-9f38-1b738b8f1bb6.png&w=1280&q=85';

const PRODUCTS: Product[] = [
  { category: 'ILLUMINATE', name: 'Illuminating cleansing gel', price: '€36,00', image: IMG_1 },
  { category: 'UNIFY', subcategory: 'TIGHTEN PORES', name: 'Unifying serum spray', price: '€34,00', image: IMG_2 },
  { category: 'NATURAL GLOW', name: 'Super glow set', price: '€92,00', oldPrice: '€99,00', image: IMG_3 },
  { category: 'PROTECT', subcategory: 'ILLUMINATE', name: 'Radiance day oil', price: '€59,00', image: IMG_4 },
  { category: 'HYDRATE', subcategory: 'NOURISH', name: 'Deep moisture cream', price: '€48,00', image: IMG_1 },
  { category: 'RENEW', name: 'Night repair elixir', price: '€72,00', oldPrice: '€79,00', image: IMG_2 },
  { category: 'SMOOTH', subcategory: 'REFINE', name: 'Gentle exfoliating toner', price: '€42,00', image: IMG_3 },
];

function BestSellers() {
  const [ref, isVisible] = useInView<HTMLElement>();
  const [tab, setTab] = useState<'best sellers' | 'sets'>('best sellers');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Update progress bar from scroll position
  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setScrollProgress(max > 0 ? el.scrollLeft / max : 0);
  };

  // Hijack vertical wheel into horizontal scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <section
      ref={ref}
      className="bg-[#F9F4F0] text-black py-12 sm:py-16 px-4 sm:px-6 lg:px-10"
    >
      {/* Tabs */}
      <div
        className={`flex items-center gap-6 sm:gap-10 mb-8 sm:mb-10 transition-all duration-[800ms] ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        {(['best sellers', 'sets'] as const).map((t) => {
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center gap-3 text-2xl sm:text-4xl md:text-5xl font-medium transition-colors ${
                active ? 'text-[#1a1a1a]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {t}
              {active && (
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#1a1a1a] animate-scale-in" />
              )}
            </button>
          );
        })}
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex overflow-x-auto scrollbar-hide"
      >
        {PRODUCTS.map((p, index) => (
          <ProductCard
            key={index}
            product={p}
            index={index}
            visible={isVisible}
          />
        ))}
      </div>

      {/* Scroll progress bar */}
      <div className="mt-8 sm:mt-10 mx-auto max-w-[280px]">
        <div className="h-[2px] bg-gray-300 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1a1a1a] rounded-full"
            style={{
              width: '30%',
              transform: `translateX(${scrollProgress * (100 / 0.3)}%)`,
            }}
          />
        </div>
      </div>
    </section>
  );
}

function ProductCard({
  product,
  index,
  visible,
}: {
  product: Product;
  index: number;
  visible: boolean;
}) {
  return (
    <div
      className="group flex-shrink-0 w-[260px] sm:w-[280px] md:w-[300px] lg:w-[calc(25%-1px)] border border-gray-200 -ml-[1px] first:ml-0 py-4 transition-all duration-500"
      style={{
        transitionDelay: `${200 + index * 80}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
      }}
    >
      {/* Top: category */}
      <div className="px-4 h-12">
        <p className="text-xs font-medium tracking-wider uppercase">
          {product.category}
        </p>
        {product.subcategory && (
          <p className="text-xs text-gray-500 uppercase mt-0.5">
            {product.subcategory}
          </p>
        )}
      </div>

      {/* Middle: image */}
      <div className="mx-4 aspect-[3/4] rounded-lg overflow-hidden bg-[#F9F4F0]">
        <img
          src={product.image}
          alt={product.name}
          draggable={false}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Bottom: name + price */}
      <div className="px-4 mt-4 text-center">
        <p className="text-sm">{product.name}</p>
        <p className="mt-1 flex items-center justify-center gap-2 text-sm">
          {product.oldPrice && (
            <span className="text-gray-400 line-through">{product.oldPrice}</span>
          )}
          <span>{product.price}</span>
        </p>
      </div>
    </div>
  );
}

/* ---------- Section 3: Categories ---------- */
type Category = { name: string; video: string };

const CATEGORIES: Category[] = [
  {
    name: 'face',
    video:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260518_203023_87a26602-2898-4acc-a396-c7a2b5ad84fd.mp4',
  },
  {
    name: 'beauty tools',
    video:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260518_203415_b86e3f19-2aec-46cd-9a86-b64c40118e38.mp4',
  },
  {
    name: 'body',
    video:
      'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260518_203051_85fee398-ea01-4aa0-972b-137a74213be5.mp4',
  },
];

function Categories() {
  const [ref, isVisible] = useInView<HTMLElement>();

  return (
    <section
      ref={ref}
      className={`bg-black text-white grid grid-cols-1 md:grid-cols-3 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      {CATEGORIES.map((cat) => (
        <CategoryCard key={cat.name} category={cat} />
      ))}
    </section>
  );
}

function CategoryCard({ category }: { category: Category }) {
  return (
    <div className="group relative overflow-hidden min-h-[400px] sm:min-h-[500px] md:min-h-[750px] p-6 sm:p-8 md:p-12 flex flex-col justify-between">
      <video
        src={category.video}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500" />

      {/* Vertical title */}
      <div className="relative z-10 flex-1 flex items-start transition-transform duration-300 group-hover:-translate-y-[2px]">
        <span
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium"
          style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}
        >
          {category.name}
        </span>
      </div>

      {/* Shop button */}
      <div className="relative z-10">
        <button className="btn-primary px-8 py-3 bg-white text-black rounded-full text-sm">
          shop {category.name}
        </button>
      </div>
    </div>
  );
}
