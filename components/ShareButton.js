import { useState } from "react";
import { SHARE_URL, SHARE_STRINGS } from "@/lib/share";

export default function ShareButton({ score }) {
  const [toast, setToast] = useState(false);

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: SHARE_STRINGS.title,
          text: SHARE_STRINGS.text(score),
          url: SHARE_URL,
        });
        return;
      } catch (_e) {
        // User cancelled or not supported — fall through to copy
      }
    }
    copyLink();
  }

  function copyLink() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(SHARE_URL).catch(() => {});
    } else {
      const ta = document.createElement("textarea");
      ta.value = SHARE_URL;
      ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch (_e) {}
      document.body.removeChild(ta);
    }
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  }

  return (
    <div className="text-center mb-8">
      <p className="text-sm mb-3" style={{ color: "var(--text-70)" }}>
        Send this test to your boys and compare pull game.
      </p>
      <button
        onClick={handleShare}
        className="btn-gradient px-6 py-3 rounded-xl text-white font-semibold text-base transition-colors"
      >
        Share with a friend
      </button>
      <button
        onClick={copyLink}
        className="block mx-auto mt-2 text-sm transition-colors"
        style={{ color: "var(--text-40)" }}
      >
        {toast ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}
