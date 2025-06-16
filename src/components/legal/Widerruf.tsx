import React from "react";

/**
 * Widerrufsbelehrung (Cancellation Policy) template for German e-commerce compliance
 * Replace placeholders with your actual details.
 */
const Widerruf: React.FC = () => (
  <div style={{maxWidth: 800, margin: "auto", padding: 32}}>
    <h1>Widerrufsbelehrung</h1>
    <p>Verbraucher haben ein vierzehntägiges Widerrufsrecht.</p>
    <h2>Widerrufsrecht</h2>
    <p>Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.</p>
    <h2>Widerrufsfrist</h2>
    <p>Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.</p>
    <h2>Folgen des Widerrufs</h2>
    <p>Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen zurückzuzahlen.</p>
    <p><i>Bitte passen Sie die Widerrufsbelehrung an Ihr Angebot an.</i></p>
  </div>
);

export default Widerruf;
