import styles from './Phases.module.css';

export default function Phases() {
  return (
    <section className={styles.section} aria-labelledby="phases-heading">
      <div className={styles.header}>
        <h2 id="phases-heading">Three Eras, One Ocean</h2>
      </div>

      <article className={styles.phase} aria-labelledby="silencing-heading">
        <div className={styles.text}>
          <h3 id="silencing-heading">The Silencing</h3>
          <p className={styles.period}>1940 – 1966</p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris.
          </p>
          <aside className={styles.callout} aria-label="Key statistic">
            <span className={styles.calloutValue}>~5,000</span>
            <span className={styles.calloutLabel}>North Atlantic population low</span>
          </aside>
        </div>
        <figure className={styles.figure}>
          <img src="/img/silencing-factory-ship-harvest.jpg" alt="Factory whaling ship" />
          <figcaption>A factory ship at work in the Southern Ocean, c. 1958</figcaption>
        </figure>
      </article>

      <article className={styles.phase} aria-labelledby="return-heading">
        <div className={styles.text}>
          <h3 id="return-heading">The Return</h3>
          <p className={styles.period}>1966 – 2000</p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris.
          </p>
          <aside className={styles.callout} aria-label="Key statistic">
            <span className={styles.calloutValue}>80,000+</span>
            <span className={styles.calloutLabel}>Global population by 2000</span>
          </aside>
        </div>
        <figure className={styles.figure}>
          <img src="/img/return-breach-hawaii.jpg" alt="Humpback whale breaching off Hawaii" />
          <figcaption>A breaching humpback off the coast of Hawaii</figcaption>
        </figure>
      </article>

      <article className={styles.phase} aria-labelledby="new-ocean-heading">
        <div className={styles.text}>
          <h3 id="new-ocean-heading">The New Ocean</h3>
          <p className={styles.period}>2000 – 2025</p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris.
          </p>
          <aside className={styles.callout} aria-label="Key statistic">
            <span className={styles.calloutValue}>150,000</span>
            <span className={styles.calloutLabel}>Estimated global population today</span>
          </aside>
        </div>
        <figure className={styles.figure}>
          <img src="/img/new-ocean-mother-calf.png" alt="Humpback mother and calf swimming together" />
          <figcaption>A humpback mother and calf in Hawaiian waters</figcaption>
        </figure>
      </article>
    </section>
  );
}
