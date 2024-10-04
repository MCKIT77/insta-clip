import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { useQuery } from '@apollo/client';
import { QUERY_VIDEO } from '../../utils/queries';
import '../../styles/SingleVideo.css';

const SingleVideo = () => {
  const { id } = useParams(); // Destructure 'id' from useParams

  console.log(id);

  const { loading, error, data } = useQuery(QUERY_VIDEO, {
    variables: { id: id },
  });

  const [isCopied, setIsCopied] = useState(false);

  const handleCopyLink = () => {
    const textArea = document.createElement('textarea');
    textArea.value = `https://instaclip-5c26d78800f1.herokuapp.com/video/${data.video._id}`;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    setIsCopied(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data || !data.video) {
    return <div>Video not found</div>;
  }

  const video = data.video;

  return (
    <div>
      <div className='video-container'>
        <ReactPlayer url={video.path} width="50%" height="50%" controls={true} id="single-video" />
        <button onClick={handleCopyLink} className='justify-center'>
          {isCopied ? 'Link Copied!' : 'Copy Link to Clipboard'}
        </button>
      </div>
    </div>
  );
};

export default SingleVideo;