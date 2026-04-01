const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'frontend', 'src', 'index.css');
let css = fs.readFileSync(cssPath, 'utf8');

// 1. Replace Aurora root variables with Alpine Light variables
css = css.replace(
  /--admin-bg: #0f172a;.*?--admin-shadow-soft: 0 15px 35px -5px rgba\(0, 0, 0, 0\.4\);/s,
  `--admin-bg: #f8fafc;
  --admin-bg-soft: #f1f5f9;
  --admin-surface: #ffffff;
  --admin-surface-solid: #ffffff;
  --admin-border: #e2e8f0;
  --admin-text: #0f172a;
  --admin-text-soft: #64748b;
  --admin-highlight: #0ea5e9;
  --admin-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.08);
  --admin-shadow-soft: 0 10px 25px -5px rgba(15, 23, 42, 0.05);`
);

// 2. We'll extract and string-replace the entire admin CSS section
const startIndex = css.indexOf('/* Admin styles preserved */');
const endIndex = css.indexOf('@media (max-width: 1024px)', startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  const alpineCSS = `/* Admin styles preserved */

.admin-navbar {
  background: transparent;
  border-bottom: none;
}
.admin-navbar .navbar-logo, .admin-navbar .navbar-links a:not(.btn) { color: var(--admin-text); }
.admin-navbar .navbar-links a:not(.btn)::after { background: var(--admin-highlight); }
.admin-navbar .navbar-hamburger { border-color: var(--admin-border); background: #ffffff; box-shadow: var(--admin-shadow-soft); }
.admin-navbar .navbar-hamburger span { background: var(--admin-text); }
.admin-navbar .navbar-logo-text span { color: var(--admin-highlight); }
.admin-navbar-logo-badge { background: linear-gradient(135deg, #0ea5e9, #3b82f6); box-shadow: 0 10px 20px rgba(14,165,233,0.2); }

.login-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: calc(var(--nav-height) + 40px) 24px 40px;
  background: radial-gradient(circle at 15% 18%, rgba(14, 165, 233, 0.08), transparent 28%),
              radial-gradient(circle at 85% 12%, rgba(16, 185, 129, 0.08), transparent 32%),
              var(--admin-bg);
}

.login-card {
  position: relative;
  z-index: 1;
  width: min(100%, 460px);
  padding: clamp(28px, 4vw, 40px);
  border: 1px solid var(--admin-border);
  border-radius: 28px;
  background: var(--admin-surface);
  color: var(--admin-text);
  box-shadow: var(--admin-shadow);
  animation: fadeUp 0.6s ease;
}

.login-card-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 68px;
  height: 68px;
  margin: 0 auto 18px;
  border-radius: 22px;
  background: linear-gradient(135deg, #0ea5e9, #3b82f6);
  color: #ffffff;
  font-family: "Poppins", sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  box-shadow: 0 12px 24px rgba(14, 165, 233, 0.25);
}

.login-card h2 { margin-bottom: 8px; text-align: center; font-size: 1.85rem; color: var(--admin-text); }
.login-card .login-subtitle { margin-bottom: 32px; text-align: center; color: var(--admin-text-soft); font-size: 0.95rem; }

.login-card .form-group label { display: block; margin-bottom: 8px; font-size: 0.9rem; font-weight: 600; color: var(--admin-text); }
.login-card .form-group input, .login-card .form-group select, .login-card .form-group textarea {
  width: 100%; min-height: 48px; padding: 12px 14px;
  border: 1px solid var(--admin-border); border-radius: 14px;
  background: var(--admin-bg-soft); color: var(--admin-text); transition: all 0.2s;
}
.login-card .form-group input:focus {
  background: #ffffff; border-color: var(--admin-highlight); box-shadow: 0 0 0 4px rgba(14,165,233,0.15); outline: none;
}
.login-card .form-group input::placeholder { color: #94a3b8; }

.login-submit { min-height: 50px; font-size: 0.95rem; }
.login-backlink { margin-top: 20px; color: var(--admin-text-soft); text-align: center; font-size: 0.84rem; }
.login-backlink-anchor { color: var(--admin-highlight); font-weight: 600; }
.login-error { padding: 12px 14px; margin-bottom: 20px; border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 14px; background: #fef2f2; color: #b91c1c; text-align: center; font-size: 0.9rem; font-weight: 600; }

.admin-layout {
  position: relative; display: flex; min-height: calc(100vh - var(--nav-height));
  margin-top: calc(var(--nav-height) - 6px); padding: 18px 24px 36px;
  background: var(--admin-bg);
}

.admin-sidebar {
  position: fixed; top: calc(var(--nav-height) + 18px); left: 24px;
  width: var(--admin-sidebar-width); height: calc(100vh - var(--nav-height) - 42px);
  display: flex; flex-direction: column;
  border: 1px solid var(--admin-border); border-radius: 30px;
  background: var(--admin-surface); box-shadow: var(--admin-shadow-soft);
}

.sidebar-brand { display: flex; align-items: center; gap: 14px; padding: 24px; border-bottom: 1px solid var(--admin-border); }
.sidebar-brand-mark {
  display: inline-flex; align-items: center; justify-content: center; width: 54px; height: 54px; border-radius: 18px;
  background: linear-gradient(135deg, #0ea5e9, #3b82f6); color: #ffffff;
  font-family: "Poppins", sans-serif; font-size: 1rem; font-weight: 700;
}
.sidebar-brand-copy { display: flex; flex-direction: column; gap: 4px; }
.sidebar-brand-name { color: var(--admin-text); font-family: "Poppins", sans-serif; font-size: 1.3rem; font-weight: 700; line-height: 1.1; }
.sidebar-brand-subtitle { color: var(--admin-text-soft); font-size: 0.78rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; }

.sidebar-nav { display: flex; flex-direction: column; gap: 10px; padding: 20px; }
.nav-item {
  display: flex; align-items: center; gap: 12px; padding: 14px 16px;
  border: 1px solid transparent; border-radius: 18px; background: transparent;
  color: #475569; font-size: 0.95rem; font-weight: 600; text-align: left; transition: all 0.2s;
}
.nav-item-badge {
  display: inline-flex; align-items: center; justify-content: center; min-width: 40px; height: 40px;
  border-radius: 14px; background: #f1f5f9; color: var(--admin-text); font-size: 0.75rem; font-weight: 700;
}
.nav-item-label { flex: 1; }
.nav-item:hover { background: #f8fafc; border-color: #e2e8f0; color: var(--admin-text); transform: translateX(2px); }
.nav-item.active { background: #f0f9ff; border-color: #bae6fd; color: #0284c7; box-shadow: 0 4px 12px rgba(14, 165, 233, 0.08); }
.nav-item.active .nav-item-badge { background: linear-gradient(135deg, #0ea5e9, #3b82f6); color: #ffffff; }

.sidebar-summary {
  margin-top: auto; margin: auto 20px 20px; padding: 20px;
  border: 1px solid var(--admin-border); border-radius: 24px;
  background: #f8fafc; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
}
.sidebar-summary-label { display: inline-block; margin-bottom: 10px; color: var(--admin-text-soft); font-size: 0.78rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; }
.sidebar-summary strong { display: block; margin-bottom: 8px; color: var(--admin-text); font-size: 1.4rem; font-family: "Poppins", sans-serif; }
.sidebar-summary p { color: var(--admin-text-soft); font-size: 0.9rem; line-height: 1.6; }

.admin-main { display: flex; flex: 1; flex-direction: column; min-width: 0; margin-left: calc(var(--admin-sidebar-width) + 24px); padding: 10px 0 0 24px; }
.admin-topbar {
  position: sticky; top: calc(var(--nav-height) + 18px); z-index: 10;
  display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; padding: 22px 24px;
  border: 1px solid var(--admin-border); border-radius: 28px;
  background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  box-shadow: var(--admin-shadow-soft);
}
.admin-topbar-copy { display: flex; flex-direction: column; gap: 6px; }
.admin-topbar-kicker { color: var(--admin-text-soft); font-size: 0.76rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; }
.admin-topbar h2 { font-size: 1.4rem; color: var(--admin-text); }
.admin-topbar p { max-width: 720px; color: var(--admin-text-soft); }

.admin-content { width: 100%; margin: 0; padding: 24px 0 0; }
.dashboard-welcome {
  position: relative; overflow: hidden; margin-bottom: 40px; padding: clamp(28px, 4vw, 36px);
  border: 1px solid #e0f2fe; border-radius: 32px;
  background: linear-gradient(135deg, #ffffff, #f0f9ff); box-shadow: var(--admin-shadow-soft);
}
.dashboard-kicker {
  display: inline-flex; align-items: center; min-height: 34px; padding: 0 14px; margin-bottom: 16px;
  border-radius: var(--radius-full); background: #e0f2fe; color: #0284c7; font-size: 0.8rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
}
.dashboard-welcome h2 { margin-bottom: 8px; font-size: clamp(1.8rem, 3vw, 2.3rem); color: var(--admin-text); }
.dashboard-welcome p { max-width: 620px; color: var(--admin-text-soft) !important; }
.dashboard-action-row { position: relative; z-index: 1; display: flex; flex-wrap: wrap; gap: 12px; margin-top: 22px; }

.admin-metric-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-top: 24px; }
.admin-metric-card, .dashboard-section {
  border: 1px solid var(--admin-border); border-radius: 24px; background: var(--admin-surface); box-shadow: var(--admin-shadow-soft);
}
.admin-metric-card { padding: 24px; cursor: pointer; transition: all 0.24s ease; }
.admin-metric-card:hover { transform: translateY(-4px); border-color: #bae6fd; box-shadow: var(--admin-shadow); }
.admin-metric-card-header { display: flex; flex-direction: column; gap: 4px; margin-bottom: 18px; }
.admin-metric-card h3 { margin-bottom: 0; color: var(--admin-text); font-size: 0.98rem; font-weight: 600; }
.admin-metric-card-header span { color: var(--admin-text-soft); font-size: 0.85rem; }
.admin-metric-card h1 { font-size: clamp(2rem, 5vw, 2.8rem); color: var(--admin-highlight); }

.dashboard-section { padding: 32px; margin-bottom: 32px; }
.dashboard-section h2 { margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--admin-border); font-size: 1.25rem; color: var(--admin-text); }
.form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; }
.form-grid .form-group.full-width { grid-column: 1 / -1; }
.admin-layout .form-group label { color: var(--admin-text); font-size: 0.9rem; font-weight: 600; margin-bottom: 8px; display: block; }
.admin-layout .form-group input, .admin-layout .form-group select, .admin-layout .form-group textarea {
  width: 100%; min-height: 48px; padding: 12px 14px;
  border: 1px solid var(--admin-border); border-radius: 14px;
  background: var(--admin-bg-soft); color: var(--admin-text); transition: all 0.2s;
}
.admin-layout .form-group input::placeholder, .admin-layout .form-group textarea::placeholder { color: #94a3b8; }
.admin-layout .form-group input:focus, .admin-layout .form-group select:focus, .admin-layout .form-group textarea:focus {
  background: #ffffff; border-color: var(--admin-highlight); box-shadow: 0 0 0 4px rgba(14,165,233,0.15); outline: none;
}
.admin-layout .form-group textarea { min-height: 132px; resize: vertical; }

.table-responsive { width: 100%; overflow-x: auto; border: 1px solid var(--admin-border); border-radius: 20px; background: #ffffff; }
.admin-table { width: 100%; border-collapse: collapse; white-space: nowrap; }
.admin-table th { padding: 16px 18px; border-bottom: 1px solid var(--admin-border); background: var(--admin-bg-soft); color: var(--admin-text-soft); font-size: 0.82rem; font-weight: 700; text-transform: uppercase; text-align: left; }
.admin-table td { padding: 16px 18px; border-bottom: 1px solid var(--admin-border); color: var(--admin-text); font-size: 0.94rem; vertical-align: middle; }
.admin-table tr:hover td { background: var(--admin-bg); }
.admin-table tr:last-child td { border-bottom: none; }
.image-column { width: 80px; }
.table-img { width: 68px; height: 50px; object-fit: cover; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.06); }
.table-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.table-description { max-width: 400px; white-space: normal; color: var(--admin-text-soft); }
.table-details { white-space: normal; }
.table-meta { color: var(--admin-text-soft); font-size: 0.85rem; }
.table-empty { padding: 32px; color: var(--admin-text-soft); text-align: center; }

.toast { display: inline-flex; align-items: center; gap: 8px; padding: 12px 16px; margin-bottom: 20px; border-radius: 16px; font-size: 0.92rem; font-weight: 700; box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08); }
.toast-success { border: 1px solid #bbf7d0; background: #f0fdf4; color: #166534; }
.toast-error { border: 1px solid #fecaca; background: #fef2f2; color: #991b1b; }

.admin-layout .btn-primary, .login-page .btn-primary { background: linear-gradient(135deg, #0ea5e9, #2563eb); border: none; box-shadow: 0 8px 16px rgba(14, 165, 233, 0.25); color: #fff; }
.admin-layout .btn-primary:hover, .login-page .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 24px rgba(14, 165, 233, 0.35); }
.admin-layout .btn-outline { background: #ffffff; color: #334155; border-color: #cbd5e1; }
.admin-layout .btn-outline:hover { background: #f8fafc; border-color: #94a3b8; }

`;
  
  css = css.slice(0, startIndex) + alpineCSS + css.slice(endIndex);
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('Alpine Light CSS completely injected!');
} else {
  console.log('Could not find injection points.');
}
