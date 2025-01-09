import { createBrowserRouter } from "react-router-dom"
import DeliveryForm from "./components/DeliveryForm.jsx"
import BidSubView from "./components/BidSubView.jsx"
import BidViewView from "./components/BidViewView.jsx"

const router = createBrowserRouter([
    {
        path: "/FinalMile",
        element: <DeliveryForm />,
    },
    {
        path: "/FinalMile/",
        element: <DeliveryForm />,
    },
    {
        path: "/FinalMile/Delivery/:id/Bidding",
        element: <BidSubView />,
    },
    {
        path: "/FinalMile/Delivery/:id/BidsView",
        element: <BidViewView />,
    }
])

export default router