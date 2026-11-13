
function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="footer-brand-name">FabShopList</span>
          <p>Your shopping, organised.</p>
        </div>

        <p className="footer-copyright">
          © {new Date().getFullYear()} FabShopList. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
