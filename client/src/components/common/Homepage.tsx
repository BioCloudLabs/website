import { useEffect } from 'react';
import { useHomepageNavigation } from '../../services/navigationService'; // Update this path as per your project structure
import { useLocation } from 'react-router-dom';

function Homepage() {
  const handleNavigation = useHomepageNavigation();

  useEffect(() => {
    handleNavigation();
  }, [handleNavigation]);

  return (
    <div className="homepage-container">
      <section className="text-gray-700 body-font">
        <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
          <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">Welcome to BioCloudLabs</h1>
            <p className="mb-8 leading-relaxed">The leading platform for omics analysis in the cloud. Explore our platform to enhance your research and development processes.</p>
            <div className="flex justify-center">
              <button className="inline-flex text-white bg-blue-500 border-0 py-2 px-6 focus:outline-none hover:bg-blue-600 rounded text-lg">Get Started</button>
            </div>
          </div>
          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
            <img className="object-cover object-center rounded" alt="hero" src="./../../../public/images/Brand/Brand_hero.webp" />
          </div>
        </div>
      </section>

      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-20">
            <h2 className="text-xs text-blue-500 tracking-widest font-medium title-font mb-1">THE ULTIMATE RESOURCE</h2>
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Why Choose BioCloudLabs?</h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">BioCloudLabs offers an integrated suite of features designed for the modern genomic researcher.</p>
          </div>
          <div className="flex flex-wrap">
            <div className="p-4 md:w-1/3">
              <div className="flex rounded-lg h-full bg-gray-100 p-8 flex-col">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-blue-500 text-white flex-shrink-0">
                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M21 16v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2"></path>
                      <circle cx="7.5" cy="4.5" r="4.5"></circle>
                      <circle cx="17.5" cy="4.5" r="4.5"></circle>
                    </svg>
                  </div>
                  <h2 className="text-gray-900 text-lg title-font font-medium">High Performance</h2>
                </div>
                <div className="flex-grow">
                  <p className="leading-relaxed text-base">Experience fast and reliable analysis of your genomic data.</p>
                </div>
              </div>
            </div>

            <div className="p-4 md:w-1/3">
              <div className="flex rounded-lg h-full bg-gray-100 p-8 flex-col">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-blue-500 text-white flex-shrink-0">
                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M18 9l-7 13-4-4-4 4V9"></path>
                      <circle cx="18" cy="5" r="3"></circle>
                    </svg>
                  </div>
                  <h2 className="text-gray-900 text-lg title-font font-medium">Accessibility</h2>
                </div>
                <div className="flex-grow">
                  <p className="leading-relaxed text-base">Access your projects from anywhere, at any time.</p>
                </div>
              </div>
            </div>

            <div className="p-4 md:w-1/3">
              <div className="flex rounded-lg h-full bg-gray-100 p-8 flex-col">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-blue-500 text-white flex-shrink-0">
                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M3 18v-6a9 9 0 0118 0v6"></path>
                      <path d="M8.21 3a3.001 3.001 0 005.576 0"></path>
                      <path d="M12 10v6m0 0v3m0-3a3 3 0 11-3-3 3 3 0 013 3z"></path>
                    </svg>
                  </div>
                  <h2 className="text-gray-900 text-lg title-font font-medium">Unlimited Cloud Usage</h2>
                </div>
                <div className="flex-grow">
                  <p className="leading-relaxed text-base">Enjoy unlimited access to our cloud resources without any restrictions.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Homepage;
