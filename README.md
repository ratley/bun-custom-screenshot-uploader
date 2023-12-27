# Custom Image Uploader for ShareX

This server, built with Bun.js, is designed as a Custom Image Uploader for ShareX. It enables secure and organized image uploads, creating user-specific directories for storage, and facilitates direct URL access to the uploaded images.

## Features

- **Secure Image Upload**: Uses ShareX for image uploading, secured with an API key.
- **Dynamic Filename Generation**: Automatically generates unique filenames for each image.
- **Organized Storage**: Images are stored in directories named after the user.
- **Direct Image Access**: Enables direct access to images through URLs.

## Setup

### Prerequisites

- [Bun](https://bun.sh/) installed on your server.
- Node.js environment for utility functions.

### Configuration

1. **Environment Variables**:

   - `API_KEY`: API key for authenticating ShareX requests.
   - `SS_FOLDER`: Absolute path to the directory where screenshots will be stored.

2. **Starting the Server**:
   - Run the server using Bun:
     ```bash
     bun start
     ```

### Using the Server with ShareX

Configure ShareX to use this server as a custom uploader. Set the following in your ShareX settings:

- **Request URL**: `http://yourserver.com/sharex`
- **Method**: POST
- **Body**: Multipart/form-data
- **File form name**: "image"
- **Headers**:
  - Key: `x-api-key`
  - Value: [Your `API_KEY` value]

## API Endpoints

- `POST /sharex`: Endpoint for ShareX to upload images. Requires `x-api-key` in the header and `user` in the form data.
- `GET /filename.png`: Directly access an uploaded image. The server will search through the user directories to find the file.

## Utility Function

- `generateRandomFilename`: Generates a random filename with a specified format. The length of the filename is randomly set to 4 or 5 characters.

## Example Usage

### Uploading an Image

Send a POST request to `/sharex` with the image file and user identifier. The server will save the image in a user-specific folder and return the filename.

### Accessing an Image

Access an uploaded image by navigating to `http://yourserver.com/filename.png`. The server will return the image if it exists.

---

### Notes

- Ensure that the `SS_FOLDER` directory exists and is writable.
