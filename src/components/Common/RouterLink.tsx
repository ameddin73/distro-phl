import React from "react";
import {Link, LinkProps} from "react-router-dom";

const RouterLink = React.forwardRef((props: LinkProps, ref) => {

    return (
        <Link style={{textDecoration: 'none', color: 'inherit'}} {...props}>
        </Link>
    );
});

export default RouterLink;