import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import '../App.css'
import Header from './Header.jsx'
import VehicleSelector from './VehicleSelector.jsx'
import ImageUploader from './ImageUploader.jsx'
import { supabase } from '../../supabaseClient.js'
import Lightbox from './Lightbox';

function App() {
  const [loading, setLoading] = useState(false)
  const [contactName, setContactName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [vehicleSize, setVehicleSize] = useState(null);
  const [ruralArea, setRuralArea] = useState('');
  const [deliverByDate, setDeliverByDate] = useState('');
  const [deliveryPhoto, setDeliveryPhoto] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const sendEmailNotification = async (recipientEmail, deliveryId) => {
    try {
      const response = await fetch('http://localhost:3000/api/send-confirmation-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: recipientEmail,
          deliveryId: deliveryId,
          contactName: contactName
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send confirmation email');
      }
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      // Don't block the form submission if email fails
    }
  };

  const handleNewDelivery = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // First, upload the image to Storage
      let imageUrl = null
      if (deliveryPhoto && deliveryPhoto.name) {
        const fileExt = deliveryPhoto.name.split('.').pop()
        const fileName = `${uuidv4()}.${fileExt}`
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('Manifests')
          .upload(fileName, deliveryPhoto)

        if (uploadError) {
          throw uploadError
        }

        const { data: { publicUrl } } = supabase.storage
          .from('Manifests')
          .getPublicUrl(fileName)

        imageUrl = publicUrl
      }

      // Then create the shipment record
      const { data: shipmentData, error: shipmentError } = await supabase
        .from('Shipments')
        .insert([
          {
            contact_name: contactName,
            company_name: companyName,
            email: email,
            phone_number: phoneNumber,
            vehicle_size: vehicleSize,
            rural_area: ruralArea,
            deliver_by_date: deliverByDate,
            image_url: imageUrl
          }
        ])
        .select()

      if (shipmentError) throw shipmentError

      // Send confirmation email
      await sendEmailNotification(email, shipmentData[0].id)

      // Notify overflow companies using existing Express backend
      const notifyResponse = await fetch('http://localhost:3000/api/notify-overflow-companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shipmentId: shipmentData[0].id
        }),
      });

      if (!notifyResponse.ok) {
        const errorData = await notifyResponse.json();
        throw new Error(errorData.error || 'Failed to notify overflow companies');
      }

      // Clear the form
      setContactName('')
      setCompanyName('')
      setEmail('')
      setPhoneNumber('')
      setVehicleSize(null)
      setRuralArea('')
      setDeliverByDate('')
      setDeliveryPhoto(null)

      alert('Shipment created successfully!')

    } catch (error) {
      console.error('Error:', error)
      alert('Error creating shipment: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
<div className="bg-white min-h-screen">
      <Header />
      <form className='max-w-xl mx-auto p-8 bg-white rounded-lg shadow-md mt-16 border border-neutral' onSubmit={handleNewDelivery}>
        <h1 className="text-xl text-gray-900 font-semibold mb-2 text-left">Submit Delivery Overflow</h1>
        <p className="text-gray-600 mb-6 text-left">Upload your manifest and provide details for bidding</p>
        <input className='bg-white w-full p-3 border border-gray-200 rounded-lg mb-4 placeholder:text-gray-400'
          type='text' 
          placeholder='Contact Name' 
          name='Contact Name' 
          value={contactName} 
          onChange={(e) => setContactName(e.target.value)}/>
        <input className='bg-white w-full p-3 border border-gray-200 rounded-lg mb-4 placeholder:text-gray-400'
          type='text'  
          placeholder='Company Name' 
          name='Company Name' 
          value={companyName} 
          onChange={(e) => setCompanyName(e.target.value)}/>
        <input className='bg-white w-full p-3 border border-gray-200 rounded-lg mb-4 placeholder:text-gray-400'
          type='tel'  
          placeholder='Phone Number' 
          name='Phone Number' 
          value={phoneNumber} 
          onChange={(e) => setPhoneNumber(e.target.value)}/>
        <input className='bg-white w-full p-3 border border-gray-200 rounded-lg mb-4 placeholder:text-gray-400'
          type='email'  
          placeholder='Email' 
          name='Email' 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}/>
        <input className='bg-white w-full p-3 border border-gray-200 rounded-lg mb-4 placeholder:text-gray-400'
          type='text'  
          placeholder='Delivery Area' 
          name='Delivery Area' 
          value={ruralArea} 
          onChange={(e) => setRuralArea(e.target.value)}/>
        <input className='bg-white w-full p-3 border border-gray-200 rounded-lg mb-4 placeholder:text-gray-400'
          type='date'  
          placeholder='Deliver-By Date' 
          name='Deliver-By Date' 
          value={deliverByDate} 
          onChange={(e) => setDeliverByDate(e.target.value)}/>       
        <div className="mb-6">
          <h2 className="text-base text-gray-900 font-medium mb-4 text-left">Select Required Vehicle Type</h2>
          <VehicleSelector setVehicleSize={setVehicleSize} />
        </div>
        <div className="mb-6">
          <h2 className="text-base text-gray-900 font-medium mb-4 text-left">Upload Manifest Image</h2>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
            <ImageUploader setDeliveryPhoto={setDeliveryPhoto} deliveryPhoto={deliveryPhoto} />
          </div>
        </div>             
        <button type="submit" 
          className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors'
          disabled={loading}>
          {loading ? 'Loading...' : 'Submit for Bidding'}
        </button>
      </form>
    </div>
  )
}

export default App