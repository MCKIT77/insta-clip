import { Link } from "react-router-dom";
import { useQuery } from '@apollo/client';
import ReactPlayer from 'react-player';
import { QUERY_USER } from '../../utils/queries';
import '../../styles/Home.css';

function Videos() {
    const { data } = useQuery(QUERY_USER);
    let user;
  
    if (data) {
      user = data.user;
    }
  
    return (      
        <div>  
          {user ? (
            <div>
              <h2>
                Your Videos
              </h2>
              <div className="video-list">
                {user.videos.map((video) => (
                  <div key={video._id}>
                    <Link to={`/video/${video._id}`}>
                      <ReactPlayer url={video.path} controls={false} className='video-link'/>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
    );
  }
  
  export default Videos;
  
