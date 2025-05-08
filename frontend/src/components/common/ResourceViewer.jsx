import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const ResourceViewer = ({ url, type, onClose }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (type === 'VIDEO' && videoRef.current) {
      videoRef.current.load();
    }
  }, [url, type]);

  return (
    <div className="h-full w-full bg-black flex items-center justify-center">
      {type === 'PDF' ? (
        <iframe 
          src={url}
          title="PDF Viewer"
          className="w-full h-full"
          style={{ border: 'none' }}
        />
      ) : (
        <div className="w-full max-w-4xl">
          <video 
            ref={videoRef}
            controls
            autoPlay
            className="w-full"
          >
            <source src={url} type={getVideoType(url)} />
            Your browser does not support video playback.
          </video>
        </div>
      )}
    </div>
  );
};

const getVideoType = (url) => {
  const ext = url.split('.').pop().toLowerCase();
  switch(ext) {
    case 'mp4': return 'video/mp4';
    case 'webm': return 'video/webm';
    case 'ogg': return 'video/ogg';
    default: return 'video/mp4';
  }
};

ResourceViewer.propTypes = {
  url: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['PDF', 'VIDEO']).isRequired,
  onClose: PropTypes.func.isRequired
};

export default ResourceViewer;