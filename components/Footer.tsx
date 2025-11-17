export default function Footer() {
  return (
    <footer className="relative w-full py-16 overflow-hidden">
      {/* Main Footer Content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center space-y-6">
        {/* Top Links */}
        <div className="flex flex-wrap justify-center gap-6 text-xl text-black">
          <a href="#" className="hover:text-gray-300 transition-colors">
            Product
          </a>
          <a href="#" className="hover:text-gray-300 transition-colors">
            About Us
          </a>
          <a href="#" className="hover:text-gray-300 transition-colors">
            Contact
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition-colors"
          >
            Twitter ↗
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition-colors"
          >
            LinkedIn ↗
          </a>
        </div>

        {/* Privacy Policy */}
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
