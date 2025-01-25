import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient.js';
import Header from './Header.jsx';
import Lightbox from './Lightbox.jsx'

const BidViewView = () => {
  const { id } = useParams();
  const [bidData, setBidData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBid, setSelectedBid] = useState(null);
  const [sending, setSending] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);


  useEffect(() => {
    fetchBids();
  }, [id]);

  const fetchBids = async () => {
    try {
      
      const { data, error } = await supabase
        .from('bids_with_shipments_view')
        .select('*')
        .eq('shipment_id', id);

      if (error) throw error;
      setBidData(data);
    } catch (err) {
      setError('Error fetching shipment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBidSelection = async (bid) => {
    try {
      setSending(true);
      setSelectedBid(bid);
      
      const username = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
  
      const response = await fetch('http://localhost:3000/api/send-notifications', {
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
  
      // Update the bid status in Supabase
      const { error: bidUpdateError } = await supabase
        .from('Bids')
        .update({ status: 'selected' })
        .eq('id', bid.bid_id);
  
      if (bidUpdateError) throw bidUpdateError;
  
      const { error: shipmentUpdateError } = await supabase
        .from('Shipments')
        .update({ status: 'closed' })
        .eq('id', bid.shipment_id);
  
      if (shipmentUpdateError) throw shipmentUpdateError;
  
      // Refresh the bids data
      await fetchBids();
    } catch (err) {
      console.error('Detailed selection error:', err);
      setError(`Error selecting bid: ${err.message}`);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!bidData || bidData.length === 0) return <div>No bids found for this shipment</div>;

  return (
    <div className=''>
      <Header />
      <div className='border border-base-100 rounded-lg mt-16 p-8'>
      <h1 className='text-base-100 text-semibold text-xl text-left mb-2'>Review bids for {id}</h1>

      <div className="flex flex-row gap-2 bg-primary space-between rounded-lg">
        
        <div className='max-w-lg max-h-lg rounded-lg overflow-hidden'>
        {bidData[0]?.image_url && (
  <div style={{ marginBottom: '20px' }}>
    <img 
      src={bidData[0].image_url} 
      alt="Shipment"
      style={{ width: '100%', borderRadius: '4px', cursor: 'pointer' }}
      onClick={() => setIsLightboxOpen(true)}
    />
    <Lightbox
      isOpen={isLightboxOpen}
      onClose={() => setIsLightboxOpen(false)}
      imageUrl={bidData[0].image_url}
    />
  </div>
)}
        </div>
        <div className="flex flex-col text-base-100">
          <div className="flex flex-row gap-2">Shipment Company: <div className="font-bold">{bidData[0].shipment_company_name}</div></div>
          <div className="flex flex-row gap-2">Rural Area: <div className="font-bold">{bidData[0].rural_area}</div></div>
          <div className="flex flex-row gap-2">Vehicle Size: <div className="font-bold">{bidData[0].vehicle_size}</div></div>
          <div className="flex flex-row gap-2">Deliver By: <div className="font-bold">{bidData[0].deliver_by_date}</div></div>
        </div>
      </div>
      <div className='divider divider-accent'></div>
      <div className="mt-8">
        <h2 className="text-xl font-bold text-base-100 mb-4">Received Bids</h2>
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
                          : sending && selectedBid?.id === bid.id
                          ? 'bg-gray-400 cursor-wait'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      {bid.status === 'selected'
                        ? 'Selected'
                        : sending && selectedBid?.id === bid.id
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
    </div>
    </div>
  );
};

export default BidViewView;