import React from "react";
import './styles/Hero.css';
import Video from "./assets/Hero-vid.mp4";

function Hero() {
  return (
    <div className="jumbotron">
        <video className="video-background" src={Video} autoPlay loop muted> </video>
        <h1 className="display-4">Hello, world!</h1>
        <p className="lead">This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
        <p className="lead">
            <a className="btn btn-primary btn-lg" href="#" role="button">Learn more</a>
        </p>
    </div>
  )
}

export default Hero;