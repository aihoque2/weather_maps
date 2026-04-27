import React, { useState, useEffect } from "react";


const USStateToolTip = ({us_state, mode, data_vals, onClose, loc}) =>{
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
        <div style={{
            position: "fixed",
            top: loc.y,
            left: loc.x,
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "12px",
            zIndex: 999,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            minWidth: "180px",
            textAlign: "left",
        }}>
            <h3 style={{ margin: "0 0 8px 0" }}>{title}</h3>
            <p style={{ margin: "0 0 8px 0" }}>city data goes here</p>
            {/* clicking X sets selectedUSState to null, hiding tooltip */}
            <button onClick={onClose}>✕ close</button>
        </div>
    )
}

export default USStateToolTip;