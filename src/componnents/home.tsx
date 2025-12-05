import Hero from './page/Hero';
import About from './page/About';
import Notices from './page/Notices'; // Importa o novo componente Notices
import Partners from './page/Partners';

function Home() {
  return (
    <>
      <main>
        <Hero />
        <Notices /> {/* Adiciona o componente Notices aqui, acima do About */}
        <Partners />
        <About />
      </main>
    </>
  );
}

export default Home;
