import React, { useState, useEffect } from "react";


const USStateToolTip = ({us_state, mode, data_vals, loca}) =>{
    var x = loc.x;
    var y = loc.y;
    let title= ""
    if (mode === "temperature") {
        title = "Temperature for ".concat(us_state);
    }

    if (mode === "humidity") {
        title = "Humidity for ".concat(us_state)
    }
    if (mode === "wind_speed"){
        title = "Humidity for ".concat(us_state)
    }

    return(
        <div>
            {}
        </div>
    )
}

export default USStateToolTip;