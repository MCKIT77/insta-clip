document.getElementById('uploadForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('video', document.getElementById('video').files[0]);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        console.log('Video uploaded successfully:', data);
    } catch (error) {
        console.error('Error uploading video:', error);
    }
});