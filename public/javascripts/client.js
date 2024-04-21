const socket = io();

const fileInput = document.getElementById('fileInputt');
const receivedImagesDiv = document.getElementById('receivedImages');

function sendImage() {
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select an image file.');
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        const imageData = reader.result;

        // Send the image data to the server
        socket.emit('image', imageData);
    };
    reader.readAsDataURL(file);
}

socket.on('image', (imageData) => {
    // Display the received image
    const imgElement = document.createElement('img');
    imgElement.src = imageData;
    receivedImagesDiv.appendChild(imgElement);
});
