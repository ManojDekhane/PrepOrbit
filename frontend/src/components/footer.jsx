
const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-50 to-slate-200 text-center py-6 px-4 shadow-inner mt-auto border-t border-gray-300">
      <p className="text-gray-700 text-sm font-medium">
        © {new Date().getFullYear()} <span className="font-semibold text-blue-700">PrepOrbit</span>. All rights reserved.
      </p>
      <p className="text-gray-500 text-xs mt-1 leading-snug">
      <span className="font-semibold text-blue-600">PrepOrbit</span>   helps you master every exam, one paper at a time.
        <br className="hidden sm:block" />
        Stuck anywhere? Just ask <span className="font-semibold text-blue-600">PrepBot</span>.
      </p>
    </footer>
  );
};

export default Footer;
