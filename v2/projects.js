/*
  Portfolio 2.0 project data. One object per project.
  Facts come from each project's GitHub README. Update both together.
  Image paths are relative to the v2/ folder.
*/
const IMG = '../assets/img/v2/';

const PROJECTS = [
  {
    id: 'serdes-link',
    title: '5 Gb/s SerDes link',
    year: '2026',
    kind: 'Personal research',
    line: 'A serial link modeled from transmitter to recovered bits, with the digital blocks rebuilt in SystemVerilog and checked against the model.',
    headline: 'Eye 126 mV × 0.41 UI, BER < 1e-15 (computed)',
    tools: ['Python', 'NumPy / SciPy', 'SystemVerilog', 'cocotb', 'Icarus Verilog', 'KiCad'],
    repo: 'https://github.com/jackpham-rgb/serdes-link',
    card: IMG + 'serdes-card.png',
    hero: { src: IMG + 'serdes-eye_steps.png', cap: 'The eye after each equalizer, 5 Gb/s over 36 in of FR4. Left to right: raw channel, + TX FFE, + CTLE, + DFE.' },

    problem: [
      'Send 5 billion bits per second down 36 inches of circuit-board trace and still read every bit at the far end.',
      'A long trace passes slow changes well and fast changes badly, so each bit smears into the bit slots after it. I learned this is called inter-symbol interference, or ISI, so that is what I call it here. The usual way to see ISI is to overlay thousands of received bits. If ones and zeros stay apart, the gap in the middle looks like an eye. A closed eye means the receiver cannot tell a one from a zero.',
      'Targets: bit error rate (BER) below 1e-12, an open eye at that rate, and a receiver that tolerates a 200 ppm clock offset.'
    ],
    diagram: 'bits → TX FFE → channel → CTLE → sampler → DFE → bits\n                                   ↑\n                                  CDR',
    approach: [
      'Each block removes the smear in a different way. The transmitter equalizer (TX FFE) sends a repeated bit slightly weaker, a 3.5 dB de-emphasis. The receiver amplifier (CTLE) boosts fast changes more than slow ones. The decision-feedback equalizer (DFE) subtracts the known smear of the last four decided bits, and its four weights tune themselves with sign-sign LMS. The clock recovery loop (CDR) has no clock wire to follow, so it watches zero crossings and nudges its sampling clock early or late each bit.',
      'Three decisions mattered most. I picked a 36 in channel because at 12 in the eye was already open and there was nothing to fix. I measured the eye statistically, from the response to one bit and every way its neighbors can add up, because simulating 1e12 bits to see one error is not practical. I chose the CTLE peaking, 5.5 dB, by sweeping it: too little leaves ISI and too much amplifies noise.'
    ],
    table: {
      head: ['Step', 'Eye height at 1e-12', 'Eye width at 1e-12', 'BER at eye center'],
      rows: [
        ['Raw channel', '0 mV', '0.00 UI', '2e-02'],
        ['+ TX FFE', '0 mV', '0.00 UI', '5e-07'],
        ['+ CTLE', '115 mV', '0.34 UI', '< 1e-15'],
        ['+ DFE', '126 mV', '0.41 UI', '< 1e-15']
      ],
      note: 'UI is one bit time, 200 ps here. Channel loss is 14.9 dB at 2.5 GHz.'
    },
    result: [
      'The computed raw error rate (1.9%) agrees with counting errors in 3,700 simulated bits (2.4%). The CDR locks and tracks a 200 ppm offset.',
      'In RTL, the PRBS bit generator matches the Python model on all 2,000 bits, the CDR loop filter matches on every one of about 4,000 steps, and the DFE agrees on over 99% of 4,000 decisions. All three run in cocotb with Icarus Verilog, and the repo has 43 passing tests.'
    ],
    figures: [
      { wide: true, src: IMG + 'serdes-channel.png', cap: 'Channel loss and the response to a single bit.' },
      { src: IMG + 'serdes-ctle_sweep.png', cap: 'Eye height against CTLE peaking. Too little leaves ISI; too much adds noise.' },
      { src: IMG + 'serdes-bathtub.png', cap: 'Bathtub curves: error rate against sampling point. A wider floor leaves more room for clock error.' },
      { wide: true, src: IMG + 'serdes-jtol_and_lock.png', cap: 'Jitter tolerance and CDR lock with a 200 ppm offset.' },
      { wide: true, src: IMG + 'serdes-dfe_taps.png', cap: 'DFE tap adaptation.' },
      { src: '../assets/img/serdes-test-channel-board.png', cap: 'KiCad test board: a 12 in line and a 1 in reference line. Designed and DRC-clean, not yet fabricated.' }
    ],
    broke: [
      'The eye read closed when it was open. My eye-height measurement included the dead time before the first bit arrived, so it returned zero on an open eye. A 12 in plot showing an open eye next to a number saying closed gave it away. The measurement now skips start-up and samples at the eye center.',
      'Both the DFE update and the CDR loop were first written as positive feedback. The DFE tap ran away and the CDR drifted to the edge of the eye from any starting point. Flipping one sign at a time and rerunning isolated each.'
    ],
    learnt: [
      'Check a measurement against a case with a known answer before trusting it on the case that matters.',
      'The DFE adds little here because the CTLE already removes most of the smear; a lossier channel would show it better. Next revision: measure a real trace on the fabricated board and make the DFE check bit-exact with a fixed-point reference.',
      'Limits: the channel is a synthetic model, and nothing has run on an FPGA or silicon yet.'
    ]
  },

  {
    id: 'fdtd-channel',
    title: 'FDTD channel solver',
    year: '2026',
    kind: 'Personal research',
    line: 'A transmission-line field solver in C++17, built from the telegrapher’s equations, with every result checked against analytic theory.',
    headline: 'S11 within 0.0012, S21 within 0.0016 of theory',
    tools: ['C++17', 'Python', 'NumPy / SciPy', 'pytest'],
    repo: 'https://github.com/jackpham-rgb/fdtd-channel',
    card: IMG + 'fdtd-sparams.png',
    hero: { src: IMG + 'fdtd-sparams.png', cap: 'S11 and S21 of a 100 Ω slab in a 50 Ω line. Measured (solid) sits on top of analytic (dashed).' },

    problem: [
      'The SerDes project uses a channel model. Before trusting one, I wanted to watch a signal travel down a line, reflect and lose energy, and see the numbers match theory.',
      'The method steps voltage and current forward in small slices of time and space. I learned it is called the finite-difference time-domain method, or FDTD. The goal was a solver whose reflection, S-parameter and loss results each agree with closed-form answers.'
    ],
    diagram: 'C++17 leapfrog core  →  Python: build, run, measure  →  compare to analytic',
    approach: [
      'One core scheme in C++17, with voltage and current on staggered grids, extended three ways: a resistive load for reflection, position-dependent L(x) and C(x) for an impedance step, and series R plus shunt G for loss. A Python layer builds each case, runs it and measures the result.',
      'Decisions that mattered: a matched source, so every reflection comes from the load and not the source; a time step set by the smaller of two stability limits with a 0.2 safety factor; and time-domain gating to split incident, reflected and transmitted waves before taking S-parameters.'
    ],
    table: {
      head: ['Check', 'Result vs analytic'],
      rows: [
        ['Reflection, 5 loads', '4 of 5 within 0.0003; matched load reads 0.0114 against 0'],
        ['S-parameters, 100 Ω slab in 50 Ω line', 'max |S11| error 0.0012, max |S21| error 0.0016'],
        ['Loss, R = 200 Ω/m, G = 0.0002 S/m, 110 MHz to 1 GHz', 'within about 1.1 dB/m of 15 to 17.5 dB/m (5 to 7%)'],
        ['Test suite', '5 terminations + causality, 3 slab cases, 3 loss cases + lossless limit']
      ],
      note: 'The matched case has the largest error because the true reflection is zero, so any residual is all of the signal.'
    },
    result: [
      'Measured loss crosses the R/L corner at 127 MHz where theory puts it. A pulse launched down the lossy line comes back smaller and wider, the expected attenuation and dispersion.'
    ],
    figures: [
      { src: IMG + 'fdtd-sparams_time_domain.png', cap: 'Time-domain gating: incident, reflected and transmitted waves separated before the FFT.' },
      { src: IMG + 'fdtd-loss_vs_freq.png', cap: 'Attenuation against frequency, measured (solid) and analytic (dashed).' },
      { src: IMG + 'fdtd-wave_reflection.png', cap: 'Snapshots of a pulse from a matched source reflecting off an open end.' }
    ],
    broke: [
      'The source added a fixed amount of charge every step. Smaller time steps made the blow-up faster, and peak amplitude times step size stayed constant across four Courant numbers, which pointed straight at the source update.',
      'An unmatched source corrupted every reflection except the open circuit: a short read +0.56 instead of −1.0. A matched (Thevenin) source fixed all five cases.',
      'S-parameters came out 20 to 50% high. A Hamming window was distorting the cropped data; a Tukey window on the same data brought the error under 2%.'
    ],
    learnt: [
      'Sweeping one variable, here the time step, and looking at what stays constant found a bug faster than reading the code.',
      'Below about 100 MHz the measured loss flattens too early, so that band is outside the validated claim. This is a from-scratch teaching solver, not a replacement for HFSS or ADS.'
    ]
  },

  {
    id: 'accessisound',
    title: 'AccessiSound',
    year: '2026',
    kind: 'Hackathon to personal build',
    line: 'An ESP32-S3 device that listens to a room, recognizes sounds and alerts the user. Three versions, from a hackathon prototype to a unit a friend uses daily.',
    headline: '47 to 53% on 5 sound classes (chance 20%), all on-chip',
    tools: ['ESP32-S3', 'C++ / PlatformIO', 'TensorFlow Lite', 'Python', 'Fusion 360'],
    repo: 'https://github.com/jackpham-rgb/accessisound-esp32s3',
    card: '../assets/img/accessisound-v1-soda-hacks.jpg',
    hero: { src: '../assets/img/accessisound-v2-model.png', cap: 'v2 enclosure, modeled in Fusion 360. It started as a copy of the ESP32-S3-BOX-3 and ended up looking like an early Macintosh.' },

    problem: [
      'A doorbell, a smoke alarm or a ringing phone carries information that a person with hearing loss can miss. The goal was a small battery device that recognizes those sounds and alerts with vibration, light and a display, with all processing on the chip.'
    ],
    diagram: 'mic → 32 ms frames → 13 MFCCs → 32-frame window (0.53 s) → CNN → alert if score ≥ 0.72',
    approach: [
      'Each 32 ms slice of audio becomes 13 numbers that describe its spectrum the way the ear spaces pitch. I learned these are called mel-frequency cepstral coefficients, or MFCCs. Thirty-two slices stack into a 0.53 s window that feeds a small CNN with 7,429 parameters. An alert fires only when the top class scores at least 0.72.',
      'v1 was built in one day at SoDA Hacks (March 2026) on a borrowed ESP32-S3-BOX-3. v2 was a rebuild with my own parts: ESP32-S3, ESP32-CAM, a 1.54 in display, an I2S microphone, a LiPo battery and a custom enclosure. v2.5 added kitchen object recognition through the camera and went to a friend whose family has hearing and vision impairments.'
    ],
    table: {
      head: ['Measure', 'Result'],
      rows: [
        ['Test accuracy, 5 classes (ESC-50 stand-in sounds)', '47 to 53% (chance 20%)'],
        ['Firmware features vs NumPy reference, same frames', 'agree to about 3e-5'],
        ['Firmware features vs training features', 'mean correlation 0.78, worst 0.39'],
        ['Model size', '7,429 parameters']
      ],
      note: 'ESC-50 has no doorbell, smoke alarm or phone ring, so each class trains on the closest stand-in.'
    },
    result: [
      'The v2.5 unit is in daily use in a dorm kitchen. The pipeline figures below are drawn with the firmware’s own math rewritten in NumPy.'
    ],
    figures: [
      { src: '../assets/img/accessisound-v1-soda-hacks.jpg', cap: 'Presenting v1 at SoDA Hacks on the borrowed ESP32-S3-BOX-3.' },
      { src: '../assets/img/accessisound-v2-internals.png', cap: 'v2 internal layout and wiring.' },
      { src: '../assets/img/accessisound-pipeline-features.png', cap: 'One clip: waveform, spectrogram, mel spectrogram and MFCCs on a shared time axis.' },
      { wide: true, src: '../assets/img/accessisound-train-vs-firmware.png', cap: 'The same audio through the firmware and the training pipeline. Similar, not identical.' }
    ],
    broke: [
      'The firmware and the training script compute features differently: different pre-emphasis, filter range, window length and normalization. Comparing them coefficient by coefficient on the same audio gave a mean correlation of 0.78. A model trained this way has not yet been checked end to end on the device.'
    ],
    learnt: [
      'Train on exactly the features the device computes, and test that match before training anything.',
      'Next revision: one shared feature extractor, 20 to 40 real recordings per target sound, and a background class so the 0.72 threshold is not the only guard against false alerts.',
      'Limits: there is no photo of the physical v2 unit, and the camera and display code is not in the repo yet.'
    ]
  },

  {
    id: 'drone-ugv',
    title: 'Drone-UGV disaster response',
    year: '2024 to 2026',
    kind: 'REU follow-up',
    line: 'Drones scout a disaster area and hand off to ground robots through a shared map. Three multi-agent learning methods, measured against doing nothing.',
    headline: 'All three methods near the do-nothing baseline (−2)',
    tools: ['Python', 'PyTorch', 'PettingZoo', 'EPyMARL', 'three.js'],
    repo: 'https://github.com/jackpham-rgb/drone-ugv-disaster-response',
    card: IMG + 'drone-demo.gif',
    hero: { src: IMG + 'drone-demo.gif', cap: 'A trained IPPO policy on the training grid. Drones (triangles) find survivors (stars); ground robots (squares) reach them.' },

    problem: [
      'In 2024 I joined an NSF REU at UT Austin with the Texas Advanced Computing Center. That project assigned disaster-response tasks to robots fairly using linear programming, a fairness-weighted learning method (FE-MADDPG) and conflict-based path search, and ended in a paper and poster.',
      'This follow-up asks a different question: what happens when drones can see but not rescue, ground robots can rescue but not see, and the only link between them is a shared map?'
    ],
    diagram: 'drones (MAPPO) → shared belief map → ground robots (QMIX) → rescue\n                                     fire trucks (greedy) → suppression',
    approach: [
      'Drones write what they find to a shared map; ground robots plan only from that map. The fairness reward from the REU paper is subtracted from each ground robot’s value, so a robot with more completed rescues bids lower on the next one.',
      'Training uses a PettingZoo environment. QMIX and MAPPO run through EPyMARL, a third-party implementation, for 100,000 steps each; independent PPO (IPPO) is written from scratch. A browser simulation in three.js shows the full scenario with terrain and spreading fire.'
    ],
    table: {
      head: ['Method', 'Final return per agent'],
      rows: [
        ['QMIX (EPyMARL)', '−1.50'],
        ['MAPPO (EPyMARL)', '−1.66'],
        ['IPPO (from scratch, 3 seeds)', '−1.96'],
        ['Do-nothing baseline', 'about −2']
      ],
      note: 'Higher is better. 100,000 training steps.'
    },
    result: [
      'All three policies learn something, and none is good yet. QMIX does best, but every method sits close to the return of barely moving.'
    ],
    figures: [
      { src: IMG + 'drone-baseline_comparison.png', cap: 'Mean return per agent over training for QMIX, MAPPO and IPPO.' },
      { src: IMG + 'drone-map_preview.png', cap: 'The full scenario: terrain, spreading fire and all three agent types.' }
    ],
    broke: [
      'The first browser simulation labeled its agents MAPPO and QMIX while they ran hand-written scoring. Real training replaced the labels with learning curves, and those curves showed how far the policies are from useful.'
    ],
    learnt: [
      'A labeled demo is not a result; a curve against a baseline is.',
      'Next: longer training, more seeds, baselines such as IQL and VDN, and an ablation that turns the fairness term off.'
    ],
    links: [
      { label: 'Interactive 3D simulation', url: 'https://jackpham-rgb.github.io/drone-ugv-disaster-response/web/sim3d_v3.html' },
      { label: '2024 REU repo', url: 'https://github.com/jackpham-rgb/area-disaster-response' }
    ]
  }
];

/* Featured on the home page, in order. */
const FEATURED = ['serdes-link', 'fdtd-channel', 'accessisound'];
