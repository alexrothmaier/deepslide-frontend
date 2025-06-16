import React from "react";

/**
 * Impressum (Legal Disclosure) as required by German law (TMG §5)
 * Please replace the placeholders with your real company/personal details.
 */
const Impressum: React.FC = () => (
  <div style={{maxWidth: 800, margin: "auto", padding: 32}}>
    <h1>Impressum</h1>
    <p><strong>Angaben gemäß § 5 TMG:</strong></p>
    <p>
      Max Mustermann<br />
      Musterstraße 1<br />
      12345 Musterstadt<br />
      Deutschland
    </p>
    <p><strong>Kontakt:</strong><br />
      Telefon: 01234-567890<br />
      E-Mail: info@example.com
    </p>
    <p><strong>Umsatzsteuer-ID:</strong><br />
      Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz: DE123456789
    </p>
    <p><strong>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</strong><br />
      Max Mustermann, Adresse wie oben
    </p>
    <p><i>Bitte ersetzen Sie alle Platzhalter mit Ihren echten Daten.</i></p>
  </div>
);

export default Impressum;
