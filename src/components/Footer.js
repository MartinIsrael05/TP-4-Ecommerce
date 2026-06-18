const Footer = () => {
  return (
    <footer className="bg-primary text-secondary pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-row justify-between items-start gap-12">

        <div className="flex flex-col items-center">
          <h2 className="font-medium text-[2em] font-sora text-white leading-none mt-2">
            ESSENCE
          </h2>
          <p className="text-sm text-neutral-300 mt-2">Perfumes premium</p>
        </div>

        <nav>
          <ul className="flex flex-col items-start gap-4 text-neutral-300 text-sm font-medium">
            <li>
              <a href="/categories" className="hover:text-white transition-colors">
                Categorias
              </a>
            </li>
            <li>
              <a href="/dashboard" className="hover:text-white transition-colors">
                Dashboard
              </a>
            </li>
          </ul>
        </nav>

      </div>
    </footer>
  );
};

export default Footer;
