import React, { useState, useEffect, useRef, Suspense } from 'react';
// Note: Canvas/3D imports remain commented out for stability

// --- GLOBAL HELPER FUNCTION ---
const formatPrice = (n) => {
  if (typeof n !== 'number' || isNaN(n)) { return '₹ --'; }
  return n.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
};

// --- CALCULATOR FUNCTIONS (Omitted for brevity, assumed unchanged) ---
const calculateEMI = (principal, annualInterestRate, tenureYears) => { 
    if (principal <= 0 || annualInterestRate < 0 || tenureYears <= 0) { return 0; }
    const monthlyInterestRate = annualInterestRate / 12 / 100;
    const numberOfPayments = tenureYears * 12;
    if (monthlyInterestRate === 0) { return principal / numberOfPayments; }
    const emi = principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    return emi;
};
const calculateFuelCost = (mileage, dailyCommuteKm, petrolPricePerLiter) => { 
    const validMileage = typeof mileage === 'number' && mileage > 0 ? mileage : (typeof mileage === 'string' && parseFloat(mileage) > 0 ? parseFloat(mileage) : 0);
    if (validMileage <= 0 || dailyCommuteKm < 0 || petrolPricePerLiter < 0) { return 0; }
    const monthlyCommuteKm = dailyCommuteKm * 30;
    const litersNeeded = monthlyCommuteKm / validMileage;
    const monthlyCost = litersNeeded * petrolPricePerLiter;
    return monthlyCost;
};


// --- DATA ARRAYS (Omitted for brevity, assumed unchanged) ---
const sampleBikes = [ { id: 1, title: 'TVS Rider 125cc', brand: 'TVS', price: 80800, km: 56, fuel: 'Petrol', img: 'https://cdn.bikedekho.com/processedimages/tvs/raider/source/raider68b7fd149e32c.jpg?imwidth=412&impolicy=resize', location: 'Bengaluru, KA', condition: 'New', year: 2025, specs: { engine: '124.8 cc', power: '11.38 PS', mileage: '57', brakes: 'Disc' } }, { id: 2, title: 'Kawasaki Ninja ZX 10R', brand: 'Kawasaki', price: 2079000, km: 12, fuel: 'Petrol', img: 'https://5.imimg.com/data5/HQ/VH/GLADMIN-49131536/kawasaki-ninja-zx-10r-500x500.png', location: 'Hyderabad, TS', condition: 'Used', year: 2023, specs: { engine: '998 cc', power: '203 PS', mileage: '12', brakes: 'Double Disc' } } ];
const upcomingBikes = [ { id: 101, title: 'Vida V2', brand: 'Hero Vida', img: 'https://cdn.bikedekho.com/processedimages/vida/vx2/source/vx268d1139c16533.jpg?imwidth=400&impolicy=resize', launchStatus: 'Coming Soon...' }, ];
const showroomsData = [ { id: 201, name: 'Guntur Bajaj Auto', city: 'Guntur', address: '4/1, Arundelpet, Guntur, Andhra Pradesh 522002', phone: '0863-222-1111', brands: ['Bajaj'], mapUrl: 'https://www.google.com/maps/search/?api=1&query=Guntur+Bajaj+Auto', imageUrl: 'https://content.jdmagicbox.com/comp/krishna/c6/9999p8676.8676.171224121801.w9c6/catalogue/varun-bajaj-tiruvuru-krishna-car-dealers-fojpfw1uzm.jpg', rating: 4.2, openingHours: 'Mon-Sat: 9 AM - 7 PM' }, ];
const heroSlides = [ { imageUrl: 'https://content.jdmagicbox.com/comp/krishna/c6/9999p8676.8676.171224121801.w9c6/catalogue/varun-bajaj-tiruvuru-krishna-car-dealers-fojpfw1uzm.jpg', title: 'Authorised Dealers You Can Trust', subtitle: 'Find certified showrooms for all major brands near you.' }, ];
const servicesData = [ { id: 's1', title: 'Bike Servicing', description: 'Get your bike serviced by certified mechanics.', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>' }, ];
const blogPostsData = [ { id: 'b1', title: 'Top 5 Commuter Bikes for 2025', excerpt: 'We review the most fuel-efficient and reliable commuter bikes available in India right now.', imageUrl: 'https://cdn.bikedekho.com/processedimages/hero/glamour-xtec-2-0/source/glamour-xtec-2-068a5658fc6c3b.jpg?imwidth=408&impolicy=resize', category: 'Reviews', date: 'Oct 25, 2025' }, ];
const sellBikeStepsData = [ { id: 'sb1', title: '1. Submit Details', description: 'Fill a simple form with bike details.', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>' }, ];
const financeOptionsData = [ { id: 'f1', title: 'Zero Down Payment', description: 'Ride home your dream bike.', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 16v-1m0-4v-1m0-4V7m0 1v.01" /></svg>' }, ];


// --- HELPER COMPONENTS (Omitted for brevity, assumed unchanged) ---
function EmiCalculatorModal({ bike, onClose }) { /* ... */ return (<div>...</div>); }
function FuelCostCalculatorModal({ bike, onClose }) { /* ... */ return (<div>...</div>); }
function ComparisonModal({ bikes, onRemove, onClose }) { /* ... */ return (<div>...</div>); }
function ShowroomImageModal({ imageUrl, onClose }) { /* ... */ return (<div>...</div>); }


// --- CRITICAL AUTH MODAL (Connects to Backend) ---
function AuthModal({ mode, onClose, onLogin }) {
    const [isLogin, setIsLogin] = useState(mode === 'login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState(''); 
    const [isLoading, setIsLoading] = useState(false); 

    // Define API URL here since it's an external dependency
    const API_BASE_URL = 'http://localhost:3001/api/auth'; 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        const endpoint = isLogin ? 'login' : 'register';
        const body = { 
            name: isLogin ? undefined : name, 
            email, 
            password 
        };

        try {
            const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                localStorage.setItem('userToken', data.token);
                onLogin({ name: data.user.name, email: data.user.email }); 
            } else {
                setError(data.message || data.msg || 'Authentication failed. Please check your credentials.');
            }
        } catch (err) {
            console.error('Network or Server Error:', err);
            setError('Could not connect to the authentication server. Ensure your backend is running.');
        } finally {
            setIsLoading(false);
        }
    };

    return ( 
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg p-8 w-full max-w-sm shadow-xl" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">{isLogin ? 'Login' : 'Sign Up'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <div className="p-2 bg-red-100 text-red-700 text-sm rounded-lg">{error}</div>} 

                    {!isLogin && (<input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded-lg p-3 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500" required />)}
                    <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-lg p-3 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500" required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded-lg p-3 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500" required />
                    <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-300 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1 disabled:opacity-50">
                        {isLoading ? 'Processing...' : isLogin ? 'Login' : 'Create Account'}
                    </button>
                </form>
                <p className="text-center text-sm text-gray-600 mt-6">
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}
                    <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-indigo-600 font-semibold ml-1 hover:underline">
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </p>
            </div>
        </div> 
    );
}
// --- END AUTH MODAL ---


// --- MAIN APP COMPONENT ---
export default function TwoWheelerMarketplaceUI() {
  
  // --- MODIFIED: State initialized as empty arrays ---
  const [bikes, setBikes] = useState([]); 
  const [showrooms, setShowrooms] = useState([]);
  const [upcomingBikes, setUpcomingBikes] = useState([]);
  const [servicesData, setServicesData] = useState([]);
  const [blogPostsData, setBlogPostsData] = useState([]);
  const [sellBikeStepsData, setSellBikeStepsData] = useState([]);
  const [financeOptionsData, setFinanceOptionsData] = useState([]);
  // --- End State Initialization ---

  const [query, setQuery] = useState('');
  const [filterBrand, setFilterBrand] = useState('All');
  const [filterFuel, setFilterFuel] = useState('All');
  const [filterCondition, setFilterCondition] = useState('All'); 
  const [selected, setSelected] = useState(null); 
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showEmiModal, setShowEmiModal] = useState(null); 
  const [showFuelCostModal, setShowFuelCostModal] = useState(null); 
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(null);
  const [showShowroomImageModal, setShowShowroomImageModal] = useState(null);
  const [showroomQuery, setShowroomQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cart, setCart] = useState([]); 


  // --- API FETCH LOGIC (All Data Sources) ---
  const API_BASE_URL = 'http://localhost:3001/api';

  const fetchData = (endpoint, setter) => {
    fetch(`${API_BASE_URL}/${endpoint}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(setter)
      .catch(error => console.error(`Error fetching ${endpoint}:`, error));
  };

  // --- Fetch ALL Data on Mount (Initial Load) ---
  useEffect(() => {
    fetchData('bikes', setBikes);
    fetchData('showrooms', setShowrooms);
    fetchData('upcoming', setUpcomingBikes);
    fetchData('services', setServicesData);
    fetchData('blog', setBlogPostsData);
    fetchData('sell-steps', setSellBikeStepsData);
    fetchData('finance-options', setFinanceOptionsData);
  }, []); 

// --- NEW HOOK: Persistent Login Check ---
// --- Check LocalStorage for JWT and Validate Session on Component Mount/Refresh ---
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
        // Send token to protected route to verify session and get user data
        fetch(`${API_BASE_URL}/users/me`, { 
            headers: { 
                'Content-Type': 'application/json',
                'x-auth-token': token // Send token for validation
            } 
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    // Token is valid! Restore user and their saved lists
                    setCurrentUser({ name: data.user.name, email: data.user.email });
                    // NOTE: data.user will contain cart/wishlist data once backend is fully implemented
                } else {
                    // Token invalid/expired - clear stored token
                    localStorage.removeItem('userToken');
                }
            })
            .catch(err => console.error("Session verification failed:", err));
    }
  }, []); 
// --- End Persistent Login Check ---


  // Slideshow Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prevSlide => (prevSlide === heroSlides.length - 1 ? 0 : prevSlide + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Calculate unique brands and fuel types for filters
  const brands = ['All', ...Array.from(new Set(bikes.map(b => b.brand)))];
  const fuelTypes = ['All', ...Array.from(new Set(bikes.map(b => b.fuel)))]; // Used in filter dropdown

  // Filter bikes based on current filters and query
  const filteredBikes = bikes.filter(b => {
    const matchesQuery = `${b.title} ${b.brand} ${b.location}`.toLowerCase().includes(query.toLowerCase());
    const matchesBrand = filterBrand === 'All' || b.brand === filterBrand;
    const matchesFuel = filterFuel === 'All' || b.fuel === filterFuel;
    const matchesCondition = filterCondition === 'All' || b.condition === filterCondition;
    return matchesQuery && matchesBrand && matchesFuel && matchesCondition;
  });

  // Filter showrooms based on query
  const filteredShowrooms = showrooms.filter(s =>
    s.city.toLowerCase().includes(showroomQuery.toLowerCase()) ||
    s.name.toLowerCase().includes(showroomQuery.toLowerCase())
  );

  // Add/Remove bike from comparison list
  const handleCompareToggle = (bike) => {
    setCompareList(prev =>
      prev.some(item => item.id === bike.id)
        ? prev.filter(item => item.id !== bike.id)
        : prev.length < 3 ? [...prev, bike] : prev // Max 3 items
    );
  };

  // Auth handlers
  const handleLogin = (userData) => { 
      setCurrentUser(userData); 
      setShowAuthModal(null); 
  };
  
  // MODIFIED Logout to clear token
  const handleLogout = () => { 
      setCurrentUser(null); 
      localStorage.removeItem('userToken'); // CRUCIAL: Clear JWT token
      // You should also clear the cart/wishlist local state here if implemented
  };

  // Cart Handlers
  const addToCart = (bike) => { if (!cart.some(c => c.id === bike.id)) setCart([...cart, bike]); };
  const removeFromCart = (id) => setCart(cart.filter(c => c.id !== id));
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  // --- Style tag for the animated background ---
  // This is one way to add custom animations without editing tailwind.config.js
  const backgroundAnimationStyles = `
    @keyframes gradient-animation {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .animated-gradient {
      background-size: 400% 400%;
      animation: gradient-animation 15s ease infinite;
    }
  `;
  // --- End of style tag ---

  return (
    <> {/* Fragment to hold style and main div */}
      <style>{backgroundAnimationStyles}</style>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-sky-50 animated-gradient">
        <header className="bg-white shadow-md sticky top-0 z-40" id="home"> {/* Added shadow-md */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-2xl font-extrabold text-indigo-700">Two Wheeler Bike App</div> {/* Updated color */}
              
              {/* --- NAVIGATION --- */}
              <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
                <a href="#hero-slideshow" onClick={(e) => { e.preventDefault(); scrollTo('hero-slideshow'); }} className="hover:text-indigo-700 transition-colors">Home</a>
                <a href="#listings" onClick={(e) => { e.preventDefault(); scrollTo('listings'); }} className="hover:text-indigo-700 transition-colors">Listings</a>
                <a href="#upcoming" onClick={(e) => { e.preventDefault(); scrollTo('upcoming'); }} className="hover:text-indigo-700 transition-colors">Upcoming</a>
                <a href="#showrooms" onClick={(e) => { e.preventDefault(); scrollTo('showrooms'); }} className="hover:text-indigo-700 transition-colors">Showrooms</a>
                <a href="#sell-bike" onClick={(e) => { e.preventDefault(); scrollTo('sell-bike'); }} className="hover:text-indigo-700 transition-colors">Sell Bike</a>
                <a href="#finance" onClick={(e) => { e.preventDefault(); scrollTo('finance'); }} className="hover:text-indigo-700 transition-colors">Finance</a>
                <a href="#services" onClick={(e) => { e.preventDefault(); scrollTo('services'); }} className="hover:text-indigo-700 transition-colors">Services</a>
                <a href="#blog" onClick={(e) => { e.preventDefault(); scrollTo('blog'); }} className="hover:text-indigo-700 transition-colors">Blog</a>
              </nav>
              
            </div>
            <div className="flex items-center gap-4">
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search model or brand..." className="hidden sm:block rounded-full border border-gray-300 px-4 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
              {currentUser ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">Welcome, {currentUser.name}!</span>
                  <button onClick={handleLogout} className="text-sm text-indigo-600 hover:underline font-medium">Logout</button>
                </div>
              ) : (
                <button onClick={() => setShowAuthModal('login')} className="hidden sm:block text-sm font-medium text-indigo-600 hover:text-indigo-800">Login / Sign Up</button>
              )}
              <button className="relative p-2 rounded-full hover:bg-gray-100" onClick={() => document.getElementById('cart-drawer')?.classList.toggle('translate-x-0')} aria-label="Open cart">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M11 15a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
                {cart.length > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 transform translate-x-1/2 -translate-y-1/2">{cart.length}</span>}
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          <section id="hero-slideshow" className="mb-12">
            <div className="relative w-full h-[55vh] rounded-lg overflow-hidden shadow-lg"> {/* Increased height */}
              <div className="w-full h-full flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>{heroSlides.map((slide, index) => (<img key={index} src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover flex-shrink-0" />))}</div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div> {/* Gradient overlay */}
              <div className="absolute bottom-0 left-0 p-8 text-white"><h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg">{heroSlides[currentSlide].title}</h1><p className="mt-3 text-lg md:text-xl max-w-2xl drop-shadow-md">{heroSlides[currentSlide].subtitle}</p></div>
              <div className="absolute bottom-4 right-4 flex gap-2">{heroSlides.map((_, index) => (<button key={index} onClick={() => setCurrentSlide(index)} className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`}></button>))}</div>
            </div>
          </section>

          <section id="listings" className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar Filters (Glassmorphism Effect Added) */}
            <aside className="col-span-1 hidden md:block">
              <div className="sticky top-24 bg-white/70 backdrop-blur-md p-6 rounded-lg shadow-lg space-y-6">
                <h4 className="text-xl font-semibold text-gray-800 border-b border-gray-300 pb-3">Filters</h4>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Brand</label>
                  <select value={filterBrand} onChange={e => setFilterBrand(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                    {brands.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Fuel Type</label>
                  <div className="flex flex-wrap gap-2">
                    {fuelTypes.map(f => (
                      <button key={f} onClick={() => setFilterFuel(f)} className={`px-3 py-1 rounded-full border text-xs font-medium transition-colors ${filterFuel === f ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}>{f}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Condition</label>
                  <div className="flex flex-wrap gap-2">
                    {['All', 'New', 'Used'].map(c => (
                      <button key={c} onClick={() => setFilterCondition(c)} className={`px-3 py-1 rounded-full border text-xs font-medium transition-colors ${filterCondition === c ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}>{c}</button>
                    ))}
                  </div>
                </div>
                <button onClick={() => { setQuery(''); setFilterBrand('All'); setFilterFuel('All'); setFilterCondition('All'); }} className="w-full text-sm text-indigo-600 hover:text-indigo-800 font-medium pt-3 border-t border-gray-300">Reset Filters</button>
              </div>
            </aside>

            {/* Bike Listings Grid */}
            <div className="col-span-1 md:col-span-3">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-4"> {/* Added flex-wrap */}
                <h2 className="text-2xl font-bold text-gray-900">Explore Two-Wheelers</h2>
                {/* Filters moved to sidebar for larger screens */}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBikes.length === 0 && <div className="col-span-full text-center text-gray-500 py-16">No bikes match your filters. Try adjusting them!</div>}
                {filteredBikes.map(b => (
                  <article key={b.id} className="bg-white rounded-lg shadow-md overflow-hidden group flex flex-col cursor-pointer transition-shadow hover:shadow-lg" onClick={() => setSelected(b)}>
                    <div className="h-48 overflow-hidden relative">
                        <img src={b.img} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <span className={`absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded ${b.condition === 'New' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{b.condition}</span>
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                        <h3 className="font-semibold text-lg text-gray-800 truncate group-hover:text-indigo-700 transition-colors">{b.title}</h3>
                        <p className="text-sm text-gray-500 mb-2">{b.brand} • {b.year}</p>
                        <div className="font-bold text-indigo-700 text-xl mb-3">{formatPrice(b.price)}</div>
                        <p className="text-xs text-gray-500 mt-1">{b.specs?.mileage} kmpl • {b.location}</p>
                        <div className="mt-auto pt-4 flex gap-3"> {/* Use gap-3 */}
                            <button onClick={(e) => { e.stopPropagation(); setSelected(b); }} className="flex-1 px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium">View Details</button>
                            <button onClick={(e) => { e.stopPropagation(); handleCompareToggle(b); }} title="Compare" className={`px-3 py-2 border rounded-md text-sm transition-colors ${compareList.some(item => item.id === b.id) ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'}`}>
                                {compareList.some(item => item.id === b.id) ? '✓' : '+'} {/* Simpler Compare Icon */}
                            </button>
                        </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="upcoming" className="mt-16">
              <div className="text-center mb-8"><h2 className="text-3xl font-extrabold text-gray-900">Upcoming Launches</h2><p className="text-gray-600 mt-2">The most anticipated models coming soon to India.</p></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"> {/* Adjusted grid cols */}
                  {upcomingBikes.map(bike => (
                      <article key={bike.id} className="bg-white rounded-lg shadow-md overflow-hidden group flex flex-col transition-shadow hover:shadow-lg">
                          <div className="h-48 overflow-hidden"><img src={bike.img} alt={bike.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /></div>
                          <div className="p-4 flex flex-col flex-grow"><h3 className="font-semibold text-lg text-gray-800 truncate group-hover:text-indigo-700 transition-colors">{bike.title}</h3><p className="text-sm text-gray-500 mb-2">{bike.brand}</p><p className="mt-auto pt-2 text-sm font-medium text-indigo-600">{bike.launchStatus}</p></div>
                      </article>
                  ))}
              </div>
          </section>

          <section id="showrooms" className="mt-16">
            <div className="text-center mb-8"><h2 className="text-3xl font-extrabold text-gray-900">Find a Showroom</h2><p className="text-gray-600 mt-2">Locate your nearest dealer for a test ride.</p><div className="mt-6 max-w-lg mx-auto"><input type="text" placeholder="Search by city or showroom name..." value={showroomQuery} onChange={e => setShowroomQuery(e.target.value)} className="w-full border border-gray-300 rounded-full px-5 py-3 text-base focus:ring-indigo-500 focus:border-indigo-500 outline-none shadow-sm bg-white" /></div></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{filteredShowrooms.length > 0 ? filteredShowrooms.map(showroom => (<div key={showroom.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col transition-shadow hover:shadow-lg"><div className="h-48 w-full overflow-hidden rounded-md mb-4 cursor-pointer group" onClick={() => setShowShowroomImageModal(showroom.imageUrl)}><img src={showroom.imageUrl} alt={`${showroom.name} Showroom`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" /></div><h3 className="text-xl font-bold text-indigo-700">{showroom.name}</h3><p className="text-gray-600 mt-1 text-sm">{showroom.address}</p><p className="text-gray-800 font-semibold mt-3">📞 {showroom.phone}</p><div className="mt-4"><h4 className="font-semibold text-sm text-gray-800 mb-2">Brands Available:</h4><div className="flex flex-wrap gap-2">{showroom.brands.map(brand => (<span key={brand} className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full">{brand}</span>))}</div></div><div className="mt-auto pt-5"><a href={showroom.mapUrl} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-blue-600 text-white font-medium py-2.5 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm">View on Map</a></div></div>)) : (<p className="text-center text-gray-500 md:col-span-2 py-10">No showrooms found. Try a different search.</p>)}</div>
          </section>
          
          {/* --- SELL BIKE SECTION (Glassmorphism Effect Added) --- */}
          <section id="sell-bike" className="mt-16 bg-white/70 backdrop-blur-md rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900">Sell Your Bike in 4 Easy Steps</h2>
              <p className="text-gray-600 mt-2">Get the best price for your bike, hassle-free.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sellBikeStepsData.map(step => (
                <div key={step.id} className="flex flex-col items-center text-center p-4">
                  <div className="bg-indigo-100 text-indigo-700 rounded-full p-4 mb-4" dangerouslySetInnerHTML={{ __html: step.icon }} />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <button className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors shadow-sm">Get Started Now</button>
            </div>
          </section>

          {/* --- FINANCE SECTION --- */}
          <section id="finance" className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900">Easy Finance Options</h2>
              <p className="text-gray-600 mt-2">Get your dream bike with our flexible loan partners.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {financeOptionsData.map(option => (
                <div key={option.id} className="bg-white rounded-lg shadow-md p-6 flex items-start gap-4 transition-shadow hover:shadow-lg">
                  <div className="bg-green-100 text-green-700 rounded-full p-3 flex-shrink-0 mt-1" dangerouslySetInnerHTML={{ __html: option.icon }} />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{option.title}</h3>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          {/* --- SERVICES SECTION --- */}
          <section id="services" className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900">Our Services</h2>
              <p className="text-gray-600 mt-2">Everything you need for your two-wheeler journey.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {servicesData.map(service => (
                <div key={service.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center transition-shadow hover:shadow-lg">
                  <div className="bg-indigo-100 text-indigo-700 rounded-full p-4 mb-4" dangerouslySetInnerHTML={{ __html: service.icon }} />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-sm text-gray-600 flex-grow">{service.description}</p>
                  <a href="#" className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-800">Learn More →</a>
                </div>
              ))}
            </div>
          </section>

          {/* --- BLOG SECTION --- */}
          <section id="blog" className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900">From the Blog</h2>
              <p className="text-gray-600 mt-2">Latest news, reviews, and maintenance tips.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPostsData.map(post => (
                <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden group flex flex-col transition-shadow hover:shadow-lg">
                  <div className="h-48 overflow-hidden">
                    <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <p className="text-xs font-semibold text-indigo-600 uppercase mb-1">{post.category}</p>
                    <h3 className="font-semibold text-lg text-gray-800 truncate group-hover:text-indigo-700 transition-colors">{post.title}</h3>
                    <p className="text-sm text-gray-600 mt-2 flex-grow">{post.excerpt}</p>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500">Posted on {post.date}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

        </main>

        {/* --- Modals and Overlays --- */}
        {showAuthModal && <AuthModal mode={showAuthModal} onLogin={handleLogin} onClose={() => setShowAuthModal(null)} />}
        {selected && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
            <div className="bg-white rounded-lg max-w-4xl w-full p-6 shadow-xl" onClick={e => e.stopPropagation()}> {/* Increased max-width */}
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2 w-full rounded-lg overflow-hidden h-64 md:h-auto"> {/* Adjusted image container */}
                  <img src={selected.img} alt={selected.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-gray-900">{selected.title}</h3>
                  <p className="text-base text-gray-500 mb-3">{selected.brand} • {selected.year} • {selected.condition}</p>
                  <div className="font-extrabold text-indigo-700 text-3xl mb-5">{formatPrice(selected.price)}</div>
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-2 text-lg">Specifications</h4>
                    <ul className="list-disc list-inside text-gray-700 text-sm space-y-1.5"> {/* Increased spacing */}
                      {selected.specs && Object.entries(selected.specs).map(([key, value]) => (<li key={key}><span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span> {value}{key === 'mileage' ? ' kmpl' : ''}</li>))}
                      {!selected.specs && <li>No specifications available.</li>}
                    </ul>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button onClick={() => { setShowEmiModal(selected); setSelected(null); }} className="w-full px-4 py-2.5 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors">Calculate EMI</button>
                    <button onClick={() => { setShowFuelCostModal(selected); setSelected(null); }} className="w-full px-4 py-2.5 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors">Calculate Fuel Cost</button>
                    <button onClick={() => setSelected(null)} className="w-full px-4 py-2.5 rounded-md border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition-colors">Close</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {showEmiModal && <EmiCalculatorModal bike={showEmiModal} onClose={() => setShowEmiModal(null)} />}
        {showFuelCostModal && <FuelCostCalculatorModal bike={showFuelCostModal} onClose={() => setShowFuelCostModal(null)} />}
        {showCompareModal && <ComparisonModal bikes={compareList} onRemove={(id) => setCompareList(prev => prev.filter(b => b.id !== id))} onClose={() => setShowCompareModal(false)} />}
        {showShowroomImageModal && <ShowroomImageModal imageUrl={showShowroomImageModal} onClose={() => setShowShowroomImageModal(null)} />}
        {compareList.length > 0 && (
          <div className="sticky bottom-0 bg-white shadow-lg p-4 z-40 border-t">
            <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4"> {/* Added flex-wrap */}
              <div><h4 className="font-bold text-gray-800">Comparing Models ({compareList.length}/3)</h4><div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">{compareList.map(bike => <div key={bike.id} className="text-sm text-gray-700">{bike.title}</div>)}</div></div>
              <div className="flex gap-3 flex-shrink-0"> {/* Prevent buttons shrinking */}
                <button onClick={() => setShowCompareModal(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium">Compare Now</button>
                <button onClick={() => setCompareList([])} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 text-gray-700 transition-colors text-sm font-medium">Clear</button>
              </div>
            </div>
          </div>
        )}

          {/* Cart Drawer */}
          <div id="cart-drawer" className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl transform translate-x-full transition-transform duration-300 z-50 flex flex-col"> {/* Adjusted width & shadow */}
            <div className="p-4 flex items-center justify-between border-b bg-gray-50 flex-shrink-0">
              <h4 className="font-semibold text-lg text-gray-800">Shopping Cart</h4>
              <button onClick={() => document.getElementById('cart-drawer')?.classList.toggle('translate-x-full')} className="text-sm text-gray-600 hover:text-indigo-600 p-1 rounded-full hover:bg-gray-200"> {/* Added padding & hover */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto flex-grow"> {/* Adjusted padding & flex-grow */}
              {cart.length === 0 && <div className="text-sm text-center text-gray-500 py-16">Your cart is empty. Start adding some bikes!</div>}
              {cart.map(item => (
                <div key={item.id} className="flex items-center gap-4 border-b pb-4 last:border-b-0">
                  <img src={item.img} alt="thumb" className="w-20 h-16 object-cover rounded-md flex-shrink-0" /> {/* Larger image */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800 truncate">{item.title}</div>
                    <div className="text-sm text-gray-500">{formatPrice(item.price)}</div>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} title="Remove item" className="text-xs text-red-500 hover:text-red-700 font-medium ml-2 p-1 rounded-full hover:bg-red-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
Show more</button>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div className="p-4 border-t bg-gray-50 flex-shrink-0">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-gray-800 text-lg">Total:</span>
                  <span className="font-bold text-indigo-700 text-xl">{formatPrice(cart.reduce((s, a) => s + (a.price || 0), 0))}</span> {/* Added safety check for price */}
                </div>
                <button className="w-full bg-indigo-600 text-white px-4 py-3 rounded-md text-base font-medium hover:bg-indigo-700 transition-colors shadow-sm">Proceed to Checkout</button> {/* Larger button */}
              </div>
            )}
        </div>

          <footer className="mt-20 bg-gray-900 text-gray-300 py-10"> {/* Darkened footer */}
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-sm">© {new Date().getFullYear()} Two Wheeler Bike App. All Rights Reserved.</p>
              <p className="text-xs mt-1">Marketplace UI Demo built with React & Tailwind CSS.</p>
              {/* You could add more links here if needed */}
            </div>
          </footer>
      </div>
    </>
  );
}