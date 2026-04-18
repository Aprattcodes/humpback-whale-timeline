import styles from './Closing.module.css';

export default function Closing() {
  return (
    <section className={styles.section} aria-labelledby="closing-heading">
      <div className={styles.container}>
        <h2 id="closing-heading">What Remains</h2>
        <p className={styles.lead}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
          ex ea commodo consequat.
        </p>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
          proident, sunt in culpa qui officia deserunt mollit anim id est
          laborum.
        </p>
      </div>
      <footer className={styles.credits} aria-label="Credits and sources">
        <h3>Credits</h3>
        <ul>
          <li>Photography: NOAA Photo Library, Chinh Le Duc, Gabriel Dizzi</li>
          <li>Audio: Humpback whale recordings via NOAA / Ocean Acoustics</li>
          <li>Data: IWC population estimates, NOAA Fisheries</li>
        </ul>
      </footer>
    </section>
  );
}
