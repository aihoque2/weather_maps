import React, { useState } from "react";

export default function ButtonMenu() {
    const [selectedValue, setSelectedValue] = useState("start");

    const options = [ 
        {label: "Starter", value: "start"},
        { label: "Temperature", value: "temp" },
        { label: "Wind Speed", value: "wind" },
        { label: "Humidity", value: "humid" },
    ];

    const handleChange = (value) => {
        setSelectedValue(value);
        console.log("Selected:", value);
    };

    return (
        <div style={styles.container}>
            {options.map((option) => (
                <label
                    key={option.value}
                    style={{
                        ...styles.option,
                        backgroundColor:
                            selectedValue === option.value
                                ? "#2ecc71" // Selected background color (green)
                                : "#ecf0f1", // Unselected background color (light gray)
                        color:
                            selectedValue === option.value ? "#ffffff" : "#7f8c8d", // Selected/unselected font color
                    }}
                >
                    <input
                        type="radio"
                        name="buttonMenu"
                        value={option.value}
                        checked={selectedValue === option.value}
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