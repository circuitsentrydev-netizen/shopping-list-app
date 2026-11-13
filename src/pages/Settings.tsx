
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../features/store/hook';
import { toggleAppTheme } from '../features/store/authSlice';
import Icon from '../components/Icon';

const SETTINGS_KEY = 'fabshoplist_settings';
type Preferences = { theme: 'light' | 'dark'; notifications: 'enabled' | 'disabled'; defaultQuantity: number };
const defaults: Preferences = { theme: 'light', notifications: 'enabled', defaultQuantity: 1 };

export default function Settings() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.auth.theme);
  const [preferences, setPreferences] = useState<Preferences>(() => {
    try { return { ...defaults, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}') }; } catch { return defaults; }
  });
  const [saved, setSaved] = useState(false);
  useEffect(() => { setPreferences((current) => ({ ...current, theme })); }, [theme]);
  const update = <K extends keyof Preferences>(key: K, value: Preferences[K]) => { setPreferences((current) => ({ ...current, [key]: value })); setSaved(false); };
  const save = () => { localStorage.setItem(SETTINGS_KEY, JSON.stringify(preferences)); dispatch(toggleAppTheme(preferences.theme)); setSaved(true); };
  const reset = () => { setPreferences(defaults); dispatch(toggleAppTheme('light')); localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaults)); setSaved(false); };
  return <main className="page-shell"><div className="page-container settings-page"><header className="page-heading"><span className="eyebrow">MAKE IT YOURS</span><h1>Settings</h1><p>Manage your FabShopList preferences.</p></header><section className="settings-card"><div className="settings-row"><span className="settings-icon"><Icon name="sparkles"/></span><div className="settings-copy"><strong>Appearance</strong><small>Choose how FabShopList looks on your device.</small></div><select aria-label="App theme" value={preferences.theme} onChange={(event) => update('theme', event.target.value as Preferences['theme'])}><option value="light">Light mode</option><option value="dark">Dark mode</option></select></div><div className="settings-row"><span className="settings-icon"><Icon name="check"/></span><div className="settings-copy"><strong>Notifications</strong><small>Control in-app notification preferences.</small></div><select aria-label="Notifications" value={preferences.notifications} onChange={(event) => update('notifications', event.target.value as Preferences['notifications'])}><option value="enabled">Enabled</option><option value="disabled">Disabled</option></select></div><div className="settings-row"><span className="settings-icon"><Icon name="list"/></span><div className="settings-copy"><strong>Default quantity</strong><small>Starting quantity when you add a new item.</small></div><input aria-label="Default quantity" type="number" min="1" max="99" value={preferences.defaultQuantity} onChange={(event) => update('defaultQuantity', Math.max(1, Math.min(99, Number(event.target.value))))}/></div><div className="settings-actions"><button className="secondary-action" type="button" onClick={reset}>Reset preferences</button><button className="primary-button" type="button" onClick={save}>Save settings</button></div>{saved&&<p className="save-message" role="status">Your preferences have been saved.</p>}</section></div></main>;
}
