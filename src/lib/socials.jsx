// Official Vizball accounts, used by the footer and the follow block under articles.

function InstagramIcon({ size = 20, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.25" />
      <circle cx="17.6" cy="6.4" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ size = 20, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" {...props}>
      <path d="M13.5 21.95V14h2.7l.4-3.2h-3.1V8.8c0-.9.25-1.55 1.57-1.55h1.66V4.4c-.29-.04-1.28-.12-2.42-.12-2.4 0-4.05 1.47-4.05 4.16v2.36H7.5V14h2.76v7.95A10 10 0 1 1 13.5 21.95Z" />
    </svg>
  );
}

function XIcon({ size = 20, ...props }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export const SOCIALS = [
  { name: 'Instagram', handle: '@vizballassociation', href: 'https://www.instagram.com/vizballassociation/', icon: InstagramIcon },
  { name: 'Facebook', handle: 'Vizball Association', href: 'https://www.facebook.com/VizballAssociation', icon: FacebookIcon },
  { name: 'X', handle: '@vizballofficial', href: 'https://x.com/vizballofficial', icon: XIcon },
];
