// import logo from "@src/assets/images/logo/logo.png";

const companyImage = localStorage.getItem('company_image');

const SpinnerComponent = () => {
    return (
        <div className="fallback-spinner app-loader overlay">
            <img className="fallback-logo" src={`http://localhost:5000/${companyImage}`} alt="Company Logo"/>
            <div className="loading">
                <div className="effect-1 effects"></div>
                <div className="effect-2 effects"></div>
                <div className="effect-3 effects"></div>
            </div>
        </div>
    );
};  

export default SpinnerComponent;   