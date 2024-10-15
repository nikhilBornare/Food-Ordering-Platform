const Footer = () => {
  const handleGithubRedirect = () => {
    window.open('https://github.com/nikhilBornare', '_blank');
  };

  return (
    <footer className="max-w-screen bg-gray-800 text-white mb-0 py-4 px-4">
      <div className=" mx-auto px-6 text-center">
        <span>Made with <span className="text-red-500">❤</span> by </span>
        <button
          onClick={handleGithubRedirect}
          className="text-white hover:text-orange underline focus:outline-none"
        >
          Nikhil Bornare
        </button>
      </div>
    </footer>
  );
};

export default Footer;
