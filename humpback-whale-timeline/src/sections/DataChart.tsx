import styles from './DataChart.module.css';

export default function DataChart() {
  return (
    <section className={styles.section} aria-labelledby="datachart-heading">
      <div className={styles.header}>
        <h2 id="datachart-heading">By the Numbers</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
      <div className={styles.chart} role="img" aria-label="Population and threat data chart">
        <p className={styles.placeholder}>Chart visualization</p>
      </div>
    </section>
  );
}
