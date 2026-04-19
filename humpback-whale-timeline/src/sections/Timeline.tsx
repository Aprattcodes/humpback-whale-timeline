import Scrubber from '../components/Scrubber';
import styles from './Timeline.module.css';

export default function Timeline() {
  return (
    <section className={styles.section} aria-labelledby="timeline-heading">
      <h2 id="timeline-heading" className={styles.srOnly}>Timeline</h2>

      <div className={styles.canvas} role="img" aria-label="Interactive timeline visualization">
        <p className={styles.placeholder}>Canvas visualization</p>
      </div>

      <div className={styles.controls}>
        <Scrubber />
      </div>

      <div className={styles.narration}>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
    </section>
  );
}
