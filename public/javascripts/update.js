// QR Code Generator
const key = 'Sixteen byte key';

document.getElementById('qrForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get form values
    const accountNumber = document.getElementById('accountNumber').value.trim();
    const mc = document.getElementById('mc').value;
    const mode = document.getElementById('mode').value;

    // Validate form inputs
    if (!accountNumber || isNaN(mc) || isNaN(mode)) {
      alert('Please enter valid input for all fields.');
      return;
    }

    const encrypt = {accountNumber, mc, mode};
    const jsonss = JSON.stringify(encrypt);
    const encryptedData = CryptoJS.AES.encrypt(jsonss, key).toString();

    const vals = document.getElementById('qrCodeInfo')
    vals.innerHTML = `Account Number: ${accountNumber}<br>MC: ${mc}<br>Mode: ${mode}<br><br>Encrypted Data: ${encryptedData}`

    // Generate QR code data
    const qrData = `${encryptedData}`;
    
    // Create QR code using qrcode-generator
    const typeNumber = 10; // QR code type (adjust as needed)
    const errorCorrectionLevel = 'L'; // Error correction level
    const qr = qrcode(typeNumber, errorCorrectionLevel);
    qr.addData(qrData);
    qr.make();
  
    // Display QR code image
    const qrCodeContainer = document.getElementById('qrCodeContainer');
    qrCodeContainer.innerHTML = qr.createImgTag();
  
    // Add download button for QR code image
    const downloadBtn = document.createElement('button');
    downloadBtn.innerText = 'Download QR Code';
    downloadBtn.addEventListener('click', function() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(function(blob) {
          saveAs(blob, 'qr_code.jpeg'); // Download as JPEG file
        }, 'image/jpeg');
      };
      img.src = qr.createDataURL(10, 0);
    });
  
    qrCodeContainer.appendChild(downloadBtn);
  });
  

// QR Code Scanner
document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const fileReader = new FileReader();
  
    fileReader.onload = function () {
      const image = new Image();
      image.onload = function () {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
  
        // Set the willReadFrequently attribute to true for better performance
        ctx.canvas.willReadFrequently = true;
  
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0, image.width, image.height);
        
        // Use jsQR library to decode QR code
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          const decryptedData = CryptoJS.AES.decrypt(code.data, key).toString(CryptoJS.enc.Utf8);
          console.log(decryptedData);
          document.getElementById('output').innerText = '\nQR Code Data Recieved:\n' + code.data + '\n\nDecrypted Data Recieved:\n' + decryptedData;
        } else {
          document.getElementById('output').innerText = 'No QR code found.';
        }
      };
      image.src = fileReader.result;
    };
  
    fileReader.readAsDataURL(file);
  });

