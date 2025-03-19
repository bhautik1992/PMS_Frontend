import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const ScrollTop = ({ showOffset = 100, scrollBehaviour = "smooth", children, ...rest }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY >= showOffset);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [showOffset]);

    const handleScrollToTop = () => {
        window.scroll({ top: 0, behavior: scrollBehaviour });
    };

    return (visible && (
        <div className="scroll-to-top" onClick={handleScrollToTop} {...rest}>
            {children}
        </div>
    ));
};

export default ScrollTop;

ScrollTop.propTypes = {
    showOffset: PropTypes.number,
    children: PropTypes.node.isRequired,
    scrollBehaviour: PropTypes.oneOf(["smooth", "instant", "auto"]),
};
