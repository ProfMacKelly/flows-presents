<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Warranties & Product Liability — Mindmap</title>
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <!-- Markmap autoloader (loads libs + renders mindmap) -->
  <script src="https://cdn.jsdelivr.net/npm/markmap-autoloader@0.18.9"></script>
  <style>
    html,body { height:100%; margin:0; }
    #mindmap { height:100vh; }
  </style>
</head>
<body>
  <svg id="mindmap"></svg>

  <!-- The Markdown outline becomes an interactive, collapsible mindmap -->
  <script type="text/markdown">
# Warranties & Product Liability

## Express Warranty
- Creation
  - Affirmations of fact / promises
  - Descriptions / specs
  - Samples / models
- Breach
  - Nonconformity with statement or sample
- Defenses / Limits
  - Puffery (opinion vs. fact)
  - Disclaimers (conspicuous? consistent?)
- Practical example
  - “Nonstick toaster” ad → crumb tray fuses to housing on first use → breach?

## Implied Warranty of Merchantability (UCC 2-314)
- Merchant seller required
- Fit for ordinary purpose
- Fair, average quality; adequately packaged/labelled
- Breach indicators
  - Frequent stalling, premature failure, safety defect
- Practical example
  - New lawnmower stalls after 3 minutes under normal use → merchantability issue

## Implied Warranty of Fitness for a Particular Purpose (UCC 2-315)
- Seller knows buyer’s particular purpose
- Buyer relies on seller’s skill/judgment
- Breach = not suitable for that purpose
- Practical example
  - Clerk recommends boots “for icy trails”; soles lack traction → injury → fitness breach

## Disclaimers & Limitations
- “As is” / “With all faults”
  - Must be conspicuous; may limit merchantability
- Fitness disclaimers
  - Typically must be in writing + conspicuous
- Limitation of remedies
  - Repair/replace only; unconscionability check
- Magnuson–Moss (consumer goods)
  - “Full” vs “Limited” warranty; restrictions on disclaimers
- Practical example
  - Used car sold “as is” with bold conspicuous notice → can it defeat implied warranties?

## Privity & Third Parties
- UCC alternatives (A/B/C) for household guests, etc.
- Remote purchaser standing varies by state
- Economic loss rule interplay (contract vs. tort)
- Practical example
  - Aunt buys blender; niece injured using it → can niece sue on warranty?

## Remedies & Damages
- Benefit-of-the-bargain (difference in value)
- Incidental & consequential damages
- Notice requirement to seller
- Statute of limitations (4 years under UCC; accrual at tender)
- Practical example
  - Business loses sales due to faulty commercial oven → consequential damages?

## Tort Overlap
- Strict products liability
- Negligence (design, manufacture, warning)
- Misrepresentation (advertising claims)
- Strategy
  - Plead contract and tort in the alternative

## Classroom Hypos (Quick Prompts)
- “Model X drone — 30-minute flight time” → 11 minutes in mild wind
- “Dishwasher: whisper-quiet” (puffery?) but vibrates off track
- “As-is” fitness: staff recommended “for kosher kitchen heat cycles,” fails
  </script>

  <script>
    // Render the mindmap from the Markdown above
    window.addEventListener('DOMContentLoaded', () => {
      const { markmap } = window;
      const svg = document.getElementById('mindmap');
      const markdown = document.querySelector('script[type="text/markdown"]').textContent;
      markmap.autoLoader.renderAll(); // autoloads and renders
    });
  </script>
</body>
</html>
