import cv2
import matplotlib.pyplot as plt

# Load the cover image and steganographic image
cover_image = cv2.imread(r'C:\Users\Naman\OneDrive\Desktop\cryptography - Copy\DataAnalysis\CoverImage1.jpg')
stego_image = cv2.imread(r'C:\Users\Naman\OneDrive\Desktop\cryptography - Copy\DataAnalysis\8_1.png')

# Split channels for cover and stego images
cover_b, cover_g, cover_r = cv2.split(cover_image)
stego_b, stego_g, stego_r = cv2.split(stego_image)

# Calculate histograms for each channel
hist_cover_b = cv2.calcHist([cover_b], [0], None, [256], [0, 256])
hist_cover_g = cv2.calcHist([cover_g], [0], None, [256], [0, 256])
hist_cover_r = cv2.calcHist([cover_r], [0], None, [256], [0, 256])

hist_stego_b = cv2.calcHist([stego_b], [0], None, [256], [0, 256])
hist_stego_g = cv2.calcHist([stego_g], [0], None, [256], [0, 256])
hist_stego_r = cv2.calcHist([stego_r], [0], None, [256], [0, 256])

# Plot histograms
plt.figure(figsize=(15, 5))

plt.subplot(2, 3, 1)
plt.plot(hist_cover_b, color='blue')
plt.title('Histogram of Blue Channel (Cover)')
plt.xlabel('Pixel Value')
plt.ylabel('Number of Pixels')

plt.subplot(2, 3, 2)
plt.plot(hist_cover_g, color='green')
plt.title('Histogram of Green Channel (Cover)')
plt.xlabel('Pixel Value')
plt.ylabel('Number of Pixels')

plt.subplot(2, 3, 3)
plt.plot(hist_cover_r, color='red')
plt.title('Histogram of Red Channel (Cover)')
plt.xlabel('Pixel Value')
plt.ylabel('Number of Pixels')

plt.subplot(2, 3, 4)
plt.plot(hist_stego_b, color='blue')
plt.title('Histogram of Blue Channel (Stego)')
plt.xlabel('Pixel Value')
plt.ylabel('Number of Pixels')

plt.subplot(2, 3, 5)
plt.plot(hist_stego_g, color='green')
plt.title('Histogram of Green Channel (Stego)')
plt.xlabel('Pixel Value')
plt.ylabel('Number of Pixels')

plt.subplot(2, 3, 6)
plt.plot(hist_stego_r, color='red')
plt.title('Histogram of Red Channel (Stego)')
plt.xlabel('Pixel Value')
plt.ylabel('Number of Pixels')

plt.tight_layout()
plt.show()
