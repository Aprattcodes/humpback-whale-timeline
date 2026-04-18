import styles from './Hero.module.css';

export default function Hero() {
  return (
    <header className={styles.section} aria-labelledby="hero-heading">
      <div className={styles.overlay} />
      <div className={styles.container}>
        <span className={styles.kicker}>1940 — 2025</span>
        <h1 id="hero-heading">Eighty-Five Years in the Deep</h1>
        <p className={styles.lead}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <a href="#prologue" className={styles.scrollLink} aria-label="Scroll to prologue">
          <svg className={styles.scrollIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </a>
      </div>
    </header>
  );
}
