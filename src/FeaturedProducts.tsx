import {
  useState,
  useEffect,
  useRef,
  type CSSProperties,
} from 'react';
import { ArrowRight, Plus } from 'lucide-react';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
const ACCENT = '#F4845F';
const ANTON = 'Anton, sans-serif';
const INTER = 'Inter, sans-serif';

/* ---------- editable product data ----------
   Replace these / add more later. Set `image` to a URL to show a real
   photo; until then a labelled placeholder is rendered. */
type Product = {
  name: string;
  category: string;
  price: string;
  image?: string;
};

const PRODUCTS: Product[] = [
  { name: 'Apex Runner', category: 'Sneakers', price: '$140' },
  { name: 'Court Classic', category: 'Sneakers', price: '$120' },
  { name: 'Oversized Hoodie', category: 'Apparel', price: '$88' },
  { name: 'Cargo Pants', category: 'Apparel', price: '$95' },
  { name: 'Trail Beast', category: 'Sneakers', price: '$165' },
  { name: 'Logo Cap', category: 'Accessories', price: '$34' },
  { name: 'Street Glide', category: 'Sneakers', price: '$110' },
  { name: 'Tech Jacket', category: 'Apparel', price: '$180' },
];

/* ---------- scroll-reveal hook (sync rect check + IntersectionObserver) ---------- */
function useReveal<T extends HTMLElement>(triggerAt = 0.85) {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * triggerAt && rect.bottom > 0) {
      setShown(true);
      return;
    }
    const bottomMargin = Math.round((1 - triggerAt) * 100);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0, rootMargin: `0px 0px -${bottomMargin}% 0px` }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [triggerAt]);
  return { ref, shown };
}

const revealStyle = (
  shown: boolean,
  delay = 0,
  distance = 32
): CSSProperties => ({
  opacity: shown ? 1 : 0,
  transform: shown ? 'translateY(0)' : `translateY(${distance}px)`,
  transition: `opacity 800ms ${EASE} ${delay}ms, transform 800ms ${EASE} ${delay}ms`,
  willChange: 'opacity, transform',
});

/* ---------- swappable image ---------- */
function ProductImage({ src, name }: { src?: string; name: string }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    );
  }
  return (
    <div
      className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-105"
      style={{
        background:
          'repeating-linear-gradient(45deg,#ece3da,#ece3da 12px,#f4ece4 12px,#f4ece4 24px)',
        color: '#9a8f84',
      }}
    >
      <span
        style={{ fontFamily: INTER }}
        className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em]"
      >
        <Plus size={14} /> {name}
      </span>
    </div>
  );
}

/* ============================================================ */
export default function FeaturedProducts() {
  const { ref, shown } = useReveal<HTMLElement>();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  };

  // hijack vertical wheel into horizontal scroll
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
      style={{ background: '#F9F4F0', fontFamily: INTER }}
      className="px-4 sm:px-8 lg:px-12 py-16 sm:py-24"
    >
      {/* Heading */}
      <div className="flex items-end justify-between mb-8 sm:mb-12">
        <h2
          style={{
            ...revealStyle(shown),
            fontFamily: ANTON,
            fontSize: 'clamp(36px, 6vw, 88px)',
            lineHeight: 0.98,
            letterSpacing: '-0.02em',
            color: '#0a0a0a',
          }}
        >
          Featured Products
        </h2>
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory"
      >
        {PRODUCTS.map((p, i) => (
          <ProductCard key={p.name} product={p} delay={i * 90} shown={shown} />
        ))}
      </div>

      {/* Scroll progress bar */}
      <div className="mt-8 sm:mt-10 mx-auto max-w-[280px]">
        <div className="h-[2px] bg-black/15 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: '30%',
              background: '#0a0a0a',
              transform: `translateX(${progress * (100 / 0.3)}%)`,
            }}
          />
        </div>
      </div>
    </section>
  );
}

function ProductCard({
  product,
  delay,
  shown,
}: {
  product: Product;
  delay: number;
  shown: boolean;
}) {
  return (
    <div
      style={revealStyle(shown, delay)}
      className="group flex-shrink-0 snap-start w-[240px] sm:w-[280px] md:w-[300px] lg:w-[320px]"
    >
      {/* Image */}
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{ aspectRatio: '4 / 5', background: '#efe7df' }}
      >
        <ProductImage src={product.image} name={product.name} />
      </div>

      {/* Details */}
      <div className="mt-4">
        <span
          style={{ color: ACCENT, fontFamily: INTER }}
          className="text-[11px] font-bold uppercase tracking-[0.18em]"
        >
          {product.category}
        </span>
        <div className="mt-1 flex items-baseline justify-between gap-3">
          <h3
            style={{ fontFamily: INTER }}
            className="text-base font-semibold text-[#0a0a0a]"
          >
            {product.name}
          </h3>
          <span
            style={{ fontFamily: INTER }}
            className="text-sm text-black/60 whitespace-nowrap"
          >
            {product.price}
          </span>
        </div>

        <button
          style={{ background: '#0a0a0a', color: '#fff', fontFamily: INTER }}
          className="btn-primary mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-widest"
        >
          view product <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
