import React from 'react';
import SwitchSelector from "react-switch-selector";


export default function ButtonMenu(){
    const options = [
        {
            label: "Starter",
            value: "starter",
            selectedBackgroundColor: "#fbc531"

        },

        {
            label: "Temp",
            value: "temperature",
            selectedBackgroundColor: "#fbc531",

        },

        {
            label: "Wind",
            value: "wind_speed",
            selectedBackgroundColor: "#fbc531",

        },      
        
        {
            label: "Humid",
            value: "humidity",
            selectedBackgroundColor: "#fbc531",

        },  
    
    ];

    const initialIdx = options.findIndex(({value}) => value === "temperature")

    const onChange = (newValue) => {
        console.log(newValue);
    };


    return (
        <div>
            <SwitchSelector
                options = {options}
                backgroundColor={"#353b48"}
                fontColor={"#f5f6fa"}
                initialIdx={0}
                onChange = {onChange}
                border={0}>
            </SwitchSelector>

        </div>

)
};
