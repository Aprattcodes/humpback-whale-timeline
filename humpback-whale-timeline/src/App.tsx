import Hero from './sections/Hero';
import Prologue from './sections/Prologue';
import Timeline from './sections/Timeline';
import Phases from './sections/Phases';
import DataChart from './sections/DataChart';
import Closing from './sections/Closing';

export default function App() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Hero />
      <main id="main-content">
        <Prologue />
        <Timeline />
        <Phases />
        <DataChart />
        <Closing />
      </main>
      <footer>
        <p>Humpback Whale Timeline</p>
      </footer>
    </>
  );
}
