import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import '../App.css'
import Header from './Header.jsx'
import VehicleSelector from './VehicleSelector.jsx'
import ImageUploader from './ImageUploader.jsx'
import { supabase } from '../../supabaseClient.js'

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
    <div>
      <Header />
      <form className='flex flex-col gap-2 p-3 bg-primary items-center rounded-xl text-base-100 mt-9' data-theme="mytheme" onSubmit={handleNewDelivery}>
        Enter your delivery information below:
        <input className='p-2 m-1 rounded-md bg-secondary placeholder:text-neutral text-base-100 w-96' type='text' placeholder='Contact Name' name='Contact Name' value={contactName} onChange={(e) => setContactName(e.target.value)}/>
        <input className='p-2 m-1 rounded-md bg-secondary placeholder:text-neutral text-base-100 w-96' type='text' placeholder='Company Name' name='Company Name' value={companyName} onChange={(e) => setCompanyName(e.target.value)}/>
        <input className='p-2 m-1 rounded-md bg-secondary placeholder:text-neutral text-base-100 w-96' type='tel' placeholder='Phone Number' name='Phone Number' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}/>
        <input className='p-2 m-1 rounded-md bg-secondary placeholder:text-neutral text-base-100 w-96' type='email' placeholder='Email' name='Email' value={email} onChange={(e) => setEmail(e.target.value)}/>
        <input className='p-2 m-1 rounded-md bg-secondary placeholder:text-neutral text-base-100 w-96' type='text' placeholder='Rural Area' name='Rural Area' value={ruralArea} onChange={(e) => setRuralArea(e.target.value)}/>
        <input className='p-2 m-1 rounded-md bg-secondary placeholder:text-neutral text-base-100 w-96' type='text' placeholder='Deliver-By Date' name='Deliver-By Date' value={deliverByDate} onChange={(e) => setDeliverByDate(e.target.value)}/>
        <VehicleSelector setVehicleSize={setVehicleSize} />
        <ImageUploader setDeliveryPhoto={setDeliveryPhoto} />              
        <button type="submit" className='w-48 border-base-100 bg-accent p-5 mt-4 text-base-100 font-bold' disabled={loading}>
          {loading ? 'Loading...' : 'Submit Delivery!'}
        </button>
      </form>
    </div>
  )
}

export default App