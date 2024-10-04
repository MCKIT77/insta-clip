import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { useMutation } from '@apollo/client';
import { Form, Button, FormGroup, Label, Input, FormText } from 'reactstrap';
import { UPLOAD_VIDEO } from '../../utils/mutations'
function Upload() {
  const [videoURL, setVideoURL] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadVideo] = useMutation(UPLOAD_VIDEO);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const videoObjectURL = URL.createObjectURL(file);
    setVideoURL(videoObjectURL);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);

    const formData = new FormData();
    formData.append('file', e.target.file.files[0]);

    try {
      // Send the formData to the server
      const response = await fetch(`https://instaclip-5c26d78800f1.herokuapp.com/upload`, {
        method: 'POST',
        body: formData,
      })

      .then((response) => response.json())
      .then((data) => {
        // Handle the server response, which may include the file path
        console.log('Server response:', data);
  
        // Call the GraphQL mutation with the received file path
        uploadVideo({ variables: { path: data.publicUrl } })
          .then((response) => {
            console.log('Video uploaded');
            // Handle the GraphQL response as needed
            window.location.reload();
          })
          .catch((error) => {
            console.error('Error uploading video:', error);
            // Handle GraphQL errors
          });
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
        // Handle file upload errors
      });
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      {uploading && <h2>Uploading video...</h2>}
      {!uploading && (
      <Form onSubmit={handleUpload}>
        <FormGroup>
          <Label for="exampleFile">Upload Video</Label>
          <Input
            type="file"
            name="file"
            id="exampleFile"
            accept="video/*"
            onChange={handleFileChange}
          />
          <FormText>Upload a video file (MP4, WebM, etc.).</FormText>
        </FormGroup>
        <Button color="primary" type="submit">
          Submit
        </Button>
      </Form>
      )}
      {!uploading && videoURL && <ReactPlayer url={videoURL} controls />}
    </div>
  );
}

export default Upload;