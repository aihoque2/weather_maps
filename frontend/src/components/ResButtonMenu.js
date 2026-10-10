import React from "react";

export default function ResButtonMenu(props) {

    const setResolution = props.setResolution;

    const options = [ 
        { label: "State", value: "state" },
        {label: "Zip", value: "zip"},
    ];

    return (
        <div style={styles.container}>
            {options.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    onClick={() => setResolution(option.value)}
                    style={{
                        ...styles.option,
                        backgroundColor:
                            props.resolution === option.value
                                ? "#33d4da" // Selected background color (cyan blue)
                                : "#e6d0c6f3", // Unselected background color (light tan)
                        color:
                            props.mode === option.value ? "#070606" : "#7f8c8d", // Selected/unselected font color
                        transition: "all 0.3s ease",
                    }}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
        width: "100%",
        height: "50px",
        marginBottom: "10px",
        backgroundColor: "#8cd8e2",
        padding: "5px 0",
    },
    option: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100px",
        height: "50%",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "bold",
        textAlign: "center",
        border: "1px solid #bdc3c7", // Light gray border
        fontFamily: "inherit",
    },
};
