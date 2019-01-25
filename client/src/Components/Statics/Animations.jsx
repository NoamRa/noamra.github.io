import React from 'react';
import ReactPlayer from 'react-player'
import './Animations.css'

const Animations = () => {
  return (
    <div>
      <div className='animation-entry'>
        <br/>
        <div>
          <h2>Flying Spagetty Monster</h2>
          <ReactPlayer 
            url={'https://vimeo.com/14523762'}
            playing={false}
            width={640}
            height={480}
          />
        </div>
        <div className='animation-text'>
          Dedicated to the coolest transcendental being - The Flying Spaghetti Monster<br/>
          <br/>
          Music by The Oufs:<br/>
          <ul>
            <li>Michael Girard (Music, guitar &amp; keyboard)</li>
            <li>Patrick Lebrun (Lyrics &amp; vocals)</li>
            <li>Xiao Jie (Intro vocals)</li>
          </ul>
        </div>
      </div>

      <div className='animation-entry'>
        <div>
          <h2>I Love xkcd</h2>
          <ReactPlayer 
            url={'https://vimeo.com/7151435'}
            playing={false}
            width={640}
            height={480}
          />
        </div>
        <div className='animation-text'>
          There are so many things to love in this world<br/>
          Based on the xkcd comic "xkcd Loves the Discovery Channel"<br/>
          <a href='http://xkcd.com/442' target='_blank' rel='noreferrer noopener'>http://xkcd.com/442</a><br/>
          <br/>
          Singing - Olga Nunes<br/>
          <a href='http://olganunes.com' target='_blank' rel='noreferrer noopener'>http://olganunes.com</a><br/>
          <a href='http://olganunes.bandcamp.com' target='_blank' rel='noreferrer noopener'>http://olganunes.bandcamp.com</a><br/>
          <br/>
          Art &amp; Concept - Randall Munroe<br/>
          <a href='http://xkcd.com' target='_blank' rel='noreferrer noopener'>http://xkcd.com</a><br/>
        </div>
      </div>
    </div>
  )

};

export default Animations;