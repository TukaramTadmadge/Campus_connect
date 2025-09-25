import React, { useEffect, useState } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Provider, useSelector } from "react-redux";

import "react-toastify/dist/ReactToastify.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Groups from "./pages/Groups";
import SignUp from "./pages/SignUp";
import Contact from "./pages/Contact";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import Error from "./pages/Error";
import ProfileDetail from "./components/ProfileDetail";
import Loading from "./components/loading/Loading";
import GroupChatBox from "./components/chatComponents/GroupChatBox";
import NotificationBox from "./components/NotificationBox";
import NotePage from "./pages/NotePage";
import Home from "./pages/Home1";
import store from "./redux/store";

const Applayout = () => {
  const [toastPosition, setToastPosition] = useState("bottom-left");

  const isProfileDetails = useSelector((store) => store.condition.isProfileDetail);
  const isGroupChatBox = useSelector((store) => store.condition.isGroupChatBox);
  const isNotificationBox = useSelector((store) => store.condition.isNotificationBox);
  const isLoading = useSelector((store) => store.condition.isLoading);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 600) {
        setToastPosition("bottom-left");
      } else {
        setToastPosition("top-left");
      }
    };

    handleResize(); // run once on mount
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      {/* ✅ Toast Notifications */}
      <ToastContainer
        position={toastPosition}
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        stacked
        limit={3}
        toastStyle={{
          border: "1px solid #dadadaaa",
          textTransform: "capitalize",
        }}
      />

      {/* ✅ Common Layout */}
      <Header />
      <div className="h-16 md:h-20"></div>

<div className="min-h-[85vh] p-2 sm:p-4 bg-white">
        <Outlet />
        {isProfileDetails && <ProfileDetail />}
        {isGroupChatBox && <GroupChatBox />}
        {isNotificationBox && <NotificationBox />}
      </div>

      {isLoading && <Loading />}
      <Footer />
    </div>
  );
};

/* ✅ Router Config */
const routers = createBrowserRouter([
  {
    path: "/",
    element: <Applayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/groups", element: <Groups /> },
      { path: "/contact", element: <Contact /> },
      { path: "/about", element: <About /> },


      { path: "/signup", element: <SignUp /> },
      { path: "/signin", element: <SignIn /> },
      { path: "/notes", element: <NotePage /> },
    ],
    errorElement: <Error />,
  },
]);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={routers} />
    </Provider>
  );
}

export default App;
