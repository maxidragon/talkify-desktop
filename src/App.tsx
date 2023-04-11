import React from 'react';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Register from './Pages/Auth/Register/Register';
import Login from './Pages/Auth/Login/Login';
import DashboardLayout from './Layout/DashboardLayout';
import Dashboard from './Pages/Dashboard/Dashboard';

const router = createBrowserRouter([
    // {
    //     path: "*",
    //     element: <>,
    // },
    {
        path: "/auth/login",
        element: <Login/>,
    },
    {
        path: "/auth/register",
        element: <Register/>,
    },
    {
        path: "/",
        element: <DashboardLayout children={<Dashboard />} />,
    },
]);

function App() {
    return (
        <div>
            <RouterProvider router={router}/>
        </div>
    );
}

export default App;
