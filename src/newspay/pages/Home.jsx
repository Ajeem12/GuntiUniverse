import React, { useState, useEffect } from 'react';
import Category from '../components/Category';
import Loader from '../components/Loader';

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? <Loader /> : <Category />}
    </>
  );
};

export default Home;
