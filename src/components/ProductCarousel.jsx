import { useEffect, useRef, useState } from 'react';

const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export default function ProductCarousel({ products, titleCase }) {
  const trackRef = useRef(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const update = () => {
    const el = trackRef.current;
    if (!el) return;
    setEdge({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  };

  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const go = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const item = el.querySelector('.pc-loop__item');
    const step = item ? item.getBoundingClientRect().width + parseFloat(getComputedStyle(el).columnGap || 0) : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <div className="pc-loop">
      <button type="button" className="pc-loop__arrow pc-loop__arrow--prev" onClick={() => go(-1)} disabled={edge.start} aria-label="Previous products">
        <span aria-hidden="true">←</span>
      </button>
      <div className="pc-loop__track" ref={trackRef} onScroll={update}>
        {products.map(([number, name, , image]) => (
          <a href="#contact" className="pc-loop__item" key={name}>
            <span className="pc-loop__media">
              <img
                src={`/images/product-${slug(name)}.jpg`}
                alt={titleCase(name)}
                loading="lazy"
                onError={(e) => { if (!e.currentTarget.src.endsWith(image)) e.currentTarget.src = image; }}
              />
            </span>
            <span className="pc-loop__name"><small>{number}</small>{titleCase(name)}</span>
          </a>
        ))}
      </div>
      <button type="button" className="pc-loop__arrow pc-loop__arrow--next" onClick={() => go(1)} disabled={edge.end} aria-label="Next products">
        <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}
