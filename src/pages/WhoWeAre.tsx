
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const WhoWeAre: React.FC = () => {
  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen">
        <section className="py-20 px-4">
          <div className="container-custom">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">Who We Are</h1>
            <p className="text-center text-xl text-brand-gray max-w-3xl mx-auto">
              This page will contain information about the company, its mission, vision, and team.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default WhoWeAre;
