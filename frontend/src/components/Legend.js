import React from "react";

const Legend = ({ mode, min, max, interpolateColor }) => {

    // 10 color stops across the gradient
    const steps = 10;
    const gradientStops = Array.from({ length: steps }, (_, i) => {
        const ratio = i / (steps - 1);
        return interpolateColor(ratio, mode);
    });

    const gradient = `linear-gradient(to right, ${gradientStops.join(", ")})`;

    const getUnit = () => {
        if (mode === "temperature") return "°F";
        if (mode === "humidity") return "%";
        if (mode === "wind_speed") return "mph";
        return "";
    }

    return (
        <div style={styles.container}>
            <div style={{ ...styles.gradientBar, background: gradient }} />
            <div style={styles.labels}>
                <span>{min.toFixed(1)} {getUnit()}</span>
                <span>{((min + max) / 2).toFixed(1)} {getUnit()}</span>
                <span>{max.toFixed(1)} {getUnit()}</span>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "20px auto",
        width: "400px",
    },
    gradientBar: {
        width: "100%",
        height: "20px",
        borderRadius: "4px",
        border: "1px solid #ccc",
    },
    labels: {
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        marginTop: "4px",
        fontSize: "13px",
        color: "#333",
    },
};

export default Legend;