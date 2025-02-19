import { useState, useEffect, memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient.js';
import Header from './Header.jsx';
import Lightbox from './Lightbox.jsx';
import LoadingOverlay from './LoadingOverlay.jsx';

// Responsive ImageGrid component
const ImageGrid = memo(({ imageUrls, onImageClick }) => {
  const [imageStatuses, setImageStatuses] = useState({});
  const validImageUrls = Array.isArray(imageUrls) ? imageUrls : [];

  useEffect(() => {
    if (validImageUrls.length > 0) {
      setImageStatuses({});
    }
  }, [validImageUrls]);

  if (!validImageUrls.length) {
    return null;
  }

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

  return (
    // Change to single column on mobile, two columns on larger screens
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
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

ImageGrid.displayName = 'ImageGrid';

ImageGrid.defaultProps = {
  imageUrls: [],
  onImageClick: () => {}
};

// Card component for responsive bid display
const BidCard = ({ bid, onSelect, sending, selectedBid }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between">
          <span className="font-medium text-gray-700">Bidder:</span>
          <span className="text-gray-900">{bid.bid_name}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-700">Phone:</span>
          <span className="text-gray-900">{bid.bid_phone_number}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-700">Bid Amount:</span>
          <span className="text-gray-900 font-semibold">${bid.bid_amount}</span>
        </div>
        <div className="mt-3 flex justify-end">
          <button
            onClick={() => onSelect(bid)}
            disabled={sending || bid.status === 'selected'}
            className={`px-4 py-2 rounded w-full sm:w-auto ${
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
        </div>
      </div>
    </div>
  );
};

// Shipment details card component
const ShipmentDetailsCard = ({ data }) => {
  return (
    <div className="bg-primary rounded-lg p-4 text-base-100">
      <div className="grid grid-cols-1 gap-3">
        <div className="flex justify-between">
          <span className="font-medium">Shipment Company:</span>
          <span>{data.shipment_company_name || data.company_name}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Delivery Area:</span>
          <span>{data.rural_area}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Vehicle Size:</span>
          <span>{data.vehicle_size}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Deliver By:</span>
          <span>{data.deliver_by_date}</span>
        </div>
      </div>
    </div>
  );
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
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
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
        .select('*')
        .eq('shipment_id', id);

      if (bidsError) throw bidsError;
      
      // If we have bids, we need to separately fetch the shipment for images
      if (bidsData && bidsData.length > 0) {
        // Fetch the shipment data for images
        const { data: shipmentInfo, error: shipmentError } = await supabase
          .from('Shipments')
          .select('image_urls')
          .eq('id', id)
          .single();

        if (shipmentError) throw shipmentError;

        // Combine the data
        const combinedData = bidsData.map(bid => ({
          ...bid,
          image_urls: shipmentInfo?.image_urls || []
        }));

        setBidData(combinedData);
      } else {
        // If no bids, fetch the shipment information directly
        const { data: shipmentInfo, error: shipmentError } = await supabase
          .from('Shipments')
          .select('*')
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
    if (showSuccessAlert) {
      const timer = setTimeout(() => {
        navigate('/FinalMile');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessAlert, navigate]);

  const handleBidSelection = async (bid) => {
    try {
      setShowLoadingOverlay(true);
      setSending(true);
      setSelectedBid(bid);
      
      const username = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
  
      const response = await fetch(`${API_URL}/api/send-notifications`, {
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
      setShowLoadingOverlay(false);
      setSending(false);
    }
  };

  // Auth screen
  if (showAuthPrompt) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-md mx-auto mt-12 p-4 sm:p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Enter Access Code</h2>
          <p className="text-gray-600 mb-4">
            We created a secure access code for your new shipment. You can find it in the e-mail confirming the details of your shipment.
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
      <div className="max-w-md mx-auto mt-12 text-center p-4">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-slate-200 h-12 w-12 mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-28 mb-2.5"></div>
          <div className="h-3 bg-slate-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-md mx-auto mt-12 p-4 text-red-600 bg-red-50 rounded-lg">
        {error}
      </div>
    </div>
  );

  if (!displayData) return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-md mx-auto mt-12 p-4 text-gray-700">
        No shipment found
      </div>
    </div>
  );

  return (
    <div className="pb-16">
      <Header />
      {showSuccessAlert && (
        <div className="fixed top-4 right-4 z-50 w-full max-w-xs sm:max-w-md bg-green-100 border border-green-500 text-green-700 px-4 py-3 rounded shadow-lg">
          <p className="font-medium">
            Bid selected successfully! Contact information has been sent to your email. 
            Redirecting to homepage...
          </p>
        </div>
      )}
      
      <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8 mt-12">
        <div className="border border-base-100 rounded-lg p-4 sm:p-6">
          <h1 className="text-base-100 font-semibold text-xl text-left mb-4">Review bids</h1>

          {/* Images and shipment details */}
          <div className="bg-primary rounded-lg overflow-hidden">
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
            
            <ShipmentDetailsCard data={displayData} />
          </div>
          
          <div className="divider divider-accent my-6"></div>
          
          {/* Bids section */}
          {bidData.length > 0 ? (
            <div>
              <h2 className="text-xl font-semibold text-base-100 mb-4">Received Bids</h2>
              
              {/* Mobile view - cards for each bid */}
              <div className="block sm:hidden">
                {bidData.map((bid, index) => (
                  <BidCard 
                    key={index}
                    bid={bid}
                    onSelect={handleBidSelection}
                    sending={sending}
                    selectedBid={selectedBid}
                  />
                ))}
              </div>
              
              {/* Table view for larger screens */}
              <div className="hidden sm:block overflow-x-auto">
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
            <div className="mt-12 p-4 text-base-100 bg-gray-50 rounded-lg text-center">
              <h2 className="text-xl font-semibold mb-2">No Bids Yet</h2>
              <p>This shipment hasn't received any bids yet.</p>
            </div>
          )}
        </div>
      </div>
      
      {showLoadingOverlay && <LoadingOverlay message="Processing bid selection..." />}
    </div>
  );
};

export default BidViewView;