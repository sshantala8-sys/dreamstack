import Link from 'next/link'
import { ArrowRight, Zap, Users, Shield, TrendingUp, Star, CheckCircle } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="ds-grid-bg min-h-screen">
      <nav style={{
        position:'fixed',top:0,left:0,right:0,zIndex:50,
        borderBottom:'1px solid var(--ds-border)',
        background:'rgba(10,10,15,0.85)',
        backdropFilter:'blur(12px)',
        padding:'0 32px',height:64,
        display:'flex',alignItems:'center',justifyContent:'space-between'
      }}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:32,height:32,borderRadius:8,background:'linear-gradient(135deg,#7c5cfc,#00d4aa)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:14,color:'white'}}>D</div>
          <span style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:18}}>DreamStack</span>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <Link href="/login" className="ds-btn-ghost">Sign in</Link>
          <Link href="/signup" className="ds-btn-primary">Get started <ArrowRight size={14}/></Link>
        </div>
      </nav>

      <section style={{paddingTop:160,paddingBottom:120,textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:80,left:'50%',transform:'translateX(-50%)',width:600,height:300,borderRadius:'50%',background:'radial-gradient(ellipse,rgba(124,92,252,0.15) 0%,transparent 70%)',pointerEvents:'none'}}/>
        <div style={{maxWidth:820,margin:'0 auto',padding:'0 24px'}}>
          <div className="ds-badge ds-badge-accent animate-fade-up" style={{marginBottom:24,display:'inline-flex'}}>
            <Zap size={12} style={{marginRight:6}}/> AI-Powered Work-to-Learn Platform
          </div>
          <h1 className="animate-fade-up delay-100" style={{fontSize:'clamp(42px,7vw,80px)',fontWeight:800,lineHeight:1.05,marginBottom:24}}>
            Turn your ideas into{' '}
            <span className="ds-gradient-text">verified proof</span>{' '}of work
          </h1>
          <p className="animate-fade-up delay-200" style={{fontSize:18,color:'var(--ds-text-muted)',maxWidth:560,margin:'0 auto 40px',lineHeight:1.7}}>
            DreamStack matches students with complementary skills, manages your project with AI, and turns completed builds into credentials recruiters actually trust.
          </p>
          <div className="animate-fade-up delay-300" style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/signup" className="ds-btn-primary" style={{padding:'14px 32px',fontSize:16}}>Start building free <ArrowRight size={16}/></Link>
            <Link href="/projects" className="ds-btn-secondary" style={{padding:'14px 32px',fontSize:16}}>Browse projects</Link>
          </div>
          <div className="animate-fade-up delay-400" style={{marginTop:48,display:'flex',justifyContent:'center',gap:40,flexWrap:'wrap'}}>
            {[{value:'2,400+',label:'Student builders'},{value:'380+',label:'Projects shipped'},{value:'94%',label:'Hired within 3 months'}].map(s=>(
              <div key={s.label} style={{textAlign:'center'}}>
                <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:28}}>{s.value}</div>
                <div style={{fontSize:13,color:'var(--ds-text-muted)',marginTop:2}}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{padding:'80px 24px',maxWidth:1100,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:60}}>
          <h2 style={{fontSize:40,fontWeight:800,marginBottom:12}}>The Flow</h2>
          <p style={{color:'var(--ds-text-muted)',fontSize:16}}>From spark to hired, in 5 steps</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:20}}>
          {[
            {num:'01',title:'The Spark',desc:'Post your idea. AI generates a blueprint and team roster instantly.',color:'#7c5cfc'},
            {num:'02',title:'Matchmaking',desc:'AI scans global students by skills, availability, and reputation.',color:'#00d4aa'},
            {num:'03',title:'Handshake',desc:'Sign a Digital Equity Agreement that protects everyone\'s IP.',color:'#ff6b35'},
            {num:'04',title:'Sprints',desc:'AI PM sets milestones, reviews code, and unblocks bottlenecks.',color:'#7c5cfc'},
            {num:'05',title:'Credential',desc:'Get Skill Badges and appear in the Sponsor Feed.',color:'#00d4aa'},
          ].map(step=>(
            <div key={step.num} className="ds-card" style={{padding:24}}>
              <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:40,color:step.color,opacity:0.3,lineHeight:1,marginBottom:12}}>{step.num}</div>
              <h3 style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:16,marginBottom:8}}>{step.title}</h3>
              <p style={{fontSize:13,color:'var(--ds-text-muted)',lineHeight:1.6}}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{padding:'80px 24px',maxWidth:1100,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:60}}>
          <h2 style={{fontSize:40,fontWeight:800,marginBottom:12}}>Everything you need to ship</h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:20}}>
          {[
            {icon:<Zap size={20}/>,title:'AI Project Manager',desc:'Weekly milestones, automated code reviews, bottleneck resolution.'},
            {icon:<Users size={20}/>,title:'Global Skill Matching',desc:'Find the right teammate anywhere in the world instantly.'},
            {icon:<Shield size={20}/>,title:'Blockchain IP Ledger',desc:'Immutable record of who built what. No disputes, no stolen credit.'},
            {icon:<TrendingUp size={20}/>,title:'Reputation Score',desc:'Dynamic score unlocks sponsored projects with real funding.'},
            {icon:<Star size={20}/>,title:'Sponsor Feed',desc:'TikTok-style feed where recruiters discover your work.'},
            {icon:<CheckCircle size={20}/>,title:'Skill Badges',desc:'Verified, AI-issued credentials tied to real shipped projects.'},
          ].map(f=>(
            <div key={f.title} className="ds-card" style={{padding:28}}>
              <div style={{width:44,height:44,borderRadius:12,background:'rgba(124,92,252,0.12)',border:'1px solid rgba(124,92,252,0.2)',display:'flex',alignItems:'center',justifyContent:'center',color:'#a78bfa',marginBottom:16}}>{f.icon}</div>
              <h3 style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:16,marginBottom:8}}>{f.title}</h3>
              <p style={{fontSize:13,color:'var(--ds-text-muted)',lineHeight:1.6}}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{padding:'80px 24px',maxWidth:900,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:60}}>
          <h2 style={{fontSize:40,fontWeight:800,marginBottom:12}}>Simple pricing</h2>
          <p style={{color:'var(--ds-text-muted)'}}>Start free, upgrade when you need the firepower</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:20}}>
          {[
            {name:'Free',price:'₹0',period:'forever',features:['3 active projects','Basic AI blueprint','Team matching','Skill badges','Sponsor feed visibility'],cta:'Get started',href:'/signup',accent:false},
            {name:'Premium',price:'₹499',period:'/month',features:['Unlimited projects','Advanced AI PM','Priority matching','IP legal templates','1-on-1 AI mentorship','Analytics dashboard'],cta:'Upgrade now',href:'/signup?plan=premium',accent:true},
          ].map(plan=>(
            <div key={plan.name} className="ds-card" style={{padding:32,border:plan.accent?'1px solid rgba(124,92,252,0.5)':undefined,position:'relative'}}>
              {plan.accent&&<div style={{position:'absolute',top:-12,left:'50%',transform:'translateX(-50%)',background:'var(--ds-accent)',color:'white',padding:'4px 16px',borderRadius:99,fontSize:12,fontWeight:600,fontFamily:'Syne,sans-serif',whiteSpace:'nowrap'}}>Most popular</div>}
              <div style={{marginBottom:4,color:'var(--ds-text-muted)',fontSize:14,fontFamily:'Syne,sans-serif',fontWeight:600}}>{plan.name}</div>
              <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:40,marginBottom:4}}>{plan.price}<span style={{fontSize:16,fontWeight:400,color:'var(--ds-text-muted)'}}>{plan.period}</span></div>
              <div style={{borderTop:'1px solid var(--ds-border)',margin:'24px 0'}}/>
              <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:12,marginBottom:28}}>
                {plan.features.map(f=>(
                  <li key={f} style={{display:'flex',gap:10,fontSize:14,color:'var(--ds-text-muted)'}}>
                    <CheckCircle size={16} style={{color:'#00d4aa',flexShrink:0,marginTop:1}}/>{f}
                  </li>
                ))}
              </ul>
              <Link href={plan.href} className={plan.accent?'ds-btn-primary':'ds-btn-secondary'} style={{width:'100%',justifyContent:'center'}}>{plan.cta}</Link>
            </div>
          ))}
        </div>
      </section>

      <section style={{padding:'80px 24px',textAlign:'center'}}>
        <div style={{maxWidth:700,margin:'0 auto',background:'linear-gradient(135deg,rgba(124,92,252,0.1),rgba(0,212,170,0.1))',border:'1px solid rgba(124,92,252,0.2)',borderRadius:24,padding:'64px 40px'}}>
          <h2 style={{fontSize:40,fontWeight:800,marginBottom:16}}>Ready to build your future?</h2>
          <p style={{color:'var(--ds-text-muted)',fontSize:16,marginBottom:32}}>Join thousands of students shipping real projects and getting hired.</p>
          <Link href="/signup" className="ds-btn-primary" style={{padding:'14px 40px',fontSize:16}}>Start for free <ArrowRight size={16}/></Link>
        </div>
      </section>

      <footer style={{borderTop:'1px solid var(--ds-border)',padding:'32px 24px',textAlign:'center'}}>
        <p style={{fontSize:13,color:'var(--ds-text-faint)'}}>© 2025 DreamStack. Built with ♥ for student builders.</p>
      </footer>
    </div>
  )
}
