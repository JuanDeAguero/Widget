import React, { useEffect } from 'react';
import {
  Container,
  Section,
  MaxWidthContainer,
  Navigation,
  Nav,
  Logo,
  NavLinks,
  NavLink,
  HeroSection,
  FloatingNodesContainer,
  HeroTitle,
  HeroSubtitle,
  CTAButton,
  SecondaryButton,
  ButtonContainer,
  FeatureGrid,
  FeatureCard,
  FeatureIcon,
  FeatureTitle,
  FeatureDescription,
  StatsContainer,
  StatCard,
  StatNumber,
  StatLabel,
  ContentGrid,
  ContentText,
  ContentImage,
  CTASection,
  CTATitle,
  CTADescription,
  Footer,
  FooterContent,
  FooterText,
  FooterLinks,
  FooterLink,
  ScrollIndicator
} from './LandingPage.styles.ts';
import { ReactFlow, useReactFlow, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { SEO } from '../../components/SEO';

const FloatingNodes: React.FC = () => {
  const { fitView } = useReactFlow();
  
  const floatingNodes = [
    {
      id: '1',
      position: { x: -200, y: -100 },
      data: { label: 'Start' },
      style: { width: 80, height: 40 },
    },
    {
      id: '2',
      position: { x: 0, y: -130 },
      data: { label: 'Process' },
      style: { width: 90, height: 40 },
    },
    {
      id: '3',
      position: { x: 200, y: -60 },
      data: { label: 'Output' },
      style: { width: 80, height: 40 },
    },
    {
      id: '4',
      position: { x: -150, y: 120 },
      data: { label: 'Input' },
      style: { width: 70, height: 40 },
    },
    {
      id: '5',
      position: { x: 100, y: 100 },
      data: { label: 'Transform' },
      style: { width: 100, height: 40 },
    },
    {
      id: '6',
      position: { x: -220, y: 20 },
      data: { label: 'Event' },
      style: { width: 75, height: 40 },
    },
  ];

  const floatingEdges = [
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      animated: false,
    },
    {
      id: 'e2-3',
      source: '2',
      target: '3',
      animated: false,
    },
    {
      id: 'e4-5',
      source: '4',
      target: '5',
      animated: false,
    },
    {
      id: 'e6-4',
      source: '6',
      target: '4',
      animated: false,
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      fitView({ padding: 0.3 });
    };

    window.addEventListener('resize', handleResize);
    
    setTimeout(() => {
      fitView({ padding: 0.3 });
    }, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [fitView]);

  return (
    <ReactFlow
      nodes={floatingNodes}
      edges={floatingEdges}
      fitView
      fitViewOptions={{
        padding: 0.3,
        includeHiddenNodes: true,
        minZoom: 0.8,
        maxZoom: 1.2,
      }}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
      panOnDrag={false}
      zoomOnScroll={false}
      zoomOnPinch={false}
      panOnScroll={false}
      preventScrolling={false}
    />
  );
};


export const LandingPage: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Container>
      <SEO
        title="Widget - Build Amazing Digital Experiences"
        description="Widget is a powerful platform for creating interactive applications and managing your digital workflow. Start building today with our intuitive tools and comprehensive features."
        keywords="widget, digital experiences, web applications, interactive tools, workflow management, app builder, UI editor, blueprint editor"
        canonical="https://yourwidgetdomain.com"
      />
      
      <Navigation>
        <Nav>
          <Logo>Widget</Logo>
          <NavLinks>
            <NavLink onClick={() => scrollToSection('features')}>Features</NavLink>
            <NavLink onClick={() => scrollToSection('about')}>About</NavLink>
            <NavLink onClick={() => scrollToSection('cta')}>Get Started</NavLink>
          </NavLinks>
        </Nav>
      </Navigation>

      <HeroSection>
        <FloatingNodesContainer>
          <ReactFlowProvider>
            <FloatingNodes />
          </ReactFlowProvider>
        </FloatingNodesContainer>
        <MaxWidthContainer>
          <HeroTitle>Build Visually</HeroTitle>
          <HeroSubtitle>
            Create powerful applications through intuitive drag-and-drop UI building and node-based scripting. 
            No code required. <div>Just design, connect and deploy.</div>
          </HeroSubtitle>
          <ButtonContainer>
            <CTAButton to="/app">Start Building →</CTAButton>
            <SecondaryButton>Watch Demo</SecondaryButton>
          </ButtonContainer>
        </MaxWidthContainer>
        <ScrollIndicator onClick={() => scrollToSection('features')}>
          <span>Scroll</span>
          <div className="scroll-line"></div>
        </ScrollIndicator>
      </HeroSection>

      <Section id="features">
        <MaxWidthContainer>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>
              Everything you need
            </h2>
            <p style={{ color: '#a1a1aa', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
              Powerful features designed for modern workflows and built for scale.
            </p>
          </div>
          <FeatureGrid>
            <FeatureCard>
              <FeatureIcon>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="5" cy="6" r="3" />
                  <circle cx="19" cy="6" r="3" />
                  <circle cx="5" cy="18" r="3" />
                  <circle cx="19" cy="18" r="3" />
                  <path d="M8 6h8" />
                  <path d="M8 18h8" />
                  <path d="M5 9v6" />
                  <path d="M19 9v6" />
                </svg>
              </FeatureIcon>
              <FeatureTitle>Visual Node System</FeatureTitle>
              <FeatureDescription>
                Build complex logic with our intuitive node-based editor. Connect nodes to create workflows, automate processes, and design interactive experiences.
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="6" height="6" rx="1" />
                  <rect x="15" y="15" width="6" height="6" rx="1" />
                  <path d="M9 6h6l-3 6" />
                  <path d="M15 18H9l3-6" />
                  <path d="M9 6v12" />
                  <path d="M15 6v12" />
                </svg>
              </FeatureIcon>
              <FeatureTitle>Drag & Drop UI</FeatureTitle>
              <FeatureDescription>
                Design beautiful interfaces with our drag-and-drop editor. Build responsive layouts, customize components, and create stunning user experiences.
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </FeatureIcon>
              <FeatureTitle>Lightning Fast</FeatureTitle>
              <FeatureDescription>
                Built for speed with modern technologies. Experience instant loading and smooth interactions in both design and runtime.
              </FeatureDescription>
            </FeatureCard>
          </FeatureGrid>
        </MaxWidthContainer>
      </Section>

      <Section>
        <MaxWidthContainer>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>
              Trusted by thousands
            </h2>
            <p style={{ color: '#a1a1aa', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
              Join the growing community of developers and teams who rely on Widget.
            </p>
          </div>
          <StatsContainer>
            <StatCard>
              <StatNumber>99.9%</StatNumber>
              <StatLabel>Uptime</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>10M+</StatNumber>
              <StatLabel>API Calls</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>50K+</StatNumber>
              <StatLabel>Active Users</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>24/7</StatNumber>
              <StatLabel>Support</StatLabel>
            </StatCard>
          </StatsContainer>
        </MaxWidthContainer>
      </Section>

      <Section id="about">
        <MaxWidthContainer>
          <ContentGrid>
            <ContentText>
              <h2>Design interfaces effortlessly</h2>
              <p>
                Build beautiful, responsive user interfaces with our drag-and-drop editor. 
                Choose from a rich library of components, customize properties, and see changes in real-time.
              </p>
              <p>
                From simple forms to complex dashboards, create pixel-perfect designs that 
                work seamlessly across all devices. No CSS knowledge required.
              </p>
            </ContentText>
            <ContentImage>
              <div>Drag & Drop UI Builder</div>
            </ContentImage>
          </ContentGrid>
        </MaxWidthContainer>
      </Section>

      <Section>
        <MaxWidthContainer>
          <ContentGrid>
            <ContentImage>
              <div>Node Editor Preview</div>
            </ContentImage>
            <ContentText>
              <h2>Visual scripting made simple</h2>
              <p>
                Our node-based editor transforms complex logic into intuitive visual flows. 
                Connect data sources, add conditions, and create powerful automations without writing a single line of code.
              </p>
              <p>
                From simple workflows to complex business logic, our visual scripting system 
                adapts to your needs. Debug visually, test instantly, and deploy with confidence.
              </p>
            </ContentText>
          </ContentGrid>
        </MaxWidthContainer>
      </Section>

      <CTASection id="cta">
        <MaxWidthContainer>
          <CTATitle>Ready to build?</CTATitle>
          <CTADescription>
            Join thousands of creators who use Widget's drag-and-drop and visual scripting tools to build amazing applications.
          </CTADescription>
          <CTAButton to="/app">Start Building Visually →</CTAButton>
        </MaxWidthContainer>
      </CTASection>

      <Footer>
        <FooterContent>
          <FooterLinks>
            <FooterLink onClick={() => scrollToSection('features')}>Features</FooterLink>
            <FooterLink onClick={() => scrollToSection('about')}>About</FooterLink>
            <FooterLink onClick={() => scrollToSection('cta')}>Get Started</FooterLink>
            <FooterLink onClick={() => window.open('https://docs.yourwidgetdomain.com', '_blank')}>Documentation</FooterLink>
            <FooterLink onClick={() => window.open('https://support.yourwidgetdomain.com', '_blank')}>Support</FooterLink>
          </FooterLinks>
          <FooterText>
            © 2025 Widget. All rights reserved.
          </FooterText>
        </FooterContent>
      </Footer>
    </Container>
  );
};