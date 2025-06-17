import React from "react";
import { Link } from "react-router-dom";

// Use the blue accent color from navbar hover
const accentColor = process.env.REACT_APP_ACCENT_COLOR || "#38bdf8"; // #00bfae (previous teal)

const Footer: React.FC = () => (
  <footer
    style={{
      background: "rgba(17, 17, 17, 0.98)",
      color: "#fff",
      padding: "24px 0 16px 0",
      textAlign: "center",
      fontSize: 14,
      marginTop: 40,
      width: "100%",
      borderTop: "1px solid rgba(255,255,255,0.13)",
      boxShadow: "0 -2px 16px 0 rgba(0,0,0,0.14)",
      zIndex: 100
    }}
  >
    <div style={{ marginBottom: 10 }}>
      <Link to="/impressum" style={{ color: accentColor, margin: "0 16px" }}>Impressum</Link>
      <Link to="/datenschutz" style={{ color: accentColor, margin: "0 16px" }}>Datenschutzerklärung</Link>
      <Link to="/agb" style={{ color: accentColor, margin: "0 16px" }}>AGB</Link>
      <Link to="/widerruf" style={{ color: accentColor, margin: "0 16px" }}>Widerruf</Link>
      <Link to="/cookie-einstellungen" style={{ color: accentColor, margin: "0 16px" }}>Cookie-Einstellungen</Link>
    </div>
    <div style={{ opacity: 0.6 }}>
      &copy; {new Date().getFullYear()} DeepSlide. Alle Rechte vorbehalten.
    </div>
  </footer>
);

export default Footer;
