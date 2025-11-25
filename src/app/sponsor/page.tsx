import Aurora from "@/components/Aurora";
import PillNav from "@/components/PillNav";

export default function SponsorsPage() {
  return (
    <>
      {/* Global Background with SVG */}
      <div className="background-with-svg" id="top"></div>

      {/* Global Aurora Background */}
      <Aurora
        colorStops={["#AABFFF", "#1A2B5C", "#496DFD"]}
        blend={1}
        amplitude={1.0}
        speed={1}
      />

      {/* Navbar */}
      <PillNav
        logo="/logo.png"
        logoAlt="MSC Logo"
        items={[
          { label: 'Home', href: '/' },
          { label: 'About us', href: '/#about' },
          { label: 'Events', href: '/#events' },
          { label: 'Blogs', href: '/#blogs' },
          { label: 'Team', href: '/#team' },
          { label: 'Sponsors', href: '/sponsors' },  // NEW
          { label: 'Contact us', href: '/#contact' },
          { label: 'FAQ', href: '/#faq' },
        ]}
        activeHref="/sponsors"
        baseColor="#808080"      // gray navbar
        pillColor="#00008b"      // dark blue pill
        hoveredPillTextColor="#ffffff"
        pillTextColor="#ffffff"
        className="custom-nav"
      />

      {/* Page Content */}
      <section className="pt-40 pb-20 px-8 max-w-5xl mx-auto text-white">
        <h1 className="text-4xl font-bold mb-6">Our Sponsors</h1>
        <p className="opacity-80 mb-10">
          Show appreciation to the organizations/companies sponsoring MSC.
        </p>

        {/* Add sponsor cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Example Card */}
          <div className="p-6 backdrop-blur-xl bg-white/10 rounded-xl border border-white/20 shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Sponsor Name</h2>
            <p className="text-sm opacity-70">Sponsor description here…</p>
          </div>
        </div>
      </section>
    </>
  );
}
