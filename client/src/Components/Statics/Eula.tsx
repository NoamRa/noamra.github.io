import React from 'react';

const Eula: Reach.FC = () => {
  return (
    <React.Fragment>
      <h2>EULA</h2>
      <p>
        <a 
          href="https://xkcd.com/1998/" 
          target="_blank"
          rel='noreferrer noopener'
        >
          <img src="https://imgs.xkcd.com/comics/gdpr.png" alt="eula"/>
        </a>
      </p>
      <p>
        Source:&nbsp;
        <a 
          href="https://xkcd.com/1998/" 
          target="_blank"
          rel='noreferrer noopener'
        >
          https://xkcd.com/1998/
        </a>
      </p>
    </React.Fragment>
  )

};

export default Eula;