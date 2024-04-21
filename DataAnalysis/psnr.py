import cv2
import numpy as np
import os

current_dir = os.getcwd()

def rgb_to_binary(image):
    binary_image = np.unpackbits(image, axis=2)
    return binary_image

def calculate_ber(image1, image2):
    flat_image1 = image1.flatten()
    flat_image2 = image2.flatten()
    hamming_distance = np.count_nonzero(flat_image1 != flat_image2)
    total_bits = len(flat_image1)
    ber = hamming_distance / total_bits
    return ber

stego_image = cv2.imread(r'C:\Users\Naman\OneDrive\10_4.png', cv2.IMREAD_COLOR)
cover_image = cv2.imread(r'C:\Users\Naman\OneDrive\CoverImage4.jpg', cv2.IMREAD_COLOR)

stego_image_resized = cv2.resize(stego_image, (cover_image.shape[1], cover_image.shape[0]))

stego_binary = rgb_to_binary(stego_image_resized)
cover_binary = rgb_to_binary(cover_image)

mse_r = np.mean((stego_image_resized[:,:,0] - cover_image[:,:,0]) ** 2)
mse_g = np.mean((stego_image_resized[:,:,1] - cover_image[:,:,1]) ** 2)
mse_b = np.mean((stego_image_resized[:,:,2] - cover_image[:,:,2]) ** 2)
mse_avg = (mse_r + mse_g + mse_b) / 3

max_pixel_value = 255
psnr = 10 * np.log10((max_pixel_value ** 2) / mse_avg)

average_ber = calculate_ber(stego_binary, cover_binary)

print(f"MSE between stego image and cover image: {mse_avg}")
print(f"PSNR between stego image and cover image: {psnr} dB")
print(f"Average BER between stego image and cover image: {average_ber}")


