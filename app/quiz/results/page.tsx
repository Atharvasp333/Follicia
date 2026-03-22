'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { useAuthModal } from '@/contexts/AuthModalContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';

interface HairDNA {
  porosityScore: number;
  scalpHealth: number;
  primaryConcern: string;
  analysis: string;
  targetTags: string[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  priceDisplay: string;
  imageUrl: string;
  aiMatchTag: string;
  category: string;
  tagline?: string;
}

export default function ResultsPage() {
  const router = useRouter();
  const { addToCart } = useCart();
  const { currentUser } = useAuthModal();
  const [hairDNA, setHairDNA] = useState<HairDNA | null>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingRegimen, setAddingRegimen] = useState(false);

  useEffect(() => {
    const loadResults = async () => {
      try {
        // Try localStorage first
        const storedData = localStorage.getItem('hairDNA');
        
        if (storedData) {
          const data = JSON.parse(storedData);
          setHairDNA(data);
          await fetchRecommendations(data.targetTags);
        } else if (currentUser) {
          // Fetch from database for authenticated users
          const response = await fetch(`/api/user/hair-profile?uid=${currentUser.uid}`);
          const result = await response.json();
          
          if (result.success && result.data) {
            const profileData = {
              porosityScore: result.data.porosityScore,
              scalpHealth: result.data.scalpHealth,
              primaryConcern: result.data.primaryConcern,
              analysis: result.data.hairAnalysis,
              targetTags: result.data.targetTags
            };
            setHairDNA(profileData);
            await fetchRecommendations(result.data.targetTags);
          } else {
            router.push('/quiz');
          }
        } else {
          router.push('/quiz');
        }
      } catch (error) {
        console.error('Error loading results:', error);
        router.push('/quiz');
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [currentUser, router]);

  const fetchRecommendations = async (tags: string[]) => {
    try {
      const response = await fetch('/api/products/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetTags: tags })
      });
      
      const result = await response.json();
      if (result.success) {
        setRecommendations(result.data);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const getPorosityLevel = (score: number) => {
    if (score < 30) return { label: 'Low Porosity', description: 'Cuticles are tightly sealed, moisture repellent' };
    if (score < 70) return { label: 'Medium Porosity', description: 'Balanced moisture absorption and retention' };
    return { label: 'High Porosity', description: 'Cuticles are raised, rapid moisture absorption' };
  };

  const getScalpHealthLevel = (score: number) => {
    if (score >= 80) return { label: 'Excellent', description: 'Optimal sebum production and pH balance' };
    if (score >= 60) return { label: 'Good', description: 'Minor imbalances, generally healthy' };
    if (score >= 40) return { label: 'Fair', description: 'Moderate concerns requiring attention' };
    return { label: 'Needs Attention', description: 'Significant imbalances detected' };
  };

  const handleAddFullRegimen = async () => {
    if (recommendations.length === 0) return;
    
    setAddingRegimen(true);
    try {
      // Add all 3 products to cart simultaneously
      for (const product of recommendations) {
        await addToCart({
          productId: product.id,
          name: product.name,
          price: product.price,
          priceDisplay: product.priceDisplay,
          imageUrl: product.imageUrl,
          category: product.category
        });
      }
      
      // Navigate to cart
      router.push('/cart');
    } catch (error) {
      console.error('Error adding regimen:', error);
      alert('Failed to add regimen. Please try again.');
    } finally {
      setAddingRegimen(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="relative w-24 h-24 mx-auto mb-8"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <div className="absolute inset-0 border-4 border-light-gray rounded-full" />
            <div className="absolute inset-0 border-4 border-brand-teal border-t-transparent rounded-full" />
          </motion.div>
          <p className="text-brand-teal font-['Inter'] text-sm">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!hairDNA) return null;

  const porosityLevel = getPorosityLevel(hairDNA.porosityScore);
  const scalpHealthLevel = getScalpHealthLevel(hairDNA.scalpHealth);

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Global Navbar */}
      <Navbar isFixed={true} />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16" style={{ marginTop: '80px' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <p className="text-brand-seafoam text-xs font-['Montserrat'] font-bold tracking-[0.2em] uppercase mb-4">
            LABORATORY ANALYSIS COMPLETE
          </p>
          <h2 className="font-['Playfair_Display'] text-5xl text-dark-text mb-4 italic">
            Your Follicular DNA Profile
          </h2>
          <p className="font-['Inter'] text-sm text-body-text max-w-2xl mx-auto">
            Synthesized by our AI-powered trichology system. Results are calibrated to your unique strand architecture.
          </p>
        </motion.div>

        {/* Scores Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-6 mb-12"
        >
          {/* Porosity Score */}
          <div className="bg-white rounded-2xl border border-light-gray p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-['Montserrat'] text-xs font-bold tracking-[0.2em] uppercase text-body-text mb-2">
                  POROSITY INDEX
                </h3>
                <p className="font-['Playfair_Display'] text-3xl text-dark-text italic">
                  {porosityLevel.label}
                </p>
              </div>
              <div className="text-right">
                <span className="font-['Montserrat'] text-4xl font-bold text-brand-seafoam">
                  {hairDNA.porosityScore}
                </span>
                <span className="font-['Inter'] text-sm text-[#9AABA5]">/100</span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="h-2 bg-light-gray rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-brand-seafoam"
                  initial={{ width: 0 }}
                  animate={{ width: `${hairDNA.porosityScore}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
            
            <p className="font-['Inter'] text-xs text-body-text leading-relaxed">
              {porosityLevel.description}
            </p>
          </div>

          {/* Scalp Health */}
          <div className="bg-white rounded-2xl border border-light-gray p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-['Montserrat'] text-xs font-bold tracking-[0.2em] uppercase text-body-text mb-2">
                  SCALP HEALTH
                </h3>
                <p className="font-['Playfair_Display'] text-3xl text-dark-text italic">
                  {scalpHealthLevel.label}
                </p>
              </div>
              <div className="text-right">
                <span className="font-['Montserrat'] text-4xl font-bold text-brand-seafoam">
                  {hairDNA.scalpHealth}
                </span>
                <span className="font-['Inter'] text-sm text-[#9AABA5]">/100</span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="h-2 bg-light-gray rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-brand-seafoam"
                  initial={{ width: 0 }}
                  animate={{ width: `${hairDNA.scalpHealth}%` }}
                  transition={{ duration: 1, delay: 0.7 }}
                />
              </div>
            </div>
            
            <p className="font-['Inter'] text-xs text-body-text leading-relaxed">
              {scalpHealthLevel.description}
            </p>
          </div>
        </motion.div>

        {/* Clinical Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-light-gray p-10 mb-12"
        >
          <h3 className="font-['Montserrat'] text-xs font-bold tracking-[0.2em] uppercase text-body-text mb-4">
            PRIMARY CONCERN
          </h3>
          <p className="font-['Playfair_Display'] text-2xl text-brand-teal mb-6 italic">
            {hairDNA.primaryConcern}
          </p>
          
          <h3 className="font-['Montserrat'] text-xs font-bold tracking-[0.2em] uppercase text-body-text mb-4">
            TRICHOLOGIST ASSESSMENT
          </h3>
          <p className="font-['Inter'] text-base text-dark-text leading-relaxed">
            {hairDNA.analysis}
          </p>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="text-center mb-10">
            <h3 className="font-['Playfair_Display'] text-4xl text-dark-text mb-4 italic">
              Your Prescribed Regimen
            </h3>
            <p className="font-['Inter'] text-sm text-body-text mb-6">
              Curated based on your unique follicular profile and diagnostic markers.
            </p>
            
            <button
              onClick={handleAddFullRegimen}
              disabled={addingRegimen || recommendations.length === 0}
              className="
                px-10 py-4 rounded-full bg-brand-teal text-white
                font-['Montserrat'] font-bold text-sm tracking-wide
                disabled:opacity-40 disabled:cursor-not-allowed
                hover:bg-brand-teal-mid transition-all duration-300
                hover:transform hover:-translate-y-0.5
              "
            >
              {addingRegimen ? 'Adding to Cart...' : 'Add Full Regimen to Cart'}
            </button>
          </div>

          {recommendations.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {recommendations.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="bg-white rounded-2xl border border-light-gray overflow-hidden hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="relative h-72 bg-brand-cream">
                    {product.imageUrl && (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>
                  
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 rounded-full bg-brand-seafoam/10 border border-brand-seafoam/30 text-brand-seafoam font-['Montserrat'] text-[0.6rem] font-bold tracking-wide uppercase mb-3">
                      {product.category}
                    </span>
                    
                    <h4 className="font-['Playfair_Display'] text-xl text-dark-text mb-2 italic">
                      {product.name}
                    </h4>
                    
                    {product.tagline && (
                      <p className="font-['Inter'] text-xs text-body-text mb-3 italic">
                        {product.tagline}
                      </p>
                    )}
                    
                    <p className="font-['Inter'] text-sm text-body-text mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-['Montserrat'] text-xl font-bold text-brand-teal">
                        {product.priceDisplay}
                      </span>
                      <button
                        onClick={() => router.push(`/shop?product=${product.id}`)}
                        className="
                          px-5 py-2 rounded-full border-2 border-brand-teal text-brand-teal
                          font-['Montserrat'] font-semibold text-xs
                          hover:bg-brand-teal hover:text-white
                          transition-all duration-300
                        "
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-light-gray p-12 text-center">
              <p className="font-['Inter'] text-sm text-body-text">
                Loading personalized recommendations...
              </p>
            </div>
          )}
        </motion.div>

        {/* Save Profile CTA */}
        {!currentUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-16 bg-brand-teal rounded-2xl p-12 text-center text-white"
          >
            <h3 className="font-['Playfair_Display'] text-3xl mb-4 italic">
              Save Your DNA Profile
            </h3>
            <p className="font-['Inter'] text-sm mb-6 opacity-90">
              Create an account to track your progress and receive ongoing personalized recommendations.
            </p>
            <button
              onClick={() => router.push('/shop')}
              className="
                px-10 py-4 rounded-full bg-white text-brand-teal
                font-['Montserrat'] font-bold text-sm tracking-wide
                hover:bg-brand-cream transition-all duration-300
                hover:transform hover:-translate-y-0.5
              "
            >
              Sign Up & Continue Shopping
            </button>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
