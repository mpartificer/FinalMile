import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid' // Add this import
import './App.css'
import Header from './components/Header.jsx'
import VehicleSelector from './components/VehicleSelector.jsx'
import ImageUploader from './components/ImageUploader.jsx'
import { supabase } from '../supabaseClient.js'

function App() {
  const [loading, setLoading] = useState(false)
  const [contactName, setContactName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [vehicleSize, setVehicleSize] = useState(null);
  const [ruralArea, setRuralArea] = useState('');
  const [deliverByDate, setDeliverByDate] = useState('');
  const [deliveryPhoto, setDeliveryPhoto] = useState(null); // Changed to null

  const handleNewDelivery = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // First, upload the image to Storage
      let imageUrl = null
      if (deliveryPhoto && deliveryPhoto.name) { // Add null check for deliveryPhoto and name
        const fileExt = deliveryPhoto.name.split('.').pop()
        const fileName = `${uuidv4()}.${fileExt}`
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('Manifests')
          .upload(fileName, deliveryPhoto)

        if (uploadError) {
          throw uploadError
        }

        // Get the public URL of the uploaded image
        const { data: { publicUrl } } = supabase.storage
          .from('Manifests')
          .getPublicUrl(fileName)

        imageUrl = publicUrl
      }

      // Then create the shipment record
      const { data, error } = await supabase
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

      if (error) throw error

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
            <button type="submit" className='w-48 border-base-100 bg-accent p-5 mt-4 text-base-100 font-bold' disabled={loading}>{loading ? 'Loading...' : 'Submit Delivery!'}</button>
          </form>
        </div>
    )
}

export default App