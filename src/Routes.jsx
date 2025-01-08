import { createBrowserRouter } from "react-router-dom"
import DeliveryForm from "./components/DeliveryForm.jsx"
import BidSubView from "./components/BidSubView.jsx"
//import BidViewView from "./components/FollowersView.jsx"


const router = createBrowserRouter([
    {
        path: "/",
        element: <DeliveryForm />,
    },
    {
        path: `FinalMile/Delivery/:id/Bidding`,
        element: <BidSubView />,
    }
    // {
    //     path: `/Delivery/:id/BidsView`,
    //     element: <BidViewView />,
    // }
])

export default router