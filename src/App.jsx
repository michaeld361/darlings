import { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════════
   DARLINGS — UNSPOKEN MASTERY
   Built with the conviction that luxury whispers.
   Every hex value, every cubic-bezier, every spacing token
   is drawn from the design system spec. Nothing is arbitrary.
   ═══════════════════════════════════════════════════════════════════ */

// ─── DESIGN TOKENS (from client legacy palette) ──────────────────
const C = {
  // Primitives — full luminance scales
  alabaster: {
    50: "#FFFFFF", 100: "#FDFDFD", 200: "#FAFAFA", 300: "#F6F6F6",
    400: "#F1F1F1", 500: "#EAEAEA", 600: "#DFDFDF", 700: "#CACACA",
    800: "#A8A8A8", 900: "#888888", 950: "#666666",
  },
  signatureRed: {
    50: "#FDF3F4", 100: "#FBE6E7", 200: "#F4C8CB", 300: "#EEAAAE",
    400: "#E46E74", 500: "#D82731", 600: "#C2232C", 700: "#A21D25",
    800: "#82171D", 900: "#6A1318", 950: "#3A0A0D",
  },
  petalPink: {
    50: "#FDF8F9", 100: "#FAEFF2", 200: "#F4DBE2", 300: "#EFB6C6",
    400: "#E793A8", 500: "#DC6683", 600: "#C84969", 700: "#A83852",
    800: "#8C3147", 900: "#752B3E", 950: "#451520",
  },
  editorialInk: {
    50: "#F5F5F5", 100: "#EBEBEB", 200: "#D6D6D6", 300: "#ADADAD",
    400: "#7A7A7A", 500: "#525252", 600: "#424242", 700: "#333333",
    800: "#242424", 900: "#171717", 950: "#000000",
  },
  // Semantic surfaces
  bg: "#F1F1F1",
  surface: "#FFFFFF",
  surfaceRaised: "#FDF8F9",
  surfaceSunken: "#EAEAEA",
  // Semantic text
  text: { primary: "#000000", secondary: "#333333", tertiary: "#7A7A7A", inverse: "#FFFFFF", link: "#D82731" },
  // Semantic borders
  border: { default: "#DFDFDF", strong: "#A8A8A8", subtle: "#F6F6F6" },
  // Semantic accents — petal pink for softness, signature red for brand
  accent: { default: "#EFB6C6", hover: "#DC6683", active: "#C84969" },
  brand: { default: "#D82731", hover: "#C2232C", active: "#A21D25", subtle: "#FBE6E7", text: "#FFFFFF" },
  // State overlays
  states: { hover: "rgba(0,0,0,0.04)", active: "rgba(0,0,0,0.08)", focus: "rgba(239,182,198,0.4)" },
};

const FONT = {
  heading: "'Cormorant Garamond', Garamond, Baskerville, Georgia, serif",
  body: "'Jost', 'Avenir Next', Montserrat, system-ui, sans-serif",
  // Northwell — brush script by Set Sail Studios; the exact face used for
  // "Alix" on the Darlings business card. Section eyebrows + preloader.
  hand: "'Northwell', 'Yellowtail', cursive",
  script: "'Northwell', cursive",
  headingFeatures: "'liga', 'kern', 'salt'",
};

// ─── BRAND PINK (from business-card script) ──────────────────────
const HAND_PINK = "#C84969"; // petalPink[600] — matches the card ink

const EASE = {
  default: "cubic-bezier(0.4, 0.0, 0.2, 1)",
  enter: "cubic-bezier(0.0, 0.0, 0.2, 1)",
  exit: "cubic-bezier(0.4, 0.0, 1, 1)",
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  threshold: "cubic-bezier(0.2, 0.8, 0.2, 1)",
};

const DUR = { instant: 100, fast: 200, normal: 350, slow: 500, slower: 700, threshold: 1400 };

// ─── CURATED IMAGERY ──────────────────────────────────────────────
const IMG = {
  // Hero — warm, moody bridal portrait with veil (editorial close-up)
  hero: "/photos/hero-bride-portrait.jpg",
  // Showcase — bride in lace gown looking down, veil, window light
  showcase: "/photos/bride-veil-window.jpg",
  // Artist portraits — Alix and Marine
  artist1: "/photos/Alix.jpg",
  artist2: "/photos/Marine.jpg",
  // Moment — brow detail, intimate artistry close-up
  detail: "/photos/brow-detail.jpg",
  // Portfolio — curated selection of their best work
  port1: "/photos/bridal-lip-closeup.jpg",       // Lip brush, silk PJs, warm light
  port2: "/photos/vintage-car-bride.jpg",         // Bride in vintage car, golden tones
  port3: "/photos/brow-detail.jpg",               // Intimate brow close-up
  port4: "/photos/estate-couple.jpg",             // Classic couple, lace dress, estate
  port5: "/photos/dior-palettes.jpg",             // Luxury product flat lay
  port6: "/photos/darlings-chair-session.jpg",    // Branded chair — instant credibility
  port7: "/photos/editorial-glam.jpg",            // Bold smoky eye, editorial range
  port8: "/photos/tiara-bride-reception.jpg",     // Joyful tiara bride at reception
  morning: "/photos/bridal-lip-closeup.jpg",      // For the immersive moment
  studio: "/photos/dior-palettes.jpg",            // Product beauty
  philosophy: "/photos/lace-bride-portrait.jpg",  // Lace gown, elegant pose
};

// ─── LOGO (sacred — from SVG source, brand red) ──────────────────
// Logo uses currentColor — inherits from its parent context
const DarlingsLogo = ({ width = 200, color = "currentColor", style = {} }) => (
  <svg viewBox="0 0 852 411" fill={color} style={{ width, height: "auto", display: "block", ...style }} aria-label="Darlings Make-Up">
    <g>
      <path d="M84.48,146.71l-.49-.74c-9.09,12.29-23.6,23.84-38.83,23.84-23.84,0-44.24-23.35-44.24-53.58,0-40.55,34.16-58.5,61.45-58.5,10.57,0,17.45,1.47,21.63,3.69,0,0,.49.49.49,0v-26.79c0-14.75-1.72-17.45-9.83-18.93l-8.11-1.47.25-.98L119.38.96v138.38c0,14.75,1.47,16.47,9.83,18.68l5.9,1.47-.25.98-50.63,9.58.25-23.35ZM84.48,143.02v-60.96c-6.64-12.29-17.21-21.88-23.6-21.88-14.75,0-21.88,21.38-21.88,47.68s10.32,43.75,26.55,43.75c8.6,0,13.76-3.93,18.93-8.6Z"/>
      <path d="M200.24,145.48l-.49-.49c-12.04,14.01-22.86,23.84-36.13,23.84-14.26,0-25.32-11.55-25.32-23.1,0-18.68,15.98-29.99,62.43-42.52l.25-9.09c.74-17.45-8.36-30.72-24.82-30.72-9.34,0-12.04,2.21-12.04,5.16,0,2.21,8.36,9.34,8.36,15.73,0,8.36-7.13,14.75-16.71,14.75-8.36,0-15.73-4.42-15.73-13.27,0-18.68,35.88-29,57.02-29,30.23,0,39.57,12.29,38.83,37.36l-1.97,44.73c-.49,9.83,4.18,14.26,9.59,14.26,3.93,0,7.62-4.42,10.32-8.36l1.72.74c-6.64,8.11-18.43,23.6-32.69,23.6-12.78,0-20.4-9.09-22.61-23.6ZM199.26,142.53l1.72-36.62c-21.14,5.65-28.76,13.76-28.76,26.79,0,9.83,4.67,16.96,14.01,16.96,5.41,0,9.34-3.2,13.03-7.13Z"/>
      <path d="M258.25,164.9l2.95-.25c7.62-.49,10.32-.98,10.32-3.93v-67.84c0-15.24-1.72-17.21-10.08-19.42l-5.65-1.23.25-.98,51.12-14.01-.74,38.83h.49c7.62-26.3,17.94-39.33,33.43-39.33,11.06,0,19.42,6.64,19.42,19.17,0,8.11-7.13,16.71-16.47,16.71-11.31,0-16.71-8.6-19.17-16.71-7.37.49-12.29,9.83-17.7,31.46v53.34c0,1.97,2.21,3.2,13.52,3.93l3.2.25.74,1.47h-66.36l.74-1.47Z"/>
      <path d="M361.73,164.9l3.2-.25c7.62-.49,8.85-.98,8.85-3.93V35.12c0-14.75-1.72-16.71-10.08-18.93l-5.41-1.47.25-.98,50.39-12.29v159.76c0,1.97,1.97,2.95,10.32,3.44l2.95.25.74,1.47h-62.18l.98-1.47Z"/>
      <path d="M431.78,164.9l2.95-.25c7.62-.49,10.32-.98,10.32-3.93v-67.84c0-15.24-1.72-17.21-10.08-19.42l-5.65-1.23.25-.98,50.39-14.01v103.97c0,1.97,1.47,2.21,12.78,3.44l1.97.25.74,1.47h-64.4l.74-1.47ZM440.62,24.06c0-10.08,7.62-20.15,20.89-20.15s20.89,10.08,20.89,20.15-7.37,20.15-20.89,20.15-20.89-10.32-20.89-20.15Z"/>
      <path d="M504.04,164.9l2.95-.25c7.62-.49,10.32-.98,10.32-3.93v-67.84c0-15.24-1.72-17.21-10.08-19.42l-5.65-1.23.25-.98,51.12-14.01-.74,22.12h.25c11.55-10.08,27.28-22.61,43.26-22.61,8.36,0,14.01,3.2,19.66,8.6,5.65,5.9,7.87,17.7,7.87,29.49v66.12c0,1.47,1.23,2.21,12.78,3.69l2.21.25.74,1.47h-63.66l.74-1.47,4.42-.25c8.6-.49,8.11-1.97,8.11-3.93v-62.43c0-15.98-8.11-20.89-18.93-20.89-8.11,0-12.78,2.46-17.45,5.16v78.65c0,1.97.98,2.7,9.59,3.44l3.69.25.49,1.47h-62.68l.74-1.47Z"/>
      <path d="M641.68,149.9c0-14.01,14.5-23.1,29.74-27.77-14.75-4.92-23.6-14.26-23.6-29.49,0-18.93,22.37-35.89,47.68-35.89,10.81,0,22.12,2.7,29.74,6.88l34.9-5.41-2.46,12.54-26.05-3.44-.25.49c7.62,6.14,11.55,14.26,11.55,23.1,0,19.17-20.89,34.16-48.17,34.16-7.13,0-13.52-.74-18.68-1.72-8.6,1.97-14.01,7.13-14.01,12.54s6.39,8.11,20.4,8.11c6.88,0,26.79-.74,35.64-.74,22.61,0,37.11,11.55,37.11,30.23,0,26.79-29.25,48.42-67.84,48.42-33.18,0-47.19-6.88-47.19-22.86,0-12.54,16.47-18.93,30.97-24.58-15.73-.49-29.5-12.54-29.5-24.58ZM734.59,191.94c0-14.26-10.57-18.19-33.43-18.93-6.15-.25-15.98.49-25.07,1.47-9.34,3.69-10.81,10.57-10.81,19.66,0,13.52,13.27,23.35,34.66,23.35s34.66-10.81,34.66-25.56ZM671.67,174.48v-.25l-.49.25h.49ZM710.25,91.41c0-20.65-5.16-31.71-14.99-31.71s-13.76,9.34-13.76,31.95,4.67,30.97,14.26,30.97c10.32,0,14.5-8.85,14.5-31.21Z"/>
      <path d="M766.54,163.18l-.74-30.97.98.49,6.64,10.08c10.08,16.71,16.96,24.82,32.44,24.82,11.55,0,18.68-6.88,18.68-17.94,0-12.04-12.04-16.96-25.56-22.61-18.43-7.37-32.94-14.75-32.94-33.92,0-22.12,17.45-36.13,42.77-36.13,8.11,0,17.7,1.97,24.09,4.18l11.31-2.21,1.23,33.67-.98.49-22.86-29.99c-3.93-2.21-8.11-3.93-13.27-3.93-10.57,0-17.21,6.64-17.21,17.7s12.29,15.98,26.3,21.63c15.48,6.88,33.67,13.76,33.67,34.66,0,18.43-13.52,36.62-45.96,36.62-15.49,0-29.5-3.2-38.59-6.64Z"/>
    </g>
    <g>
      <path d="M298.95,380.75c1.08-1.97,2.54-4.77,4.12-7.8,1.87-3.59,3.77-7.52,5.31-10.68-5.96,4.91-13.86,11.3-17.53,14.26l-4.03-2.1c.42-4.7,1-14.96,1.53-22.7-2.7,4.99-7.09,13.2-9.06,17l-.73,1.4-5.19-2.7c1.55-2.59,10.67-19.4,14.1-25.99l.89-1.72,5.91,3.08c-.23,2.97-.95,16.71-1.6,25.75,7.14-5.82,17.65-14.29,20-16.17l5.71,2.97c-1.85,3.55-5.88,11.86-9.29,18.5-2.41,4.73-4.35,8.74-4.79,9.68l-5.35-2.79Z"/>
      <path d="M348.61,399.29l-.46-8.25-11.48-3.55c-1.85,2.49-3.6,4.77-5,6.55l-5.8-1.8c.04-.13,19.34-23.83,21.35-26.36l5.29,1.64c.28,6.26,2.1,31.41,2.29,33.68l-6.19-1.92ZM347.89,386.11c-.25-4.36-.45-8.9-.6-12.67-2.3,3.01-5.01,6.6-7.65,10.11l8.25,2.55Z"/>
      <path d="M396.22,408.34c-3.38-5.07-8.09-12.76-10.51-16.12-.75,5.76-1.5,11.87-1.8,14.51l-6.29-.82c.28-1.42,1.28-9.13,2.26-16.63.8-6.16,1.59-12.18,1.86-14.6l6.25.81c-.39,2.67-1.25,8.87-2.01,14.71,3.37-2.87,10.3-9.41,14.32-13.11l6.74.88c-4.21,3.72-10.19,9.29-14.89,13.31,3.49,5.22,8.38,13.02,11.72,18.04l-7.63-.99Z"/>
      <path d="M446.86,382.83l-14.79.57c.05,2.38.11,5.13.22,7.92l12.77-.49.18,4.77-12.77.49v.22c.13,3.06.24,5.98.38,8.41l14.84-.57.2,5.08-21.13.82c.04-2.43-.24-10.93-.55-18.85-.19-4.99-.38-9.76-.53-12.63l21-.81.2,5.08Z"/>
      <path d="M467.41,396.45l-.85-4.56,21.41-4,.85,4.56-21.41,4Z"/>
      <path d="M509.38,385.69l-1.68-4.71c-3.67-10.3-4.14-11.62-5-13.75l5.81-2.07,1.32,3.69c.67,1.87,1.9,5.2,5.23,14.52.56,1.57,2.66,6.93,9.19,4.6,5.17-1.84,5.4-5.75,4.04-9.71-.68-1.91-1.64-4.72-2.68-7.65s-2.72-7.63-3.7-10.24l5.6-2c.42,1.19.91,2.69,1.56,4.51,1.18,3.31,2.68,7.79,4.73,13.65,2.82,8.03.72,13.55-7.79,16.59-12.25,4.37-15.51-4.36-16.61-7.45Z"/>
      <path d="M571.26,348.14c3.07,5.61.91,11.61-5.41,15.06l-4.11,2.25c2.35,4.3,4.36,7.88,5,8.96l-5.57,3.04c-3.34-6.38-5.68-10.85-8.25-15.55-1.96-3.59-4.03-7.28-6.83-12.12l9.91-5.42c6.08-3.32,12.18-1.84,15.24,3.77ZM563.04,358.99c3.2-1.75,4.27-4.85,2.67-7.77-1.64-3-4.83-3.77-7.99-2.04l-3.67,2.01c1.49,2.83,3.42,6.34,5.28,9.84l3.71-2.03Z"/>
    </g>
  </svg>
);

// ─── SMALL LOGO (wordmark only — for nav header) ─────────────────
const DarlingsLogoSmall = ({ width = 120, color = "currentColor", style = {} }) => (
  <svg viewBox="0 0 852 225" fill={color} style={{ width, height: "auto", display: "block", ...style }} aria-label="Darlings">
    <g>
      <path d="M84.48,146.71l-.49-.74c-9.09,12.29-23.6,23.84-38.83,23.84-23.84,0-44.24-23.35-44.24-53.58,0-40.55,34.16-58.5,61.45-58.5,10.57,0,17.45,1.47,21.63,3.69,0,0,.49.49.49,0v-26.79c0-14.75-1.72-17.45-9.83-18.93l-8.11-1.47.25-.98L119.38.96v138.38c0,14.75,1.47,16.47,9.83,18.68l5.9,1.47-.25.98-50.63,9.58.25-23.35ZM84.48,143.02v-60.96c-6.64-12.29-17.21-21.88-23.6-21.88-14.75,0-21.88,21.38-21.88,47.68s10.32,43.75,26.55,43.75c8.6,0,13.76-3.93,18.93-8.6Z"/>
      <path d="M200.24,145.48l-.49-.49c-12.04,14.01-22.86,23.84-36.13,23.84-14.26,0-25.32-11.55-25.32-23.1,0-18.68,15.98-29.99,62.43-42.52l.25-9.09c.74-17.45-8.36-30.72-24.82-30.72-9.34,0-12.04,2.21-12.04,5.16,0,2.21,8.36,9.34,8.36,15.73,0,8.36-7.13,14.75-16.71,14.75-8.36,0-15.73-4.42-15.73-13.27,0-18.68,35.88-29,57.02-29,30.23,0,39.57,12.29,38.83,37.36l-1.97,44.73c-.49,9.83,4.18,14.26,9.59,14.26,3.93,0,7.62-4.42,10.32-8.36l1.72.74c-6.64,8.11-18.43,23.6-32.69,23.6-12.78,0-20.4-9.09-22.61-23.6ZM199.26,142.53l1.72-36.62c-21.14,5.65-28.76,13.76-28.76,26.79,0,9.83,4.67,16.96,14.01,16.96,5.41,0,9.34-3.2,13.03-7.13Z"/>
      <path d="M258.25,164.9l2.95-.25c7.62-.49,10.32-.98,10.32-3.93v-67.84c0-15.24-1.72-17.21-10.08-19.42l-5.65-1.23.25-.98,51.12-14.01-.74,38.83h.49c7.62-26.3,17.94-39.33,33.43-39.33,11.06,0,19.42,6.64,19.42,19.17,0,8.11-7.13,16.71-16.47,16.71-11.31,0-16.71-8.6-19.17-16.71-7.37.49-12.29,9.83-17.7,31.46v53.34c0,1.97,2.21,3.2,13.52,3.93l3.2.25.74,1.47h-66.36l.74-1.47Z"/>
      <path d="M361.73,164.9l3.2-.25c7.62-.49,8.85-.98,8.85-3.93V35.12c0-14.75-1.72-16.71-10.08-18.93l-5.41-1.47.25-.98,50.39-12.29v159.76c0,1.97,1.97,2.95,10.32,3.44l2.95.25.74,1.47h-62.18l.98-1.47Z"/>
      <path d="M431.78,164.9l2.95-.25c7.62-.49,10.32-.98,10.32-3.93v-67.84c0-15.24-1.72-17.21-10.08-19.42l-5.65-1.23.25-.98,50.39-14.01v103.97c0,1.97,1.47,2.21,12.78,3.44l1.97.25.74,1.47h-64.4l.74-1.47ZM440.62,24.06c0-10.08,7.62-20.15,20.89-20.15s20.89,10.08,20.89,20.15-7.37,20.15-20.89,20.15-20.89-10.32-20.89-20.15Z"/>
      <path d="M504.04,164.9l2.95-.25c7.62-.49,10.32-.98,10.32-3.93v-67.84c0-15.24-1.72-17.21-10.08-19.42l-5.65-1.23.25-.98,51.12-14.01-.74,22.12h.25c11.55-10.08,27.28-22.61,43.26-22.61,8.36,0,14.01,3.2,19.66,8.6,5.65,5.9,7.87,17.7,7.87,29.49v66.12c0,1.47,1.23,2.21,12.78,3.69l2.21.25.74,1.47h-63.66l.74-1.47,4.42-.25c8.6-.49,8.11-1.97,8.11-3.93v-62.43c0-15.98-8.11-20.89-18.93-20.89-8.11,0-12.78,2.46-17.45,5.16v78.65c0,1.97.98,2.7,9.59,3.44l3.69.25.49,1.47h-62.68l.74-1.47Z"/>
      <path d="M641.68,149.9c0-14.01,14.5-23.1,29.74-27.77-14.75-4.92-23.6-14.26-23.6-29.49,0-18.93,22.37-35.89,47.68-35.89,10.81,0,22.12,2.7,29.74,6.88l34.9-5.41-2.46,12.54-26.05-3.44-.25.49c7.62,6.14,11.55,14.26,11.55,23.1,0,19.17-20.89,34.16-48.17,34.16-7.13,0-13.52-.74-18.68-1.72-8.6,1.97-14.01,7.13-14.01,12.54s6.39,8.11,20.4,8.11c6.88,0,26.79-.74,35.64-.74,22.61,0,37.11,11.55,37.11,30.23,0,26.79-29.25,48.42-67.84,48.42-33.18,0-47.19-6.88-47.19-22.86,0-12.54,16.47-18.93,30.97-24.58-15.73-.49-29.5-12.54-29.5-24.58ZM734.59,191.94c0-14.26-10.57-18.19-33.43-18.93-6.15-.25-15.98.49-25.07,1.47-9.34,3.69-10.81,10.57-10.81,19.66,0,13.52,13.27,23.35,34.66,23.35s34.66-10.81,34.66-25.56ZM671.67,174.48v-.25l-.49.25h.49ZM710.25,91.41c0-20.65-5.16-31.71-14.99-31.71s-13.76,9.34-13.76,31.95,4.67,30.97,14.26,30.97c10.32,0,14.5-8.85,14.5-31.21Z"/>
      <path d="M766.54,163.18l-.74-30.97.98.49,6.64,10.08c10.08,16.71,16.96,24.82,32.44,24.82,11.55,0,18.68-6.88,18.68-17.94,0-12.04-12.04-16.96-25.56-22.61-18.43-7.37-32.94-14.75-32.94-33.92,0-22.12,17.45-36.13,42.77-36.13,8.11,0,17.7,1.97,24.09,4.18l11.31-2.21,1.23,33.67-.98.49-22.86-29.99c-3.93-2.21-8.11-3.93-13.27-3.93-10.57,0-17.21,6.64-17.21,17.7s12.29,15.98,26.3,21.63c15.48,6.88,33.67,13.76,33.67,34.66,0,18.43-13.52,36.62-45.96,36.62-15.49,0-29.5-3.2-38.59-6.64Z"/>
    </g>
  </svg>
);

// ─── GLOBAL STYLES (injected once) ────────────────────────────────
const GlobalStyles = () => {
  useEffect(() => {
    const id = "darlings-globals";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

      /* Northwell Complete Family — Set Sail Studios, licensed via MyFonts.
         Three faces available: the default brush, a more flourished Alt, and
         a swashy Swash variant. Alt matches the 'A' on the business card. */
      @font-face {
        font-family: 'Northwell';
        src: url('/fonts/northwell/NorthwellRegular.woff2') format('woff2'),
             url('/fonts/northwell/NorthwellRegular.woff') format('woff');
        font-weight: 400;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: 'NorthwellAlt';
        src: url('/fonts/northwell/NorthwellAlt.woff2') format('woff2'),
             url('/fonts/northwell/NorthwellAlt.woff') format('woff');
        font-weight: 400;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: 'NorthwellSwash';
        src: url('/fonts/northwell/NorthwellSwash.woff2') format('woff2'),
             url('/fonts/northwell/NorthwellSwash.woff') format('woff');
        font-weight: 400;
        font-style: normal;
        font-display: swap;
      }

      *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

      html {
        font-size: 16px;
        scroll-behavior: smooth;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      /* Animated noise for The Breath */
      @keyframes grain-shift {
        0%   { transform: translate(0, 0); }
        33%  { transform: translate(-2px, 1px); }
        66%  { transform: translate(1px, -1px); }
        100% { transform: translate(0, 0); }
      }

      body {
        cursor: none;
        background: ${C.bg};
        color: ${C.text.primary};
        font-family: ${FONT.body};
        font-weight: 400;
        line-height: 1.65;
        letter-spacing: 0.01em;
        overflow-x: hidden;
      }

      ::selection {
        background: ${C.petalPink[200]};
        color: ${C.editorialInk[800]};
      }

      a { color: inherit; text-decoration: none; cursor: none; }
      button { cursor: none; border: none; background: none; font-family: inherit; }
      img { display: block; max-width: 100%; }
      *, *::before, *::after { cursor: none !important; }

      @media (pointer: coarse) {
        body, *, *::before, *::after { cursor: auto !important; }
      }
      input, textarea, select { font-family: inherit; }

      /* The Breath — signature vignette on images with organic grain */
      .breath::after {
        content: '';
        position: absolute;
        inset: -4px;
        pointer-events: none;
        background:
          radial-gradient(
            ellipse 80% 70% at 50% 50%,
            transparent 50%,
            ${C.petalPink[100]}12 70%,
            ${C.alabaster[300]}18 85%,
            ${C.alabaster[400]}22 100%
          );
      }
      .breath::before {
        content: '';
        position: absolute;
        inset: -4px;
        pointer-events: none;
        z-index: 1;
        opacity: 0.04;
        mix-blend-mode: multiply;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        background-size: 150px 150px;
        animation: grain-shift 4s steps(3) infinite;
      }

      /* Scroll reveal base */
      .reveal {
        opacity: 0;
        transform: translateY(24px);
        transition: opacity ${DUR.slower}ms ${EASE.enter},
                    transform ${DUR.slower}ms ${EASE.enter};
      }
      .reveal.visible {
        opacity: 1;
        transform: translateY(0);
      }

      /* Nav link hover */
      .nav-link {
        position: relative;
        font-family: ${FONT.body};
        font-size: 13px;
        font-weight: 400;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: ${C.text.secondary};
        transition: color ${DUR.normal}ms ${EASE.default};
        padding: 8px 0;
      }
      .nav-link::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0;
        height: 1px;
        background: ${C.brand.default};
        transition: width ${DUR.slow}ms ${EASE.default};
      }
      .nav-link:hover { color: ${C.text.primary}; }
      .nav-link:hover::after { width: 100%; }
      .nav-link.active { color: ${C.text.primary}; }
      .nav-link.active::after { width: 100%; }

      /* Smooth image load */
      .img-load {
        opacity: 0;
        transition: opacity ${DUR.slower}ms ${EASE.enter};
      }
      .img-load.loaded { opacity: 1; }

      /* Form inputs — enclosed anatomy */
      .form-input {
        width: 100%;
        padding: 14px 16px;
        border: 1px solid ${C.border.default};
        border-radius: 3px;
        background: ${C.surface};
        color: ${C.text.primary};
        font-family: ${FONT.body};
        font-size: 16px;
        font-weight: 400;
        letter-spacing: 0.01em;
        outline: none;
        transition: border-color ${DUR.normal}ms ${EASE.default},
                    box-shadow ${DUR.normal}ms ${EASE.default};
      }
      .form-input:focus {
        border-color: ${C.accent.default};
        box-shadow: 0 0 0 4px ${C.states.focus};
      }
      .form-input::placeholder {
        color: ${C.text.tertiary};
        font-weight: 400;
      }

      /* Scrollbar */
      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: ${C.alabaster[200]}; }
      ::-webkit-scrollbar-thumb { background: ${C.alabaster[700]}; border-radius: 3px; }

      /* Portfolio hover — quiet, classy */
      .port-item { transition: opacity ${DUR.slow}ms ${EASE.default}; will-change: opacity; }
      .port-grid:hover .port-item { opacity: 0.75; }
      .port-grid:hover .port-item:hover { opacity: 1; }
      .port-parallax { will-change: transform; }

      /* Hero fade-in */
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @media (max-width: 1024px) {
        .grid-services { grid-template-columns: 1fr 1fr !important; }
        .grid-about { grid-template-columns: 1fr !important; gap: 48px !important; }
        .grid-philosophy { grid-template-columns: 1fr !important; gap: 40px !important; }
        .grid-contact { grid-template-columns: 1fr !important; gap: 48px !important; }
        .grid-footer { grid-template-columns: 1fr 1fr !important; gap: 40px !important; }
      }

      @media (max-width: 768px) {
        .hide-mobile { display: none !important; }
        .mobile-menu-btn { display: flex !important; }
        .port-grid { grid-template-columns: 1fr 1fr !important; }
        .port-grid > * { grid-column: auto !important; }
        .grid-services { grid-template-columns: 1fr !important; }
        .grid-about { grid-template-columns: 1fr !important; gap: 40px !important; }
        .grid-philosophy { grid-template-columns: 1fr !important; gap: 32px !important; }
        .grid-contact { grid-template-columns: 1fr !important; gap: 40px !important; }
        .grid-footer { grid-template-columns: 1fr 1fr !important; }
        .grid-footer > div:first-child,
        .grid-footer > div:last-child { grid-column: 1 / -1; }
        .form-grid { grid-template-columns: 1fr !important; }
        .grid-footer { gap: 32px !important; }
        h1 { font-size: clamp(18px, 5vw, 24px) !important; }
        section[id], section.grid-philosophy { padding-top: 56px !important; padding-bottom: 56px !important; }
      }

      @media (max-width: 480px) {
        .port-grid { grid-template-columns: 1fr !important; }
        section[id], section.grid-philosophy { padding-left: 24px !important; padding-right: 24px !important; padding-top: 40px !important; padding-bottom: 40px !important; }
        footer { padding-left: 24px !important; padding-right: 24px !important; }
      }
    `;
    document.head.appendChild(style);
    return () => { const el = document.getElementById(id); if (el) el.remove(); };
  }, []);
  return null;
};

// ─── HOOKS ────────────────────────────────────────────────────────
const useReveal = (threshold = 0.15) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
};

// Module-level cache so multiple components share a single font load.
let _northwellFontPromise = null;
const loadNorthwell = () => {
  if (!_northwellFontPromise) {
    _northwellFontPromise = import("opentype.js").then((mod) => {
      const opentype = mod.default ?? mod;
      return new Promise((resolve, reject) => {
        opentype.load("/fonts/northwell/NorthwellRegular.woff", (err, f) => {
          if (err) reject(err); else resolve(f);
        });
      });
    });
  }
  return _northwellFontPromise;
};

// Parse a multi-line string into centered per-glyph SVG paths + a snug
// viewBox. Used by both the Preloader (animated draw) and the Hero
// (static fill), so both show the identical handwritten phrase.
const useNorthwellGlyphs = (text, fontSize = 260, padding = 12) => {
  const [glyphs, setGlyphs] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const font = await loadNorthwell();
        if (cancelled) return;

        const lines = text.split("\n");
        const lineGap = fontSize * 1.08;
        const scale = fontSize / font.unitsPerEm;

        // Pass 1 — measure each line's advance width so we can center them.
        const lineGlyphsByLine = lines.map((l) => font.stringToGlyphs(l));
        const lineWidths = lineGlyphsByLine.map((lg) => {
          let w = 0;
          for (let i = 0; i < lg.length; i++) {
            w += lg[i].advanceWidth * scale;
            if (i < lg.length - 1) {
              w += (font.getKerningValue(lg[i], lg[i + 1]) || 0) * scale;
            }
          }
          return w;
        });
        const maxLineWidth = Math.max(...lineWidths);

        // Pass 2 — emit one path per glyph, centered per line.
        const paths = [];
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;

        lineGlyphsByLine.forEach((lg, lineIdx) => {
          const y = lineIdx * lineGap;
          const offsetX = (maxLineWidth - lineWidths[lineIdx]) / 2;
          let x = offsetX;
          for (let i = 0; i < lg.length; i++) {
            const glyph = lg[i];
            const p = glyph.getPath(x, y, fontSize);
            const d = p.toPathData(3);
            if (d) {
              paths.push(d);
              const bb = p.getBoundingBox();
              if (isFinite(bb.x1) && isFinite(bb.y1)) {
                minX = Math.min(minX, bb.x1);
                maxX = Math.max(maxX, bb.x2);
                minY = Math.min(minY, bb.y1);
                maxY = Math.max(maxY, bb.y2);
              }
            }
            let advance = glyph.advanceWidth * scale;
            if (i < lg.length - 1) {
              advance += (font.getKerningValue(glyph, lg[i + 1]) || 0) * scale;
            }
            x += advance;
          }
        });

        const viewBox = `${minX - padding} ${minY - padding} ${(maxX - minX) + padding * 2} ${(maxY - minY) + padding * 2}`;
        setGlyphs({ paths, viewBox });
      } catch (e) {
        console.warn("Northwell glyph extraction failed", e);
        setGlyphs({ paths: [], viewBox: "0 0 100 10" });
      }
    })();
    return () => { cancelled = true; };
  }, [text, fontSize, padding]);

  return glyphs;
};

// The phrase shared by the preloader and the hero — define it once so
// both surfaces always stay in sync.
const HERO_SCRIPT_TEXT = "You look beautiful,\ndarling!";

// ─── PRELOADER — The business card, come to life ─────────────────
// Pale-pink card ground, handwritten message drawn in Northwell.
// opentype.js pulls each glyph out as its own SVG path, and GSAP
// staggers stroke-dashoffset so the letters appear one at a time —
// the pen tracing "You look beautiful, darling!" into view.
const Preloader = ({ onComplete }) => {
  const wrapRef = useRef(null);
  const scriptWrapRef = useRef(null);
  const strokeRefs = useRef([]);
  const fillRefs = useRef([]);
  const glyphs = useNorthwellGlyphs(HERO_SCRIPT_TEXT, 260, 12);

  useLayoutEffect(() => {
    if (!glyphs) return;
    const strokes = strokeRefs.current.slice(0, glyphs.paths.length).filter(Boolean);
    const fills = fillRefs.current.slice(0, glyphs.paths.length).filter(Boolean);
    const scriptWrap = scriptWrapRef.current;
    const wrap = wrapRef.current;
    if (!scriptWrap || !wrap) return;

    // Initial state — every stroke and fill hidden. Strokes stay at
    // opacity 0 until their letter's turn, which prevents the outline
    // from briefly flashing before the dasharray animation begins.
    strokes.forEach((stroke, i) => {
      const length = stroke.getTotalLength();
      gsap.set(stroke, { strokeDasharray: length, strokeDashoffset: length, opacity: 0 });
      if (fills[i]) gsap.set(fills[i], { opacity: 0 });
    });
    gsap.set(scriptWrap, { opacity: 0, y: 8 });

    const tl = gsap.timeline({ onComplete });

    // 1. Stage fades in — blank card, pen ready.
    tl.to(scriptWrap, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0);

    // 2. Letters draw one at a time — pen tracing each glyph, ink
    //    settling in partway through so the next letter starts while
    //    the previous is still inking.
    const DRAW = 0.42;
    const STAGGER = 0.11;
    const FILL_IN = DRAW * 0.55;
    const START = 0.35;

    strokes.forEach((stroke, i) => {
      const at = START + i * STAGGER;
      // Snap the stroke visible exactly when its draw starts — the
      // dasharray/offset are already in place from the initial set,
      // so the path is hidden at the instant it becomes opacity 1.
      tl.set(stroke, { opacity: 1 }, at);
      tl.to(stroke, { strokeDashoffset: 0, duration: DRAW, ease: "power1.inOut" }, at);
      if (fills[i]) {
        tl.to(fills[i], { opacity: 1, duration: DRAW - FILL_IN + 0.15, ease: "power2.out" }, at + FILL_IN);
      }
      tl.to(stroke, { opacity: 0, duration: DRAW - FILL_IN + 0.15, ease: "power2.out" }, at + FILL_IN);
    });

    // 3. Hold the finished writing, then fade and lift the curtain.
    const writingEnd = START + (Math.max(strokes.length - 1, 0)) * STAGGER + DRAW;
    tl.to({}, { duration: 0.9 }, writingEnd + 0.3);
    tl.to(scriptWrap, { opacity: 0, duration: 0.5, ease: "power2.in" });
    tl.to(wrap, { yPercent: -100, duration: 1.2, ease: "expo.inOut" });

    return () => tl.kill();
  }, [glyphs, onComplete]);

  // Card palette, matched to the printed business card.
  const GROUND = "#FCD6E3";            // card stock — pale pink
  const SCRIPT_INK = C.petalPink[500]; // #DC6683 — the writing is the message

  return (
    <div ref={wrapRef} style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: GROUND,
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden",
    }}>
      {/* Handwritten message — each letter drawn along its own glyph path */}
      <div
        ref={scriptWrapRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          // Scale with the viewport — no upper cap so the writing fills
          // the panel at every breakpoint, from phone to ultrawide.
          width: "96vw",
          transform: "rotate(-7deg)",
          pointerEvents: "none",
          opacity: 0,
        }}
      >
        {glyphs && glyphs.paths.length > 0 && (
          <svg
            viewBox={glyphs.viewBox}
            preserveAspectRatio="xMidYMid meet"
            style={{ width: "100%", height: "auto", overflow: "visible", display: "block" }}
          >
            {glyphs.paths.map((d, i) => (
              <path
                key={`stroke-${i}`}
                ref={(el) => { strokeRefs.current[i] = el; }}
                d={d}
                fill="none"
                stroke={SCRIPT_INK}
                strokeWidth={2.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                opacity={0}
              />
            ))}
            {glyphs.paths.map((d, i) => (
              <path
                key={`fill-${i}`}
                ref={(el) => { fillRefs.current[i] = el; }}
                d={d}
                fill={SCRIPT_INK}
                opacity={0}
              />
            ))}
          </svg>
        )}
      </div>
    </div>
  );
};

// ─── CUSTOM CURSOR — Tactile intimacy ─────────────────────────────
const CustomCursor = () => {
  const dotRef = useRef(null);
  const textRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const size = useRef(4);
  const targetSize = useRef(4);
  const cursorText = useRef("");
  const isTouch = useRef(false);

  useEffect(() => {
    // Skip on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) {
      isTouch.current = true;
      return;
    }

    const onMove = (e) => { target.current = { x: e.clientX, y: e.clientY }; };
    const onEnterBtn = () => { targetSize.current = 0; };
    const onLeaveBtn = () => { targetSize.current = 4; };

    window.addEventListener("mousemove", onMove, { passive: true });

    // Observe DOM for data-cursor elements
    const attachListeners = () => {
      document.querySelectorAll('[data-cursor="magnetic"]').forEach((el) => {
        el.removeEventListener("mouseenter", onEnterBtn);
        el.removeEventListener("mouseleave", onLeaveBtn);
        el.addEventListener("mouseenter", onEnterBtn);
        el.addEventListener("mouseleave", onLeaveBtn);
      });
    };
    // Re-attach after DOM settles
    const timer = setTimeout(attachListeners, 2000);
    const interval = setInterval(attachListeners, 4000);

    let raf;
    const lerp = (a, b, f) => a + (b - a) * f;
    const loop = () => {
      pos.current.x = lerp(pos.current.x, target.current.x, 0.15);
      pos.current.y = lerp(pos.current.y, target.current.y, 0.15);
      size.current = lerp(size.current, targetSize.current, 0.12);
      const d = dotRef.current;
      if (d) {
        d.style.transform = `translate(${pos.current.x - size.current / 2}px, ${pos.current.y - size.current / 2}px)`;
        d.style.width = `${size.current}px`;
        d.style.height = `${size.current}px`;
        d.style.opacity = size.current < 1 ? "0" : "1";
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  // Don't render on touch devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return null;

  return (
    <>
      <div ref={dotRef} style={{
        position: "fixed", top: 0, left: 0, zIndex: 10000,
        width: 4, height: 4, borderRadius: "50%",
        background: C.brand.default,
        pointerEvents: "none",
        transition: "opacity 0.3s",
      }} />
    </>
  );
};

// ─── FILM GRAIN — Global living texture ───────────────────────────
const FilmGrain = () => (
  <div style={{
    position: "fixed", inset: 0, zIndex: 9998,
    pointerEvents: "none",
    opacity: 0.02,
    mixBlendMode: "multiply",
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
    backgroundSize: "150px 150px",
    animation: "grain-shift 4s steps(3) infinite",
  }} />
);

// ─── MORNING MOTES — 6am dust in sunlight ─────────────────────────
// Large, blurred, warm-pearl orbs drifting through the viewport
// like dust catching early light. Reacts subtly to mouse movement.
const MorningMotes = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h, raf;
    const mouse = { x: 0.5, y: 0.5 };

    // Mote colours — pearl, champagne, rose, warm cream
    const palette = [
      [255, 245, 235],  // warm cream
      [250, 242, 245],  // pearl blush
      [248, 235, 240],  // rose mist
      [255, 248, 230],  // morning gold
    ];

    const NUM = 3;
    const motes = Array.from({ length: NUM }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 100 + Math.random() * 200, // very large, very soft
      vx: (Math.random() - 0.5) * 0.00015,
      vy: -0.00003 - Math.random() * 0.00015,
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 0.8,
      color: palette[Math.floor(Math.random() * palette.length)],
      alpha: 0.12 + Math.random() * 0.06, // 12% to 18% opacity
    }));

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e) => {
      mouse.x = e.clientX / w;
      mouse.y = e.clientY / h;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        const time = t * 0.001 * m.speed;
        // Gentle floating drift — like light through a window
        const mx = (mouse.x - 0.5) * m.r * 0.15;
        const my = (mouse.y - 0.5) * m.r * 0.1;
        const px = m.x * w + Math.sin(time + m.phase) * 60 + Math.cos(time * 0.4 + m.phase * 2) * 30 + mx;
        const py = m.y * h + Math.cos(time * 0.6 + m.phase) * 40 + Math.sin(time * 0.3 + m.phase * 1.5) * 25 + my;
        // Wrap vertically
        m.x += m.vx;
        m.y += m.vy;
        if (m.y < -0.15) { m.y = 1.15; m.x = Math.random(); }
        if (m.x < -0.1) m.x = 1.1;
        if (m.x > 1.1) m.x = -0.1;

        const [r, g, b] = m.color;
        const grad = ctx.createRadialGradient(px, py, 0, px, py, m.r);
        grad.addColorStop(0, `rgba(${r},${g},${b},${m.alpha})`);
        grad.addColorStop(0.5, `rgba(${r},${g},${b},${m.alpha * 0.4})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: "absolute", inset: 0, zIndex: 4,
      pointerEvents: "none",
    }} />
  );
};

// ─── PEEL IMAGE — Scroll-triggered cinematic reveal ───────────────
const PeelImage = ({ src, alt, aspect = "3/4", style = {}, imgStyle = {} }) => {
  const wrapRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img) return;

    gsap.set(wrap, { clipPath: "inset(100% 0 0 0)" });
    gsap.set(img, { scale: 1.2 });

    const trigger = ScrollTrigger.create({
      trigger: wrap,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(wrap, { clipPath: "inset(0% 0 0 0)", duration: 1.2, ease: "expo.out" });
        gsap.to(img, { scale: 1, duration: 1.6, ease: "expo.out" });
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <div ref={wrapRef} className="breath" style={{
      position: "relative", overflow: "hidden",
      aspectRatio: aspect, ...style,
    }}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="lazy"
        style={{
          width: "100%", height: "100%",
          objectFit: "cover",
          transformOrigin: "center center",
          ...imgStyle,
        }}
      />
    </div>
  );
};

const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? window.scrollY / h : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return progress;
};

// ─── IMAGE WITH LAZY LOAD ─────────────────────────────────────────
const LazyImage = ({ src, alt, style = {}, className = "" }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      <img
        src={src}
        alt={alt}
        className={`img-load ${loaded ? "loaded" : ""} ${className}`}
        onLoad={() => setLoaded(true)}
        loading="lazy"
        style={{ width: "100%", height: "100%", objectFit: "cover", ...style }}
      />
      {/* Subtle film grain overlay — luxury analog texture */}
      <div style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        opacity: 0.08,
        mixBlendMode: "multiply",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundSize: "128px 128px",
      }} />
      {/* Warm vignette for depth */}
      <div style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        background: "radial-gradient(ellipse at center, transparent 50%, rgba(45,35,25,0.12) 100%)",
      }} />
    </div>
  );
};

// ─── SECTION WRAPPER WITH REVEAL ──────────────────────────────────
const Section = ({ children, style = {}, id, delay = 0, className = "" }) => {
  const [ref, visible] = useReveal(0.1);
  return (
    <section
      ref={ref}
      id={id}
      className={`reveal ${visible ? "visible" : ""} ${className}`}
      style={{
        ...style,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </section>
  );
};

// ─── MAGNETIC BUTTON — True physical attraction ──────────────────
const MagneticButton = ({ children, onClick, style = {}, ...props }) => {
  const btnRef = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn || window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      gsap.to(btn, { x: dx * 0.3, y: dy * 0.3, duration: 0.4, ease: "power2.out" });
      if (innerRef.current) {
        gsap.to(innerRef.current, { x: dx * 0.1, y: dy * 0.1, duration: 0.4, ease: "power2.out" });
      }
    };
    const onLeave = () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
      if (innerRef.current) {
        gsap.to(innerRef.current, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
      }
    };
    btn.addEventListener("mousemove", onMove);
    btn.addEventListener("mouseleave", onLeave);
    return () => {
      btn.removeEventListener("mousemove", onMove);
      btn.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <button ref={btnRef} onClick={onClick} data-cursor="magnetic" style={{ ...style, willChange: "transform" }} {...props}>
      <span ref={innerRef} style={{ display: "inline-block", pointerEvents: "none" }}>{children}</span>
    </button>
  );
};

// ═══════════════════════════════════════════════════════════════════
// NAVIGATION — Minimal, floating, smart-scroll hide/show
// ═══════════════════════════════════════════════════════════════════
const Navigation = ({ activeSection }) => {
  const [pastHero, setPastHero] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    let lastY = 0;
    let navHidden = false;
    const onScroll = () => {
      const y = window.scrollY;
      const threshold = window.innerHeight * 0.7;
      setPastHero(y > threshold);

      // Smart-scroll: hide on down, show on up
      if (y > threshold) {
        const delta = y - lastY;
        if (delta > 5 && !navHidden) {
          navHidden = true;
          if (navRef.current) gsap.to(navRef.current, { y: "-100%", duration: 0.4, ease: "power2.inOut" });
        } else if (delta < -3 && navHidden) {
          navHidden = false;
          if (navRef.current) gsap.to(navRef.current, { y: "0%", duration: 0.4, ease: "power2.out" });
        }
      } else {
        if (navHidden) {
          navHidden = false;
          if (navRef.current) gsap.to(navRef.current, { y: "0%", duration: 0.4, ease: "power2.out" });
        }
      }
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { id: "experience", label: "The Experience" },
    { id: "portfolio", label: "Portfolio" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ];

  const scrollTo = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const leftLinks = links.slice(0, 2);
  const rightLinks = links.slice(2);

  const linkStyle = (l) => ({
    fontFamily: FONT.body,
    fontSize: 11,
    fontWeight: 400,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: pastHero ? C.text.secondary : "rgba(255,255,255,0.8)",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px 0",
    borderBottom: activeSection === l.id
      ? `1px solid ${pastHero ? C.text.primary : "rgba(255,255,255,0.8)"}`
      : "1px solid transparent",
    transition: `all ${DUR.slow}ms ${EASE.default}`,
  });

  return (
    <nav ref={navRef} style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      padding: pastHero ? "28px 48px" : "40px 48px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: pastHero ? `${C.bg}f0` : "transparent",
      backdropFilter: pastHero ? "blur(20px)" : "none",
      borderBottom: pastHero ? `1px solid ${C.border.subtle}` : "1px solid transparent",
      transition: `padding ${DUR.slow}ms ${EASE.default}, background ${DUR.slow}ms ${EASE.default}, backdrop-filter ${DUR.slow}ms ${EASE.default}, border-bottom ${DUR.slow}ms ${EASE.default}`,
      willChange: "transform",
    }}>
      {/* Left links */}
      <div className="hide-mobile" style={{
        display: "flex",
        gap: 40,
        alignItems: "center",
        flex: 1,
        justifyContent: "flex-end",
        paddingRight: 48,
      }}>
        {leftLinks.map((l) => (
          <button
            key={l.id}
            style={linkStyle(l)}
            onClick={() => scrollTo(l.id)}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* Centred logo */}
      <div
        style={{
          cursor: "pointer",
          opacity: pastHero ? 1 : 0,
          transform: pastHero ? "none" : "translateY(-4px)",
          transition: `all ${DUR.slow}ms ${EASE.default}`,
          pointerEvents: pastHero ? "auto" : "none",
          flexShrink: 0,
        }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <DarlingsLogoSmall width={120} color={HAND_PINK} />
      </div>

      {/* Right links */}
      <div className="hide-mobile" style={{
        display: "flex",
        gap: 40,
        alignItems: "center",
        flex: 1,
        justifyContent: "flex-start",
        paddingLeft: 48,
      }}>
        {rightLinks.map((l) => (
          <button
            key={l.id}
            style={linkStyle(l)}
            onClick={() => scrollTo(l.id)}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* Mobile menu button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
        style={{
          display: "none",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
          padding: 12,
          position: "absolute",
          right: 20,
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          cursor: "pointer",
          zIndex: 101,
        }}
        className="mobile-menu-btn"
      >
        <span style={{
          display: "block",
          width: 22, height: 1.5, background: pastHero ? HAND_PINK : "#fff",
          transform: menuOpen ? "rotate(45deg) translateY(4.5px)" : "none",
          transition: `transform ${DUR.normal}ms ${EASE.default}, background ${DUR.slow}ms ${EASE.default}`,
        }} />
        <span style={{
          display: "block",
          width: 22, height: 1.5, background: pastHero ? HAND_PINK : "#fff",
          opacity: menuOpen ? 0 : 1,
          transition: `opacity ${DUR.fast}ms, background ${DUR.slow}ms ${EASE.default}`,
        }} />
        <span style={{
          display: "block",
          width: 22, height: 1.5, background: pastHero ? HAND_PINK : "#fff",
          transform: menuOpen ? "rotate(-45deg) translateY(-4.5px)" : "none",
          transition: `transform ${DUR.normal}ms ${EASE.default}, background ${DUR.slow}ms ${EASE.default}`,
        }} />
      </button>

      {/* Mobile overlay */}
      {menuOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "#F1F1F1",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
          zIndex: 99999,
          overflow: "hidden",
        }}>
          {/* Close button */}
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            style={{
              position: "absolute",
              top: 28,
              right: 20,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 12,
              outline: "none",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" stroke={C.text.primary} strokeWidth="1.5" strokeLinecap="round">
              <line x1="2" y1="2" x2="18" y2="18" />
              <line x1="18" y1="2" x2="2" y2="18" />
            </svg>
          </button>
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => { scrollTo(l.id); setMenuOpen(false); }}
              style={{
                fontFamily: FONT.heading,
                fontSize: 28,
                fontWeight: 400,
                color: C.text.primary,
                letterSpacing: "-0.01em",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px 0",
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

// ─── HERO TAGLINE — Lens-focus entrance ──────────────────────────
const HeroTagline = ({ loaded }) => {
  const tagRef = useRef(null);

  useEffect(() => {
    if (!loaded || !tagRef.current) return;
    gsap.fromTo(tagRef.current, {
      letterSpacing: "0.3em",
      filter: "blur(8px)",
      opacity: 0,
    }, {
      letterSpacing: "-0.02em",
      filter: "blur(0px)",
      opacity: 1,
      duration: 1.2,
      delay: 0.9,
      ease: "power3.out",
    });
  }, [loaded]);

  return (
    <h1 ref={tagRef} style={{
      position: "relative",
      zIndex: 3,
      fontFamily: FONT.heading,
      fontFeatureSettings: FONT.headingFeatures,
      fontSize: "clamp(18px, 2.4vw, 28px)",
      fontWeight: 400,
      fontStyle: "italic",
      lineHeight: 1.1,
      letterSpacing: "0.3em",
      color: "rgba(255,255,255,0.85)",
      textAlign: "center",
      maxWidth: 480,
      opacity: 0,
      filter: "blur(8px)",
    }}>
      The beauty you already carry, revealed
    </h1>
  );
};

// ═══════════════════════════════════════════════════════════════════
// HERO — Typographic. No banner. The logo IS the hero.
// Like walking into that 7am room.
// ═══════════════════════════════════════════════════════════════════
const Hero = () => {
  const [loaded, setLoaded] = useState(false);
  const [imgReady, setImgReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="home" style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      background: C.editorialInk[900],
    }}>
      {/* Full-bleed hero photograph — exhale entrance */}
      <img
        src={IMG.hero}
        alt="Darlings makeup artistry"
        onLoad={() => setImgReady(true)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 30%",
          opacity: imgReady ? 1 : 0,
          transform: imgReady ? "scale(1)" : "scale(1.05)",
          transition: `opacity 1800ms ${EASE.enter}, transform 2400ms ${EASE.exit}`,
          filter: "brightness(1.12) contrast(0.98) saturate(1.02)",
        }}
      />

      {/* Film grain on hero image */}
      <div style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        opacity: 0.06,
        mixBlendMode: "multiply",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundSize: "128px 128px",
        zIndex: 1,
      }} />

      {/* Soft light wash — lifts the image so the pink logo reads cleanly */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: `
          radial-gradient(ellipse at center, rgba(255,248,240,0.28) 0%, rgba(255,248,240,0.08) 60%, transparent 100%),
          linear-gradient(to bottom, rgba(255,248,240,0.1) 0%, transparent 40%, transparent 70%, rgba(42,37,33,0.08) 100%)
        `,
        zIndex: 2,
        pointerEvents: "none",
      }} />

      {/* Morning dust motes — subtle warmth */}
      <MorningMotes />

      {/* Logo — centred over the image, appears first */}
      <div style={{
        position: "relative",
        zIndex: 3,
        opacity: loaded ? 1 : 0,
        transform: loaded ? "none" : "translateY(8px)",
        transition: `all 1200ms ${EASE.enter} 400ms`,
        marginBottom: 40,
      }}>
        <DarlingsLogo width={340} color={HAND_PINK} />
      </div>

      {/* Minimal scroll indicator */}
      <div style={{
        position: "absolute",
        bottom: 48,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        opacity: loaded ? 0.85 : 0,
        transition: `opacity 1800ms ${EASE.enter} 3000ms`,
        zIndex: 3,
      }}>
        <span style={{
          fontFamily: FONT.body,
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.9)",
          textShadow: "0 1px 4px rgba(0,0,0,0.3)",
        }}>
          Scroll
        </span>
        <div style={{
          width: 1,
          height: 36,
          background: "linear-gradient(to bottom, rgba(255,255,255,0.7), transparent)",
        }} />
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════
// PHILOSOPHY — Asymmetric break. Whitespace IS the statement.
// ═══════════════════════════════════════════════════════════════════
const Philosophy = () => {
  const [ref, vis] = useReveal(0.15);

  return (
    <section
      ref={ref}
      className="grid-philosophy"
      style={{
        padding: "140px 48px 40px",
        maxWidth: 1280,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 64,
        alignItems: "start",
      }}
    >
      {/* Left: Body copy */}
      <div style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : "translateY(20px)",
        transition: `all ${DUR.slower}ms ${EASE.enter}`,
      }}>
        <span style={{
          fontFamily: FONT.hand,
          fontSize: "clamp(58px, 11.7vw, 135px)",
          fontWeight: 400,
          lineHeight: 1,
          color: HAND_PINK,
          display: "block",
          marginBottom: 20,
        }}>
          Philosophy
        </span>
        <p style={{
          fontFamily: FONT.heading,
          fontSize: "clamp(24px, 3.2vw, 39px)",
          fontWeight: 400,
          lineHeight: 1.3,
          letterSpacing: "-0.01em",
          color: C.text.primary,
          maxWidth: "20ch",
          marginBottom: 48,
        }}>
          A sanctuary of calm before the world rushes in.
        </p>
        <p style={{
          fontFamily: FONT.body,
          fontSize: 16,
          fontWeight: 400,
          lineHeight: 1.75,
          color: C.text.secondary,
          maxWidth: "48ch",
          marginBottom: 24,
        }}>
          Behind Darlings are Alix and Marine. Our philosophy is simple: we believe in the power
          of an intimate, quiet moment before the world rushes in. We bring a decade of
          combined expertise to your day, but more importantly, we bring a sanctuary of calm.
        </p>
        <p style={{
          fontFamily: FONT.body,
          fontSize: 16,
          fontWeight: 400,
          lineHeight: 1.75,
          color: C.text.secondary,
          maxWidth: "48ch",
          marginBottom: 32,
        }}>
          Whether it is a bridal morning, a private lesson, or an evening gala, our mission
          is to ensure you feel utterly indulged and entirely yourself.
        </p>
        <span style={{
          fontFamily: FONT.body,
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: C.text.tertiary,
          padding: "10px 20px",
          border: `1px solid ${C.border.default}`,
          borderRadius: 9999,
          display: "inline-block",
        }}>
          Est. 2019
        </span>
      </div>

      {/* Right: Hero image */}
      <div style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : "translateY(20px)",
        transition: `all ${DUR.slower}ms ${EASE.enter} 200ms`,
      }}>
        <PeelImage
          src={IMG.philosophy}
          alt="Bride in lace gown by window"
          aspect="3/4"
          style={{ objectPosition: "top", filter: "brightness(0.95) saturate(0.92)" }}
        />
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════
// SERVICES — Three services. Not cards. Editorial text layout.
// ═══════════════════════════════════════════════════════════════════
const Services = () => {
  const services = [
    {
      title: "Bridal & Wedding",
      desc: "A morning of absolute calm. Relinquish the details and trust our artistry. From the first consultation to the final touch-up, we craft a luminous bridal look that honours your natural grace, ensuring you and your loved ones radiate confidence.",
    },
    {
      title: "Private Appointments",
      desc: "Bespoke artistry for your most important occasions. Whether it is a gala or an intimate celebration, we design a luminous, enduring look tailored entirely to your features and your style.",
    },
    {
      title: "Workshops & Courses",
      desc: "Master the art of your own radiance. Whether you wish to perfect your daily routine or master a specific technique, our private masterclasses offer tailored, step-by-step guidance in an inviting and relaxed atmosphere.",
    },
  ];

  return (
    <section id="experience" style={{
      padding: "80px 48px",
      maxWidth: 1280,
      margin: "0 auto",
    }}>
      <Section>
        <span style={{
          fontFamily: FONT.hand,
          fontSize: "clamp(58px, 11.7vw, 135px)",
          fontWeight: 400,
          lineHeight: 1,
          color: HAND_PINK,
          display: "block",
          marginBottom: 28,
        }}>
          Services
        </span>
      </Section>

      <div className="grid-services" style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 64,
        borderTop: `1px solid ${C.border.default}`,
        paddingTop: 48,
      }}>
        {services.map((s, i) => (
          <Section key={i} delay={i * 150}>
            <h3 style={{
              fontFamily: FONT.heading,
              fontSize: 25,
              fontWeight: 400,
              lineHeight: 1.3,
              letterSpacing: "0em",
              color: C.text.primary,
              marginBottom: 20,
            }}>
              {s.title}
            </h3>
            <p style={{
              fontFamily: FONT.body,
              fontSize: 15,
              fontWeight: 400,
              lineHeight: 1.7,
              color: C.text.secondary,
              maxWidth: "38ch",
            }}>
              {s.desc}
            </p>
          </Section>
        ))}
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════
// MOMENT — Full-width image with single line of text.
// "A breath between sections."
// ═══════════════════════════════════════════════════════════════════
const Moment = () => (
  <Section style={{
    position: "relative",
    width: "100%",
    height: "60vh",
    minHeight: 400,
    overflow: "hidden",
  }}>
    <div className="breath" style={{ position: "absolute", inset: 0 }}>
      <LazyImage
        src={IMG.port3}
        alt="Morning light through studio"
        style={{ filter: "brightness(0.85) saturate(0.85)" }}
      />
      {/* Deepened champagne overlay for text legibility */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(to top, rgba(42,37,33,0.45) 0%, rgba(42,37,33,0.1) 50%, transparent 100%)`,
        pointerEvents: "none",
        zIndex: 1,
      }} />
    </div>
    <div style={{
      position: "absolute",
      bottom: 64,
      left: 0,
      right: 0,
      textAlign: "center",
      zIndex: 2,
    }}>
      <p style={{
        fontFamily: FONT.heading,
        fontSize: "clamp(28px, 4vw, 42px)",
        fontWeight: 400,
        fontStyle: "italic",
        lineHeight: 1.2,
        letterSpacing: "-0.01em",
        color: C.text.inverse,
        textShadow: "none",
      }}>
        Three hours of quiet mastery.
      </p>
    </div>
  </Section>
);

// ═══════════════════════════════════════════════════════════════════
// TESTIMONIAL — Single voice. Cormorant at large scale.
// ═══════════════════════════════════════════════════════════════════
const Testimonial = () => (
  <Section style={{
    padding: "80px 48px",
    maxWidth: 900,
    margin: "0 auto",
    textAlign: "center",
  }}>
    <span style={{
      fontFamily: FONT.script,
      fontSize: 80,
      fontWeight: 400,
      lineHeight: 1,
      color: C.petalPink[300],
      display: "block",
      marginBottom: 24,
    }}>
      {"\u201C"}
    </span>
    <blockquote style={{
      fontFamily: FONT.heading,
      fontSize: "clamp(22px, 3vw, 31px)",
      fontWeight: 400,
      lineHeight: 1.35,
      letterSpacing: "-0.005em",
      color: C.text.primary,
      fontStyle: "normal",
      marginBottom: 40,
    }}>
      She made me feel like the most important person in the world.
      I looked in the mirror and saw myself{"\u2009"}&mdash;{"\u2009"}only somehow the version I always imagined.
    </blockquote>
    <div>
      <cite style={{
        fontFamily: FONT.body,
        fontSize: 14,
        fontWeight: 400,
        fontStyle: "normal",
        color: C.text.primary,
        letterSpacing: "0.02em",
      }}>
        Charlotte M.
      </cite>
      <span style={{
        display: "block",
        fontFamily: FONT.body,
        fontSize: 13,
        fontWeight: 400,
        color: C.text.tertiary,
        marginTop: 4,
      }}>
        Bride, Summer 2025
      </span>
    </div>
  </Section>
);

// ═══════════════════════════════════════════════════════════════════
// PORTFOLIO — Masonry with editorial rhythm.
// Intentional grid breaks. The Breath on each image.
// ═══════════════════════════════════════════════════════════════════
const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [lightbox, setLightbox] = useState(null);

  const gridRef = useRef(null);

  const images = [
    { src: IMG.port1, cat: "bridal", aspect: "3/4", col: "2 / 6", row: "1", speed: -30 },
    { src: IMG.port2, cat: "glamour", aspect: "4/5", col: "8 / 11", row: "1", speed: 20 },
    { src: IMG.port3, cat: "editorial", aspect: "16/10", col: "3 / 10", row: "2", speed: -15 },
    { src: IMG.port4, cat: "bridal", aspect: "3/4", col: "1 / 4", row: "3", speed: 25 },
    { src: IMG.port5, cat: "glamour", aspect: "4/3", col: "5 / 8", row: "3", speed: -40 },
    { src: IMG.port6, cat: "bridal", aspect: "3/4", col: "9 / 13", row: "3", speed: 15 },
    { src: IMG.port7, cat: "editorial", aspect: "1/1", col: "2 / 5", row: "4", speed: -20 },
    { src: IMG.port8, cat: "glamour", aspect: "4/5", col: "7 / 11", row: "4", speed: 30 },
  ];

  const filtered = activeFilter === "all" ? images : images.filter(img => img.cat === activeFilter);

  // Parallax float effect
  useEffect(() => {
    if (!gridRef.current) return;
    const items = gridRef.current.querySelectorAll(".port-parallax");
    const triggers = [];
    items.forEach((item) => {
      const speed = parseFloat(item.dataset.speed || 0);
      if (speed === 0) return;
      const t = gsap.to(item, {
        y: speed,
        ease: "none",
        scrollTrigger: {
          trigger: item,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
      triggers.push(t);
    });
    return () => triggers.forEach((t) => { if (t.scrollTrigger) t.scrollTrigger.kill(); });
  }, [filtered]);

  return (
    <section id="portfolio" style={{
      padding: "80px 48px 48px",
      maxWidth: 1280,
      margin: "0 auto",
    }}>
      <Section>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 64,
        }}>
          <div>
            <span style={{
              fontFamily: FONT.hand,
              fontSize: "clamp(58px, 11.7vw, 135px)",
              fontWeight: 400,
              lineHeight: 1,
              color: HAND_PINK,
              display: "block",
              marginBottom: 16,
            }}>
              Portfolio
            </span>
            <h2 style={{
              fontFamily: FONT.heading,
              fontFeatureSettings: FONT.headingFeatures,
              fontSize: "clamp(32px, 4.5vw, 49px)",
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: C.text.primary,
            }}>
              Recent Work
            </h2>
          </div>
          <span style={{
            fontFamily: FONT.body,
            fontSize: 12,
            fontWeight: 400,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: C.text.tertiary,
            padding: "8px 20px",
            border: `1px solid ${C.border.default}`,
            borderRadius: 9999,
          }}>
            Updated Weekly
          </span>
        </div>
      </Section>

      {/* Bespoke 12-column editorial grid */}
      <div ref={gridRef} className="port-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(12, 1fr)",
        gap: 20,
        rowGap: 40,
      }}>
        {filtered.map((img, i) => (
          <Section key={`${img.src}-${i}`} delay={i * 80} style={{
            gridColumn: img.col,
          }}>
            <div
              className="port-parallax"
              data-speed={img.speed}
            >
              <div
                data-cursor="gallery"
                className="breath port-item"
                onClick={() => setLightbox(img.src)}
                style={{
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{
                  aspectRatio: img.aspect,
                  overflow: "hidden",
                  position: "relative",
                }}>
                  <LazyImage
                    src={img.src}
                    alt="Darlings portfolio work"
                  />
                </div>
              </div>
            </div>
          </Section>
        ))}
      </div>

      {/* Philosophy interruption — breath between gallery sections */}
      <Section style={{
        padding: "96px 0",
        textAlign: "center",
        maxWidth: 560,
        margin: "0 auto",
      }}>
        <p style={{
          fontFamily: FONT.heading,
          fontSize: 22,
          fontWeight: 400,
          fontStyle: "italic",
          lineHeight: 1.5,
          color: C.text.secondary,
          letterSpacing: "-0.005em",
        }}>
          We believe in discretion. Our work lives in the confidence of the women
          who wear it{"\u2009"}&mdash;{"\u2009"}not in before-and-after comparisons.
        </p>
      </Section>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: `${C.editorialInk[900]}f0`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            padding: 48,
            animation: `fadeIn ${DUR.normal}ms ${EASE.enter}`,
          }}
        >
          <img
            src={lightbox}
            alt="Portfolio detail"
            style={{
              maxWidth: "85vw",
              maxHeight: "85vh",
              objectFit: "contain",
            }}
          />
          <button style={{
            position: "absolute",
            top: 32,
            right: 32,
            color: C.text.inverse,
            fontFamily: FONT.body,
            fontSize: 14,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            opacity: 0.7,
          }}>
            Close
          </button>
        </div>
      )}
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════
// ABOUT — Asymmetric duo layout. Not a grid of equal cards.
// ═══════════════════════════════════════════════════════════════════
const About = () => (
  <section id="about" style={{
    padding: "80px 48px",
    maxWidth: 1280,
    margin: "0 auto",
  }}>
    {/* Artist 1 — text left, image right */}
    <Section className="grid-about" style={{
      display: "grid",
      gridTemplateColumns: "7fr 5fr",
      gap: 96,
      alignItems: "start",
      marginBottom: 96,
    }} delay={100}>
      <div>
        <h3 style={{
          fontFamily: FONT.hand,
          fontSize: "clamp(126px, 23.4vw, 324px)",
          fontWeight: 400,
          lineHeight: 0.9,
          color: HAND_PINK,
          margin: 0,
          marginBottom: 32,
          whiteSpace: "nowrap",
          pointerEvents: "none",
        }}>
          Alix
        </h3>
        <span style={{
          fontFamily: FONT.body,
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: C.accent.active,
          display: "block",
          marginBottom: 32,
        }}>
          Moncheur · Co-Founder & Makeup Artist
        </span>
        <p style={{
          fontFamily: FONT.body,
          fontSize: 16,
          fontWeight: 400,
          lineHeight: 1.75,
          color: C.text.secondary,
          maxWidth: "48ch",
          marginBottom: 24,
        }}>
          Certified Pro Makeup Artist with a background steeped in technical precision. Graduating from
          the Make Up For Ever Academy, Alix approaches makeup with an almost architectural understanding
          of light and skin. Her work is defined by an effortless, enduring elegance.
        </p>
        <p style={{
          fontFamily: FONT.heading,
          fontSize: 20,
          fontWeight: 400,
          fontStyle: "italic",
          lineHeight: 1.5,
          color: C.text.primary,
          maxWidth: "42ch",
        }}>
          {"\u201C"}I believe that the finest artistry is the kind you cannot see{"\u2009"}&mdash;{"\u2009"}only
          feel. Every face tells a story, and my role is simply to illuminate it.{"\u201D"}
        </p>
      </div>
      <PeelImage src={IMG.artist1} alt="Alix Moncheur" />
    </Section>

    {/* Artist 2 — image left, text right (reversed) */}
    <Section className="grid-about" style={{
      display: "grid",
      gridTemplateColumns: "5fr 7fr",
      gap: 96,
      alignItems: "start",
    }} delay={100}>
      <PeelImage src={IMG.artist2} alt="Marine de Menten" imgStyle={{ objectPosition: "-30px" }} />
      <div>
        <h3 style={{
          fontFamily: FONT.hand,
          fontSize: "clamp(126px, 23.4vw, 324px)",
          fontWeight: 400,
          lineHeight: 0.9,
          color: HAND_PINK,
          margin: 0,
          marginBottom: 32,
          whiteSpace: "nowrap",
          pointerEvents: "none",
        }}>
          Marine
        </h3>
        <span style={{
          fontFamily: FONT.body,
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: C.accent.active,
          display: "block",
          marginBottom: 32,
        }}>
          de Menten · Co-Founder & Makeup Artist
        </span>
        <p style={{
          fontFamily: FONT.body,
          fontSize: 16,
          fontWeight: 400,
          lineHeight: 1.75,
          color: C.text.secondary,
          maxWidth: "48ch",
          marginBottom: 24,
        }}>
          Graduating alongside Alix at the Make Up For Ever Academy, Marine possesses an intuitive
          understanding of colour as an emotional language. She believes that the right makeup is not
          a mask, but a deeply personal expression of confidence.
        </p>
        <p style={{
          fontFamily: FONT.heading,
          fontSize: 20,
          fontWeight: 400,
          fontStyle: "italic",
          lineHeight: 1.5,
          color: C.text.primary,
          maxWidth: "42ch",
        }}>
          {"\u201C"}Colour is confidence you can wear. I live for the moment a client sees herself
          in the mirror and stands a little taller.{"\u201D"}
        </p>
      </div>
    </Section>
  </section>
);

// ═══════════════════════════════════════════════════════════════════
// CTA — Simple invitation. Not transactional.
// ═══════════════════════════════════════════════════════════════════
const CallToAction = () => (
  <Section style={{
    padding: "64px 48px",
    textAlign: "center",
    maxWidth: 640,
    margin: "0 auto",
  }}>
    <h2 style={{
      fontFamily: FONT.heading,
      fontSize: "clamp(32px, 4vw, 49px)",
      fontWeight: 400,
      lineHeight: 1.15,
      letterSpacing: "-0.015em",
      color: C.text.primary,
      marginBottom: 24,
    }}>
      Every great look begins with a conversation
    </h2>
    <p style={{
      fontFamily: FONT.body,
      fontSize: 17,
      fontWeight: 400,
      lineHeight: 1.65,
      color: C.text.secondary,
      marginBottom: 48,
    }}>
      We would love to hear about the event you are planning. Please share your date,
      preparation location, and the number of guests requiring our services, and we will
      curate a bespoke proposal just for you.
    </p>
    <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
      <button
        onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
        style={{
          fontFamily: FONT.heading,
          fontSize: 16,
          fontWeight: 500,
          color: C.text.inverse,
          background: C.editorialInk[800],
          border: "none",
          borderRadius: 3,
          padding: "16px 48px",
          cursor: "pointer",
          transition: `background ${DUR.normal}ms ${EASE.default}`,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = C.editorialInk[700]; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = C.editorialInk[800]; }}
      >
        Begin Your Experience
      </button>
      <button
        onClick={() => document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })}
        style={{
          fontFamily: FONT.heading,
          fontSize: 16,
          fontWeight: 500,
          color: C.text.primary,
          background: "transparent",
          border: `1px solid ${C.border.strong}`,
          borderRadius: 3,
          padding: "16px 40px",
          cursor: "pointer",
          transition: `border-color ${DUR.normal}ms ${EASE.default}`,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.editorialInk[800]; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border.strong; }}
      >
        View Portfolio
      </button>
    </div>
  </Section>
);

// ═══════════════════════════════════════════════════════════════════
// CONTACT — Intimate. Not a form you fill in, a conversation you start.
// ═══════════════════════════════════════════════════════════════════
const Contact = () => {
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", service: "",
    weddingDate: "", venue: "", partySize: "", travelRequired: "",
    appointmentDate: "", location: "", occasion: "",
    projectType: "", brand: "", timeline: "",
    groupSize: "", experience: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const set = (key) => (e) => setFormData({ ...formData, [key]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.service) {
      setSubmitted(true);
    }
  };

  const labelStyle = {
    fontFamily: FONT.body, fontSize: 11, fontWeight: 500,
    letterSpacing: "0.08em", textTransform: "uppercase",
    color: C.text.tertiary, display: "block", marginBottom: 8,
  };

  return (
    <section id="contact" style={{
      padding: "80px 48px",
      maxWidth: 1280,
      margin: "0 auto",
    }}>
      <div className="grid-contact" style={{
        display: "grid",
        gridTemplateColumns: "5fr 7fr",
        gap: 96,
        alignItems: "start",
      }}>
        {/* Left — Contact details */}
        <Section>
          <span style={{
            fontFamily: FONT.hand,
            fontSize: "clamp(58px, 11.7vw, 135px)",
            fontWeight: 400,
            lineHeight: 1,
            color: HAND_PINK,
            display: "block",
            marginBottom: 16,
          }}>
            Get in Touch
          </span>
          <h2 style={{
            fontFamily: FONT.heading,
            fontSize: "clamp(28px, 3.5vw, 39px)",
            fontWeight: 400,
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
            color: C.text.primary,
            marginBottom: 48,
          }}>
            Every great look begins with a conversation
          </h2>

          <div style={{ marginBottom: 32 }}>
            <span style={{
              fontFamily: FONT.body,
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: C.text.tertiary,
              display: "block",
              marginBottom: 16,
            }}>Alix · Austria</span>
            <a href="tel:+436704001680" style={{
              fontFamily: FONT.body,
              fontSize: 16,
              fontWeight: 400,
              color: C.text.primary,
              display: "block",
              marginBottom: 6,
            }}>+43 670 400 1680</a>
            <a href="mailto:moncheuralix@gmail.com" style={{
              fontFamily: FONT.body,
              fontSize: 16,
              fontWeight: 400,
              color: C.text.primary,
            }}>moncheuralix@gmail.com</a>
          </div>

          <div style={{ marginBottom: 32 }}>
            <span style={{
              fontFamily: FONT.body,
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: C.text.tertiary,
              display: "block",
              marginBottom: 16,
            }}>Marine · Belgium</span>
            <a href="tel:+32496055914" style={{
              fontFamily: FONT.body,
              fontSize: 16,
              fontWeight: 400,
              color: C.text.primary,
              display: "block",
              marginBottom: 6,
            }}>+32 496 05 59 14</a>
            <a href="mailto:marinedementen@gmail.com" style={{
              fontFamily: FONT.body,
              fontSize: 16,
              fontWeight: 400,
              color: C.text.primary,
            }}>marinedementen@gmail.com</a>
          </div>

          <div style={{ marginBottom: 32 }}>
            <span style={{
              fontFamily: FONT.body,
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: C.text.tertiary,
              display: "block",
              marginBottom: 8,
            }}>Availability</span>
            <p style={{
              fontFamily: FONT.body,
              fontSize: 16,
              fontWeight: 400,
              color: C.text.primary,
              lineHeight: 1.65,
            }}>
              Austria & Belgium<br />
              By appointment only
            </p>
          </div>

          <div>
            <span style={{
              fontFamily: FONT.body,
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: C.text.tertiary,
              display: "block",
              marginBottom: 8,
            }}>Follow</span>
            <div style={{ display: "flex", gap: 20 }}>
              <a href="https://instagram.com/darlingsmakeupbe" target="_blank" rel="noopener noreferrer" style={{
                fontFamily: FONT.body,
                fontSize: 14,
                fontWeight: 400,
                color: C.text.link,
                borderBottom: `1px solid transparent`,
                transition: `border-color ${DUR.normal}ms`,
              }}
                onMouseEnter={(e) => { e.target.style.borderColor = C.text.link; }}
                onMouseLeave={(e) => { e.target.style.borderColor = "transparent"; }}
              >
                Instagram
              </a>
            </div>
          </div>
        </Section>

        {/* Right — Smart Form */}
        <Section delay={200}>
          {submitted ? (
            <div style={{ padding: "80px 0", textAlign: "center" }}>
              <p style={{
                fontFamily: FONT.heading, fontSize: 28, fontWeight: 400,
                color: C.text.primary, marginBottom: 16,
              }}>Thank you</p>
              <p style={{
                fontFamily: FONT.body, fontSize: 16, fontWeight: 400,
                color: C.text.secondary,
              }}>We will be in touch within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Name + Email */}
              <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
                <div>
                  <label style={labelStyle}>Name *</label>
                  <input className="form-input" type="text" placeholder="Your name" value={formData.name} onChange={set("name")} required />
                </div>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input className="form-input" type="email" placeholder="your@email.com" value={formData.email} onChange={set("email")} required />
                </div>
              </div>

              {/* Phone + Service */}
              <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
                <div>
                  <label style={labelStyle}>Phone</label>
                  <input className="form-input" type="tel" placeholder="+32 ..." value={formData.phone} onChange={set("phone")} />
                </div>
                <div>
                  <label style={labelStyle}>Service *</label>
                  <select className="form-input" value={formData.service} onChange={set("service")} required style={{ appearance: "none", cursor: "pointer" }}>
                    <option value="">Select a service...</option>
                    <option value="bridal">Bridal & Wedding</option>
                    <option value="private">Private Appointment</option>
                    <option value="editorial">Editorial & Campaign</option>
                    <option value="workshop">Workshop or Course</option>
                    <option value="other">Something else</option>
                  </select>
                </div>
              </div>

              {/* ─── Bridal conditional fields ─── */}
              {formData.service === "bridal" && (
                <div style={{ padding: 24, background: "rgba(0,0,0,0.02)", borderRadius: 6, marginBottom: 24, border: `1px solid ${C.border.subtle}` }}>
                  <span style={{ ...labelStyle, marginBottom: 20, fontSize: 10, color: C.brand.default }}>Wedding Details</span>
                  <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
                    <div>
                      <label style={labelStyle}>Wedding Date</label>
                      <input className="form-input" type="date" value={formData.weddingDate} onChange={set("weddingDate")} />
                    </div>
                    <div>
                      <label style={labelStyle}>Venue / Location</label>
                      <input className="form-input" type="text" placeholder="e.g. Château de Vaux" value={formData.venue} onChange={set("venue")} />
                    </div>
                  </div>
                  <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                    <div>
                      <label style={labelStyle}>Bridal Party Size</label>
                      <select className="form-input" value={formData.partySize} onChange={set("partySize")} style={{ appearance: "none", cursor: "pointer" }}>
                        <option value="">Select...</option>
                        <option value="bride-only">Bride only</option>
                        <option value="1-3">Bride + 1–3</option>
                        <option value="4-6">Bride + 4–6</option>
                        <option value="7+">Bride + 7+</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Travel Required?</label>
                      <select className="form-input" value={formData.travelRequired} onChange={set("travelRequired")} style={{ appearance: "none", cursor: "pointer" }}>
                        <option value="">Select...</option>
                        <option value="austria">Within Austria</option>
                        <option value="belgium">Within Belgium</option>
                        <option value="europe">Elsewhere in Europe</option>
                        <option value="international">International</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── Private conditional fields ─── */}
              {formData.service === "private" && (
                <div style={{ padding: 24, background: "rgba(0,0,0,0.02)", borderRadius: 6, marginBottom: 24, border: `1px solid ${C.border.subtle}` }}>
                  <span style={{ ...labelStyle, marginBottom: 20, fontSize: 10, color: C.brand.default }}>Appointment Details</span>
                  <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
                    <div>
                      <label style={labelStyle}>Preferred Date</label>
                      <input className="form-input" type="date" value={formData.appointmentDate} onChange={set("appointmentDate")} />
                    </div>
                    <div>
                      <label style={labelStyle}>Location</label>
                      <select className="form-input" value={formData.location} onChange={set("location")} style={{ appearance: "none", cursor: "pointer" }}>
                        <option value="">Select...</option>
                        <option value="your-home">At your home</option>
                        <option value="hotel">Hotel</option>
                        <option value="event-venue">Event venue</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Occasion</label>
                    <input className="form-input" type="text" placeholder="e.g. Birthday, gala, photoshoot..." value={formData.occasion} onChange={set("occasion")} />
                  </div>
                </div>
              )}

              {/* ─── Editorial conditional fields ─── */}
              {formData.service === "editorial" && (
                <div style={{ padding: 24, background: "rgba(0,0,0,0.02)", borderRadius: 6, marginBottom: 24, border: `1px solid ${C.border.subtle}` }}>
                  <span style={{ ...labelStyle, marginBottom: 20, fontSize: 10, color: C.brand.default }}>Project Details</span>
                  <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
                    <div>
                      <label style={labelStyle}>Project Type</label>
                      <select className="form-input" value={formData.projectType} onChange={set("projectType")} style={{ appearance: "none", cursor: "pointer" }}>
                        <option value="">Select...</option>
                        <option value="fashion-editorial">Fashion editorial</option>
                        <option value="brand-campaign">Brand campaign</option>
                        <option value="film-tv">Film / TV</option>
                        <option value="lookbook">Lookbook</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Brand / Publication</label>
                      <input className="form-input" type="text" placeholder="e.g. Vogue, Dior..." value={formData.brand} onChange={set("brand")} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Timeline</label>
                    <input className="form-input" type="text" placeholder="e.g. June 2026, flexible..." value={formData.timeline} onChange={set("timeline")} />
                  </div>
                </div>
              )}

              {/* ─── Workshop conditional fields ─── */}
              {formData.service === "workshop" && (
                <div style={{ padding: 24, background: "rgba(0,0,0,0.02)", borderRadius: 6, marginBottom: 24, border: `1px solid ${C.border.subtle}` }}>
                  <span style={{ ...labelStyle, marginBottom: 20, fontSize: 10, color: C.brand.default }}>Workshop Details</span>
                  <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                    <div>
                      <label style={labelStyle}>Group Size</label>
                      <select className="form-input" value={formData.groupSize} onChange={set("groupSize")} style={{ appearance: "none", cursor: "pointer" }}>
                        <option value="">Select...</option>
                        <option value="individual">Just me</option>
                        <option value="2-4">2–4 people</option>
                        <option value="5-10">5–10 people</option>
                        <option value="10+">10+</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Experience Level</label>
                      <select className="form-input" value={formData.experience} onChange={set("experience")} style={{ appearance: "none", cursor: "pointer" }}>
                        <option value="">Select...</option>
                        <option value="beginner">Complete beginner</option>
                        <option value="some">Some experience</option>
                        <option value="professional">Professional</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Message — always visible, label changes per service */}
              <div style={{ marginBottom: 32 }}>
                <label style={labelStyle}>
                  {formData.service === "bridal" ? "Anything else we should know?" :
                   formData.service === "private" ? "Tell us about the look you have in mind" :
                   formData.service === "editorial" ? "Brief / creative direction" :
                   formData.service === "workshop" ? "What would you like to learn?" :
                   "Message"}
                </label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder={
                    formData.service === "bridal" ? "Hair preferences, inspiration, allergies..." :
                    formData.service === "private" ? "Describe the occasion and your vision..." :
                    formData.service === "editorial" ? "Share your mood board, references, or creative brief..." :
                    formData.service === "workshop" ? "Specific techniques, products, or skills you'd like to focus on..." :
                    "Tell us about your moment..."
                  }
                  value={formData.message}
                  onChange={set("message")}
                  style={{ resize: "vertical", minHeight: 80 }}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                style={{
                  fontFamily: FONT.heading, fontSize: 16, fontWeight: 500,
                  color: C.text.inverse, background: C.editorialInk[800],
                  border: "none", borderRadius: 3, padding: "16px 48px",
                  cursor: "pointer", width: "100%",
                  transition: `all ${DUR.normal}ms ${EASE.default}`,
                }}
                onMouseEnter={(e) => { e.target.style.background = C.editorialInk[700]; }}
                onMouseLeave={(e) => { e.target.style.background = C.editorialInk[800]; }}
              >
                Send Enquiry
              </button>
            </form>
          )}
        </Section>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════
// FOOTER — Whispered. Information available, never shouted.
// ═══════════════════════════════════════════════════════════════════
const Footer = () => {
  // Pink footer palette — card stock background with deep-rose ink, to
  // mirror the preloader + business card and give the site a soft,
  // girly close.
  const BG = "#FCD6E3";                     // card stock
  const LOGO_INK = C.petalPink[800];        // #8C3147
  const HEADING = HAND_PINK;                // #C84969 — same pink as section eyebrows
  const BODY = C.petalPink[900];            // #752B3E — dark rose, reads on pink bg
  const MUTED = C.petalPink[700];           // #A83852
  const HOVER = C.petalPink[950];           // #451520
  const DIVIDER = "rgba(168, 56, 82, 0.2)"; // petalPink[700] @ 20%

  return (
    <footer style={{
      borderTop: "none",
      background: BG,
      padding: "96px 48px 48px",
    }}>
      <div className="grid-footer" style={{
        maxWidth: 1280,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "5fr 2fr 2fr 3fr",
        gap: 64,
        marginBottom: 96,
      }}>
        {/* Brand */}
        <div>
          <DarlingsLogo width={160} color={LOGO_INK} style={{ marginBottom: 24 }} />
          <p style={{
            fontFamily: FONT.body,
            fontSize: 14,
            fontWeight: 400,
            lineHeight: 1.7,
            color: BODY,
            maxWidth: "36ch",
          }}>
            Bespoke bridal and beauty artistry, by appointment,
            across Austria and Belgium.
          </p>
        </div>

        {/* Services */}
        <div>
          <h4 style={{
            fontFamily: FONT.hand,
            fontSize: 36,
            fontWeight: 400,
            lineHeight: 1,
            color: HEADING,
            marginBottom: 20,
          }}>Services</h4>
          {["Bridal & Wedding", "Private Appointments", "Workshops & Courses", "Editorial & Campaign"].map((s) => (
            <p key={s} style={{
              fontFamily: FONT.body,
              fontSize: 14,
              fontWeight: 400,
              color: MUTED,
              marginBottom: 10,
              cursor: "pointer",
              transition: `color ${DUR.normal}ms`,
            }}
              onMouseEnter={(e) => { e.target.style.color = HOVER; }}
              onMouseLeave={(e) => { e.target.style.color = MUTED; }}
            >
              {s}
            </p>
          ))}
        </div>

        {/* Company */}
        <div>
          <h4 style={{
            fontFamily: FONT.hand,
            fontSize: 36,
            fontWeight: 400,
            lineHeight: 1,
            color: HEADING,
            marginBottom: 20,
          }}>Company</h4>
          {["About Us", "Portfolio", "Testimonials", "Contact"].map((s) => (
            <p key={s} style={{
              fontFamily: FONT.body,
              fontSize: 14,
              fontWeight: 400,
              color: MUTED,
              marginBottom: 10,
              cursor: "pointer",
              transition: `color ${DUR.normal}ms`,
            }}
              onMouseEnter={(e) => { e.target.style.color = HOVER; }}
              onMouseLeave={(e) => { e.target.style.color = MUTED; }}
            >
              {s}
            </p>
          ))}
        </div>

        {/* Contact */}
        <div>
          <h4 style={{
            fontFamily: FONT.hand,
            fontSize: 36,
            fontWeight: 400,
            lineHeight: 1,
            color: HEADING,
            marginBottom: 20,
          }}>Contact</h4>
          <p style={{
            fontFamily: FONT.body,
            fontSize: 14,
            fontWeight: 400,
            color: MUTED,
            lineHeight: 1.7,
          }}>
            <a href="mailto:moncheuralix@gmail.com" style={{ color: "inherit" }}>moncheuralix@gmail.com</a><br />
            <a href="mailto:marinedementen@gmail.com" style={{ color: "inherit" }}>marinedementen@gmail.com</a>
          </p>
          <p style={{
            fontFamily: FONT.body,
            fontSize: 14,
            fontWeight: 400,
            color: MUTED,
            lineHeight: 1.7,
            marginBottom: 20,
          }}>
            Austria & Belgium<br />
            By appointment only
          </p>
          <div style={{ display: "flex", gap: 16 }}>
            {/* Instagram */}
            <a href="https://instagram.com/darlingsmakeupbe" target="_blank" rel="noopener noreferrer"
              style={{ color: MUTED, transition: `color ${DUR.normal}ms` }}
              onMouseEnter={(e) => { e.currentTarget.style.color = HOVER; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = MUTED; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="5"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: `1px solid ${DIVIDER}`,
        paddingTop: 32,
        maxWidth: 1280,
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 16,
      }}>
        <span style={{
          fontFamily: FONT.body,
          fontSize: 12,
          fontWeight: 400,
          color: MUTED,
        }}>
          &copy; {new Date().getFullYear()} Darlings Studio. All rights reserved.
        </span>
        <div style={{ display: "flex", gap: 24 }}>
          <span style={{
            fontFamily: FONT.body,
            fontSize: 12,
            fontWeight: 400,
            color: MUTED,
            cursor: "pointer",
          }}>Privacy Policy</span>
          <span style={{
            fontFamily: FONT.body,
            fontSize: 12,
            fontWeight: 400,
            color: MUTED,
            cursor: "pointer",
          }}>Terms</span>
        </div>
      </div>
    </footer>
  );
};

// ═══════════════════════════════════════════════════════════════════
// APP — The composition. Pacing matters.
// ═══════════════════════════════════════════════════════════════════
export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [preloaderDone, setPreloaderDone] = useState(false);
  const lenisRef = useRef(null);

  // ─── REFRESH → TOP + SCROLL LOCK WHILE PRELOADER SHOWING ──────
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (preloaderDone) return;
    const { body, documentElement: html } = document;
    const prevBody = body.style.overflow;
    const prevHtml = html.style.overflow;
    body.style.overflow = "hidden";
    html.style.overflow = "hidden";
    return () => {
      body.style.overflow = prevBody;
      html.style.overflow = prevHtml;
    };
  }, [preloaderDone]);

  // ─── LENIS SMOOTH SCROLL ──────────────────────────────────────
  useEffect(() => {
    if (!preloaderDone) return;
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [preloaderDone]);

  // ─── SECTION OBSERVER ─────────────────────────────────────────
  useEffect(() => {
    const sections = ["home", "experience", "portfolio", "about", "contact"];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const handlePreloaderComplete = useCallback(() => {
    setPreloaderDone(true);
  }, []);

  return (
    <>
      <GlobalStyles />
      {!preloaderDone && <Preloader onComplete={handlePreloaderComplete} />}
      <CustomCursor />

      <FilmGrain />
      <Navigation activeSection={activeSection} />
      <main>
        <Hero />
        <Philosophy />
        <Services />
        <Moment />
        <Testimonial />
        <Portfolio />
        <About />
        <CallToAction />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
