import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HomePage.css';

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <div
        className="hero-section"
        style={{
          
          background: "url('/images/College1.avif') no-repeat center center/cover",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          position: "relative",
        }}
      >
        <div className="overlay"></div>

        <div className="content text-center">
          <h2 className="display-4 fw-bold">Welcome to Campus Connect</h2>
          <p className="lead">
            Campus Connect is a digital platform for students to connect, share,
            and explore academic opportunities within our campus community.
          </p>

          {/* <div className="buttons mt-4">
            <a href="./register" className="btn btn-dark btn-lg me-3">Register</a>
            <a href="./login" className="btn btn-success btn-lg">Login</a>
          </div> */}
        </div>
      </div>

      {/* About Section */}
      <section className="about-section mt-5 mb-5 py-5">
        <div className="container">
          <div className="row align-items-center">
            
            {/* Left: YouTube Video */}
            <div className="col-md-6 mb-4 mb-md-0">
              <div className="ratio ratio-16x9 video-wrapper">
                <iframe
                  width="450"
                  height="280"
                  src="https://www.youtube.com/embed/tyijrY4TV-U?si=uHjfY5xkBpKhHeQ6"
                  title="DYP College Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            {/* Right: Text Content */}
            <div className="col-md-6 text-center text-md-start">
              <h2>
                About <span className="text-success">Campus Connect</span>
              </h2>
              <p className="mt-3">
                Campus Connect is your digital gateway to campus life—showcasing
                achievements, promoting departmental updates, sharing events, and
                fostering collaboration among students and faculty of D.Y. Patil College.
              </p>
              <a href="#" className="btn btn-outline-dark mt-3">
                Learn More <span className="ms-1">➜</span>
              </a>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
