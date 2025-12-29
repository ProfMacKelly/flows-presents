---
theme: default
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: none
# some information about your slides (markdown enabled)
title: Negligence
# apply UnoCSS classes to the current slide
class: text-center
# https://sli.dev/features/drawing
drawings: false
# slide transition: https://sli.dev/guide/animations.html#slide-transitions
transition: slide-left
# enable MDC Syntax: https://sli.dev/features/mdc
mdc: true
layout: center
alias: start
---
# Starting slide
---
layout: center
alias: overview
---

# Overview: Negligence in General

<v-clicks>

1. *Prima Facie* Case for Liability  
   - **Duty** (to others)
   - **Breach** (of duty)
   - **Damages** (suffered by another)
   - **Causation** (of damages)

   > **Note:** Sufficient evidence to support a claim at **face value**; rebuttable by defenses.

2. **Defenses to Liability**
   - Failure of Proof
   - Affirmative Defenses

</v-clicks>


---
layout: center
---
<div class="h-80 overflow-y-auto">
 
```mermaid
flowchart TB 
    du["**Element: Duty**<br>Did D owe a<br/>**legal duty** to P?"]
    du -- **No** --> z["**STOP:<br>Not Liable**"]
    du -- **Yes** --> da["**Element: Damages**<br>Did P suffer damages (aka harm, injury, loss)?"]
    da -- **No** --> z
    da -- **Yes** --> b["**Element: Breach**<br>Did D breach their duty?"]
    b -- **No** --> z
    b -- **Yes** --> ca["**Element: Causation**<br>Did D's conduct cause P's harm?"]
    ca -- **No** --> z
    ca -- **Yes** --> p(("**The D has a<br>_prima facie_ case<br>of negligence**"))
    p == **NEXT** ==> aa[Is there an **affirmative defense**?]
    aa -- **No** --> l["**D is liable**"]
    aa -- **Yes** --> z
    
   
    z@{ shape: terminal}
    style z stroke-width:2.5px,fill:#FFCDD2
    l@{ shape: diamond}
    style l stroke-width:2.5px
    style p stroke-width:2.5px
```
</div>
---

# Element 1: Duty
Did D have a duty to P?

```mermaid {scale: 0.5}
graph TD
    z1["**START HERE**"] --> du["Did D owe a<br/>**legal duty** to P?"]
    du -- **No** --> z2["**STOP:<br>Not Liable**"]
    du -- **Yes** --> da["Did P suffer damages (aka harm, injury, loss)?"]
    da -- **No** --> z2
    da -- **Yes** --> b["Did D breach their duty?"]
    b -- **No** --> z2
    b -- **Yes** --> ca@{ label: "Did D's conduct cause P's harm?" }
    ca -- **No** --> z2
    ca -- **Yes** --> p["**The D has a prima facie case for negligence**"]
    p --> aa[Is there an **affirmative defense**?]
    aa -- **No** --> l["**D is liable**"]
    aa -- **Yes** --> z2
```
---
layout: center
class: text-center
alias: not_liable
---

# Outcome
D is not liable for negligence.

---
layout: center
alias: breach
decision: true
question: "Breach?"
yesTarget: causation
noTarget: not_liable
---

# Element 2: Breach
Did D breach the duty to P?

```mermaid
graph TD
    Q2{Breach?}
    Q2 -->|Yes| Next[Go to Causation]
    Q2 -->|No| End[No Liability]
    style Q2 stroke-width:4px,stroke:#4ade80
```
---
layout: center
alias: causation
decision: true
question: "Causation?"
yesTarget: damages
noTarget: not_liable
---
# Element 3: Causation
Did the defendant's breach cause harm?

```mermaid
graph TD
    Q3{Causation?}
    Q3 -->|Yes| Next[Go to Damages]
    Q3 -->|No| End[No Liability]
    style Q3 stroke-width:4px,stroke:#4ade80
```
---
layout: center
alias: damages
decision: true
question: "Causation?"
yesTarget: 4
noTarget: 7
---
```mermaid
graph TB

    z1["**START HERE**"] --> du["**Element: Duty**<br>Did D owe a<br/>**legal duty** to P?"]
    du -- **No** --> z2["**STOP:<br>Not Liable**"]
    du -- **Yes** --> da["**Element: Damages**<br>Did P suffer **damages** (aka harm, injury, loss)?"]
    da -- **No** --> z2
    da -- **Yes** --> b["**Element: Breach**<br>Did D **breach** their duty?"]
    b -- **No** --> z2
    b -- **Yes** --> ca["**Element: Causation**<br>Did D's conduct **cause** P's harm?"]
    ca -- **No** --> z2
    ca -- **Yes** --> p["**The D has a prima facie case for negligence**"]
    p --> aa[Does D have an **affirmative defense**?]
    aa -- **No** --> li["**D is liable**"]
    aa -- **Yes** --> z2
    
    z1@{ shape: terminal}
    z2@{ shape: terminal}
    style z1 stroke-width:2.5px,stroke-dasharray: 2,fill:#fafafa,stroke:#000000
    style z2 stroke-width:2.5px,fill:#FFCDD2,stroke:#e52437
    li@{ shape: diamond}
    style li stroke-width:2.5px,fill:#edffeb,stroke:#19531c
```