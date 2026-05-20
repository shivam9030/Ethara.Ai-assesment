import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', role: 'Member' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.email, formData.password, formData.role);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const onFocus = (e) => {
    e.target.style.borderColor = '#0058be';
    e.target.style.boxShadow = '0 0 0 4px rgba(0,88,190,0.10)';
  };
  const onBlur = (e) => {
    e.target.style.borderColor = '#c2c6d6';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#f9f9ff' }}>

      {/* Background Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute rounded-full blur-[120px]"
          style={{ top: '-10%', left: '-10%', width: '40%', height: '40%', backgroundColor: 'rgba(0,88,190,0.05)' }} />
        <div className="absolute rounded-full blur-[120px]"
          style={{ bottom: '-10%', right: '-10%', width: '40%', height: '40%', backgroundColor: 'rgba(208,225,251,0.2)' }} />
      </div>

      {/* Auth Card */}
      <main className="w-full" style={{ maxWidth: '480px' }}>

        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            style={{ backgroundColor: '#2170e4', boxShadow: '0 8px 24px rgba(0,88,190,0.20)' }}>
            <span className="material-symbols-outlined" style={{ color: '#fefcff', fontSize: '28px' }}>dashboard</span>
          </div>
          <h1 className="text-[36px] font-bold tracking-tight" style={{ color: '#191b23', letterSpacing: '-0.02em' }}>TaskFlow</h1>
          <p className="text-sm mt-1" style={{ color: '#424754' }}>Enterprise SaaS productivity suite</p>
        </div>

        {/* Card */}
        <div className="rounded-xl auth-card-shadow border" style={{ backgroundColor: '#ffffff', borderColor: 'rgba(194,198,214,0.3)', padding: '32px' }}>

          {/* Mode Toggle */}
          <div className="flex p-1 rounded-lg mb-6" style={{ backgroundColor: '#e6e7f2' }}>
            <button
              type="button"
              onClick={() => { setIsLogin(true); setError(null); }}
              className="flex-1 py-2 px-4 rounded-md text-xs font-semibold tracking-wide transition-all"
              style={isLogin
                ? { backgroundColor: '#ffffff', color: '#0058be', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }
                : { backgroundColor: 'transparent', color: '#424754' }}>
              Login
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); setError(null); }}
              className="flex-1 py-2 px-4 rounded-md text-xs font-semibold tracking-wide transition-all"
              style={!isLogin
                ? { backgroundColor: '#ffffff', color: '#0058be', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }
                : { backgroundColor: 'transparent', color: '#424754' }}>
              Sign up
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg border text-sm"
              style={{ backgroundColor: '#ffdad6', color: '#93000a', borderColor: 'rgba(186,26,26,0.2)' }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#424754' }}>
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#727785', fontSize: '20px', pointerEvents: 'none' }}>mail</span>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  type="email"
                  placeholder="name@company.com"
                  className="w-full rounded-lg outline-none transition-all border text-sm"
                  style={{ paddingLeft: '40px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px', backgroundColor: '#ffffff', borderColor: '#c2c6d6', color: '#191b23' }}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: '#424754' }}>
                  Password
                </label>
                {isLogin && <a href="#" className="text-xs font-semibold" style={{ color: '#0058be' }}>Forgot password?</a>}
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#727785', fontSize: '20px', pointerEvents: 'none' }}>lock</span>
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-lg outline-none transition-all border text-sm"
                  style={{ paddingLeft: '40px', paddingRight: '44px', paddingTop: '12px', paddingBottom: '12px', backgroundColor: '#ffffff', borderColor: '#c2c6d6', color: '#191b23' }}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#727785' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>visibility</span>
                </button>
              </div>
            </div>

            {/* Role selector — signup only */}
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#424754' }}>
                  Account Role
                </label>
                <div className="flex gap-3">
                  {['Member', 'Admin'].map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: r })}
                      className="flex-1 py-2.5 px-4 rounded-lg border text-sm font-semibold transition-all"
                      style={formData.role === r
                        ? { backgroundColor: '#0058be', color: '#ffffff', borderColor: '#0058be' }
                        : { backgroundColor: '#ffffff', color: '#424754', borderColor: '#c2c6d6' }}
                    >
                      {r === 'Admin' ? '🛡️ Admin' : '👤 Member'}
                    </button>
                  ))}
                </div>
                <p className="mt-1.5 text-xs" style={{ color: '#727785' }}>
                  Admins can manage projects &amp; members. Members can view and work on assigned tasks.
                </p>
              </div>
            )}

            {/* Remember me */}
            <div className="flex items-center gap-2 py-2">
              <input
                type="checkbox"
                id="remember"
                className="w-5 h-5 rounded cursor-pointer"
                style={{ accentColor: '#0058be' }}
              />
              <label htmlFor="remember" className="text-sm cursor-pointer select-none" style={{ color: '#424754' }}>
                Remember this device
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl text-lg font-semibold transition-all active:scale-[0.98] disabled:opacity-70"
              style={{ backgroundColor: '#0058be', color: '#ffffff', boxShadow: '0 8px 24px rgba(0,88,190,0.25)', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#004395'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#0058be'; }}
            >
              {loading ? 'Please wait…' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: 'rgba(194,198,214,0.5)' }} />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 text-xs font-semibold uppercase tracking-wider"
                style={{ backgroundColor: '#ffffff', color: '#727785' }}>
                Or continue with
              </span>
            </div>
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-colors"
              style={{ borderColor: '#c2c6d6', backgroundColor: '#ffffff' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f2f3fd'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}>
              <img alt="Google" style={{ width: '20px', height: '20px' }}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC71x4tsPWW2wo6_67XYWW4J0k6Z4WTjwDEtrmaGj2fMFT7YanFrujpKSpcYFVSVmgIfPGormeuZmeEq_efwcbCEyMwAQD4tSXTznvgbRL4bKa6GQoUSgsE0WsWmTn--_9TNUVOtwai2Gf3cpLSJqqvzenmQg4Qd-P96Ir4npFl1NaebsqLK0DOgpCUIhLzUjD49yjRmi44Fj_waGQbXXwjOteAH8QhhLm1_m4Wu8BGThHf6rCR7DO31POylI_n3DfCTUE-r8HYDZo" />
              <span className="text-sm font-medium" style={{ color: '#191b23' }}>Google</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-colors"
              style={{ borderColor: '#c2c6d6', backgroundColor: '#ffffff' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f2f3fd'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}>
              <span className="material-symbols-outlined" style={{ fontSize: '22px', color: '#191b23' }}>work</span>
              <span className="text-sm font-medium" style={{ color: '#191b23' }}>SSO</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm" style={{ color: '#424754' }}>
            By signing in, you agree to our{' '}
            <a href="#" className="font-semibold hover:underline" style={{ color: '#191b23' }}>Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="font-semibold hover:underline" style={{ color: '#191b23' }}>Privacy Policy</a>
          </p>
        </div>
      </main>

      {/* Side Hero Panel — xl screens only, fixed to right */}
      <div className="hidden xl:flex fixed top-8 right-8 bottom-8 flex-col rounded-2xl overflow-hidden border"
        style={{ width: '380px', backgroundColor: '#ecedf7', borderColor: 'rgba(194,198,214,0.2)', boxShadow: '0 25px 50px rgba(0,0,0,0.15)' }}>
        <div className="relative" style={{ flex: '0 0 48%' }}>
          <img alt="Office workspace" className="w-full h-full object-cover block"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAf7nPzneZYoj03pzghRXqtljoeKukONTasMdZU06qAXwC6dK3aUfGiw4g1H6-Ea454hwOcn1ztfK_VPxRDngDuoMnDM5rSpEsTlWxluxMKe93rFdGMQnar7a-8dbscLEonDyqUNvgqrdJ6WH7o6gwd0_H4q4tPb_9gJtJpuVBPILAHzR_-qhumZjhcftfVaTHYyekNNwkSL4DMIjb1IheAd5l6fWyn8MPtmhYVaQ3clsHQbnp2LXluGBdH9_1FQnzo0PHOdqwY8kE" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #ecedf7, transparent)' }} />
        </div>
        <div className="flex-1 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold mb-6" style={{ color: '#191b23', letterSpacing: '-0.01em' }}>
            Streamline your team's velocity
          </h2>
          <div className="space-y-5">
            {[
              { icon: 'bolt',   bg: 'rgba(0,88,190,0.10)',  color: '#0058be',  title: 'Instant Syncing',     desc: 'Real-time updates across all team dashboards.' },
              { icon: 'shield', bg: 'rgba(146,71,0,0.10)',  color: '#924700',  title: 'Enterprise Security', desc: 'SOC2 compliant data protection for your projects.' },
            ].map(({ icon, bg, color, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: bg }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '24px', color }}>{icon}</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold" style={{ color: '#191b23' }}>{title}</h4>
                  <p className="text-sm mt-0.5" style={{ color: '#424754' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 rounded-xl border italic text-sm"
            style={{ backgroundColor: '#e6e7f2', borderColor: 'rgba(194,198,214,0.3)', color: '#424754' }}>
            "TaskFlow has redefined how our engineering teams handle complex sprints. It's the clarity we were missing."
            <div className="flex items-center gap-3 mt-3 not-italic">
              <img alt="Alex Rivera" className="w-9 h-9 rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZCOv_cIVdt_anmIMw0FmJ__SFyNmcV0dwrXIFM-qwtWHhBaYDvrNX0Y2k72l2vqUeZQlDsd6i7fzynnahAfJiaX9sVXRFH_hcpbA6WxwpxIB06WIi95bntf7YmWZIbfRDywtmJ1GEgbuTovJCelTqQ9QlR6PIDOk5gYYcCCgnDcChkkDh1-QeyYyI4XKcSz2K8sFaArwlioG2_GU00uFiteS9M3f9UQ-JclsIG-Mn2oLb_BO1qx348YXWLYEJzgd937CUGHRmrZA" />
              <div>
                <p className="text-xs font-bold" style={{ color: '#191b23' }}>Alex Rivera</p>
                <p className="text-xs" style={{ color: '#727785' }}>CTO at TechScale</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
