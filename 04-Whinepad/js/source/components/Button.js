import React from "react";
import classNames from 'classnames'
import { PropTypes } from 'prop-types';


function Button(props) {
    const cssclasses = classNames('Button', props.className);
    return props.href ? 
        <a {...props} className={cssclasses} /> :
        <button {...props} className={cssclasses} />;
}

Button.propType = {
    href: PropTypes.string,
};

export default Button