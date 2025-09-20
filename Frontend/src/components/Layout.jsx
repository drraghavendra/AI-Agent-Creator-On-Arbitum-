export default function Layout({ children }) {
return (
<div>
<header className="topbar">
<div className="brand">ARC Agents</div>
<div className="spacer" />
<div className="wallet"><!-- wallet button rendered in child --></div>
</header>


<div className="content">{children}</div>


<footer className="footer">Built for Arbitrum — replace mocks with real integrations.</footer>
</div>
);
}