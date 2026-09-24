import LoginForm from '../../components/LoginForm';
export default function LoginPage() { return <main className="auth-wrap"><div className="auth-card"><img src="/riloc-logo.png" alt="RILOC" width="160"/><span className="eyebrow">Administrator sign in</span><h1>Welcome back</h1><p>Sign in with the administrator account created in Supabase.</p><LoginForm/></div></main>; }
