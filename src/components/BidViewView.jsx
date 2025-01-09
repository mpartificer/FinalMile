import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient.js'
import Header from './Header.jsx'

const BidViewView = () => {
  const { id } = useParams();
  const [ bidData, setBidData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBids();
  }, [id]);

  const fetchBids = async () => {
    try {
      // Add logging to see what's being queried
      console.log('Fetching bids for shipment:', id);
      
      const { data, error } = await supabase
        .from('bids_with_shipments_view')
        .select('*')
        .eq('shipment_id', id);

      // Log the response
      console.log('Supabase response:', { data, error });

      if (error) throw error;
      setBidData(data);
    } catch (err) {
      setError('Error fetching shipment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!bidData || bidData.length === 0) return <div>No bids found for this shipment</div>;

  return (
    <div className=''>
      <Header />
      <div className="flex flex-row gap-2 mt-16 bg-primary rounded-lg p-4 m-4">
      <div className='max-w-lg max-h-lg rounded-lg overflow-hidden'>
      {bidData[0]?.image_url && (
        <div style={{ marginBottom: '20px' }}>
          <img 
            src={bidData[0].image_url} 
            alt="Shipment"
            style={{ width: '100%', borderRadius: '4px' }}
          />
        </div>
      )}
      </div>
      <div className="flex flex-col text-base-100">
        <div className="flex flex-row gap-2">Shipment Company:  <div className="font-bold">{bidData[0].shipment_company_name}</div></div>
        <div className="flex flex-row gap-2">Rural Area:  <div className="font-bold">{bidData[0].rural_area}</div></div>
        <div className="flex flex-row gap-2">Vehicle Size:  <div className="font-bold">{bidData[0].vehicle_size}</div></div>
        <div className="flex flex-row gap-2">Deliver By:  <div className="font-bold">{bidData[0].deliver_by_date}</div></div>

      </div>
      </div>
      <div className='text-base-100'>Review bids for {id}</div>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Received Bids</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left border">Bidder Name</th>
                <th className="p-3 text-left border">Phone Number</th>
                <th className="p-3 text-left border">Bid Amount</th>
              </tr>
            </thead>
            <tbody>
              {bidData.map((bid, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-3 border">{bid.bid_name}</td>
                  <td className="p-3 border">{bid.bid_phone_number}</td>
                  <td className="p-3 border">${bid.bid_amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BidViewView