import { useEffect, useState } from "react";
import boatImg from "./images/bateau.png"; // ton image

export function ScrollBoat() {
  const [x, setX] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;

      // progress = 0  -> bateau à droite
      // progress = 1  -> bateau à gauche
      const boatWidth = 80; // ajuste en fonction de la taille de ton image
      const xPos = (1 - progress) * (window.innerWidth - boatWidth);

      setX(xPos);
    };

    handleScroll(); // position correcte dès le chargement
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <div className="scroll-boat" style={{ transform: `translateX(${x}px)` }}>
      <img src={boatImg} alt="Bateau" />
    </div>
  );
}
