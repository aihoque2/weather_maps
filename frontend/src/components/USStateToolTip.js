import React, { useState, useEffect } from "react";

const USStateToolTip = ({ us_state, mode, data_vals, onClose, loc }) => {
    if (!loc) return null;

    const isRightSide = loc.x > window.innerWidth / 2;

    let title = "";
    if (mode === "temperature") title = `Temperature for ${us_state}`;
    else if (mode === "humidity") title = `Humidity for ${us_state}`;
    else if (mode === "wind_speed") title = `Wind Speed for ${us_state}`;

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

            <h3 style={{ margin: "0 0 8px 0", color: "#ffffff" }}>{title}</h3>
            <p style={{ margin: "0", color: "#cccccc" }}>city data goes here</p>
        </div>
    );
}
export default USStateToolTip;