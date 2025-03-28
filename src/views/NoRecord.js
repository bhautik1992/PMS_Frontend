import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import { useSkin } from "@hooks/useSkin";
import illustrationsLight from "@src/assets/images/pages/error.svg";
import illustrationsDark from "@src/assets/images/pages/error-dark.svg";
import "@styles/base/pages/page-misc.scss";
import logo from "@src/assets/images/logo/logo_name.png";

const NoRecord = () => {
    const { skin } = useSkin();
    const source = skin === "dark" ? illustrationsDark : illustrationsLight;

    return (
        <div className="misc-wrapper">
            <a className="brand-logo" href="/">
                <img src={logo} alt="logo" style={{height:'50px'}}/>
            </a>

            <div className="misc-inner p-2 p-sm-3">
                <div className="w-100 text-center">
                    <h2 className="mb-1">404 Record Not Found 🕵🏻‍♀️</h2>
                    <p className="mb-2">
                        Uh-oh! 😕 The requested record could not be found on this server.
                    </p>
                    
                    <Button
                        tag={Link}
                        to="/"
                        color="primary"
                        className="btn-sm-block mb-2"
                    >
                        Back to home
                    </Button>
                    
                    <img className="img-fluid" src={source} alt="Not authorized page" />
                </div>
            </div>
        </div>
    );
};

export default NoRecord;


