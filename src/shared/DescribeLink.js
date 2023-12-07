import React from "react";
import { Link } from "react-router-dom";

export default function DescribeLink({namespace}) {
    return <Link to={`/namespace/describe/${namespace}`}>
        {namespace}
    </Link>
}