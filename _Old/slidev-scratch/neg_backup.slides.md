---
# try 'default' to start simple
theme: default
# like them? see https://unsplash.com/collections/94734566/slidev
background: none
# slide transition: https://sli.dev/guide/animations.html#slide-transitions
transition: slide-left
# enable MDC Syntax: https://sli.dev/features/mdc
mdc: true\
hideArrow: false
# https://sli.dev/features/drawing
drawings:
   persist: false
aspectRatio: 16/9
# Global slide canvas sizing (recommended)
canvasWidth: 760  # was 980; smaller = everything appears larger on screen

title: Negligence & Products Liability
layout: center
alias: start

defaults:
  layout: zoomable


---

# Negligence

---
class: -mt-8
alias: overview
---

## Overview: Negligence in General

<v-clicks>

1. **_Prima Facie_ Case for Liability**  
   > **Note:** "*prima facie* case" means: <br>
   > **(a)** P has alleged sufficient evidence to support a claim at **face value**, and <br>
   > **(b)** P's evidence is rebuttable by defenses.

   - **Duty** (to others)
   - **Breach** (of duty)
   - **Damages** (suffered by another)
   - **Causation** (of damages)

2. **Defenses to Liability**
   - Failure of Proof
   - Affirmative Defenses

</v-clicks>

---
alias: overview_flowchart
class: -mt--45
---

<Transform :scale="2.0" origin="left">

Overview Flowchart
<br>

```mermaid 
flowchart TB 
    start["**START HERE**"] --> du["**Element: Duty**<br>Did D owe a<br/>**legal duty** to P?"]
    du -- **No** --> not_liab["**STOP:<br>Not Liable**"]
    du -- **Yes** --> da["**Element: Damages**<br>Did P suffer **damages** (aka harm, injury, loss)?"]
    click du "/presenter/6/" "Go to Duty"
    da -- **No** --> not_liab
    da -- **Yes** --> br["**Element: Breach**<br>Did D **breach** their duty?"]
    br -- **No** --> not_liab
    br -- **Yes** --> ca["**Element: Causation**<br>Did D's conduct **cause** P's harm?"]
    ca -- **No** --> not_liab
    ca -- **Yes** --> pf(["**The D has a _prima_ facie case for negligence**"])
    pf --> def[Does D have an **affirmative defense**?]
    def -- **No** --> liable["**D is liable**"]
    def -- **Yes** --> not_liab

    start@{ shape: terminal}
    not_liab@{ shape: terminal}
    style start stroke-width:2.5px,stroke-dasharray: 2,fill:#fafafa,stroke:#000000
    style not_liab stroke-width:2.5px,fill:#FFF8F8,stroke:#880101
    liable@{ shape: diamond}
    style liable stroke-width:2.5px,fill:#ebf5eb,stroke:#2c5e36
    style pf stroke-width:2.5px,fill:#e1f5fe,stroke:#01579b
```
</Transform>

---
---

---
class: -mt-5
alias: duties
---

### When is there a duty?

<v-clicks>

1. **Foreseeability**  
   - Common law duty to avoid causing foreseeable harm to others

2. **On the Premises**
   - Owners/Possessors of a premises owe special duty to warn

3. **Special Relationships**
   - Special duties owed to certain relationship counterparts

4. **Creation of Risk**
   - Duty created when person creates a risk to others

5. **Assumption of Duty**
   - Duty exists when person assumes a duty that didn't previously exist

6. **Contract**
   - Contracts create duties between the contracting parties

</v-clicks>

---
class: -mt--20
---

<Transform :scale="2.2" origin="left">

```mermaid
flowchart LR 
    start["**START HERE**"] --> du["Did D owe a<br/>**legal duty** to P?"]
    du --> du1["Was there a **foreseeable** harm to P"]
    du --> du2["Did D own/possess a **premises** relevant to the circumstances?"]
    du --> du3["Did did and P have a **special relationship**?"]
    du --> du4["Did D **create** a risk**?"]
    du --> du5["Did D **assume a duty**?"]
    du --> du6["Did D have a **contract**?"]
    du1 --> yes-no["Were any of <br>the answers **yes**?"]
    du2 --> yes-no
    du3 --> yes-no
    du4 --> yes-no
    du5 --> yes-no
    du6 --> yes-no
    yes-no -- **No** --> no_du["**STOP:<br>D did not have<br>a duty to P**"]
    yes-no -- **Yes** --> duty["**D had a duty to P; <br><br>Move to Damages**"]
    click duty "/presenter/3/" "Go to Overview Flowchart"




    start@{ shape: terminal}
    no_du@{ shape: terminal}
    duty@{ shape: diamond}
    style start stroke-width:2.5px,stroke-dasharray: 2,fill:#fafafa,stroke:#000000
    style no_du stroke-width:2.5px,fill:#FFF8F8,stroke:#880101
    style yes-no stroke-width:2.5px,fill:#e1f5fe,stroke:#01579b
    style duty stroke-width:2.5px,fill:#ebf5eb,stroke:#2c5e36
```
</Transform>

---
---
# When is there a duty?

```mermaid
flowchart TB 
    start["**START HERE**"] --> du["**Element: Duty**<br>Did D owe a<br/>**legal duty** to P?"]
    du -- **No** --> not_liab["**STOP:<br>Not Liable**"]
    du -- **Yes** --> da["**Element: Damages**<br>Did P suffer **damages** (aka harm, injury, loss)?"]
    
    start@{ shape: terminal}
    not_liab@{ shape: terminal}
    style start stroke-width:2.5px,stroke-dasharray: 2,fill:#fafafa,stroke:#000000
    style not_liab stroke-width:2.5px,fill:#FFF8F8,stroke:#880101
```
---
alias: overview_map
zoom: 1.3
---

x


---
alias: placeholder
---
# Element 1: Duty
Did D have a duty to P?



what's up?





---
class: text-center
alias: not_liable
---

# Outcome

D is not liable for negligence.


---
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
alias: causation
decision: true
question: "Causation?"
yesTarget: breach
noTarget: damages
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
alias: damages
decision: true
question: "Causation?"
yesTarget: 4
noTarget: 7
dragPos:
  square: -109,0,0,0
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
