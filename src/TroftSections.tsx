import {
  useState,
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { ArrowUpRight, Plus } from 'lucide-react';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
const ACCENT = '#F4845F';
const ANTON = 'Anton, sans-serif';
const INTER = 'Inter, sans-serif';

/* ---------- scroll-reveal hook ----------
   Reveals once the element scrolls into view. Uses a synchronous rect
   check at mount (covers anything already on screen) and an
   IntersectionObserver for elements scrolled into view afterwards.
   `triggerAt` is the fraction of viewport height at which it fires. */
function useReveal<T extends HTMLElement>(triggerAt = 0.85) {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Already visible at mount? reveal immediately.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * triggerAt && rect.bottom > 0) {
      setShown(true);
      return;
    }

    // Otherwise observe until it scrolls in.
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

/* ---------- parallax hook (scroll-driven translateY) ---------- */
function useParallax<T extends HTMLElement>(speed = 0.15) {
  const ref = useRef<T>(null);
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const elCenter = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      setOffset((elCenter - viewportCenter) * -speed);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [speed]);
  return { ref, offset };
}

/* reveal style helper */
const revealStyle = (
  shown: boolean,
  delay = 0,
  distance = 40
): CSSProperties => ({
  opacity: shown ? 1 : 0,
  transform: shown ? 'translateY(0)' : `translateY(${distance}px)`,
  transition: `opacity 900ms ${EASE} ${delay}ms, transform 900ms ${EASE} ${delay}ms`,
  willChange: 'opacity, transform',
});

/* ---------- swappable media placeholder ----------
   Pass `src` later to render a real image; until then it shows a
   labelled placeholder box. */
function Media({
  src,
  label,
  className,
  style,
}: {
  src?: string;
  label: string;
  className?: string;
  style?: CSSProperties;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={label}
        draggable={false}
        className={className}
        style={{ objectFit: 'cover', ...style }}
      />
    );
  }
  return (
    <div
      className={className}
      style={{
        background:
          'repeating-linear-gradient(45deg,#1a1a1a,#1a1a1a 12px,#222 12px,#222 24px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(255,255,255,0.55)',
        ...style,
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontFamily: INTER,
          fontSize: 11,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
        }}
      >
        <Plus size={14} /> {label}
      </span>
    </div>
  );
}

/* ============================================================ */
/* 1. Marquee strip                                             */
/* ============================================================ */
export function Marquee() {
  const phrase = 'TROFT — FITS THAT HIT DIFFERENT — SHOES & THREADS — ';
  const text = phrase.repeat(4);
  return (
    <div
      style={{ background: '#0a0a0a', borderBlock: '1px solid rgba(255,255,255,0.1)' }}
      className="overflow-hidden py-5 sm:py-7"
    >
      <div className="troft-marquee-track">
        {[0, 1].map((i) => (
          <span
            key={i}
            style={{
              fontFamily: ANTON,
              fontSize: 'clamp(28px, 5vw, 64px)',
              color: '#fff',
              letterSpacing: '-0.01em',
              paddingRight: 24,
            }}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ============================================================ */
/* 2. Featured shoes grid                                       */
/* ============================================================ */
type Product = { name: string; price: string; tag?: string; src?: string };

const SHOES: Product[] = [
  { name: 'Apex Runner', price: '$140', tag: 'NEW' },
  { name: 'Court Classic', price: '$120' },
  { name: 'Trail Beast', price: '$165', tag: 'DROP' },
  { name: 'Street Glide', price: '$110' },
];

export function FeaturedShoes() {
  const { ref, shown } = useReveal<HTMLElement>();
  return (
    <section
      ref={ref}
      style={{ background: '#fff', fontFamily: INTER }}
      className="px-4 sm:px-8 lg:px-12 py-16 sm:py-24"
    >
      <div className="flex items-end justify-between mb-10 sm:mb-14">
        <h2
          style={{
            ...revealStyle(shown),
            fontFamily: ANTON,
            fontSize: 'clamp(40px, 8vw, 110px)',
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
            color: '#0a0a0a',
          }}
        >
          THE
          <br />
          KICKS
        </h2>
        <a
          href="#"
          style={{ ...revealStyle(shown, 150), fontFamily: INTER }}
          className="hidden sm:flex items-center gap-1 text-sm font-semibold uppercase tracking-widest text-black/70 hover:text-black transition-colors"
        >
          all shoes <ArrowUpRight size={16} />
        </a>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {SHOES.map((p, i) => (
          <ProductCard key={p.name} product={p} delay={i * 120} shown={shown} />
        ))}
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
  const [hover, setHover] = useState(false);
  return (
    <div
      style={revealStyle(shown, delay)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        style={{
          position: 'relative',
          aspectRatio: '4 / 5',
          borderRadius: 16,
          overflow: 'hidden',
          background: '#f2f2f2',
        }}
      >
        <Media
          label={`${product.name} image`}
          src={product.src}
          className="absolute inset-0 w-full h-full"
          style={{
            transform: hover ? 'scale(1.06)' : 'scale(1)',
            transition: `transform 700ms ${EASE}`,
          }}
        />
        {product.tag && (
          <span
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              background: ACCENT,
              color: '#fff',
              fontFamily: INTER,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.12em',
              padding: '5px 10px',
              borderRadius: 999,
            }}
          >
            {product.tag}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span style={{ fontFamily: INTER }} className="text-sm font-semibold text-black">
          {product.name}
        </span>
        <span style={{ fontFamily: INTER }} className="text-sm text-black/60">
          {product.price}
        </span>
      </div>
    </div>
  );
}

/* ============================================================ */
/* 3. Clothing editorial split (with parallax)                  */
/* ============================================================ */
export function ClothingSplit() {
  const { ref, shown } = useReveal<HTMLElement>();
  const para = useParallax<HTMLDivElement>(0.12);
  return (
    <section
      ref={ref}
      style={{ background: '#0a0a0a', color: '#fff', fontFamily: INTER }}
      className="grid grid-cols-1 lg:grid-cols-2 items-stretch"
    >
      {/* Image side with parallax */}
      <div className="relative overflow-hidden min-h-[60vh] lg:min-h-[90vh]">
        <div
          ref={para.ref}
          className="absolute inset-x-0"
          style={{
            top: '-12%',
            height: '124%',
            transform: `translateY(${para.offset}px)`,
            willChange: 'transform',
          }}
        >
          <Media
            label="clothing editorial"
            className="w-full h-full"
            style={{ height: '100%', width: '100%' }}
          />
        </div>
      </div>

      {/* Text side */}
      <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-16 lg:py-0">
        <span
          style={{ ...revealStyle(shown), color: ACCENT, fontFamily: INTER }}
          className="text-xs font-bold uppercase tracking-[0.3em] mb-5"
        >
          The Wardrobe
        </span>
        <h2
          style={{
            ...revealStyle(shown, 100),
            fontFamily: ANTON,
            fontSize: 'clamp(44px, 6vw, 96px)',
            lineHeight: 0.98,
            letterSpacing: '-0.02em',
          }}
        >
          THREADS
          <br />
          THAT TALK
        </h2>
        <p
          style={{ ...revealStyle(shown, 200), fontFamily: INTER }}
          className="mt-6 max-w-md text-white/70 leading-relaxed"
        >
          Clean silhouettes, heavyweight cotton, zero filler. Built to layer,
          made to last — the pieces you reach for before everything else.
        </p>
        <a
          href="#"
          style={{ ...revealStyle(shown, 300), fontFamily: INTER, background: '#fff', color: '#0a0a0a' }}
          className="btn-primary mt-10 inline-flex items-center gap-2 self-start px-9 py-4 rounded-full text-sm font-semibold uppercase tracking-widest"
        >
          shop clothing <ArrowUpRight size={16} />
        </a>
      </div>
    </section>
  );
}

/* ============================================================ */
/* 4. Category showcase                                         */
/* ============================================================ */
const CATEGORIES = [
  { name: 'SHOES', count: '48 styles' },
  { name: 'CLOTHING', count: '120 styles' },
  { name: 'ACCESSORIES', count: '36 styles' },
];

export function CategoryShowcase() {
  const { ref, shown } = useReveal<HTMLElement>();
  return (
    <section
      ref={ref}
      style={{ background: '#fff', fontFamily: INTER }}
      className="px-4 sm:px-8 lg:px-12 py-16 sm:py-24"
    >
      <h2
        style={{
          ...revealStyle(shown),
          fontFamily: ANTON,
          fontSize: 'clamp(36px, 6vw, 84px)',
          letterSpacing: '-0.02em',
          color: '#0a0a0a',
        }}
        className="mb-10 sm:mb-14"
      >
        SHOP BY CATEGORY
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {CATEGORIES.map((c, i) => (
          <CategoryTile key={c.name} {...c} delay={i * 140} shown={shown} />
        ))}
      </div>
    </section>
  );
}

function CategoryTile({
  name,
  count,
  delay,
  shown,
}: {
  name: string;
  count: string;
  delay: number;
  shown: boolean;
}) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href="#"
      style={revealStyle(shown, delay)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group relative block overflow-hidden rounded-2xl"
    >
      <div style={{ aspectRatio: '3 / 4' }} className="relative">
        <Media
          label={`${name} image`}
          className="absolute inset-0 w-full h-full"
          style={{
            transform: hover ? 'scale(1.05)' : 'scale(1)',
            transition: `transform 700ms ${EASE}`,
          }}
        />
        <div
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 55%)',
          }}
          className="absolute inset-0"
        />
        <div className="absolute bottom-0 left-0 p-6 sm:p-7">
          <h3
            style={{
              fontFamily: ANTON,
              fontSize: 'clamp(28px, 4vw, 48px)',
              color: '#fff',
              letterSpacing: '-0.01em',
              transform: hover ? 'translateY(-4px)' : 'translateY(0)',
              transition: `transform 400ms ${EASE}`,
            }}
          >
            {name}
          </h3>
          <span
            style={{ fontFamily: INTER }}
            className="text-xs uppercase tracking-widest text-white/70"
          >
            {count}
          </span>
        </div>
      </div>
    </a>
  );
}

/* ============================================================ */
/* 5. Newsletter / footer CTA                                   */
/* ============================================================ */
export function NewsletterCTA() {
  const { ref, shown } = useReveal<HTMLElement>();
  return (
    <section
      ref={ref}
      style={{ background: '#0a0a0a', color: '#fff', fontFamily: INTER }}
      className="px-6 sm:px-12 py-20 sm:py-28"
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2
          style={{
            ...revealStyle(shown),
            fontFamily: ANTON,
            fontSize: 'clamp(48px, 10vw, 150px)',
            lineHeight: 0.92,
            letterSpacing: '-0.02em',
          }}
        >
          JOIN THE DROP
        </h2>
        <p
          style={{ ...revealStyle(shown, 120), fontFamily: INTER }}
          className="mt-5 text-white/65 max-w-md mx-auto"
        >
          Be first to cop new releases. No spam, just heat.
        </p>
        <form
          style={revealStyle(shown, 220)}
          onSubmit={(e) => e.preventDefault()}
          className="mt-9 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            placeholder="your@email.com"
            style={{ fontFamily: INTER }}
            className="flex-1 px-5 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm outline-none focus:border-white/50 transition-colors"
          />
          <button
            type="submit"
            style={{ background: ACCENT, color: '#fff', fontFamily: INTER }}
            className="btn-primary px-8 py-4 rounded-full text-sm font-semibold uppercase tracking-widest"
          >
            notify me
          </button>
        </form>
      </div>

      <Footer />
    </section>
  );
}

function Footer() {
  const cols: { title: string; links: string[] }[] = [
    { title: 'Shop', links: ['Shoes', 'Clothing', 'Accessories', 'New Drops'] },
    { title: 'Help', links: ['Shipping', 'Returns', 'Size Guide', 'Contact'] },
    { title: 'Company', links: ['About', 'Careers', 'Press', 'Sustainability'] },
  ];
  return (
    <div className="max-w-6xl mx-auto mt-20 sm:mt-28 pt-10 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8 text-left">
      <span
        style={{ fontFamily: ANTON, fontSize: 28, letterSpacing: '0.04em' }}
        className="col-span-2 md:col-span-1"
      >
        troft
      </span>
      {cols.map((col) => (
        <FooterCol key={col.title} title={col.title} links={col.links} />
      ))}
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4
        style={{ fontFamily: INTER }}
        className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4"
      >
        {title}
      </h4>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l}>
            <a
              href="#"
              style={{ fontFamily: INTER }}
              className="text-sm text-white/80 hover:text-white transition-colors"
            >
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* convenience: all Troft sections in order */
export function TroftSections(): ReactNode {
  return (
    <>
      <Marquee />
      <FeaturedShoes />
      <ClothingSplit />
      <CategoryShowcase />
      <NewsletterCTA />
    </>
  );
}

