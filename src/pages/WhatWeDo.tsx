
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const WhatWeDo: React.FC = () => {
  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen">
        <section className="py-20 px-4">
          <div className="container-custom">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">What We Do</h1>
            <p className="text-center text-xl text-brand-gray max-w-3xl mx-auto">
              This page will showcase the company's expertise and approach to solar energy solutions.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default WhatWeDo;
