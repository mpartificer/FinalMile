import { useState, useEffect, memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient.js';
import Header from './Header.jsx';
import Lightbox from './Lightbox.jsx';

const ImageGrid = memo(({ imageUrls, onImageClick }) => {
  const [imageStatuses, setImageStatuses] = useState({});

  const handleImageError = (url) => {
    console.error(`Failed to load image: ${url}`);
    setImageStatuses(prev => ({
      ...prev,
      [url]: 'error'
    }));
  };

  const handleImageLoad = (url) => {
    setImageStatuses(prev => ({
      ...prev,
      [url]: 'loaded'
    }));
  };

  // Reset image statuses when URLs change
  useEffect(() => {
    if (imageUrls?.length > 0) {
      setImageStatuses({});
    }
  }, [imageUrls]);

  // Early return if no valid image URLs
  if (!imageUrls?.length) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      {imageUrls.map((url, index) => (
        <div key={`image-${index}-${url}`} className="relative">
          {imageStatuses[url] === 'error' ? (
            <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
              Failed to load image
            </div>
          ) : (
            <>
              <img 
                src={url} 
                alt={`Shipment ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg cursor-pointer"
                onError={() => handleImageError(url)}
                onLoad={() => handleImageLoad(url)}
                onClick={() => onImageClick?.(index)}
              />
              {!imageStatuses[url] && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
});

// Set display name for debugging
ImageGrid.displayName = 'ImageGrid';

// Add prop types checking if you're using TypeScript or PropTypes
ImageGrid.defaultProps = {
  imageUrls: [],
  onImageClick: () => {}
};

const BidViewView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bidData, setBidData] = useState([]);
  const [shipmentData, setShipmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBid, setSelectedBid] = useState(null);
  const [sending, setSending] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const [showAuthPrompt, setShowAuthPrompt] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const displayData = bidData.length > 0 ? bidData[0] : shipmentData;

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };
  
  const verifyAuthCode = async (code) => {
    try {
      setLoading(true);
      
      // First try to set the auth code
      const { data: setAuthData, error: setAuthError } = await supabase
        .rpc('set_auth_code', { 
          provided_auth_code: code 
        });
  
      if (setAuthError) {
        console.error('Error setting auth code:', setAuthError);
        throw new Error('Failed to verify authentication code');
      }
  
      // Then try to fetch the matching record
      const { data, error } = await supabase
        .from('shipmentauth')
        .select('*')
        .eq('shipment_id', id)
        .eq('auth_code', code)
        .single();
  
      console.log('Auth verification response:', { data, error }); // Debug log
  
      if (error) {
        console.error('Verification error:', error);
        throw new Error('Invalid authentication code');
      }
  
      if (!data) {
        throw new Error('No matching authentication code found');
      }
  
      // Check expiration
      if (new Date(data.expires_at) < new Date()) {
        throw new Error('Authentication code has expired');
      }
  
      setIsAuthenticated(true);
      setShowAuthPrompt(false);
      await fetchData();
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err.message || 'Invalid or expired authentication code');
      setAuthCode('');
    } finally {
      setLoading(false);
    }
  };

  
const handleAuthSubmit = async (e) => {
  e.preventDefault();
  setError(null);
  setLoading(true);
  
  // Normalize the auth code
  const normalizedCode = authCode.trim().toUpperCase();
  
  if (normalizedCode.length !== 6) {
    setError('Please enter a valid 6-digit code');
    setLoading(false);
    return;
  }
  
  await verifyAuthCode(normalizedCode);
};

  const fetchData = async () => {
    if (!isAuthenticated) {
      console.log('Not authenticated, skipping fetch');
      return;
    }

    try {
      // First, try to fetch bids from the view
      const { data: bidsData, error: bidsError } = await supabase
        .from('bids_with_shipments_view')
        .select('*, image_urls')
        .eq('shipment_id', id);

      if (bidsError) throw bidsError;
      setBidData(bidsData || []);

      // If there are no bids, fetch the shipment information directly
      if (!bidsData || bidsData.length === 0) {
        const { data: shipmentInfo, error: shipmentError } = await supabase
          .from('Shipments')
          .select('*, image_urls')
          .eq('id', id)
          .single();

        if (shipmentError) throw shipmentError;
        setShipmentData(shipmentInfo);
      }
    } catch (err) {
      setError('Error fetching data: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
    fetchData();
    }
  }, [id, isAuthenticated]);

  useEffect(() => {
    if (displayData) {
      console.log('Full display data:', displayData);
    console.log('Image URLs type:', typeof displayData.image_urls);
    console.log('Bid Data:', bidData);
    console.log('Shipment Data:', shipmentData);
    }
  }, [displayData, bidData, shipmentData]);

  useEffect(() => {
    if (showSuccessAlert) {
      const timer = setTimeout(() => {
        navigate('/FinalMile');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessAlert, navigate]);

  const handleBidSelection = async (bid) => {
    try {
      setSending(true);
      setSelectedBid(bid);
      
      const username = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
  
      const response = await fetch(`{${API_URL}}/api/send-notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          phoneNumber: bid.bid_phone_number,
          shipmentId: id,
          shipmentCompany: bid.shipment_company_name,
          bidderName: bid.bid_name,
          companyPhoneNumber: bid.shipment_phone_number,
          shipperEmail: bid.shipment_email,
          bidAmount: bid.bid_amount,
          bidderEmail: bid.bid_email,
        }),
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to send notifications');
      }
  
      const { error: bidUpdateError } = await supabase
        .from('Bids')
        .update({ status: 'selected' })
        .eq('bid_id', bid.bid_id);
  
      if (bidUpdateError) throw bidUpdateError;
  
      const { error: shipmentUpdateError } = await supabase
        .from('Shipments')
        .update({ status: 'closed' })
        .eq('id', bid.shipment_id);
  
      if (shipmentUpdateError) throw shipmentUpdateError;
  
      setShowSuccessAlert(true);
      await fetchData();
    } catch (err) {
      console.error('Detailed selection error:', err);
      setError(`Error selecting bid: ${err.message}`);
    } finally {
      setSending(false);
    }
  };

  if (showAuthPrompt) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Enter Authentication Code</h2>
          <p className="text-gray-600 mb-4">
            Please enter the authentication code sent to your email.
          </p>
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <input
              type="text"
              value={authCode}
              onChange={(e) => setAuthCode(e.target.value.toUpperCase())}
              placeholder="Enter 6-digit code"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={6}
            />
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Verify Code
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-md mx-auto mt-16 text-center">Loading...</div>
    </div>
  );

  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  // Get the display data either from bids or direct shipment

  if (!displayData) return <div>No shipment found</div>;

  

  return (
    <div className=''>
      <Header />
      {showSuccessAlert && (
        <div className="fixed top-4 right-4 w-96 bg-green-100 border border-green-500 text-green-700 px-4 py-3 rounded shadow-lg">
          <p className="font-medium">
            Bid selected successfully! Contact information has been sent to your email. 
            Redirecting to homepage...
          </p>
        </div>
      )}
      <div className='border border-base-100 rounded-lg mt-16 p-8'>
        <h1 className='text-base-100 font-semibold text-xl text-left mb-2'>Review bids for {id}</h1>

        <div className="flex flex-col gap-2 bg-primary space-between rounded-lg p-6">
        {displayData?.image_urls && (
  <>
    <ImageGrid 
      imageUrls={displayData.image_urls}
      onImageClick={(index) => {
        setCurrentImageIndex(index);
        setIsLightboxOpen(true);
      }}
    />
    <Lightbox
      isOpen={isLightboxOpen}
      onClose={() => setIsLightboxOpen(false)}
      images={displayData.image_urls}
      currentIndex={currentImageIndex}
      setCurrentIndex={setCurrentImageIndex}
    />
  </>
)}
          <div className="flex flex-row gap-2 text-base-100">Shipment Company: {displayData.shipment_company_name || displayData.company_name}</div>
          <div className="flex flex-row gap-2 text-base-100">Delivery Area: {displayData.rural_area}</div>
          <div className="flex flex-row gap-2 text-base-100">Vehicle Size: {displayData.vehicle_size}</div>
          <div className="flex flex-row gap-2 text-base-100">Deliver By: {displayData.deliver_by_date}</div>
        </div>
        
        <div className='divider divider-accent'></div>
        
        {bidData.length > 0 ? (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-base-100 mb-4">Received Bids</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left text-base-100 border">Bidder Name</th>
                    <th className="p-3 text-left text-base-100 border">Phone Number</th>
                    <th className="p-3 text-left text-base-100 border">Bid Amount</th>
                    <th className="p-3 text-left text-base-100 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bidData.map((bid, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-3 border text-base-100">{bid.bid_name}</td>
                      <td className="p-3 border text-base-100">{bid.bid_phone_number}</td>
                      <td className="p-3 border text-base-100">${bid.bid_amount}</td>
                      <td className="p-3 border text-base-100">
                        <button
                          onClick={() => handleBidSelection(bid)}
                          disabled={sending || bid.status === 'selected'}
                          className={`px-4 py-2 rounded ${
                            bid.status === 'selected'
                              ? 'bg-green-500 text-white cursor-not-allowed'
                              : sending && selectedBid?.id === bid.bid_id
                              ? 'bg-gray-400 cursor-wait'
                              : 'bg-blue-500 hover:bg-blue-600 text-white'
                          }`}
                        >
                          {bid.status === 'selected'
                            ? 'Selected'
                            : sending && selectedBid?.id === bid.bid_id
                            ? 'Sending...'
                            : 'Select Bid'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="mt-8 text-base-100">
            <h2 className="text-xl font-semibold mb-4">No Bids Yet</h2>
            <p>This shipment hasn't received any bids yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BidViewView;