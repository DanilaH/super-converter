import { englishContent } from "@/content/en";
import styles from "./page.module.css";

const { home } = englishContent;

export default function Home() {
  return (
    <div className={styles.intro}>
      <h1 className={styles.heading}>{home.heading}</h1>
      <p className={styles.description}>{home.description}</p>
      <p className={styles.privacy}>{home.privacy}</p>

      <section className={styles.toolPlaceholder}>
        <h2 className={styles.toolPlaceholderHeading}>
          {home.toolPlaceholder.heading}
        </h2>
        <p className={styles.toolPlaceholderDescription}>
          {home.toolPlaceholder.description}
        </p>
      </section>
    </div>
  );
}
