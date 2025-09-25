import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="about-container">
      <section className="about-hero">
        <div className="hero-text">
          <h1>About Campus Connect</h1>
          <p>
            DYP Connect is a collaborative academic platform connecting students across years,
            courses, and clubs.
          </p>
        </div>
        <div className="hero-image">
          <img src="/images/college5.png" alt="About DYP Connect" />
        </div>
      </section>

      <section className="about-features">
        <h2>Why Use Campus Connect?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <img src="/images/chat.png" alt="Chat" />
            <h3>Real-Time Chat</h3>
            <p>Engage in meaningful course-wise conversations with peers and mentors.</p>
          </div>
          <div className="feature-card">
            <img src="/images/notes.jpeg" alt="Notes" />
            <h3>Notes Sharing</h3>
            <p>Upload and download study materials anytime to support learning.</p>
          </div>
          <div className="feature-card">
            <img src="/images/group.png" alt="Groups" />
            <h3>Course Groups</h3>
            <p>Organized groups for academics, placements, clubs, and guidance.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
