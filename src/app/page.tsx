import Image from "next/image";
import styles from "./page.module.css";
import PhotoBooth from "@/components/Photobooth";

export default function Home() {
  return (
    <main className={styles.main}>
    <PhotoBooth/>
    </main>
  );
}
