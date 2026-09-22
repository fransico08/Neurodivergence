# Canonical research source — ADC 2026 DHH + Neurodivergence

## Metadata

- Research lock: 2026-09-08.
- Audience: PDT, ADC Hackathon 2026.
- Artifact: `ADC_Hackathon_2026_DHH_Neurodivergence_Deep_Research.md`.
- Constraints: 3-day in-person build; 3–5 minute demo/video; commodity laptop/browser; workplace inclusion; Vietnamese-first.
- Exclusions: diagnosis/treatment, emotion/attention/productivity inference, certified safety alerting, general continuous sign-language translation.

## Direct answer

Build SignalFlow: a meeting evidence timeline that preserves verbatim timestamped captions and renders them through DHH, Focus, or Combined views. The shared job is information continuity; the needs are not assumed identical. MVP: Vietnamese captions, correction/glossary, immutable transcript, Now/Before/Next with evidence, user-controlled density, offline/extractive fallback. Stretch: speaker diarization, sound events, grounded LLM.

## Strategic thesis

- Caption-only is a commodity baseline across Android, Apple and Teams.
- DHH differentiation: speaker/context, confidence, correction, meaningful sounds and persistent evidence.
- Neuro differentiation: fewer loci of attention, predictable state, reduced notification, context recovery and original-preserving simplification.
- The central tension is richness versus cognitive load. Resolve by one evidence layer plus user-controlled renderers, not by replacing verbatim captions.
- General VSL translation is out: VSL400 is isolated-word, controlled access, single-site/limited signer diversity.

## Gap matrix

| Claim family                   | Source status                           |  Confidence | Limitation/contradiction                                        | Resolution                                                      |
| ------------------------------ | --------------------------------------- | ----------: | --------------------------------------------------------------- | --------------------------------------------------------------- |
| ADC dates/team/criteria        | Official RMIT current page              |        High | Detailed challenge brief arrives Day 1                          | Keep architecture reusable; reframe task after end-user session |
| Auditory/caption requirements  | W3C WAI/MAUR                            |        High | Requirements guidance, not performance evidence                 | Use as invariant; test implementation                           |
| Collaboration cognitive load   | W3C CTAUR + CHI hybrid meeting study    |        High | Qualitative/small samples; not Vietnam                          | Treat as design hypothesis; local co-design                     |
| Neurodivergent workplace needs | W3C COGA + peer-reviewed studies        | Medium–High | Heterogeneous populations/small regional samples                | Functional controls; no diagnosis preset                        |
| Market baseline                | Microsoft/Google/Apple product docs     |        High | Features depend on OS/device/license/region                     | Re-check on demo device; avoid blanket availability claims      |
| Caption customization          | CapTune + CHI ADHD video study          |      Medium | Small studies/content contexts, not live Vietnamese meetings    | Use as design signal; test preference and overload              |
| Vietnamese ASR                 | PhoASR/PhoWhisper/VietASR primary pages | Medium–High | Model cards/papers differ in data lineage; live meeting unknown | Benchmark on exact laptop, mic, accent and glossary             |
| VSL scope                      | Scientific Data/Zenodo/WFD              |        High | Dataset controlled and isolated-word                            | Future/closed vocabulary only; Deaf leadership                  |
| Safety/privacy                 | NIST + workplace research               |        High | Not Vietnam legal advice                                        | Consent, ephemeral data, evidence/abstention, no surveillance   |
| Product scores/targets         | Analyst judgment                        |      Medium | Depends on team skill/hardware/user access                      | Label estimates; define kill criteria                           |

## Consequential provenance records

### P01 — ADC scope and judging

- Claim: RMIT ADC is a 3-day AI & Employability hackathon on 21–23 Sep 2026 for teams of 3. Judging includes innovation/impact, user-centred accessibility, feasibility, responsible/meaningful AI and finale communication.
- Source: https://industryhub.rmit.edu.vn/ADC/
- Confidence: High.

### P02 — Captions are semantic alternatives, not raw text only

- Claim: Captions should include dialogue, speaker identification where necessary and meaningful non-speech audio.
- Sources: https://www.w3.org/WAI/WCAG21/Understanding/captions-prerecorded.html ; https://www.w3.org/WAI/media/av/captions/
- Confidence: High for design requirements.

### P03 — Caption/transcript and split attention

- Claim: synchronized captions and video can create two loci of attention; transcript supports slower reading/context but does not replace synchronized captions.
- Source: https://www.w3.org/TR/media-accessibility-reqs/
- Confidence: High for W3C user requirements; not a controlled effect-size estimate.

### P04 — Collaboration adds cognitive load beyond basic conformance

- Claim: teleconference/co-editing can be cognitively burdensome; many users cannot track multiple locations; WCAG alone may be insufficient for complex collaboration.
- Source: W3C Group Note, 2025: https://www.w3.org/TR/ctaur/
- Confidence: High for requirements framing.

### P05 — Hybrid meeting access tax

- Claim: DHH and neurodivergent professionals report split attention, cross-talk/audio problems and multiple conversational threads as barriers.
- Source: Alharbi, Tang & Henderson, CHI 2023: https://doi.org/10.1145/3544548.3581541 ; author PDF https://www.microsoft.com/en-us/research/uploads/prod/2024/06/RahafPaper.pdf
- Evidence: qualitative study with 21 professionals with disabilities, including 5 DHH and 7 neurodivergent participants.
- Confidence: High for pain-point identification; medium for Vietnam generalization.

### P06 — Neurodivergent video-call needs

- Claim: sensory sensitivities, cognitive load and anxiety shape channel preferences; autistic adults use substantial coping effort.
- Source: Microsoft Research/CSCW 2019: https://www.microsoft.com/en-us/research/publication/managing-stress-the-needs-of-autistic-adults-in-video-calling/
- Confidence: Medium–High; qualitative and older.

### P07 — Workplace systems assume neurotypicality

- Claim: ambiguous instruction, executive-function demand and implicit communication rules create barriers; participants see AI potential for structure and mutual understanding.
- Source: Kan et al., Frontiers in Psychiatry, 2026: https://www.frontiersin.org/journals/psychiatry/articles/10.3389/fpsyt.2026.1825357/full
- Evidence: participatory study with 20 autistic adults in Singapore.
- Confidence: Medium–High; small sample, not Vietnam.

### P08 — User preference contradicts a single “ADHD mode”

- Claim: captions/timestamps/speed controls can help, while dynamic highlighting is useful for some and distracting for others.
- Source: Jiang et al., CHI 2025: https://lucyajiang.github.io/files/papers/CHI25-ADHDVideo.pdf
- Evidence: interviews with 20 self-identifying ADHD participants.
- Confidence: Medium; video context, not live meetings.

### P09 — Caption richness versus cognitive load

- Claim: expressive caption richness has context-dependent tradeoffs; viewer control is safer than a fixed presentation.
- Source: CapTune, ASSETS 2025: https://soundability.eecs.umich.edu/img/portfolio/Huang_CapTune_ASSETS2025.pdf ; DOI https://doi.org/10.1145/3663547.3746346
- Evidence: evaluations with 7 creators and 12 DHH participants.
- Confidence: Medium; design evidence, not clinical outcome.

### P10 — Current product baseline

- Claim: Teams provides live captions, CART, caption style/position/line controls; captions are not saved without transcription. Android and Apple provide live captions/transcription with device/language limitations.
- Sources: https://support.microsoft.com/en-us/teams/meetings/use-live-captions-in-microsoft-teams-meetings ; https://support.google.com/accessibility/android/answer/9158064?hl=en ; https://support.apple.com/en-by/guide/iphone/iphe0990f7bb/ios
- Confidence: High for documented features, accessed 2026-09-08.

### P11 — Vietnamese ASR 2026 candidate

- Claim: PhoASR-whisper-small is a 0.2B Vietnamese Whisper-small derivative with word timestamps and explicit limitations for Central accents/rare terms; intended for research/education.
- Sources: model card https://huggingface.co/Qualcomm-AI-Research/PhoASR-whisper-small ; paper https://aclanthology.org/2026.findings-eacl.345/
- License: BSD 3-Clause Clear + Qualcomm Responsible AI License per card.
- Contradiction: paper abstract presents a unified 500-hour dataset; model card says fine-tuned on a 3000-hour variant of PhoASR-3100h. Do not merge these as one training-data claim.
- Confidence: High for availability/declared limits; medium for live meeting performance.

### P12 — Additional Vietnamese ASR routes

- PhoWhisper: fine-tuned multilingual Whisper on an 844-hour multi-accent dataset; BSD-3-Clause. https://huggingface.co/vinai/PhoWhisper-base/blob/main/README.md
- VietASR: Apache-2.0 repo, low-resource pipeline and 70,000-hour pseudo-label checkpoint; more complex icefall/k2 integration. https://github.com/zzasdf/VietASR
- Confidence: High for published card/repo facts; benchmark required.

### P13 — Speech evaluation data

- Claim: Common Voice is suitable for general/accent smoke testing but scripted speech is not a proxy for cross-talk/far-field meetings.
- Sources: https://commonvoice.mozilla.org/en/datasets ; 2026 release https://discourse.mozilla.org/t/release-live-mcv-scripted-speech-v26-0-and-spontaneous-speech-v4-0/148687
- Confidence: High. Exact current Vietnamese hours/speakers not asserted.

### P14 — VSL400 scope and access

- Claim: 74,259 clips, 400 isolated glosses, 28 signers; human videos require controlled access/DUA; it does not support a continuous-translator claim.
- Sources: https://doi.org/10.1038/s41597-026-08040-2 ; https://zenodo.org/records/17943574
- Confidence: High.

### P15 — Sign-language variation and leadership

- Claim: sign languages are natural languages with regional/social/register variation; sign-language initiatives need Deaf native-user leadership.
- Source: WFD: https://wfdeaf.org/wfd-statement-on-standardized-sign-language/
- Confidence: High for principle; local VSL validation still needed.

### P16 — Local AI tradeoff and GenAI risk

- Claim: local browser inference can improve offline/privacy properties but device support varies; confabulation and privacy remain separate risks.
- Sources: NIST AI 600-1 https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence ; ONNX Runtime Web https://onnxruntime.ai/docs/tutorials/web/ ; Whisper https://github.com/openai/whisper
- Confidence: High for platform/risk framing; medium for performance on unknown laptop.

## Decisions and kill criteria

- Select ASR only after 8–10 minute Vietnamese fixture benchmark on the demo laptop.
- Use 20 in-domain key terms; measure key-term accuracy and finalization latency, not only WER.
- Drop live diarization if it degrades caption readability or stability after a fixed timebox.
- Drop YAMNet if scripted false alerts exceed one.
- Drop generative recap if any factual field lacks a valid evidenceId; retain extractive mode.
- Pivot from live SignalFlow to Adaptive Caption Studio if streaming cannot complete 3 consecutive clean runs by end of Day 1.

## Unresolved gaps

- No direct Vietnam workplace study for intersectional DHH × neurodivergent users.
- No sufficiently representative open Vietnamese hybrid-meeting corpus for cross-talk/far-field benchmarking.
- User preference for confidence UI, density and motion needs local validation.
- Vietnamese privacy/recording and enterprise retention requirements need legal review for production.
- Product market/pricing/patent landscape not in scope.

## Diminishing-returns stop

Consequential claims about competition scope, DHH caption needs, neuro cognitive load, market baseline, Vietnamese ASR, VSL access, safety and 3-day feasibility now have primary/official support or explicit limitations. Remaining uncertainty can only be materially reduced by local co-design and on-device benchmarking, not more general web search.
