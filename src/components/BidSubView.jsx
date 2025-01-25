import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient.js'
import Header from './Header.jsx'
import Lightbox from './Lightbox.jsx';

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('submitting');

    try {
      const { error } = await supabase
        .from('Bids')
        .insert([
          {
            name: formData.name,
            bid: parseFloat(formData.bid),
            phone_number: formData.phone_number,
            shipment_id: id
          }
        ]);

      if (error) throw error;
      
      setSubmitStatus('success');
      setFormData({ name: '', bid: '', phone_number: '' });
    } catch (err) {
      setSubmitStatus('error');
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <Header />
    <div className="mt-16 p-8 max-w-lg bg-primary rounded-xl text-base-100 border border-neutral">
      <h1 className='text-xl text-gray-900 font-semibold mb-2 text-left'>Submit Bid for Shipment #{id}</h1>
      
      {shipment?.image_url && (
  <div style={{ marginBottom: '20px' }}>
    <img 
      src={shipment.image_url} 
      alt="Shipment"
      style={{ width: '100%', borderRadius: '4px', cursor: 'pointer' }}
      onClick={() => setIsLightboxOpen(true)}
    />
    <Lightbox
      isOpen={isLightboxOpen}
      onClose={() => setIsLightboxOpen(false)}
      imageUrl={shipment.image_url}
    />
  </div>
)}
              <div className="flex flex-col text-base-100">
          <div className="flex flex-row gap-2">Shipment Company: <div className="font-bold">{shipment.company_name}</div></div>
          <div className="flex flex-row gap-2">Delivery Area: <div className="font-bold">{shipment.rural_area}</div></div>
          <div className="flex flex-row gap-2">Vehicle Size: <div className="font-bold">{shipment.vehicle_size}</div></div>
          <div className="flex flex-row gap-2">Deliver By: <div className="font-bold">{shipment.deliver_by_date}</div></div>
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
    </div>
  );
};

export default BidSubView;