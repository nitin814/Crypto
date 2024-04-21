const filestegoimage = document.getElementById('stegoImage');
const filestegoimage1 = document.getElementById('stegoImage1');
const receivedImagesDiv = document.getElementById('receivedImages');


var coverImageDataUri;
var payloadImageDataUri;

function readCoverImage(input) {
    coverImageDataUri = input;
}

function readPayloadImage(input) {
    payloadImageDataUri = input;
}

function hideImage(val) {
    if (!coverImageDataUri || !payloadImageDataUri) {
        if (!coverImageDataUri) {
            alert('Please select cover image.');
        }
        if (!payloadImageDataUri) {
            alert('Please select payload image.');
        }
        alert('Please select both cover image and payload image.');
        return;
    }

    var stegoDataUri = steg.encode(payloadImageDataUri, coverImageDataUri);
    
    if (val==1) {
      document.getElementById('fish1').style.display = 'block';
      document.getElementById("stegoImage1").src = stegoDataUri; }
    else {
      document.getElementById('fish').style.display = 'block';
      document.getElementById("stegoImage").src = stegoDataUri; }
}

function decodeImage(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            var decodedDataUri = steg.decode(e.target.result);
            document.getElementById("decodedImage").src = decodedDataUri;
        };

        reader.readAsDataURL(input.files[0]);
    }
}

function sendImage1() {
    const file = filestegoimage1.files[0];
    if (!file) {
        alert('Please select an image file.');
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        const imageData = reader.result;
        socket.emit('image', imageData);
    };
    reader.readAsDataURL(file);
}


function sendImage() {
  const file = filestegoimage.files[0];
  if (!file) {
      alert('Please select an image file.');
      return;
  }

  const reader = new FileReader();
  reader.onload = () => {
      const imageData = reader.result;
      socket.emit('image', imageData);
  };
  reader.readAsDataURL(file);
}



















   
// for the second scan upload part 
document.getElementById('uploadingqr').addEventListener('change', function (event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
      const image = document.getElementById('uploadedImage');
      image.src = e.target.result;
      image.style.display = 'block';
      readPayloadImage(e.target.result);
      document.getElementById('buttonContainer').style.display = 'block';
      document.getElementById('uploadCoverBtn').style.display = 'block';
  };

  reader.readAsDataURL(file);
  });

  document.getElementById('uploadCoverBtn').addEventListener('click', function () {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.addEventListener('change', function (event) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = function (e) {
      const coverImage = document.getElementById('coverImage');
      coverImage.src = e.target.result;
      readCoverImage(e.target.result);
      coverImage.style.display = 'block';
      document.getElementById('sendImageBtn').style.display = 'block';
      };

      reader.readAsDataURL(file);
  });
  fileInput.click();
  });

  document.getElementById('sendImageBtn').addEventListener('click', function () {
    hideImage(2)
  });

    document.addEventListener('DOMContentLoaded', function () {
    var formInputs = document.querySelectorAll('.form input, .form textarea');
    formInputs.forEach(function (input) {
        input.addEventListener('keyup', function (e) {
        var label = input.previousElementSibling;
        if (input.value === '') {
            label.classList.remove('active', 'highlight');
        } else {
            label.classList.add('active', 'highlight');
        }
        });

        input.addEventListener('blur', function () {
        var label = input.previousElementSibling;
        if (input.value === '') {
            label.classList.remove('active', 'highlight');
        } else {
            label.classList.remove('highlight');
        }
        });

        input.addEventListener('focus', function () {
        var label = input.previousElementSibling;
        if (input.value === '') {
            label.classList.remove('highlight');
        } else {
            label.classList.add('highlight');
        }
        });
    });

    var tabLinks = document.querySelectorAll('.tab a');
    tabLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
        e.preventDefault();
        var parent = link.parentElement;
        parent.classList.add('active');
        var siblings = parent.parentElement.children;
        for (var i = 0; i < siblings.length; i++) {
            if (siblings[i] !== parent) {
            siblings[i].classList.remove('active');
            }
        }

        var target = link.getAttribute('href');
        var tabContents = document.querySelectorAll('.tab-content > div');
        tabContents.forEach(function (content) {
            if (content.id === target.substr(1)) {
            content.style.display = 'block';
            } else {
            content.style.display = 'none';
            }
        });
        });
    });
    });

































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

    const vals = document.getElementById('qrCodeInfo')
    vals.innerHTML = `Account Number: ${accountNumber}<br>MC: ${mc}<br>Mode: ${mode}<br>`

    // Generate QR code data
    const qrData = `${accountNumber} ${mc} ${mode}`;
    
    // Create QR code using qrcode-generator
    const typeNumber = 10; // QR code type (adjust as needed)
    const errorCorrectionLevel = 'L'; // Error correction level
    const qr = qrcode(typeNumber, errorCorrectionLevel);
    qr.addData(qrData);
    qr.make();
  
    // Display QR code image
    const qrCodeContainer = document.getElementById('qrCodeContainer');
    qrCodeContainer.innerHTML = qr.createImgTag();
    readPayloadImage(qrCodeContainer.innerHTML);

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
    
    document.getElementById('buttonContainer1').style.display = 'block';
    document.getElementById('uploadCoverBtn1').style.display = 'block';
    qrCodeContainer.appendChild(downloadBtn);

  });
  
  document.getElementById('uploadCoverBtn1').addEventListener('click', function () {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function (e) {
        const coverImage = document.getElementById('coverImage1');
        coverImage.src = e.target.result;
        readCoverImage(e.target.result);
        coverImage.style.display = 'block';
        document.getElementById('sendImageBtn1').style.display = 'block';
        };

        reader.readAsDataURL(file);
    });
    fileInput.click();
    });

    document.getElementById('sendImageBtn1').addEventListener('click', function () {
      hideImage(1)
    });


// QR Code Scanner
document.getElementById('scanningqr').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    
    const imageshowing = document.getElementById('showqrcode');
    imageshowing.style.display = 'block';

    fileReader.onload = function () {
      const image = new Image();
      image.onload = function () {
        const canvas = document.getElementById('canvasscan');
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
          document.getElementById('outputscan').innerText = '\nQR Code Data Recieved:\n' + code.data;
        } else {
          document.getElementById('outputscan').innerText = 'No QR code found.';
        }
      };
      imageshowing.src = fileReader.result;
      image.src = fileReader.result;
    };
  
    fileReader.readAsDataURL(file);
  });










// for the second scan upload part 
document.getElementById('uploadingqr').addEventListener('change', function (event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
      const image = document.getElementById('uploadedImage');
      image.src = e.target.result;
      image.style.display = 'block';
      readPayloadImage(e.target.result);
      document.getElementById('buttonContainer').style.display = 'block';
      document.getElementById('uploadCoverBtn').style.display = 'block';
  };

  reader.readAsDataURL(file);
  });

  document.getElementById('uploadCoverBtn').addEventListener('click', function () {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.addEventListener('change', function (event) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = function (e) {
      const coverImage = document.getElementById('coverImage');
      coverImage.src = e.target.result;
      readCoverImage(e.target.result);
      coverImage.style.display = 'block';
      document.getElementById('sendImageBtn').style.display = 'block';
      };

      reader.readAsDataURL(file);
  });
  fileInput.click();
  });

  document.getElementById('sendImageBtn').addEventListener('click', function () {
    hideImage(2)
  });

  






socket.on('image', (imageData) => {
    const imgElement = document.createElement('img');
    imgElement.src = imageData;
    receivedImagesDiv.appendChild(imgElement);
});