import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import { useSkin } from "@hooks/useSkin";
import {} from "@utils";
import illustrationsLight from "@src/assets/images/pages/not-authorized.svg";
import illustrationsDark from "@src/assets/images/pages/not-authorized-dark.svg";
import "@styles/base/pages/page-misc.scss";
import logo from "@src/assets/images/logo/logo_name.png";
import { Helmet } from 'react-helmet-async';

const NotAuthorized = () => {
    const { skin } = useSkin();
    const source = skin === "dark" ? illustrationsDark : illustrationsLight;

    return (
        <>
            <Helmet>
                <title>Not Authorized | PMS</title>
            </Helmet>

            <div className="misc-wrapper">
                <a className="brand-logo" href="/">
                    <img src={logo} alt="logo" style={{height:'50px'}}/>
                </a>
        
                <div className="misc-inner p-2 p-sm-3">
                    <div className="w-100 text-center">
                        <h2 className="mb-1">You are not authorized! 🔐</h2>
                        <p className="mb-2">
                            This page cannot be displayed because the required permissions are not available for your account.
                            Please contact the site administrator to request access.
                        </p>
                        
                        <Button
                            tag={Link}
                            color="primary"
                            className="btn-sm-block mb-1"
                            to={"/"}
                        >
                            Back to Home
                        </Button>
                        
                        <img className="img-fluid" src={source} alt="Not authorized page" />
                    </div>
                </div>
            </div>
        </>
    );
};

export default NotAuthorized;


