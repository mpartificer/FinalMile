import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient.js'
import Header from './Header.jsx'

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
    <div className="mt-24 max-w-lg bg-primary rounded-xl p-4 text-base-100">
      <h2>Submit Bid for Shipment #{id}</h2>
      
      {shipment?.image_url && (
        <div style={{ marginBottom: '20px' }}>
          <img 
            src={shipment.image_url} 
            alt="Shipment"
            style={{ width: '100%', borderRadius: '4px' }}
          />
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div>
          <label htmlFor="bid">Bid Amount:</label>
          <input
            id="bid"
            name="bid"
            type="number"
            step="0.01"
            value={formData.bid}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div>
          <label htmlFor="phone_number">Phone Number:</label>
          <input
            id="phone_number"
            name="phone_number"
            type="tel"
            value={formData.phone_number}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={submitStatus === 'submitting'}
          style={{ 
            padding: '10px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
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