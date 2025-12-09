import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog"

export default function Footer() {
  return (
    <footer className="relative w-full py-16 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto text-center space-y-6">
        
        {/* Top Links */}
        <div className="flex flex-wrap justify-center gap-6 text-xl text-black">

          {/* ABOUT US with dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <button className="hover:text-gray-300 transition-colors">
                About Us
              </button>
            </DialogTrigger>

            <DialogContent
              className="
                sm:max-w-[550px]
                max-h-[75vh]
                p-0
                flex flex-col justify-center
              "
            >
              {/* Scrollable container */}
              <div className="relative overflow-y-auto p-6 space-y-6 text-center max-h-[75vh]">

                {/* Header */}
                <div className="space-y-2">
                  <h2 className="text-3xl font-semibold tracking-tight">About Us</h2>
                  <p className="text-gray-500 text-sm">
                    Learn more about who we are and what we do.
                  </p>
                </div>

                <div className="border-t border-gray-200" />

                {/* Overview */}
                <section className="space-y-3">
                  <h3 className="text-xl font-semibold">Overview</h3>
                  <p className="text-gray-600 leading-relaxed">
                    The E-Barangay Portal provides Bacoor residents with modern access
                    to essential services, public announcements, and community information.
                    Our goal is to simplify communication between the barangay and citizens.
                  </p>
                </section>

                <div className="border-t border-gray-200" />

                {/* Mission */}
                <section className="space-y-3">
                  <h3 className="text-xl font-semibold">Mission</h3>
                  <p className="text-gray-600 leading-relaxed">
                    To deliver convenient, reliable, and efficient digital services that
                    enhance public transparency and bring important community tools closer
                    to every resident.
                  </p>
                </section>

                <div className="border-t border-gray-200" />

                {/* Vision */}
                <section className="space-y-3">
                  <h3 className="text-xl font-semibold">Vision</h3>
                  <p className="text-gray-600 leading-relaxed">
                    A connected and empowered digital community where information and 
                    essential services are always accessible anytime, anywhere.
                  </p>
                </section>

                <div className="border-t border-gray-200" />

                {/* Core Values */}
                <section className="space-y-3 pb-3">
                  <h3 className="text-xl font-semibold">Core Values</h3>
                  <ul className="text-gray-600 space-y-2 list-none leading-relaxed">
                    <li><strong>Transparency</strong> – Clear and accessible information.</li>
                    <li><strong>Efficiency</strong> – Faster, simplified barangay services.</li>
                    <li><strong>Community</strong> – Strengthening citizen engagement.</li>
                    <li><strong>Accessibility</strong> – Easy to use for all residents.</li>
                    <li><strong>Innovation</strong> – Continuous improvement for better service.</li>
                  </ul>
                </section>
              </div>
            </DialogContent>
          </Dialog>


          {/* CONTACT */}
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=mjenolpediz@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition-colors"
          >
            Contact
          </a>

          {/* FACEBOOK */}
          <a
            href="https://www.facebook.com/acscvsubacoor"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition-colors"
          >
            Facebook ↗
          </a>

          {/* LINKEDIN */}
          <a
            href="#"
            className="hover:text-gray-300 transition-colors"
          >
            Back to Top ↗
          </a>
        </div>

        <p className="text-xs text-gray-400">Computer Science Privacy Policy</p>
      </div>

      {/* Background Text */}
      <div className="mt-10">
        <h1
          className="font-bold select-none leading-none text-center 
                    text-5xl sm:text-7xl md:text-[8rem] lg:text-[10rem] xl:text-[12rem] 
                    text-transparent bg-clip-text
                    [background-image:repeating-linear-gradient(45deg,theme(colors.blue.100)_0,theme(colors.blue.100)_2px,transparent_2px,transparent_6px)]"
        >
          E-Barangay Portal
        </h1>
      </div>
    </footer>
  );
}
