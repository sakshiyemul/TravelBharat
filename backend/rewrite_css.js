const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'frontend', 'src', 'index.css');
let css = fs.readFileSync(cssPath, 'utf8');

// 1. Replace variables in :root
css = css.replace(
  /--admin-bg: #f6efe4;.*?--admin-shadow-soft: 0 14px 30px rgba\(133, 108, 71, 0\.08\);/s,
  `--admin-bg: #0f172a;
  --admin-bg-soft: #1e293b;
  --admin-surface: rgba(30, 41, 59, 0.7);
  --admin-surface-solid: #1e293b;
  --admin-border: rgba(255, 255, 255, 0.12);
  --admin-text: #f8fafc;
  --admin-text-soft: #94a3b8;
  --admin-highlight: #38bdf8;
  --admin-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.6);
  --admin-shadow-soft: 0 15px 35px -5px rgba(0, 0, 0, 0.4);`
);

// 2. We'll replace the hardcoded messy backgrounds with clean Aurora Theme ones using Regex
// Replace login-page background
css = css.replace(
  /\.login-page\s*{[^}]*background:\s*radial-gradient[^;]*;/s,
  (match) => {
     return match.replace(/background:.*?;/s, `background:
    radial-gradient(circle at 15% 18%, rgba(56, 189, 248, 0.15), transparent 28%),
    radial-gradient(circle at 85% 12%, rgba(139, 92, 246, 0.15), transparent 32%),
    #0f172a;`);
  }
);

// Replace login-card background
css = css.replace(
  /\.login-card\s*{[^}]*background:\s*rgba\(255, 253, 249, 0\.92\);/s,
  (match) => match.replace('rgba(255, 253, 249, 0.92)', 'var(--admin-surface)')
);

// Replace login-card-mark background
css = css.replace(
  /\.login-card-mark\s*{[^}]*background:\s*linear-gradient\([^)]+\);/s,
  (match) => match.replace(/background:\s*linear-gradient\([^)]+\);/, `background: linear-gradient(135deg, #38bdf8, #8b5cf6);`)
);
css = css.replace(
  /\.login-card-mark\s*{[^}]*box-shadow:[^;]+;/s,
  (match) => match.replace(/box-shadow:[^;]+;/, `box-shadow: 0 0 24px rgba(56, 189, 248, 0.4);`)
);

// Replace form-group inputs for login-card
css = css.replace(
  /\.login-card \.form-group input,\s*\.login-card \.form-group select,\s*\.login-card \.form-group textarea\s*{[^}]*background:\s*#ffffff;/s,
  (match) => match.replace('background: #ffffff;', 'background: rgba(15, 23, 42, 0.6);')
);
css = css.replace(
  /\.login-card \.form-group input::placeholder,\s*\.login-card \.form-group textarea::placeholder\s*{[^}]*color:\s*rgba\(107, 117, 109, 0\.8\);/s,
  (match) => match.replace('rgba(107, 117, 109, 0.8)', 'var(--admin-text-soft)')
);

// Replace admin-layout background
css = css.replace(
  /\.admin-layout\s*{[^}]*background:\s*radial-gradient[^;]*;/s,
  (match) => {
     return match.replace(/background:.*?;/s, `background:
    radial-gradient(circle at top right, rgba(56, 189, 248, 0.12), transparent 30%),
    radial-gradient(circle at top left, rgba(139, 92, 246, 0.12), transparent 30%),
    #0f172a;`);
  }
);
// Remove admin-layout::before (the grid pattern) if you like, or change opacity
css = css.replace(
  /\.admin-layout::before\s*{[^}]*opacity:\s*0\.28;/s,
  (match) => match.replace('opacity: 0.28;', 'opacity: 0.04;')
);

// Replace nav-item styles
css = css.replace(
  /\.nav-item-badge\s*{[^}]*background:\s*rgba\(255,\s*255,\s*255,\s*0\.78\);/s,
  (match) => match.replace('rgba(255, 255, 255, 0.78)', 'rgba(255, 255, 255, 0.1)')
);
css = css.replace(
  /\.nav-item:hover\s*{[^}]*background:\s*rgba\(255,\s*255,\s*255,\s*0\.68\);/s,
  (match) => match.replace('rgba(255, 255, 255, 0.68)', 'rgba(255, 255, 255, 0.06)')
);
css = css.replace(
  /\.nav-item\.active\s*{[^}]*background:\s*linear-gradient\([^;]+;/s,
  (match) => match.replace(/background:[^;]+;/, 'background: rgba(56, 189, 248, 0.15);')
);

// Replace sidebar-brand-mark background
css = css.replace(
  /\.sidebar-brand-mark\s*{[^}]*background:\s*linear-gradient\([^;]+;/s,
  (match) => match.replace(/background:[^;]+;/, `background: linear-gradient(135deg, #38bdf8, #8b5cf6);`)
);

// Sidebar summary background
css = css.replace(
  /\.sidebar-summary\s*{[^}]*background:\s*rgba\(255, 255, 255, 0\.66\);/s,
  (match) => match.replace('rgba(255, 255, 255, 0.66)', 'rgba(255, 255, 255, 0.04)')
);

// Admin topbar background
css = css.replace(
  /\.admin-topbar\s*{[^}]*background:\s*rgba\(255, 252, 247, 0\.76\);/s,
  (match) => match.replace('rgba(255, 252, 247, 0.76)', 'var(--admin-surface)')
);

// Dashboard welcome background
css = css.replace(
  /\.dashboard-welcome\s*{[^}]*background:\s*radial-gradient[^;]*;/s,
  (match) => {
     return match.replace(/background:.*?;/s, `background:
    radial-gradient(circle at top right, rgba(56, 189, 248, 0.15), transparent 28%),
    linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.8));`);
  }
);
// Dashboard kicker background
css = css.replace(
  /\.dashboard-kicker\s*{[^}]*background:\s*rgba\(47, 133, 90, 0\.1\);/s,
  (match) => match.replace('rgba(47, 133, 90, 0.1)', 'rgba(56, 189, 248, 0.15)')
);

// metric card / dashboard section
css = css.replace(
  /\.admin-metric-card,\s*\.dashboard-section\s*{[^}]*background:\s*rgba\(255,\s*255,\s*255,\s*0\.84\);/s,
  (match) => match.replace('rgba(255, 255, 255, 0.84)', 'var(--admin-surface)')
);

// admin layout form groups
css = css.replace(
  /\.admin-layout \.form-group input,\s*\.admin-layout \.form-group select,\s*\.admin-layout \.form-group textarea\s*{[^}]*background:\s*#fffefb;/s,
  (match) => match.replace('background: #fffefb;', 'background: rgba(15, 23, 42, 0.5);')
);
css = css.replace(
  /\.admin-layout \.form-group input:focus,\s*\.admin-layout \.form-group select:focus,\s*\.admin-layout \.form-group textarea:focus\s*{[^}]*box-shadow:[^;]*;/s,
  (match) => match.replace(/box-shadow:[^;]*;/, 'box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.15);')
).replace(
  /\.admin-layout \.form-group input:focus,\s*\.admin-layout \.form-group select:focus,\s*\.admin-layout \.form-group textarea:focus\s*{[^}]*border-color:[^;]*;/s,
  (match) => match.replace(/border-color:[^;]*;/, 'border-color: rgba(56, 189, 248, 0.5);')
);

// tables
css = css.replace(
  /\.table-responsive\s*{[^}]*background:\s*rgba\(255, 255, 255, 0\.82\);/s,
  (match) => match.replace('rgba(255, 255, 255, 0.82)', 'var(--admin-surface)')
);
css = css.replace(
  /\.admin-table th\s*{[^}]*background:\s*rgba\(247, 241, 232, 0\.9\);/s,
  (match) => match.replace('rgba(247, 241, 232, 0.9)', 'rgba(255, 255, 255, 0.05)')
);
css = css.replace(
  /\.admin-table tr:hover td\s*{[^}]*background:\s*rgba\(255, 251, 244, 0\.88\);/s,
  (match) => match.replace('rgba(255, 251, 244, 0.88)', 'rgba(255, 255, 255, 0.04)')
);

// Admin footer overrides
css = css.replace(
  /\.admin-footer\s*{[^}]*background:\s*#fff8ef;/s,
  (match) => match.replace('background: #fff8ef;', 'background: var(--admin-bg);')
);

// Primary and outline button specific for admin
// A custom neat trick: we can just inject a global override for .admin-layout .btn-primary right before @media
css = css.replace(
  "@media (max-width: 1024px)",
  ".admin-layout .btn-primary, .login-page .btn-primary { background: linear-gradient(135deg, #38bdf8, #8b5cf6); border: none; box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3); color: #fff; }\n" +
  ".admin-layout .btn-primary:hover, .login-page .btn-primary:hover { opacity: 0.9; transform: translateY(-2px); box-shadow: 0 12px 25px rgba(139, 92, 246, 0.4); }\n" +
  ".admin-layout .btn-outline { background: rgba(255,255,255,0.05); color: #f8fafc; border-color: rgba(255,255,255,0.15); }\n" +
  ".admin-layout .btn-outline:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.25); }\n\n" +
  "@media (max-width: 1024px)"
);

fs.writeFileSync(cssPath, css, 'utf8');
console.log('Admin CSS overridden for Aurora Theme successfully!');
