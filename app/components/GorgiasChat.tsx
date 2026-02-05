import { useEffect, useRef } from 'react';

interface GorgiasChatProps {
  appId?: string;
  enabled?: boolean;
}

/**
 * Gorgias Chat Widget Component
 * 
 * Lazy-loads Gorgias chat widget after page load for better performance.
 * Only loads on client-side and after initial page render.
 * 
 * @param appId - Gorgias app ID from environment variables
 * @param enabled - Enable/disable chat widget (default: true)
 */
export function GorgiasChat({ 
  appId,
  enabled = true 
}: GorgiasChatProps) {
  const scriptLoadedRef = useRef(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    // Only load on client side
    if (typeof window === 'undefined') return;
    
    // Don't load if disabled or no app ID
    if (!enabled || !appId) return;

    // Wait for page to be fully loaded before loading chat widget
    const loadChat = () => {
      if (scriptLoadedRef.current || initializedRef.current) return;

      // Load Gorgias script
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.innerHTML = `
        (function(w,d,t,u,n,a,m){w['GorgiasChatObject']=n;
        w[n]=w[n]||function(){(w[n].q=w[n].q||[]).push(arguments)};a=d.createElement(t);
        m=d.getElementsByTagName(t)[0];a.async=1;a.src=u;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://config.gorgias.chat/gorgias-chat-bundle.js','gorgiasChat');
        gorgiasChat.init({appId: '${appId}'});
      `;
      document.body.appendChild(script);
      
      scriptLoadedRef.current = true;
      initializedRef.current = true;
    };

    // Load after a short delay to not block initial page load
    if (document.readyState === 'complete') {
      setTimeout(loadChat, 1000);
    } else {
      window.addEventListener('load', () => {
        setTimeout(loadChat, 1000);
      });
    }
  }, [appId, enabled]);

  // Component doesn't render anything - widget injects itself
  return null;
}
