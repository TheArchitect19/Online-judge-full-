import React, { useState } from 'react';

const Test = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleFileChange = (event) => {
        const files = event.target.files;
        const filesArray = Array.from(files);
        setSelectedFiles(filesArray);
    };

    const handleFormSubmit = () => {
        const formData = new FormData();

        // Append all files to the same key
        selectedFiles.forEach((file, index) => {
            formData.append('files[]', file);
        });

        // Log the FormData entries
        for (const pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        // Now you can send formData to your backend using a fetch or axios
    };

    return (
        <div>
            <input type="file" accept=".txt" multiple onChange={handleFileChange} />
            {selectedFiles.length > 0 && (
                <div>
                    <p>Selected Files:</p>
                    <ul>
                        {selectedFiles.map((file, index) => (
                            <li key={index}>
                                {file.name} - {file.size} bytes
                            </li>
                        ))}
                    </ul>
                    <button onClick={handleFormSubmit}>Submit Form</button>
                    {/* Add more details or actions based on your requirements */}
                </div>
            )}
        </div>
    );
};

export default Test;
