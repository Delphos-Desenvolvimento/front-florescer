import Hero from './page/Hero';
import About from './page/About';
import Features from './page/Features';
import Partners from './page/Partners';
import LatestNewsSection from './page/LatestNewsSection';

function Home() {
  return (
    <>
      <main>
        <Hero />
        <About />
        <Features />
        <Partners />
        <LatestNewsSection />
      </main>
    </>
  );
}

export default Home;
