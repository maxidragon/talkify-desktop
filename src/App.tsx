import React from 'react';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Register from './Pages/Auth/Register/Register';
import Login from './Pages/Auth/Login/Login';
import DashboardLayout from './Layout/DashboardLayout';
import Dashboard from './Pages/Dashboard/Dashboard';
import Conversation from './Pages/Conversation/Conversation';
import Settings from './Pages/Settings/Settings';
import {createTheme, ThemeProvider} from '@mui/material/styles';

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
        element: <DashboardLayout children={<Dashboard/>}/>,
    },
    {
        path: "conversation/:conversationId",
        element: <DashboardLayout children={<Conversation/>}/>,
    },
    {
        path: "settings/",
        element: <DashboardLayout children={<Settings/>}/>,
    }
]);
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#1C1F20',
        },
        secondary: {
            main: '#f48fb1',
        },
    },
});

function App() {
    return (
            <RouterProvider router={router}/>
        // <ThemeProvider theme={darkTheme}>
        // </ThemeProvider>
    );
}

export default App;
