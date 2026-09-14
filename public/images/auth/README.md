# Official sign-in artwork

These assets are used only as their respective identity provider's sign-in button, without modifying the artwork.

- `google-sign-in-dark.png`: Google pre-approved Android + Web dark pill, with text, @4x (720×160). Source: https://developers.google.com/static/identity/images/signin-assets.zip — `Android + Web/PNG @4x/Dark/Theme=Dark, Show text=Yes, Shape=Pill, Platform=Android+Web@4x.png`. Guidelines: https://developers.google.com/identity/branding-guidelines
- `apple-sign-in-white.png`: Apple-generated center-aligned Sign in with Apple, white pill (864×192). Source: https://appleid.cdn-apple.com/appleid/button?type=sign-in&color=white&width=216&height=48&border_radius=24&scale=4&locale=en_US. Guidelines: https://developer.apple.com/sign-in-with-apple/usage-guidelines-for-websites-and-other-platforms/

Both are displayed at 216×48 CSS pixels, preserving their aspect ratios. Local assets keep button rendering independent of third-party script availability and leave the existing server OAuth/PKCE flow intact.

Responsive full-width variant: Apple artwork remains 216×48 within a white button; Google uses the official standalone `https://developers.google.com/static/identity/images/g-logo.png` at 20×20, with Google Sans Medium locally hosted from the Google Fonts CSS API. Neither logo nor label is stretched when the button width changes.
