import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient.js'
import Header from './Header.jsx'
import Lightbox from './Lightbox.jsx';
import LoadingOverlay from './LoadingOverlay';


const BidSubView = () => {
  const { id } = useParams();
  const [shipment, setShipment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    bid: '',
    phone_number: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitStatus, setSubmitStatus] = useState('');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';


  useEffect(() => {
    fetchShipment();
  }, [id]);

  const fetchShipment = async () => {
    try {
      const { data, error } = await supabase
        .from('Shipments')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setShipment(data);
    } catch (err) {
      setError('Error fetching shipment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sendEmailNotification = async () => {
    try {
      const response = await fetch(`${API_URL}/api/send-bid-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: shipment.email,  // Use the email directly from shipment data
          shipmentId: id,
          bidAmount: formData.bid,
          bidderName: formData.name,
          bidderCompany: formData.company_name,
          bidderPhone: formData.phone_number
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to send email notification');
      }
    } catch (err) {
      console.error('Error sending email notification:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowLoadingOverlay(true);
    setSubmitStatus('submitting');

    try {
      const { error } = await supabase
        .from('Bids')
        .insert([
          {
            name: formData.name,
            bid: parseFloat(formData.bid),
            phone_number: formData.phone_number,
            shipment_id: id,
            company_name: formData.company_name
          }
        ]);

      if (error) throw error;

      if (shipment?.email) {
        await sendEmailNotification();
      }
      
      setSubmitStatus('success');
      setFormData({ name: '', bid: '', company_name: '', phone_number: '' });
    } catch (err) {
      setSubmitStatus('error');
      console.error(err);
    }
    finally {
      setShowLoadingOverlay(false);
      setLoading(false);
    }
  };

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <Header />
      <div className="mt-16 p-8 max-w-lg bg-primary rounded-xl text-base-100 shadow-lg">
        <h1 className='text-xl text-gray-900 font-semibold mb-2 text-left'>Submit Bid</h1>
        
        {shipment?.image_urls && shipment.image_urls.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {shipment.image_urls.map((url, index) => (
              <div key={index} className="relative">
                <img 
                  src={url} 
                  alt={`Shipment ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg cursor-pointer"
                  onClick={() => openLightbox(index)}
                />
              </div>
            ))}
          </div>
        )}
        
        <Lightbox
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          images={shipment?.image_urls || []}
          currentIndex={currentImageIndex}
          setCurrentIndex={setCurrentImageIndex}
        />

        <div className="flex flex-col text-base-100">
          <div className="flex flex-row gap-2">Shipment Company: {shipment.company_name}</div>
          <div className="flex flex-row gap-2">Delivery Area: {shipment.rural_area}</div>
          <div className="flex flex-row gap-2">Vehicle Size: {shipment.vehicle_size}</div>
          <div className="flex flex-row gap-2">Deliver By: {shipment.deliver_by_date}</div>
        </div>
        <div className="divider divider-neutral"></div>
      <h2 className='text-left'>Enter Bid Below</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <input
            id="name"
            placeholder='Name'
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            className='bg-secondary rounded-md'
          />
        </div>

        <div>
          <input
            id="company_name"
            placeholder='Company Name'
            name="company_name"
            value={formData.company_name}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            className='bg-secondary rounded-md'
          />
        </div>

        <div>
          <input
            placeholder='Bid Amount'
            id="bid"
            name="bid"
            type="number"
            step="0.01"
            value={formData.bid}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            className='bg-secondary rounded-md'
          />
        </div>

        <div>
          <input
            placeholder='Phone Number'
            id="phone_number"
            name="phone_number"
            type="tel"
            value={formData.phone_number}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}

            className='bg-secondary rounded-md'
          />
        </div>

        <button 
          type="submit" 
          disabled={submitStatus === 'submitting'}
          style={{ 
            padding: '10px', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer', 
            color: 'white'
          }}
          className='bg-accent text-base-100 font-medium'
        >
          {submitStatus === 'submitting' ? 'Submitting...' : 'Submit Bid'}
        </button>

        {submitStatus === 'success' && (
          <p style={{ color: 'green', textAlign: 'center' }}>Bid submitted successfully!</p>
        )}
        {submitStatus === 'error' && (
          <p style={{ color: 'red', textAlign: 'center' }}>Error submitting bid. Please try again.</p>
        )}
      </form>
    </div>
    {showLoadingOverlay && <LoadingOverlay message="Submitting Bid..." />}

    </div>
  );
};

export default BidSubView;