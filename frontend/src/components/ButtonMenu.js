import React, { useState } from "react";

export default function ButtonMenu(props) {

    const setMode = props.setMode;

    const options = [ 
        {label: "Welcome!", value: "start"},
        { label: "Temperature", value: "temperature" },
        { label: "Wind Speed", value: "wind_speed" },
        { label: "Humidity", value: "humidity" },
        { label: "Test", value: "test"},
    ];

    
    const handleChange = (value) => {
        setMode(value);
        console.log("Selected:", props.mode);
    };

    return (
        <div style={styles.container}>
            {options.map((option) => (
                <label
                    key={option.value}
                    style={{
                        ...styles.option,
                        backgroundColor:
                            props.mode === option.value
                                ? "#2ecc71" // Selected background color (green)
                                : "#ecf0f1", // Unselected background color (light gray)
                        color:
                            props.mode === option.value ? "#ffffff" : "#7f8c8d", // Selected/unselected font color
                        transition: "all 0.3s slide",
                    }}
                >
                    <input
                        type="radio"
                        name="buttonMenu"
                        value={option.value}
                        checked={props.mode === option.value}
                        onChange={() => handleChange(option.value)}
                        style={styles.radioInput}
                    />
                    {option.label}
                </label>
            ))}
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        gap: "10px", // Space between the options
        marginTop: "20px",
        position:"fixed",
        top: 0, // pins to top
        left: 0,
        right: 0, // full width
        zIndex: 1000, // stays above everything
        //backgroundColor: "#58c0d3", // so content doesn't bleed through
        padding: "10px 0",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)", // subtle shadow so it feels lifted
    },
    option: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100px",
        height: "40px",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "bold",
        textAlign: "center",
        border: "1px solid #bdc3c7", // Light gray border
    },
    radioInput: {
        display: "none", // Hide the radio input visually
    },
};