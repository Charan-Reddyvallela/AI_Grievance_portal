import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Shield, TrendingUp, Users, Award, ArrowRight, MessageCircle, HelpCircle, Clock } from 'lucide-react';
import PageLayout from 'examples/LayoutContainers/PageLayout';
import DefaultNavbar from 'examples/Navbars/DefaultNavbar';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import {
  HERO,
  HOW_IT_WORKS,
  DEPARTMENTS,
  PRIORITIES,
  REWARDS,
  FOOTER,
  STATS_DEFAULT,
  HOW_TO_SUBMIT,
  AFTER_SUBMIT,
  SAMPLE_COMPLAINTS,
  GRIEVANCEBOT_HELP,
  FAQ_LANDING,
} from 'data/portalContent';
// eslint-disable-next-line no-unused-vars -- used as <HeroSlideshow /> in hero
import HeroSlideshow from 'components/HeroSlideshow';

/** Section-specific background images (alternating sections only; skip first below slideshow) */
const SECTION_BG = {
  howToSubmit: '/civic-images/1.jpg',       // procedure / civic
  afterSubmit: '/civic-images/2.jpg',       // timelines / progress
  sampleComplaints: '/civic-images/3.jpg', // complaints / issues
  grievanceBot: '/civic-images/4.jpg',      // community / support
  rewards: '/civic-images/5.jpg',           // participation / rewards
};
const sectionBgStyle = (img) => ({
  backgroundImage: `linear-gradient(rgba(255,255,255,0.2), rgba(255,255,255,0.22)), url(${img})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
});

const LandingPage = () => {
  const stats = STATS_DEFAULT;
  const [slideIndex, setSlideIndex] = useState(0);
  const [contentPosition, setContentPosition] = useState('left'); // 'left' | 'right'
  const [contentOpacity, setContentOpacity] = useState(1);
  const isFirstSlide = useRef(true);

  // When slide changes: fade out with image, then show content on other side and fade in
  useEffect(() => {
    if (isFirstSlide.current) {
      isFirstSlide.current = false;
      setContentPosition(slideIndex % 2 === 0 ? 'left' : 'right');
      return;
    }
    setContentOpacity(0);
    const t = setTimeout(() => {
      setContentPosition(slideIndex % 2 === 0 ? 'left' : 'right');
      setContentOpacity(1);
    }, 400);
    return () => clearTimeout(t);
  }, [slideIndex]);

  const features = [
    {
      icon: <FileText className="h-8 w-8" />,
      title: 'Submit Complaint',
      description: 'Describe your civic issue with location details and optional media uploads.',
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'AI Analysis',
      description: 'Our NLP engine categorizes, prioritizes, and detects duplicate complaints.',
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: 'Real-time Tracking',
      description: 'Track your complaint status with color-coded priorities on your dashboard.',
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Community Support',
      description: 'Upvote complaints to help prioritize issues that affect multiple people.',
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: 'Reward Points',
      description: 'Earn +10 pts per complaint, +5 when resolved, +2 for upvoting. Unlock badges.',
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: 'GrievanceBot',
      description: '24/7 AI assistant for how to submit, status, departments, and step-by-step guides.',
    },
  ];

  return (
    <PageLayout>
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <DefaultNavbar action={{ type: 'internal', route: '/login', label: 'Sign In', color: 'info' }} transparent light />
      </div>
      <MDBox
        minHeight="100vh"
        position="relative"
        display="flex"
        alignItems="center"
        justifyContent={contentPosition === 'left' ? 'flex-start' : 'flex-end'}
        sx={{
          pt: 20,
          pb: 16,
          px: { xs: 2, sm: 3, md: 4, lg: 5 },
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          overflow: 'hidden'
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>
        <HeroSlideshow index={slideIndex} onIndexChange={setSlideIndex} />
        <MDBox
          position="relative"
          zIndex={10}
          width="100%"
          maxWidth={640}
          px={{ xs: 2, sm: 3 }}
          textAlign={contentPosition === 'left' ? 'left' : 'right'}
          sx={{
            opacity: contentOpacity,
            transition: 'opacity 0.4s ease-in-out',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            textRendering: 'optimizeLegibility',
          }}
        >
          <MDTypography variant="h2" fontWeight="bold" color="white" mb={1.5} sx={{ fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' } }}>
            AI-Powered Civic Portal
          </MDTypography>
          <MDTypography variant="h4" fontWeight="bold" color="white" mb={1.5} sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            {HERO.title}
          </MDTypography>
          <MDTypography
            variant="body1"
            color="white"
            sx={{
              maxWidth: 520,
              mb: 3.5,
              lineHeight: 1.6,
              fontSize: { xs: '0.95rem', sm: '1rem' },
              ...(contentPosition === 'left' ? { mr: 'auto' } : { ml: 'auto' }),
            }}
          >
            {HERO.subtitle}
          </MDTypography>
          <MDBox
            display="flex"
            flexDirection={{ xs: 'column', sm: 'row' }}
            gap={2}
            justifyContent={contentPosition === 'left' ? 'flex-start' : 'flex-end'}
            alignItems="center"
            flexWrap="wrap"
          >
            <MDButton
              component={Link}
              to="/dashboard"
              variant="outlined"
              color="white"
              size="large"
              sx={{ whiteSpace: 'nowrap', minWidth: { sm: 180 } }}
            >
              {HERO.ctaSecondary}
            </MDButton>
          </MDBox>
        </MDBox>
      </MDBox>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-b from-slate-50 via-white to-indigo-50/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.12),transparent)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-14">
            <h2 className="landing-reveal text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-800 mb-4">
              Making a Real Impact
            </h2>
            <p className="landing-reveal landing-reveal-stagger-1 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
              Join thousands of citizens actively improving their communities
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`landing-reveal landing-reveal-stagger-${index + 2} group`}
              >
                <div className="landing-card p-8 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 tabular-nums">
                      {stat.number}
                    </div>
                    <div className="text-slate-600 font-semibold text-sm uppercase tracking-wider">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Submit a Complaint – step-by-step procedure */}
      <section className="py-20 relative overflow-hidden min-h-[320px]">
        <div className="absolute inset-0" style={sectionBgStyle(SECTION_BG.howToSubmit)} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="landing-reveal text-3xl md:text-4xl font-bold tracking-tight text-slate-800 mb-4">
              How to Submit a Complaint
            </h2>
            <p className="landing-reveal landing-reveal-stagger-1 text-lg text-slate-600 max-w-2xl mx-auto">
              Follow our simple procedure to file a grievance and get a tracking ID.
            </p>
          </div>
          <div className="space-y-6 max-w-4xl mx-auto">
            {HOW_TO_SUBMIT.map((item, index) => (
              <div
                key={index}
                className={`landing-reveal landing-reveal-stagger-${Math.min(index + 2, 8)}`}
              >
                <div className="landing-card p-6 flex gap-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center text-lg font-bold shadow-lg shadow-indigo-500/20">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">{item.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_80%_20%,rgba(99,102,241,0.06),transparent)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="landing-reveal text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-800 mb-4">
              Why Choose AI Grievance Portal?
            </h2>
            <p className="landing-reveal landing-reveal-stagger-1 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
              Experience the future of civic engagement with our intelligent complaint management system.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`landing-reveal landing-reveal-stagger-${Math.min(index + 2, 8)} group`}
              >
                <div className="landing-card p-8 h-full flex flex-col">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 mb-6 group-hover:scale-110 group-hover:shadow-indigo-500/30 transition-all duration-300 [&_svg]:text-white">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed flex-1">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Happens After You Submit – timelines */}
      <section className="py-16 relative overflow-hidden min-h-[280px] border-y border-slate-200/60">
        <div className="absolute inset-0" style={sectionBgStyle(SECTION_BG.afterSubmit)} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="landing-reveal text-2xl md:text-3xl font-bold tracking-tight text-slate-800 mb-2 text-center">
            What Happens After You Submit
          </h2>
          <p className="landing-reveal landing-reveal-stagger-1 text-slate-600 text-center mb-10 max-w-2xl mx-auto">
            Typical timelines so you know what to expect.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {AFTER_SUBMIT.map((item, index) => (
              <div key={index} className={`landing-reveal landing-reveal-stagger-${index + 2}`}>
                <div className="landing-card p-5 h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-indigo-600" />
                    <span className="font-bold text-indigo-600 text-sm">{item.time}</span>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1">{item.phase}</h3>
                  <p className="text-sm text-slate-600 leading-snug">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-b from-indigo-50/60 via-white to-purple-50/50 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-200/60 to-transparent hidden md:block" style={{ transform: 'translateY(-50%)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="landing-reveal text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-800 mb-4">
              How It Works
            </h2>
            <p className="landing-reveal landing-reveal-stagger-1 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
              Our AI-powered platform makes civic engagement easy and effective.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 relative">
            {HOW_IT_WORKS.map((item, index) => (
              <div
                key={index}
                className={`landing-reveal landing-reveal-stagger-${Math.min(index + 2, 8)} group relative`}
              >
                <div className="landing-card p-8 text-center relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-5 shadow-lg shadow-indigo-500/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                  {index < HOW_IT_WORKS.length - 1 && (
                    <div className="absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-indigo-200 to-transparent hidden md:block" style={{ transform: 'translateY(-50%)' }} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample / Recent Complaints */}
      <section className="py-20 relative overflow-hidden min-h-[320px]">
        <div className="absolute inset-0" style={sectionBgStyle(SECTION_BG.sampleComplaints)} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10">
            <h2 className="landing-reveal text-3xl md:text-4xl font-bold tracking-tight text-slate-800 mb-4">
              Recently Filed & Resolved
            </h2>
            <p className="landing-reveal landing-reveal-stagger-1 text-lg text-slate-600 max-w-2xl mx-auto">
              Sample complaints showing how issues are categorized, routed, and updated.
            </p>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[640px] landing-reveal landing-reveal-stagger-2">
              <div className="grid gap-3">
                {SAMPLE_COMPLAINTS.map((c, i) => (
                  <div key={i} className="landing-card p-4 flex flex-wrap items-center gap-3 md:gap-4">
                    <span className="font-mono text-sm font-semibold text-indigo-600">{c.id}</span>
                    <span className="font-bold text-slate-800 flex-1 min-w-0">{c.title}</span>
                    <span className="text-sm text-slate-600 whitespace-nowrap">{c.category} · {c.location}</span>
                    <span className={`text-sm font-semibold px-2.5 py-0.5 rounded-full ${
                      c.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {c.status}
                    </span>
                    <span className="text-sm text-slate-500">{c.days}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="py-24 bg-slate-50/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_20%_80%,rgba(139,92,246,0.08),transparent)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="landing-reveal text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-800 mb-4">
              Departments We Cover
            </h2>
            <p className="landing-reveal landing-reveal-stagger-1 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
              AI routes your complaints to the right department automatically.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {DEPARTMENTS.map((dept, index) => (
              <div
                key={index}
                className={`landing-reveal landing-reveal-stagger-${Math.min(index + 2, 8)} group`}
              >
                <div className="landing-card p-5 flex items-start gap-4">
                  <span className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                    {dept.emoji}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-800 mb-0.5">{dept.name}</h3>
                    <p className="text-sm text-slate-600 leading-snug">{dept.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How GrievanceBot Helps – AI chat */}
      <section className="py-20 relative overflow-hidden min-h-[380px]">
        <div className="absolute inset-0" style={sectionBgStyle(SECTION_BG.grievanceBot)} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="landing-reveal text-3xl md:text-4xl font-bold tracking-tight text-slate-800 mb-4">
              How GrievanceBot Can Help You
            </h2>
            <p className="landing-reveal landing-reveal-stagger-1 text-lg text-slate-600 max-w-3xl mx-auto mb-4">
              {GRIEVANCEBOT_HELP.intro}
            </p>
            <p className="landing-reveal landing-reveal-stagger-2 text-sm text-indigo-600 font-medium max-w-2xl mx-auto">
              {GRIEVANCEBOT_HELP.tip}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GRIEVANCEBOT_HELP.capabilities.map((cap, index) => (
              <div key={index} className={`landing-reveal landing-reveal-stagger-${Math.min(index + 2, 8)}`}>
                <div className="landing-card p-6 h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageCircle className="h-6 w-6 text-indigo-600 flex-shrink-0" />
                    <h3 className="font-bold text-slate-800">{cap.title}</h3>
                  </div>
                  <p className="text-sm text-slate-600 mb-4 flex-1">{cap.response}</p>
                  <div className="text-xs text-slate-500">
                    <span className="font-semibold text-slate-600">Try asking:</span>
                    <ul className="mt-1 space-y-0.5">
                      {cap.examples.slice(0, 2).map((ex, i) => (
                        <li key={i} className="italic">&ldquo;{ex}&rdquo;</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Color-Coded Priority System */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="landing-reveal text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-800 mb-4">
              Color-Coded Priority System
            </h2>
            <p className="landing-reveal landing-reveal-stagger-1 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
              Every complaint is assigned a priority level by our AI.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {PRIORITIES.map((p, index) => {
              const isRed = p.color === 'red';
              const isYellow = p.color === 'yellow';
              const dot = isRed ? 'bg-red-500' : isYellow ? 'bg-amber-500' : 'bg-emerald-500';
              const cardBg = isRed
                ? 'from-red-50 to-rose-50 border-red-100 hover:border-red-200'
                : isYellow
                ? 'from-amber-50 to-yellow-50 border-amber-100 hover:border-amber-200'
                : 'from-emerald-50 to-green-50 border-emerald-100 hover:border-emerald-200';
              return (
                <div
                  key={index}
                  className={`landing-reveal landing-reveal-stagger-${index + 2} group`}
                >
                  <div className={`rounded-2xl border-2 bg-gradient-to-br ${cardBg} p-8 shadow-lg hover:shadow-xl transition-all duration-300 -translate-y-0 hover:-translate-y-1`}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`w-4 h-4 rounded-full ${dot} shadow-md group-hover:scale-125 transition-transform duration-300`} />
                      <h3 className="text-xl font-bold text-slate-800">{p.level} Priority</h3>
                    </div>
                    <p className="text-slate-700 font-medium mb-2">{p.label}</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{p.tags}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Rewards Section */}
      <section className="py-24 relative overflow-hidden min-h-[420px]">
        <div className="absolute inset-0" style={sectionBgStyle(SECTION_BG.rewards)} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="landing-reveal text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-800 mb-4">
              Earn Rewards for Civic Participation
            </h2>
            <p className="landing-reveal landing-reveal-stagger-1 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
              Get points and badges for being an active citizen.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-10 lg:gap-14">
            <div className="landing-reveal landing-reveal-stagger-2">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Points System</h3>
              <div className="space-y-4">
                {REWARDS.points.map((r, i) => (
                  <div key={i} className="group">
                    <div className="landing-card p-5 flex items-center gap-4">
                      <span className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                        {r.emoji}
                      </span>
                      <div>
                        <span className="font-bold text-emerald-600 text-lg">+{r.amount} Points</span>
                        <p className="text-slate-700 font-medium">{r.label}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="landing-reveal landing-reveal-stagger-3">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Achievement Badges</h3>
              <div className="space-y-4">
                {REWARDS.badges.map((b, i) => (
                  <div key={i} className="group">
                    <div className="landing-card p-5 flex items-center gap-4">
                      <span className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-2xl shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform duration-300">
                        {b.emoji}
                      </span>
                      <div>
                        <span className="font-bold text-slate-800 text-lg">{b.name}</span>
                        <p className="text-slate-600 text-sm leading-relaxed">{b.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ – scattered flow: big, medium, small boxes + dotted background + connector lines */}
      <section className="faq-dotted-bg py-20 border-t border-slate-200/60 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <h2 className="landing-reveal text-2xl md:text-3xl font-bold tracking-tight text-slate-800 mb-2 text-center relative z-10">
            Frequently Asked Questions
          </h2>
          <p className="landing-reveal landing-reveal-stagger-1 text-slate-600 text-center mb-12 relative z-10">
            Quick answers about submitting complaints and using the portal.
          </p>
          <div className="relative min-h-[640px] md:min-h-[520px]">
            {/* Connector lines (SVG) – behind cards */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
              viewBox="0 0 100 100"
              style={{ zIndex: 0 }}
              preserveAspectRatio="none"
            >
              <defs>
                <marker id="faq-dot" markerWidth="6" markerHeight="6" refX="3" refY="3">
                  <circle cx="3" cy="3" r="2" fill="rgba(99,102,241,0.5)" />
                </marker>
              </defs>
              {/* Line pairs connecting boxes – coordinates match grid positions */}
              {[
                [0, 1], [0, 4], [1, 2], [1, 3], [2, 5], [3, 6], [4, 5], [4, 7], [4, 8],
                [5, 6], [5, 9], [6, 9], [7, 8], [8, 9],
              ].map(([a, b], i) => {
                const c = [
                  [25, 22], [75, 14], [62, 38], [88, 38], [25, 55],
                  [62, 55], [88, 55], [14, 88], [38, 88], [75, 88],
                ];
                const [x1, y1] = c[a];
                const [x2, y2] = c[b];
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(99,102,241,0.4)"
                    strokeWidth="0.8"
                    strokeDasharray="3 2"
                  />
                );
              })}
            </svg>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5 items-start relative z-10" style={{ gridAutoRows: 'minmax(100px, auto)' }}>
              {FAQ_LANDING.map((faq, index) => {
                const tiles = [
                  { col: 'md:col-span-2', row: 'md:row-span-2', pad: 'p-7', text: 'text-base', titleSize: 'text-xl', pos: 'md:col-start-1 md:row-start-1', offset: '' },
                  { col: 'md:col-span-2', row: 'md:row-span-1', pad: 'p-4', text: 'text-sm', titleSize: 'text-base', pos: 'md:col-start-3 md:row-start-1', offset: 'md:mt-3' },
                  { col: 'md:col-span-1', row: 'md:row-span-1', pad: 'p-3', text: 'text-xs', titleSize: 'text-sm', pos: 'md:col-start-3 md:row-start-2', offset: 'md:-mt-1' },
                  { col: 'md:col-span-1', row: 'md:row-span-1', pad: 'p-3', text: 'text-xs', titleSize: 'text-sm', pos: 'md:col-start-4 md:row-start-2', offset: 'md:mt-5' },
                  { col: 'md:col-span-2', row: 'md:row-span-1', pad: 'p-5', text: 'text-sm', titleSize: 'text-base', pos: 'md:col-start-1 md:row-start-3', offset: 'md:ml-3 md:mt-1' },
                  { col: 'md:col-span-1', row: 'md:row-span-1', pad: 'p-3', text: 'text-xs', titleSize: 'text-sm', pos: 'md:col-start-3 md:row-start-3', offset: 'md:mt-2' },
                  { col: 'md:col-span-1', row: 'md:row-span-1', pad: 'p-3', text: 'text-xs', titleSize: 'text-sm', pos: 'md:col-start-4 md:row-start-3', offset: 'md:mt-4' },
                  { col: 'md:col-span-1', row: 'md:row-span-1', pad: 'p-4', text: 'text-sm', titleSize: 'text-sm', pos: 'md:col-start-1 md:row-start-4', offset: 'md:mt-2' },
                  { col: 'md:col-span-1', row: 'md:row-span-1', pad: 'p-4', text: 'text-sm', titleSize: 'text-sm', pos: 'md:col-start-2 md:row-start-4', offset: 'md:mt-3' },
                  { col: 'md:col-span-2', row: 'md:row-span-1', pad: 'p-4', text: 'text-sm', titleSize: 'text-base', pos: 'md:col-start-3 md:row-start-4', offset: 'md:mt-2' },
                ];
                const t = tiles[index] || tiles[0];
                return (
                  <div
                    key={index}
                    className={`landing-reveal landing-reveal-stagger-${Math.min(index + 2, 8)} ${t.col} ${t.row} ${t.pos} ${t.offset}`}
                  >
                    <div className={`landing-card ${t.pad} h-full flex flex-col shadow-xl bg-white/95 backdrop-blur-sm`}>
                      <div className="flex gap-3 flex-1">
                        <HelpCircle className={`text-indigo-600 flex-shrink-0 mt-0.5 ${index === 0 ? 'h-7 w-7' : index >= 7 ? 'h-5 w-5' : 'h-5 w-5'}`} />
                        <div className="min-w-0">
                          <h3 className={`font-bold text-slate-800 mb-1.5 ${t.titleSize}`}>{faq.q}</h3>
                          <p className={`text-slate-600 leading-relaxed ${t.text}`}>{faq.a}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full opacity-5 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full opacity-5 translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Join the civic movement. Submit complaints, track progress, and earn rewards while improving your community.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/register"
              className="group bg-white text-blue-600 hover:bg-gray-100 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 inline-flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Sign Up Now
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link
              to="/login"
              className="group border-2 border-white text-white hover:bg-white hover:text-blue-600 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 inline-flex items-center justify-center"
            >
              Sign In
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer – left and right of chat button, not mid-centre */}
      <footer className="py-12 bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pr-24 md:pr-28">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-start gap-8 md:gap-12">
              <div>
                <h3 className="font-semibold text-white text-lg mb-2">AI Grievance Portal</h3>
                <p className="text-sm max-w-sm">{FOOTER.tagline}</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Quick Links</h4>
                <ul className="space-y-1 text-sm">
                  <li><Link to="/" className="hover:text-white">Home</Link></li>
                  <li><Link to="/dashboard" className="hover:text-white">Dashboard</Link></li>
                  <li><Link to="/login" className="hover:text-white">Sign In</Link></li>
                </ul>
              </div>
            </div>
            <div className="md:text-right">
              <h4 className="font-semibold text-white mb-2">Contact</h4>
              <ul className="space-y-1 text-sm">
                <li><a href={`mailto:${FOOTER.contact.email}`} className="hover:text-white">{FOOTER.contact.email}</a></li>
                <li><a href={`tel:${FOOTER.contact.phone}`} className="hover:text-white">{FOOTER.contact.phone}</a></li>
                <li>{FOOTER.contact.address}</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm">
            © {new Date().getFullYear()} AI Grievance Portal. Built for Hackathon.
          </div>
        </div>
      </footer>
    </PageLayout>
  );
};

export default LandingPage;
