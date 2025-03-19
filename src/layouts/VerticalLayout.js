// ** React Imports
import { Outlet } from "react-router-dom";

// ** Core Layout Import
// !Do not remove the Layout import
import Layout from "@layouts/VerticalLayout";

// ** Menu Items Array
import navigation from "@src/navigation/vertical";

import { useSelector } from "react-redux";
import { useState, useEffect } from 'react';

const VerticalLayout = (props) => {
  // const [menuData, setMenuData] = useState([])

  // ** For ServerSide navigation
  // useEffect(() => {
  //   axios.get(URL).then(response => setMenuData(response.data))
  // }, [])

    const { permissions } = useSelector((state) => state.LoginReducer);
    const [revisedNavigation, setRevisedNavigation]  = useState([]);

    useEffect(() => {
        const temp = navigation.filter((item) => 
            item.action && permissions.includes(item.action)
        );
        
        setRevisedNavigation(temp);
    },[permissions])

    return (
        <Layout menuData={revisedNavigation} {...props}>
            <div className="app-content content overflow-hidden">
                <div className="content-overlay"></div>
                <div className="header-navbar-shadow"></div>
                <div className="container-xxxl p-0">
                    <Outlet />
                </div>
            </div>
        </Layout>
    );
};

export default VerticalLayout;
