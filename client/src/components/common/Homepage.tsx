import { useEffect } from 'react';
import { useHomepageNavigation } from '../../services/navigationService'; // Update this path as per your project structure
import './../../css/Homepage.css';

function Homepage() {
  const handleNavigation = useHomepageNavigation();

  useEffect(() => {
    handleNavigation();
  }, [handleNavigation]);

  return (
    <div className="homepage-container">
      <section className="text-gray-700 body-font">
        <div className="container mx-auto flex px-5 py-16 md:flex-row flex-col items-center">
          <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">Welcome to BioCloudLabs</h1>
            <p className="mb-4 leading-relaxed">The leading platform for omics analysis in the cloud. Explore our platform to enhance your research and development processes.</p>
            <div className="flex justify-center">
              <button className="inline-flex items-center justify-center bg-blue-700 text-white border-0 py-2 px-6 focus:outline-none hover:bg-blue-800 rounded text-lg transition duration-300 ease-in-out transform hover:-translate-y-1">
                Get Started
              </button>
            </div>
          </div>
          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
            <img className="circular-shadow-border" alt="BioCloudLabs logo" src="/images/Brand/Brand_hero.webp" />
          </div>
        </div>
      </section>

      <section className="text-gray-600 body-font">
        <div className="container px-5 py-12 mx-auto">
          <div className="flex flex-col text-center w-full mb-12">
            <h2 className="text-lg text-gray-900 bg-gray-100 tracking-widest font-medium title-font mb-1">
              THE ULTIMATE RESOURCE
            </h2>
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Why Choose BioCloudLabs?</h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">BioCloudLabs offers an integrated suite of features designed for the modern genomic researcher.</p>
          </div>
          <div className="flex flex-wrap justify-center">
            <div className="p-4 md:w-1/3">
              <div className="flex rounded-lg h-full bg-gray-100 p-6 flex-col">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-blue-900 text-white flex-shrink-0">
                    <span>🚀</span>  {/* Updated to bg-blue-900 for better contrast */}
                  </div>
                  <h2 className="text-black text-lg title-font font-medium">High Performance</h2>
                </div>
                <div className="flex-grow">
                  <p className="leading-relaxed text-gray-800 text-base">Experience fast and reliable analysis of your genomic data.</p>
                </div>
              </div>
            </div>

            <div className="p-4 md:w-1/3">
              <div className="flex rounded-lg h-full bg-gray-100 p-6 flex-col">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-blue-900 text-white flex-shrink-0">
                    <span>🌍</span>  {/* Assuming similar style as the rocket for uniformity */}
                  </div>

                  <h2 className="text-black text-lg title-font font-medium">Globally Accessible</h2>
                </div>
                <div className="flex-grow">
                  <p className="leading-relaxed text-gray-800 text-base">Access to your cloud projects from anywhere, at any time.</p>
                </div>
              </div>
            </div>

            <div className="p-4 md:w-1/3">
              <div className="flex rounded-lg h-full bg-gray-100 p-6 flex-col">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-blue-900 text-white flex-shrink-0">
                    <span>☁️</span>  {/* Assuming similar style as the rocket for uniformity */}
                  </div>
                  <h2 className="text-black text-lg title-font font-medium">Unlimited Cloud Usage</h2>
                </div>
                <div className="flex-grow">
                  <p className="leading-relaxed text-gray-800 text-base">Enjoy access to our cloud resources without usage restrictions.</p>
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
