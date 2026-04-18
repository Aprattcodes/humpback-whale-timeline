import styles from './Timeline.module.css';

export default function Timeline() {
  return (
    <section className={styles.section} aria-labelledby="timeline-heading">
      <h2 id="timeline-heading" className={styles.srOnly}>Timeline</h2>

      <div className={styles.canvas} role="img" aria-label="Interactive timeline visualization">
        <p className={styles.placeholder}>Canvas visualization</p>
      </div>

      <div className={styles.controls}>
        <div className={styles.labels}>
          <span className={styles.year}>1940</span>
          <span className={styles.phase}>The Silencing</span>
        </div>
        <div className={styles.scrubber} role="slider" aria-label="Timeline year" aria-valuemin={1940} aria-valuemax={2025} aria-valuenow={1940} tabIndex={0}>
          <div className={styles.track}>
            <div className={styles.fill} />
            <div className={styles.thumb} />
          </div>
        </div>
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
