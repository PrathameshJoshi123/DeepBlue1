import React from 'react';
import '../CSS/AboutUs.css'

const AboutUs = () => {
  return (
    <main className="about-us-container">
      <section className="about-us">
        <div className="intro">
          <h2>Our Mission</h2>
          <p>
            We aim to reduce food waste by connecting communities with surplus food to those in need. Through this initiative, we create a sustainable future and reduce hunger.
          </p>
        </div>
        <div className="what-we-do">
          <h2>What We Do</h2>
          <p>
            Urban Food Waste Management connects donors, recipients, and delivery partners. By collaborating with individuals, NGOs, and delivery services, we facilitate the redistribution of surplus food to those in need.
          </p>
          <ul>
            <li><strong>Donors:</strong> Individuals and organizations that have surplus food and want to contribute to reducing food waste.</li>
            <li><strong>Recipients:</strong> People in need of food, such as community members or NGOs supporting vulnerable groups.</li>
            <li><strong>Delivery Partners:</strong> Those who help transport food from donors to recipients, ensuring the food reaches those who need it most.</li>
          </ul>
        </div>
        <div className="impact">
          <h2>Our Impact</h2>
          <p>
            Since our inception, we've redistributed thousands of meals and contributed to minimizing food waste in urban areas. By partnering with local organizations, we continue to expand our reach and impact.
          </p>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;
