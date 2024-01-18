import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const Solved = () => {
    // Function to retrieve a cookie value
    const getCookie = (name) => {
        const cookieValue = Cookies.get(name);
        return cookieValue ? cookieValue : null;
    };

    // State to manage the button color
    const [buttonColor, setButtonColor] = useState(getCookie('buttonColor') || 'initialColor');

    // Function to change the button color and save the color in cookies
    const changeColor = () => {
        const newColor = buttonColor === 'red' ? '#01FE3E' : 'red';
        setButtonColor(newColor);
        Cookies.set('buttonColor', newColor);
    };

    // Set the initial color from the stored cookie
    useEffect(() => {
        const initialColor = getCookie('buttonColor');
        if (initialColor) {
            setButtonColor(initialColor);
        }
    }, []);

    return (
        <button
            style={{ backgroundColor: buttonColor, fontWeight: "600", fontSize: "medium", borderRadius: "15px",height:"35px" }}
            onClick={changeColor}
        >
            Solved
        </button>
    );
};

export default Solved;
