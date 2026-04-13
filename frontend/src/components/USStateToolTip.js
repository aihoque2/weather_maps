import React, { useState, useEffect } from "react";


const USStateToolTip = ({state, mode, data_vals, location}) =>{

    const Opened, setOpened = useState(false);

    if (Opened){
        let tooltip = (<div>
        </div>);
    }
    else{
        let tooltip = null;
    }



    return(
        <div>
            {tooltip}
        </div>
    )
}