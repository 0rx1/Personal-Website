'use client'

import { useState, useEffect, useRef, KeyboardEvent, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Command {
  command: string
  output: string | JSX.Element
}

type CommandsType = {
  [key: string]: JSX.Element | string | (() => Promise<JSX.Element>);
};

type NewsItem = {
  title: string;
  link: string;
  date: string;
  severity?: string;
  description?: string;
};

const fetchSecurityNews = async (): Promise<NewsItem[]> => {
  try {
    const response = await fetch('/api/news');
    const { data } = await response.json();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, 'text/xml');
    const items = xmlDoc.getElementsByTagName('item');
    
    return Array.from(items).slice(0, 5).map((item) => {
      const description = item.getElementsByTagName('description')[0]?.textContent || '';
      const severityMatch = description.match(/Severity:<\/strong> ([\d.]+) \| ([A-Z]+)/);
      
      return {
        title: item.getElementsByTagName('title')[0]?.textContent || '',
        link: item.getElementsByTagName('link')[0]?.textContent || '',
        date: item.getElementsByTagName('pubDate')[0]?.textContent || '',
        severity: severityMatch ? severityMatch[2] : undefined,
        description: description.replace(/<[^>]*>/g, '').split('<br>')[0],
      };
    });
  } catch (error) {
    console.error('Error fetching security news:', error);
    return [];
  }
};

const Terminal = () => {
  const [bootPhase, setBootPhase] = useState(0)
  const [history, setHistory] = useState<Command[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const bootSequence = [
    {
      text: '[    0.000000] Linux version 6.4.0-portfolio (root@portfolio)',
      delay: 300
    },
    {
      text: '[    0.000000] Command line: BOOT_IMAGE=/boot/portfolio-kernel root=UUID=portfolio-id',
      delay: 200
    },
    {
      text: '[    0.000000] x86/fpu: Supporting XSAVE feature 0x001: \'x87 floating point registers\'',
      delay: 100
    },
    {
      text: '[    0.000000] BIOS-provided physical RAM map:',
      delay: 200
    },
    {
      text: '[    0.000000] ACPI: Early table checksum verification disabled',
      delay: 150
    },
    {
      text: '[    0.000000] ACPI: RSDP 0x00000000000F0490 000024 (v02 PORTFOLIO)',
      delay: 100
    },
    {
      text: '[    0.041891] CPU0: Intel(R) Core(TM) i7-1165G7 @ 2.80GHz',
      delay: 300
    },
    {
      text: '[    0.041891] Performance Events: PEBS fmt3+',
      delay: 200
    },
    {
      text: '[    0.042345] checking TSC synchronization [CPU#0 -> CPU#1]',
      delay: 400
    },
    {
      text: '[    0.043012] Calibrating delay loop (skipped)',
      delay: 300
    },
    {
      text: '[    0.089123] Memory: 16384MB DDR4',
      delay: 200
    },
    {
      text: '[    0.091123] Initializing system services...',
      delay: 800
    },
    {
      text: '[    0.092123] Starting network interfaces...',
      delay: 400
    },
    {
      text: '[    0.093123] Loading security modules...',
      delay: 300
    },
    {
      text: '[    0.094123] Mounting filesystems...',
      delay: 500
    },
    {
      text: '[    0.095123] Starting portfolio services...',
      delay: 600
    },
    {
      text: '[    0.096123] System initialization complete.',
      delay: 400
    },
    {
      text: 'Portfolio Terminal v2.0.0 (c) 2024\nType \'help\' for available commands.\n',
      delay: 500
    }
  ]

  const commands: CommandsType = {
    help: (
      <div className="text-green-400">
        <div className="mb-2">[Available Commands]</div>
        <ul className="list-none space-y-1">
          <li>$ whoami - Display personal info</li>
          <li>$ experience - Show work experience</li>
          <li>$ skills - List technical skills</li>
          <li>$ projects - View portfolio projects</li>
          <li>$ contact - Get contact information</li>
          <li>$ social - View social media links</li>
          <li>$ clear - Clear terminal history</li>
          <li>$ news - Show latest tech news</li>
          <li>$ help - Show this help message</li>
        </ul>
      </div>
    ),
    whoami: (
      <div className="text-green-400/90 space-y-4">
        {/* Profile Header */}
        <div className="border border-green-400/30 rounded-lg p-4 bg-black/50 relative overflow-hidden group">
          {/* Cyberpunk-style decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-transparent transform rotate-45"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-green-500/10 to-transparent transform -rotate-45"></div>
          
          <div className="flex items-start justify-between relative">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-green-500/20 flex items-center justify-center border border-green-400/30">
                  <span className="text-2xl">👨‍💻</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors">Charafeddine Nassiri</h2>
                  <div className="text-white/70 mt-1">Cybersecurity Specialist & CTO @ Defendis</div>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-3 text-sm">
                <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-green-400/10">
                  <span className="text-white/50">⌘</span>
                  <span className="text-white/70">Casablanca, Morocco</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-green-400/10">
                  <span className="text-white/50">⚡</span>
                  <span className="text-white/70">Available for collaboration</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-white/50 mb-1">System Status</div>
              <div className="flex items-center gap-2 bg-green-400/10 px-2 py-1 rounded-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span className="text-emerald-400">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Years of Experience', value: '8+', icon: '⚡' },
            { label: 'Projects Completed', value: '50+', icon: '🚀' },
            { label: 'Technologies', value: '15+', icon: '💻' }
          ].map((stat) => (
            <div key={stat.label} className="border border-green-400/30 rounded-lg p-4 bg-black/50 hover:bg-black/70 transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-green-500/20 flex items-center justify-center">
                  <span className="text-lg">{stat.icon}</span>
                </div>
                <div>
                  <div className="text-white/50 text-xs">{stat.label}</div>
                  <div className="text-cyan-400 text-xl group-hover:text-cyan-300 transition-colors">{stat.value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bio */}
        <div className="border border-green-400/30 rounded-lg p-4 bg-black/50 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-500/5 to-transparent"></div>
          <div className="text-white/50 text-xs mb-2 flex items-center gap-2">
            <span className="text-cyan-400/70">~/</span>About
          </div>
          <p className="text-white/90 leading-relaxed relative">
          I’m Charafeddine Nassiri—a tech geek, cybersecurity aficionado, and self-proclaimed AI wizard. As CTO of Defendis, I spend my days battling cyber threats, cooking up smart solutions, and drinking way too much coffee. I’ve worked with banks and businesses across Africa, helping them sleep a little better at night. When I’m not geeking out over my broken code, you’ll probably find me trying to explain to my wife why buying another gadget is absolutely necessary.
          </p>
        </div>

        {/* Core Technologies */}
        <div className="border border-green-400/30 rounded-lg p-4 bg-black/50 group">
          <div className="text-white/50 text-xs mb-3 flex items-center gap-2">
            <span className="text-cyan-400/70">~/</span>Tech Stack
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              'MISP', 
              'OpenCTI', 
              'TheHive', 
              'Cortex', 
              'YARA', 
              'Sigma Rules',
              'Snort/Suricata',
              'Python',
              'STIX/TAXII',
              'Maltego'
            ].map((tech) => (
              <div 
                key={tech}
                className="px-3 py-1.5 rounded-md bg-green-400/10 text-green-400 text-sm flex items-center gap-2 group-hover:bg-green-400/15 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-400/50"></span>
                {tech}
              </div>
            ))}
          </div>
        </div>

        {/* Current Focus */}
        <div className="border border-green-400/30 rounded-lg p-4 bg-black/50 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-green-500/5"></div>
          <div className="relative">
            <div className="text-white/50 text-xs mb-2 flex items-center gap-2">
              <span className="text-cyan-400/70">~/</span>Current Focus
            </div>
            <div className="flex items-center gap-2 text-cyan-400">
              <span className="animate-pulse">▶</span>
              <span className="text-white/90">Building The Next Generation of Cybersecurity Solutions</span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="flex items-center justify-between text-white/50 text-sm italic">
          <span>Type 'contact' or 'social' for ways to connect</span>
          <div className="flex items-center gap-2">
            <span className="animate-pulse text-xs">●</span>
            <span>Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    ),
    experience: (
      <div className="text-green-400 space-y-4">
        <div className="mb-2">[Work Experience]</div>
        <div className="space-y-4">
          {/* Current Role - Defendis.ai */}
          <div className="border border-green-400/30 rounded-lg p-4 bg-black/50 hover:bg-black/70 transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mt-1">
                  <span className="text-xl">🚀</span>
                </div>
                <div>
                  <div className="text-cyan-400 font-bold group-hover:text-cyan-300">Co-Founder & CTO</div>
                  <div className="text-white/70">Defendis.ai</div>
                  <div className="text-white/50 text-sm">2024 - Present</div>
                </div>
              </div>
              <div className="px-2 py-1 rounded text-xs bg-green-400/10 text-green-400">Current</div>
            </div>
            <div className="ml-13 pl-10 border-l border-green-400/20 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-cyan-400/70">▹</span>
                <span className="text-white/90">Leading technical strategy and product development</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cyan-400/70">▹</span>
                <span className="text-white/90">Building innovative cybersecurity solutions</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cyan-400/70">▹</span>
                <span className="text-white/90">Managing technical team and security operations</span>
              </div>
            </div>
          </div>

          {/* Purple Team Lead Role */}
          <div className="border border-green-400/30 rounded-lg p-4 bg-black/50 hover:bg-black/70 transition-all group">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mt-1">
                <span className="text-xl">🛡️</span>
              </div>
              <div>
                <div className="text-cyan-400 font-bold group-hover:text-cyan-300">Purple Team Lead & Senior Analyst</div>
                <div className="text-white/70">Dataprotect</div>
                <div className="text-white/50 text-sm">2021 - 2024</div>
              </div>
            </div>
            <div className="ml-13 pl-10 border-l border-green-400/20 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-cyan-400/70">▹</span>
                <span className="text-white/90">Led red and blue team operations</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cyan-400/70">▹</span>
                <span className="text-white/90">Conducted advanced threat hunting and incident response</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cyan-400/70">▹</span>
                <span className="text-white/90">Developed security strategies and frameworks</span>
              </div>
            </div>
          </div>

          {/* Offensive Security Consultant Role */}
          <div className="border border-green-400/30 rounded-lg p-4 bg-black/50 hover:bg-black/70 transition-all group">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mt-1">
                <span className="text-xl">🎯</span>
              </div>
              <div>
                <div className="text-cyan-400 font-bold group-hover:text-cyan-300">Offensive Security Consultant</div>
                <div className="text-white/70">Dataprotect</div>
                <div className="text-white/50 text-sm">2019 - 2021</div>
              </div>
            </div>
            <div className="ml-13 pl-10 border-l border-green-400/20 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-cyan-400/70">▹</span>
                <span className="text-white/90">Performed penetration testing and security assessments</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cyan-400/70">▹</span>
                <span className="text-white/90">Conducted vulnerability research and exploit development</span>
              </div>
            </div>
          </div>

          {/* Freelance Role */}
          <div className="border border-green-400/30 rounded-lg p-4 bg-black/50 hover:bg-black/70 transition-all group">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mt-1">
                <span className="text-xl">💼</span>
              </div>
              <div>
                <div className="text-cyan-400 font-bold group-hover:text-cyan-300">Freelance Application Security Consultant</div>
                <div className="text-white/70">Self-Employed</div>
                <div className="text-white/50 text-sm">2014 - 2018</div>
              </div>
            </div>
            <div className="ml-13 pl-10 border-l border-green-400/20 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-cyan-400/70">▹</span>
                <span className="text-white/90">Conducted 3000+ security tests for organizations including Fortune 500 companies</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cyan-400/70">▹</span>
                <span className="text-white/90">Performed full-cycle ethical hacks from test planning to reporting</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cyan-400/70">▹</span>
                <span className="text-white/90">Developed custom security testing methodologies and frameworks</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    skills: (
      <div className="text-green-400 space-y-4">
        <div className="mb-2">[Technical Skills]</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border border-green-400/30 rounded-lg p-4 bg-black/50 hover:bg-black/70 transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-xl">🎯</span>
              </div>
              <div className="text-cyan-400 font-bold group-hover:text-cyan-300">Offensive Security</div>
            </div>
            <div className="space-y-2">
              {[
                'Penetration Testing',
                'Vulnerability Assessment',
                'Red Teaming',
                'Social Engineering',
                'Web App Security'
              ].map((skill) => (
                <div key={skill} className="flex items-center gap-2">
                  <span className="text-cyan-400/70">▹</span>
                  <span className="text-white/90">{skill}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-green-400/30 rounded-lg p-4 bg-black/50 hover:bg-black/70 transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-xl">🔍</span>
              </div>
              <div className="text-cyan-400 font-bold group-hover:text-cyan-300">Threat Intelligence</div>
            </div>
            <div className="space-y-2">
              {[
                'CTI Analysis',
                'OSINT Collection',
                'Threat Hunting',
                'IOC Development',
                'APT Tracking'
              ].map((skill) => (
                <div key={skill} className="flex items-center gap-2">
                  <span className="text-cyan-400/70">▹</span>
                  <span className="text-white/90">{skill}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-green-400/30 rounded-lg p-4 bg-black/50 hover:bg-black/70 transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-xl">🛡️</span>
              </div>
              <div className="text-cyan-400 font-bold group-hover:text-cyan-300">SOC Operations</div>
            </div>
            <div className="space-y-2">
              {[
                'Incident Response',
                'Log Analysis',
                'SIEM Management',
                'Alert Triage',
                'Malware Analysis'
              ].map((skill) => (
                <div key={skill} className="flex items-center gap-2">
                  <span className="text-cyan-400/70">▹</span>
                  <span className="text-white/90">{skill}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-green-400/30 rounded-lg p-4 bg-black/50 hover:bg-black/70 transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-xl">🔧</span>
              </div>
              <div className="text-cyan-400 font-bold group-hover:text-cyan-300">Tools & Platforms</div>
            </div>
            <div className="space-y-2">
              {[
                'MISP/OpenCTI',
                'TheHive/Cortex',
                'Splunk/ELK',
                'Nmap/Metasploit',
                'Wireshark/Zeek'
              ].map((skill) => (
                <div key={skill} className="flex items-center gap-2">
                  <span className="text-cyan-400/70">▹</span>
                  <span className="text-white/90">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border border-green-400/30 rounded-lg p-4 bg-black/50">
          <div className="flex items-center gap-2">
            <span className="animate-pulse text-cyan-400">▶</span>
            <span className="text-white/90">Currently focusing on Advanced Threat Hunting and APT Research</span>
          </div>
        </div>
      </div>
    ),
    projects: (
      <div className="text-green-400 space-y-4">
        <div className="mb-2">[Featured Projects]</div>
        <div className="grid grid-cols-1 gap-4">
          <div className="border border-green-400/30 rounded-lg bg-black/50 overflow-hidden group">
            {/* Project Link Preview */}
            <a 
              href="https://defendis.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 border-b border-green-400/30 hover:bg-black/30 transition-all"
            >
              <div className="flex items-center gap-2 text-sm text-white/50 mb-2">
                <span className="text-cyan-400">🔗</span>
                <span>defendis.ai</span>
                <span className="ml-auto px-2 py-0.5 rounded text-xs bg-green-400/10 text-green-400">Live</span>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-green-500/20 flex items-center justify-center">
                  <span className="text-2xl">🛡️</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-cyan-400 font-bold text-lg group-hover:text-cyan-300">Defendis.ai</h3>
                  <p className="text-white/70 text-sm mt-1">
                    Advanced Threat Intelligence Platform | AI-Powered Cybersecurity Solutions
                  </p>
                </div>
              </div>
            </a>

            <div className="p-4">
              <p className="text-white/70">
                A comprehensive threat intelligence platform that helps Government Agencies, Banks, and Businesses identify breaches and known vulnerabilities. The platform leverages AI to prioritize, contextualize, and deliver advanced cyber threat insights.
              </p>
              
              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    {
                      title: 'Credentials Compromise Alerting',
                      description: 'Automated detection and alerting for employee and customer credential compromises',
                      icon: '🔐'
                    },
                    {
                      title: 'Payment Cards Fraud Prevention',
                      description: 'Real-time detection of payment card leaks across the dark web',
                      icon: '💳'
                    },
                    {
                      title: 'Assets Vulnerability Insights',
                      description: 'Identification and prioritization of vulnerabilities based on real-time exploitability',
                      icon: '🎯'
                    },
                    {
                      title: 'Ransomware Monitoring',
                      description: 'Early detection of ransomware attacks targeting regional peers',
                      icon: '🚨'
                    }
                  ].map((feature) => (
                    <div key={feature.title} className="border border-green-400/20 rounded-lg p-3 bg-black/30 hover:bg-black/50 transition-all">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{feature.icon}</span>
                        <div className="text-cyan-400 font-medium">{feature.title}</div>
                      </div>
                      <div className="text-white/60 text-sm mt-1 ml-7">{feature.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <div className="text-white/50 text-sm font-medium">Key Technologies</div>
                <div className="flex flex-wrap gap-2">
                  {[
                    'AI/ML',
                    'MISP',
                    'OpenCTI',
                    'TheHive',
                    'STIX/TAXII',
                    'Python',
                    'Next.js',
                    'TypeScript'
                  ].map((tech) => (
                    <span key={tech} className="px-2 py-1 rounded-md bg-green-400/10 text-green-400 text-xs hover:bg-green-400/20 transition-colors">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <a 
                  href="https://defendis.ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-all group"
                >
                  <span>Visit Platform</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </a>
                <div className="text-white/50 text-sm">
                  <span className="animate-pulse">●</span> Live Project
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    social: (
      <div className="text-green-400 space-y-4">
        <div className="mb-2">[Social Links]</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="border border-green-400/30 rounded-lg p-4 bg-black/50 hover:bg-black/70 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-xl">🐙</span>
              </div>
              <div>
                <div className="text-cyan-400 font-bold group-hover:text-cyan-300">GitHub</div>
                <div className="text-white/50 text-sm">@johndoe</div>
              </div>
            </div>
          </a>

          <a 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="border border-green-400/30 rounded-lg p-4 bg-black/50 hover:bg-black/70 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-xl">💼</span>
              </div>
              <div>
                <div className="text-cyan-400 font-bold group-hover:text-cyan-300">LinkedIn</div>
                <div className="text-white/50 text-sm">John Doe</div>
              </div>
            </div>
          </a>

          <a 
            href="https://x.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="border border-green-400/30 rounded-lg p-4 bg-black/50 hover:bg-black/70 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-xl">✖️</span>
              </div>
              <div>
                <div className="text-cyan-400 font-bold group-hover:text-cyan-300">X</div>
                <div className="text-white/50 text-sm">@johndoe</div>
              </div>
            </div>
          </a>
        </div>
        
        <div className="text-white/50 text-sm italic">
          Click any card to visit profile
        </div>
      </div>
    ),
    contact: (
      <div className="text-green-400 space-y-4">
        <div className="mb-2">[Contact Information]</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border border-green-400/30 rounded-lg p-4 bg-black/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-xl">📧</span>
              </div>
              <div>
                <div className="text-white/50 text-sm">Email</div>
                <div className="text-cyan-400">john@example.com</div>
              </div>
            </div>
          </div>

          <div className="border border-green-400/30 rounded-lg p-4 bg-black/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-xl">📱</span>
              </div>
              <div>
                <div className="text-white/50 text-sm">Phone</div>
                <div className="text-cyan-400">(555) 123-4567</div>
              </div>
            </div>
          </div>

          <div className="border border-green-400/30 rounded-lg p-4 bg-black/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-xl">📍</span>
              </div>
              <div>
                <div className="text-white/50 text-sm">Location</div>
                <div className="text-cyan-400">New York, NY</div>
              </div>
            </div>
          </div>

          <div className="border border-green-400/30 rounded-lg p-4 bg-black/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-xl">⏰</span>
              </div>
              <div>
                <div className="text-white/50 text-sm">Timezone</div>
                <div className="text-cyan-400">EST (UTC-5)</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-green-400/30 rounded-lg p-4 bg-black/50">
          <div className="flex items-center gap-2 text-cyan-400">
            <span className="animate-pulse">▶</span>
            <span>Available for freelance opportunities</span>
          </div>
        </div>
      </div>
    ),
    clear: 'CLEAR',
    news: async () => {
      const news = await fetchSecurityNews();
      
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-green-400 font-bold text-lg">Latest Security Vulnerabilities</div>
            <div className="px-2 py-1 rounded text-xs bg-green-400/10 text-green-400">Live Feed</div>
          </div>
          
          <div className="space-y-3">
            {news.map((item, index) => (
              <div 
                key={index} 
                className="border border-green-400/20 rounded-lg p-4 hover:bg-black/30 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <span className="text-lg">🔒</span>
                      </div>
                      <a 
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 font-medium group-hover:underline"
                      >
                        {item.title}
                      </a>
                    </div>
                    {item.description && (
                      <p className="text-white/70 text-sm pl-11">{item.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm pl-11">
                      <div className="flex items-center gap-2">
                        <span className="text-white/50">📅</span>
                        <span className="text-white/50">{new Date(item.date).toLocaleDateString()}</span>
                      </div>
                      {item.severity && (
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          item.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                          item.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {item.severity}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-white/50 text-sm italic">
            <span>Source: CVE Feed - Latest Security Vulnerabilities</span>
            <span className="flex items-center gap-2">
              <span className="animate-pulse">●</span>
              Auto-updating
            </span>
          </div>
        </div>
      );
    },
  }

  const handleCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase()
    
    if (trimmedCmd === 'clear') {
      setHistory([])
      if (containerRef.current) {
        containerRef.current.scrollTop = 0
      }
      return
    }

    const commandOutput = commands[trimmedCmd]
    const output = typeof commandOutput === 'function' 
      ? await commandOutput()
      : commandOutput || 'Command not found. Type \'help\' for available commands.'

    const newCommand: Command = {
      command: cmd,
      output,
    }
    setHistory((prev) => [...prev, newCommand])
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      handleCommand(input)
      setInput('')
    }
  }

  useEffect(() => {
    const startBoot = async () => {
      setIsLoading(true)
      
      // Initial delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      // BIOS POST screen
      setBootPhase(-1) // Special phase for POST screen
      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      // Memory check animation
      setBootPhase(-2) // Special phase for memory check
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      // Boot sequence
      for (let i = 0; i < bootSequence.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, bootSequence[i].delay))
        setBootPhase(i + 1)
      }
      
      await new Promise((resolve) => setTimeout(resolve, 500))
      setIsLoading(false)
    }

    startBoot()
  }, [])

  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: 'smooth'
    })
  }, [history])

  const renderBootScreen = () => {
    if (bootPhase === -1) {
      return (
        <div className="text-white space-y-2">
          <pre className="text-cyan-400">
{`
Portfolio BIOS (c) 2024 Portfolio Inc.
BIOS Date: 01/01/24 Ver: 2.0.0
CPU: Intel(R) Core(TM) i7 @ 2.80GHz
`}
          </pre>
          <div>Press DEL to enter SETUP</div>
        </div>
      )
    }
    
    if (bootPhase === -2) {
      return (
        <div className="text-white">
          <div>Memory Test:</div>
          <div className="mt-2 space-y-1">
            <div>Testing: 16384MB</div>
            <div className="w-64 h-2 bg-gray-800 rounded">
              <motion.div
                className="h-full bg-green-500 rounded"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.5 }}
              />
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="text-green-400/90 font-mono space-y-1">
        {bootSequence.slice(0, bootPhase).map((phase, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {phase.text}
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black font-mono text-sm overflow-hidden">
      <div 
        ref={containerRef}
        className="p-4 h-screen overflow-auto"
        onClick={() => inputRef.current?.focus()}
      >
        {isLoading ? (
          // Boot Sequence
          renderBootScreen()
        ) : (
          <>
            {/* Simple Welcome Banner (only shown on fresh start/clear) */}
            {history.length === 0 && (
              <div className="text-green-400/90 mb-4">
                Portfolio Terminal v2.0.0 (c) 2024
                <br />
                Type 'help' for available commands.
              </div>
            )}

            {/* Command History */}
            <AnimatePresence>
              {history.map((entry, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4"
                >
                  <div className="flex items-center text-green-400/90">
                    <span>root@portfolio</span>
                    <span className="text-white/90 mx-1">:</span>
                    <span className="text-blue-400/90">~</span>
                    <span className="text-white/90 mx-1">$</span>
                    <span className="text-white/90 ml-1">{entry.command}</span>
                  </div>
                  <div className="mt-1 ml-4">{entry.output}</div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Command Input */}
            <div className="flex items-center text-green-400/90 mt-4">
              <span>root@portfolio</span>
              <span className="text-white/90 mx-1">:</span>
              <span className="text-blue-400/90">~</span>
              <span className="text-white/90 mx-1">$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="ml-1 bg-transparent outline-none flex-1 text-white/90 caret-white"
                spellCheck="false"
                autoComplete="off"
              />
            </div>
          </>
        )}

        {/* Blinking Cursor during boot */}
        {isLoading && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="inline-block w-2 h-4 bg-white/90 ml-1"
          />
        )}
      </div>
    </div>
  )
}

export default Terminal