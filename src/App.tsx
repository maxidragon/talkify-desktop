import React from 'react';
import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import Register from './Pages/Auth/Register/Register';
import Login from './Pages/Auth/Login/Login';
import DashboardLayout from './Layout/DashboardLayout';
import Dashboard from './Pages/Dashboard/Dashboard';
import Conversation from './Pages/Conversation/Conversation';
import Settings from './Pages/Settings/Settings';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import getUser from "./Lib/User";
import ConversationSidebar from "./Layout/ConversationSidebar";
import SettingsSidebar from "./Layout/SettingsSidebar";
import ChangePassword from "./Pages/Settings/ChangePassword";
import {ConfirmProvider} from "material-ui-confirm";

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
        element: <DashboardLayout children={<Conversation/>} sidebar={<ConversationSidebar/>}/>,
    },
    {
        path: "settings/",
        element: <DashboardLayout children={<Settings/>} sidebar={<SettingsSidebar/>}/>,
    },
    {
        path: "settings/password",
        element: <DashboardLayout children={<ChangePassword/>} sidebar={<SettingsSidebar/>}/>,
    }
]);
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});
const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
});

function App() {
    const user = getUser();

    return (
        <ThemeProvider theme={user.Theme === "dark" ? darkTheme : lightTheme}>
            <ConfirmProvider>
                <RouterProvider router={router}/>
            </ConfirmProvider>
        </ThemeProvider>
    );
}

export default App;
