import React, { useState, useEffect } from "react";

const USStateToolTip = ({ us_state, mode, city_vals, state_val, onClose, loc }) => {
    if (!loc) return null;
    console.log("here's state_val: ", state_val);

    const isRightSide = loc.x > window.innerWidth / 2;

    let title = "Avg ";
    if (mode === "temperature") title += `Temperature for ${us_state}: `;
    else if (mode === "humidity") title += `Humidity for ${us_state}: `;
    else if (mode === "wind_speed") title += `Wind Speed for ${us_state}: `;


    const getUnit = () => {
        if (mode === "temperature") return " °F";
        if (mode === "humidity") return " %";
        if (mode === "wind_speed") return " mph";
        return "";
    }
    
    return (
        <div style={{
            position: "fixed",
            top: loc.y,
            // if right side, anchor tooltip to the left of click instead
            left: isRightSide ? "auto" : loc.x,
            right: isRightSide ? window.innerWidth - loc.x : "auto",
            backgroundColor: "#1a1a2e",
            border: "1px solid #14e2af",
            borderRadius: "8px",
            padding: "28px 16px 16px 16px",
            zIndex: 999,
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            minWidth: "200px",
            textAlign: "left",
        }}>
            {/* X flips to left or right depending on screen side */}
            <button onClick={onClose} style={{
                position: "absolute",
                top: "8px",
                left: isRightSide ? "auto" : "8px",
                right: isRightSide ? "8px" : "auto",
                background: "none",
                border: "none",
                color: "#ffffff",
                fontSize: "16px",
                cursor: "pointer",
                lineHeight: 1,
                padding: "0",
            }}>✕</button>

            <p style={{ margin: "0 0 8px 0", color: "#ffffff" }}>
                {/*call upon Math.round() for 2 decimals*/
                title.concat(Math.round(state_val * 100) / 100)+getUnit()}
            </p> 
            <div style={{ marginTop: "8px" }}>
                {city_vals ? city_vals.map(({ city, value }) => (
                    <div key={city} style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "16px",
                        padding: "4px 0",
                        borderBottom: "1px solid #2a2a4e",
                        color: "#cccccc",
                        fontSize: "13px",
                    }}>
                        <span>{city}</span>
                        <span style={{ color: "#14e2af", fontWeight: "bold" }}>
                            {typeof value === "number" ? value.toFixed(1) : value} {getUnit()}
                        </span>
                    </div>
                )) : <p style={{ color: "#cccccc" }}>Loading...</p>}
            </div>        
        </div>
    );
}
export default USStateToolTip;