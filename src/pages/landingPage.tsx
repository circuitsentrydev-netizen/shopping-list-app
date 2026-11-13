
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../features/store/hook';
import Icon from '../components/Icon';
import Footer from '../components/Footer';

export default function LandingPage() {
  const navigate = useNavigate();
  const authenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (authenticated) return <Navigate to="/home" replace/>;

  return (
    <div className="landing-page">
      <header className="landing-header">
        <a className="brand" href="/">
          <span className="brand-mark"><Icon name="basket"/></span>
          FabShop<span className="brand-light">List</span>
        </a>
        <button className="landing-login" onClick={() => navigate('/login')}>Log in</button>
      </header>

      <main className="landing-hero">
        <div className="hero-copy">
          <span className="hero-kicker"><Icon name="sparkles" size={15}/> A simpler way to shop</span>
          <h1>Every list in order.<br/><span>Every shop, smarter.</span></h1>
          <p>Plan your shopping, keep track of what you need, and tick items off as you go. FabShopList makes everyday shopping feel more organised.</p>
          <div className="hero-actions">
            <button className="hero-primary" onClick={() => navigate('/register')}>Get started <Icon name="chevron-right" size={18}/></button>
            <button className="hero-secondary" onClick={() => navigate('/login')}>I already have an account</button>
          </div>
          <div className="hero-benefits">
            <span><Icon name="check" size={16}/> Organised lists</span>
            <span><Icon name="check" size={16}/> Easy tracking</span>
            <span><Icon name="check" size={16}/> Shareable</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-glow"/>
          <div className="preview-card">
            <div className="preview-top">
              <div><small>YOUR SHOPPING LIST</small><h3>Weekend groceries</h3></div>
              <span className="preview-icon"><Icon name="basket" size={22}/></span>
            </div>
            <div className="preview-progress"><span/><span/><span/><span/></div>
            <p className="preview-count">3 of 5 items completed</p>
            {[
              ['Avocados', 'Produce', true],
              ['Wholegrain bread', 'Bakery', true],
              ['Fresh milk', 'Dairy', true],
              ['Free-range eggs', 'Dairy', false],
              ['Olive oil', 'Pantry', false]
            ].map(([name, category, done]) => (
              <div className={`preview-item ${done ? 'is-done' : ''}`} key={String(name)}>
                <span className="preview-check">{done && <Icon name="check" size={13}/>}</span>
                <span><b>{name}</b><small>{category}</small></span>
              </div>
            ))}
            <div className="preview-foot"><Icon name="sparkles" size={15}/> A little more organised, every day.</div>
          </div>
          <div className="floating-note">
            <span className="floating-check"><Icon name="check"/></span>
            <span><b>Nice work!</b><small>You're making progress</small></span>
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  );
}
