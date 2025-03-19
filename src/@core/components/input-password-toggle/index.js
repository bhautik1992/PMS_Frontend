import { Fragment, useState, forwardRef } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { Eye, EyeOff } from "react-feather";
import { InputGroup, Input, InputGroupText, Label } from "reactstrap";

const InputPasswordToggle = forwardRef((
    {field,form,label,hideIcon,showIcon,visible,className,htmlFor,placeholder,iconSize,inputClassName,invalid,...rest},ref
) => {
    const [inputVisibility, setInputVisibility] = useState(visible);

    const renderIcon = () => {
        const size = iconSize || 14;
        return inputVisibility
            ? showIcon || <EyeOff size={size} />
            : hideIcon || <Eye size={size} />;
        };

        const isInvalid = form.errors[field.name] && form.touched[field.name];

        return (
            <Fragment>
                {label && (<Label className="form-label" for={htmlFor}>{label}</Label>)}
                
                <InputGroup
                    className={classnames("input-password-toggle", {
                        "is-invalid": isInvalid, // Apply invalid styling to InputGroup
                    })}
                >
                    <Input
                        ref={ref}
                        {...field}
                        type={inputVisibility ? "text" : "password"}
                        placeholder={placeholder || "············"}
                        className={classnames("form-control", inputClassName)}
                        {...(htmlFor ? { id: htmlFor } : {})}
                        {...rest}
                    />
                    
                    <InputGroupText
                        className="cursor-pointer"
                        onClick={() => setInputVisibility(!inputVisibility)}
                    >
                    
                    {renderIcon()}
                    </InputGroupText>
                </InputGroup>
        </Fragment>
    );
    }
);

InputPasswordToggle.propTypes = {
    invalid       : PropTypes.bool,
    hideIcon      : PropTypes.node,
    showIcon      : PropTypes.node,
    visible       : PropTypes.bool,
    className     : PropTypes.string,
    placeholder   : PropTypes.string,
    iconSize      : PropTypes.number,
    inputClassName: PropTypes.string,
    label         : PropTypes.string,
    htmlFor       : PropTypes.string,
};

InputPasswordToggle.defaultProps = {
    visible: false,
};

export default InputPasswordToggle;


