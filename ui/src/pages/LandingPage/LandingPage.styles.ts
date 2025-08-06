import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

export const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const Container = styled.div`
  background: #0a0a0a;
  color: #ffffff;
  width: 100%;
`;

export const Section = styled.section`
  padding: 6rem 2rem;
  position: relative;
  
  &:nth-child(even) {
    background: #111111;
  }
`;

export const MaxWidthContainer = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
`;

export const Navigation = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 2rem;
  background: rgba(10, 10, 10, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
`;

export const Nav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

export const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(45deg, #8b5cf6, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

export const NavLink = styled.button`
  background: none;
  border: none;
  color: #ffffff;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    color: #8b5cf6;
  }
  
  &:focus {
    outline: none;
  }
  
  &:focus-visible {
    outline: 2px solid #8b5cf6;
    outline-offset: 2px;
  }
`;

export const HeroSection = styled.section`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: 
    radial-gradient(circle at 30% 40%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 70% 20%, rgba(6, 182, 212, 0.12) 0%, transparent 50%),
    radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.08) 0%, transparent 50%);
  text-align: center;
  flex-direction: column;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      linear-gradient(135deg, transparent 0%, rgba(139, 92, 246, 0.03) 50%, transparent 100%),
      linear-gradient(45deg, transparent 0%, rgba(6, 182, 212, 0.02) 50%, transparent 100%);
    pointer-events: none;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      linear-gradient(45deg, transparent 48%, rgba(139, 92, 246, 0.05) 49%, rgba(139, 92, 246, 0.05) 51%, transparent 52%),
      linear-gradient(-45deg, transparent 48%, rgba(6, 182, 212, 0.04) 49%, rgba(6, 182, 212, 0.04) 51%, transparent 52%),
      radial-gradient(circle at 2px 2px, rgba(139, 92, 246, 0.08) 1px, transparent 1px);
    background-size: 120px 120px, 80px 80px, 40px 40px;
    background-position: 0 0, 40px 40px, 0 0;
    opacity: 0.3;
    pointer-events: none;
  }
`;

export const FloatingNodesContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.12;
  pointer-events: none;
  z-index: 1;
  
  @media (max-width: 1100px) {
    display: none;
  }
  
  .react-flow__background {
    background: transparent;
  }
  
  .react-flow__node {
    background: rgba(139, 92, 246, 0.3);
    border: 1px solid rgba(139, 92, 246, 0.5);
    border-radius: 8px;
    font-size: 11px;
    padding: 8px 12px;
    color: rgba(255, 255, 255, 0.7);
    font-weight: 500;
    box-shadow: 0 2px 10px rgba(139, 92, 246, 0.2);
    
    &:nth-child(even) {
      background: rgba(6, 182, 212, 0.3);
      border-color: rgba(6, 182, 212, 0.5);
      box-shadow: 0 2px 10px rgba(6, 182, 212, 0.2);
    }
  }
  
  .react-flow__edge-path {
    stroke: rgba(139, 92, 246, 0.4);
    stroke-width: 2;
  }
  
  .react-flow__edge:nth-child(even) .react-flow__edge-path {
    stroke: rgba(6, 182, 212, 0.4);
  }
  
  .react-flow__handle {
    width: 8px;
    height: 8px;
    background: rgba(139, 92, 246, 0.6);
    border: 2px solid rgba(255, 255, 255, 0.3);
  }
  
  .react-flow__attribution {
    display: none;
  }
`;

export const HeroTitle = styled.h1`
  font-size: clamp(3.5rem, 10vw, 7rem);
  font-weight: 900;
  margin-bottom: 2rem;
  background: linear-gradient(45deg, #ffffff, #8b5cf6, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${fadeInUp} 1s ease-out;
  line-height: 1.15;
  letter-spacing: -0.02em;
  text-shadow: 0 0 40px rgba(139, 92, 246, 0.1);
  padding-bottom: 0.1em;
  
  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
`;

export const HeroSubtitle = styled.p`
  font-size: clamp(1.3rem, 3.5vw, 1.6rem);
  color: #d1d5db;
  margin-bottom: 3.5rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  animation: ${fadeInUp} 1s ease-out 0.3s both;
  line-height: 1.7;
  font-weight: 400;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    margin-bottom: 2.5rem;
    font-size: 1.2rem;
  }
`;

export const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, #8b5cf6, #06b6d4);
  color: #ffffff;
  padding: 1.2rem 2.5rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  animation: ${fadeInUp} 1s ease-out 0.6s both;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  z-index: 1;
  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.6s ease;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 40px rgba(139, 92, 246, 0.4);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.3);
  }
  
  &:visited {
    color: #ffffff;
  }
`;

export const SecondaryButton = styled.button`
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  padding: 1.2rem 2.5rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: 1rem;
  backdrop-filter: blur(10px);
  animation: ${fadeInUp} 1s ease-out 0.7s both;
  
  &:hover {
    border-color: rgba(139, 92, 246, 0.5);
    background: rgba(139, 92, 246, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(139, 92, 246, 0.15);
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  @media (max-width: 640px) {
    margin-left: 0;
    margin-top: 1rem;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  
  @media (max-width: 640px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

export const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

export const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    border-color: rgba(139, 92, 246, 0.3);
    background: rgba(139, 92, 246, 0.1);
  }
`;

export const FeatureIcon = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  
  svg {
    width: 100%;
    height: 100%;
    stroke: #8b5cf6;
    stroke-width: 1.5;
    fill: none;
  }
`;

export const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #ffffff;
`;

export const FeatureDescription = styled.p`
  color: #a1a1aa;
  line-height: 1.6;
`;

export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  text-align: center;
`;

export const StatCard = styled.div`
  padding: 2rem;
`;

export const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(45deg, #8b5cf6, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
`;

export const StatLabel = styled.div`
  color: #a1a1aa;
  font-size: 1.1rem;
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

export const ContentText = styled.div`
  h2 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: #ffffff;
  }
  
  p {
    color: #a1a1aa;
    line-height: 1.8;
    margin-bottom: 1.5rem;
  }
`;

export const ContentImage = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  color: #a1a1aa;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CTASection = styled.section`
  background: radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.2) 0%, transparent 70%);
  text-align: center;
  padding: 5rem 2rem;
`;

export const CTATitle = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #ffffff;
`;

export const CTADescription = styled.p`
  font-size: 1.2rem;
  color: #a1a1aa;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

export const Footer = styled.footer`
  background: #000000;
  padding: 3rem 2rem 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
`;

export const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

export const FooterText = styled.p`
  color: #6b7280;
  margin-bottom: 1rem;
`;

export const FooterLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

export const FooterLink = styled.button`
  background: none;
  border: none;
  color: #a1a1aa;
  text-decoration: none;
  transition: color 0.3s ease;
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    color: #8b5cf6;
  }
`;

export const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  opacity: 0.7;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 1;
    transform: translateX(-50%) translateY(-2px);
  }
  
  span {
    color: #a1a1aa;
    font-size: 0.8rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 0.5rem;
  }
  
  .scroll-line {
    width: 1px;
    height: 40px;
    background: linear-gradient(to bottom, transparent, #8b5cf6, transparent);
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -3px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 3px solid transparent;
      border-right: 3px solid transparent;
      border-top: 6px solid #8b5cf6;
    }
  }
`;