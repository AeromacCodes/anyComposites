import './OurWork.css';

/*
  Our work — image gallery on the landing page (after Standard range).
  Mosaic of mixed sizes; a small label shows on hover.
  Images: save as public/images/work-1.jpg … work-8.jpg (the fallback shows until then).
  Labels are placeholders — change them to describe each photo.
*/
const GALLERY = [
  { label: 'Aerospace', image: '/images/work-1.jpg', fallback: '/images/sector-aerospace.jpg' },
  { label: 'Layup', image: '/images/work-2.jpg', fallback: '/images/process-manufacturing.jpg' },
  { label: 'Medical', image: '/images/work-3.jpg', fallback: '/images/sector-medical.jpg' },
  { label: 'Design & engineering', image: '/images/work-4.jpg', fallback: '/images/process-design.jpg' },
  { label: 'Automotive', image: '/images/work-5.jpg', fallback: '/images/sector-automotive.jpg' },
  { label: 'Machining', image: '/images/work-6.jpg', fallback: '/images/process-machining.jpg' },
  { label: 'UAV & Defence', image: '/images/work-7.jpg', fallback: '/images/sector-uav-defence.jpg' },
  { label: 'Sports', image: '/images/work-8.jpg', fallback: '/images/sector-sports.jpg' },
];

export default function OurWork() {
  return (
    <section id="our-work" className="pdf-products product-catalogue our-work">
      <header className="product-catalogue-heading">
        <div>
          <span>Our work</span>
          <h2>Gallery</h2>
        </div>
        <p>Composite parts and projects from our design office, workshop and the field.</p>
      </header>

      <div className="ow-gallery">
        {GALLERY.map((item, i) => (
          <figure className="ow-tile" key={item.image}>
            <img
              src={item.image}
              alt={item.label}
              loading="lazy"
              onError={(e) => { if (!e.currentTarget.src.endsWith(item.fallback)) e.currentTarget.src = item.fallback; }}
            />
            <figcaption>{item.label}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
