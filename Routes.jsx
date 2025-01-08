import { createBrowserRouter } from "react-router-dom"
import App from "./components/App.jsx"
//import BidSubView from "./components/ProfileView.jsx"
//import BidViewView from "./components/FollowersView.jsx"


const router = createBrowserRouter([
    { basename: import.meta.env.DEV ? "/" : "/siiiift/" },
    {
        path: "/",
        element: <App />,
    }
    // {
    //     path: `/Delivery/:slug/Bidding`,
    //     element: <BidSubView />,
    // },
    // {
    //     path: `/Delivery/:slug/BidsView`,
    //     element: <BidViewView />,
    // }
])

export default router