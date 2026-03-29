import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

const galleryItems = [
  {
    src: '/ARTS/Weixin%20Image_20260321160559_7618_465.jpg',
    title: 'Artwork 01',
    description:
      'A featured piece from the collection, presented with a clean editorial layout and plenty of negative space.',
  },
  {
    src: '/ARTS/Weixin%20Image_20260324133342_9568_465.jpg',
    title: 'Artwork 02',
    description:
      'This page continues the portfolio rhythm with a simple composition: image on one side, description on the other.',
  },
  {
    src: '/ARTS/Weixin%20Image_20260324133554_9592_465.jpg',
    title: 'Artwork 03',
    description:
      'A minimal gallery presentation that keeps the focus on the visual work instead of extra framing elements.',
  },
  {
    src: '/ARTS/Weixin%20Image_20260324134127_9637_465.jpg',
    title: 'Artwork 04',
    description:
      'Designed to feel like a modern portfolio spread, with alternating alignment from one artwork page to the next.',
  },
  {
    src: '/ARTS/Weixin%20Image_20260324134128_9638_465.jpg',
    title: 'Artwork 05',
    description:
      'The layout stays quiet and balanced so each image can breathe while the text offers a short introduction.',
  },
  {
    src: '/ARTS/Weixin%20Image_20260324134719_9701_465.jpg',
    title: 'Artwork 06',
    description:
      'Large imagery and restrained typography help the gallery read like a sequence of full-page visual chapters.',
  },
  {
    src: '/ARTS/Weixin%20Image_20260328132951_10833_465.png',
    title: 'Artwork 07',
    description:
      'The final artwork page keeps the alternating pattern while preserving the same soft cherry blossom atmosphere.',
  },
]

const baseSections = [
  {
    id: 'hero',
    navLabel: 'Hero',
    eyebrow: 'Miss Zhi Personal Profile',
    title: 'Cherry Blossom Profile',
    text: 'A modern sakura-inspired personal website with full-page scrolling and a fixed header.',
    type: 'hero',
    theme: 'theme-hero',
  },
  {
    id: 'about',
    navLabel: 'About',
    eyebrow: 'About Me',
    title: 'Soft, calm, and expressive.',
    text: 'This section can hold a personal introduction, interests, values, and the small details that shape the profile.',
    type: 'copy',
    theme: 'theme-about',
  },
  {
    id: 'projects',
    navLabel: 'Projects',
    eyebrow: 'My Gallery',
    title: 'Artwork presented one page at a time.',
    text: 'Scroll down and each move snaps to the next full-screen artwork, like turning pages in a portfolio.',
    type: 'galleryIntro',
    theme: 'theme-projects',
  },
  {
    id: 'contact',
    navLabel: 'Contact',
    eyebrow: 'Contact',
    title: 'A final section for links and ways to connect.',
    text: 'This page is ready for email, social links, or any other contact information you want to add later.',
    type: 'copy',
    theme: 'theme-contact',
  },
]

function DeviceChooser({ onSelect }) {
  return (
    <div className="chooser-screen">
      <div className="chooser-shell">
        <p className="chooser-eyebrow">Miss Zhi Personal Profile</p>
        <h1 className="chooser-title">Choose Your Viewing Mode</h1>
        <p className="chooser-copy">
          Open the profile in a full desktop presentation or in a mobile portrait version.
        </p>

        <div className="chooser-grid">
          <button type="button" className="chooser-card" onClick={() => onSelect('desktop')}>
            <span className="chooser-icon desktop-icon" aria-hidden="true"></span>
            <strong>Desktop</strong>
            <span>Wide layout, side navigation dots, and alternating gallery spreads.</span>
          </button>

          <button type="button" className="chooser-card mobile" onClick={() => onSelect('mobile')}>
            <span className="chooser-icon mobile-icon" aria-hidden="true"></span>
            <strong>Mobile</strong>
            <span>Portrait layout with stacked sections, simplified navigation, and mobile-first spacing.</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function SiteExperience({ mode, onChangeMode }) {
  const isMobileMode = mode === 'mobile'
  const scrollRef = useRef(null)
  const sectionRefs = useRef({})
  const [activeSection, setActiveSection] = useState('hero')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const sections = useMemo(
    () => [
      baseSections[0],
      baseSections[1],
      baseSections[2],
      ...galleryItems.map((item, index) => ({
        id: `artwork-${index + 1}`,
        navLabel: null,
        eyebrow: 'Artwork',
        title: item.title,
        text: item.description,
        type: 'artwork',
        src: item.src,
        layout: isMobileMode ? 'media-stack' : index % 2 === 0 ? 'media-left' : 'media-right',
        order: index + 1,
        theme: index % 2 === 0 ? 'theme-artwork-a' : 'theme-artwork-b',
      })),
      baseSections[3],
    ],
    [isMobileMode],
  )

  useEffect(() => {
    const root = scrollRef.current
    if (!root) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (!visible) return

        const { id } = visible.target
        if (id.startsWith('artwork-')) {
          setActiveSection('projects')
          return
        }

        setActiveSection(id)
      },
      {
        root,
        threshold: [0.55, 0.7],
      },
    )

    sections.forEach((section) => {
      const element = sectionRefs.current[section.id]
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [sections])

  useEffect(() => {
    if (typeof window === 'undefined' || !window.Sakura) return undefined

    const sakura = new window.Sakura('body', {
      delay: isMobileMode ? 650 : 500,
      fallSpeed: isMobileMode ? 1.7 : 1.4,
      minSize: isMobileMode ? 8 : 10,
      maxSize: isMobileMode ? 13 : 16,
      colors: [
        {
          gradientColorStart: 'rgba(255, 212, 225, 0.9)',
          gradientColorEnd: 'rgba(246, 169, 196, 0.85)',
          gradientColorDegree: 120,
        },
        {
          gradientColorStart: 'rgba(255, 232, 239, 0.92)',
          gradientColorEnd: 'rgba(244, 190, 207, 0.88)',
          gradientColorDegree: 95,
        },
      ],
    })

    return () => {
      sakura.stop(true)
    }
  }, [isMobileMode])

  const handleNavigate = (id) => {
    const targetId = id === 'projects' ? 'projects' : id
    sectionRefs.current[targetId]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
    setMobileMenuOpen(false)
  }

  return (
    <div className={`app-shell ${isMobileMode ? 'app-mobile' : 'app-desktop'}`}>
      <header className="site-header">
        <div className="header-inner">
          <div className="brand-mark">
            <span className="brand-kicker">MISS ZHI</span>
            <span className="brand-name">Cherry Blossom Profile</span>
          </div>

          {isMobileMode ? (
            <button
              type="button"
              className="mobile-menu-toggle"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-site-nav"
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          ) : null}

          <nav
            id={isMobileMode ? 'mobile-site-nav' : undefined}
            className={
              isMobileMode
                ? mobileMenuOpen
                  ? 'site-nav mobile-open'
                  : 'site-nav mobile-collapsed'
                : 'site-nav'
            }
            aria-label="Primary"
          >
            {baseSections.map((section) => (
              <button
                key={section.id}
                type="button"
                className={activeSection === section.id ? 'nav-link active' : 'nav-link'}
                onClick={() => handleNavigate(section.id)}
              >
                {section.id === 'projects' ? 'My Gallery' : section.navLabel}
              </button>
            ))}
            <button
              type="button"
              className="nav-link mode-link"
              onClick={() => {
                setMobileMenuOpen(false)
                onChangeMode()
              }}
            >
              Choose View
            </button>
          </nav>
        </div>
      </header>

      {!isMobileMode ? (
        <div className="scroll-dots">
          {baseSections.map((section) => (
            <button
              key={section.id}
              type="button"
              className={activeSection === section.id ? 'dot active' : 'dot'}
              onClick={() => handleNavigate(section.id)}
              aria-label={
                section.id === 'projects'
                  ? 'Go to My Gallery section'
                  : `Go to ${section.navLabel} section`
              }
            >
              <span className="dot-label">
                {section.id === 'projects' ? 'My Gallery' : section.navLabel}
              </span>
            </button>
          ))}
        </div>
      ) : null}

      <main ref={scrollRef} className="snap-container">
        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            ref={(element) => {
              sectionRefs.current[section.id] = element
            }}
            className={`snap-section ${section.theme}`}
          >
            <div className="section-overlay"></div>

            <div className="section-inner">
              {section.type === 'artwork' ? (
                <div className={`artwork-layout ${section.layout}`}>
                  <div className="artwork-media">
                    <img src={section.src} alt={section.title} />
                  </div>
                  <div className="artwork-copy">
                    <p className="section-eyebrow">Artwork</p>
                    <h2 className="artwork-title">{section.title}</h2>
                    <p className="artwork-description">{section.text}</p>
                    <div className="artwork-meta">
                      <span>Gallery Piece</span>
                      <span>{String(section.order).padStart(2, '0')}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="content-block">
                  <p className="section-eyebrow">{section.eyebrow}</p>
                  <h1 className={section.type === 'hero' ? 'section-title hero' : 'section-title'}>
                    {section.title}
                  </h1>
                  <p className="section-copy">{section.text}</p>

                  {section.type === 'hero' ? (
                    <div className="hero-actions">
                      <button
                        type="button"
                        className="primary-action"
                        onClick={() => handleNavigate('about')}
                      >
                        Explore Profile
                      </button>
                      <button
                        type="button"
                        className="secondary-action"
                        onClick={() => handleNavigate('projects')}
                      >
                        Open Gallery
                      </button>
                    </div>
                  ) : null}

                  {section.type === 'galleryIntro' ? (
                    <div className="gallery-intro-card">
                      <span>{galleryItems.length} artworks in ARTS</span>
                      <span>Scroll down to flip one full page at a time</span>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </section>
        ))}
      </main>
    </div>
  )
}

function App() {
  const [mode, setMode] = useState(null)

  if (!mode) {
    return <DeviceChooser onSelect={setMode} />
  }

  return <SiteExperience mode={mode} onChangeMode={() => setMode(null)} />
}

export default App
