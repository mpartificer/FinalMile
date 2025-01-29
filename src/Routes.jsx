import { createBrowserRouter } from "react-router-dom"
import DeliveryForm from "./components/DeliveryForm.jsx"
import BidSubView from "./components/BidSubView.jsx"
import BidViewView from "./components/BidViewView.jsx"

const router = createBrowserRouter([
    {
        path: "/",
        element: <DeliveryForm />,
    },
    {
        path: "/",
        element: <DeliveryForm />,
    },
    {
        path: "/Delivery/:id/Bidding",
        element: <BidSubView />,
    },
    {
        path: "/Delivery/:id/BidsView",
        element: <BidViewView />,
    }
])

export default router