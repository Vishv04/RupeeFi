import { Link } from 'react-router-dom';

const MerchantLanding = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Accept Payments with</span>
            <span className="block text-indigo-600">RupeeFi</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Join thousands of merchants who trust RupeeFi for their payment needs. Get started in minutes.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link to="/merchant/register">
              <button className="px-8 py-3 text-base font-medium text-white bg-green-600 hover:bg-green-700 rounded-md shadow-sm">
                Register Now
              </button>
            </Link>
            <Link to="/merchant/login">
              <button className="px-8 py-3 text-base font-medium text-indigo-600 bg-white hover:bg-gray-50 border border-indigo-600 rounded-md shadow-sm">
                Sign In
              </button>
            </Link>
          </div>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="pt-6">
              <div className="flow-root bg-white rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                    {/* Icon */}
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Easy Integration</h3>
                  <p className="mt-5 text-base text-gray-500">
                    Quick and simple integration with your existing systems
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="flow-root bg-white rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                    {/* Icon */}
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Secure Payments</h3>
                  <p className="mt-5 text-base text-gray-500">
                    Industry-standard security for all transactions
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="flow-root bg-white rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                    {/* Icon */}
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">24/7 Support</h3>
                  <p className="mt-5 text-base text-gray-500">
                    Round-the-clock support for all your needs
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantLanding; 