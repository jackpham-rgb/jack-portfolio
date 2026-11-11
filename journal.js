/*
  Journal entries, newest first. Each shows how a project went,
  including what broke. `project` links to a project page id (optional).
*/
const JOURNAL = [
  {
    id: 'game-theory-in-ee',
    date: 'Fall 2026',
    title: 'Bringing game theory into EE',
    link: { label: 'rf-mixed-signal-security-game', url: 'https://github.com/jackpham-rgb/rf-mixed-signal-security-game' },
    body: [
      'It started with all the AI and ML buzz at work. During downtime at my co-op I hung out with the AI and ML team, watched some intro to AI lectures, and kept wondering how game theory could fit into EE. My first guess was circuits, like electrons picking paths through wires. Digging deeper, I wanted a corner fewer people have looked at, and landed on signals and ML.',
      'The question: can a device shuffle its clock and dummy power draw so someone listening to its RF or power noise learns less, without burning too much energy? Early answer: a little. Randomizing beats the best fixed setting in 27 of 400 cases, by at most about 0.05 bits per trace. Still in progress.'
    ]
  },
  {
    id: 'eye-that-looked-closed',
    date: 'Fall 2026',
    title: 'The eye that looked closed',
    project: 'serdes-link',
    body: [
      'My SerDes model reported that the eye at 12 inches was fully closed, and the plot next to that number showed it wide open. One of them was wrong. The plot came straight from the simulated waveform, so I trusted it and went after the measurement.',
      'The eye-height code included the dead time before the first bit arrived. That flat stretch of signal pulled the measured opening to zero. Once the measurement skipped start-up and sampled at the eye center, 12 inches turned out to be too easy: the eye was open with no equalization at all. I moved to 36 inches, 14.9 dB of loss at 2.5 GHz, so the equalizers had something to fix, and redid every result I had written up from the broken measurement.',
      'I now check a measurement on a case with a known answer before trusting it on the case that matters.'
    ],
    fig: { src: 'assets/img/projects/serdes-card.png', cap: 'After the fix, at 36 in: raw channel (left) and after the full equalizer chain (right).' }
  },
  {
    id: 'survey-as-load-list',
    date: 'October 2026',
    title: 'Reading a survey as a load list',
    body: [
      'I joined the LEAP Institute as volunteer electrical support for a solar, battery storage and EV charging microgrid in Huron, CA. My first task was reading, not designing: concept papers, budgets and a community survey of 33 residents and 24 vendors. I turned what people said they needed into electrical loads, mainly refrigerated storage, a cooling center, a commissary kitchen, and event lighting and stage power.',
      'That list turned up a conflict. The plan includes six DC fast chargers and also calls the site net zero. Whether both can be true depends on where the net zero boundary is drawn, so I raised it with the team to settle before the design goes further.'
    ]
  },
  {
    id: 'smaller-step-worse',
    date: 'September 2026',
    title: 'When a smaller time step made it worse',
    project: 'fdtd-channel',
    body: [
      'My first FDTD solver blew up to infinity on an open-circuit line. A smaller time step should make a simulation more stable; here it made it blow up faster. I swept the step over four values and saw that peak amplitude times step size stayed constant. That pattern means something gets added a fixed amount per step regardless of how long a step is. It was the source: the code added the raw pulse value to the first node on every step.',
      'Fixing that exposed a second problem. Every load except the open circuit gave the wrong reflection; a short read +0.56 instead of −1.0. The source had zero impedance, so waves bounced back off it. A matched source fixed all five cases, and four of them now land within 0.0003 of theory.'
    ],
    fig: { src: 'assets/img/projects/fdtd-wave_reflection.png', cap: 'A pulse from the matched source reflecting off an open end.' }
  },
  {
    id: 'label-not-result',
    date: '2026',
    title: 'A label is not a result',
    project: 'drone-ugv',
    body: [
      'My browser simulation of drones and ground robots had buttons labeled MAPPO and QMIX, two multi-agent learning methods. Behind the labels was hand-written scoring. It looked convincing and measured nothing.',
      'So I built a real training environment, ran QMIX and MAPPO through EPyMARL, a published implementation, and wrote independent PPO from scratch. After 100,000 steps all three sit close to the return of a policy that barely moves, about −2 per agent, with QMIX best at −1.50. That result looks worse than the demo did, and it is more useful, because now there is a number to improve.'
    ]
  },
  {
    id: 'interviews-before-hardware',
    date: 'Spring 2026',
    title: 'Interviews before hardware',
    body: [
      'In the Fung Fellowship, our team of four (anthropology, society and environment, electrical engineering and mechanical engineering) took on methane emissions with Climate Action California. I expected to start with a sensor. We started with 12 stakeholder interviews, and they pointed at the real gap: there is little methane data at the household level.',
      'That shaped the device, a $15 household methane sensor built from off-the-shelf parts. Our findings went to the California Air Resources Board.'
    ],
    fig: { src: 'assets/img/projects/methane-prototype.jpg', cap: 'The sensor prototype. Photo: Fung Institute.' }
  },
  {
    id: 'garbage-in',
    date: 'Spring 2026',
    title: 'EEG: garbage in, garbage out',
    body: [
      'EEG is a tiny signal in a noisy room. Power lines put a strong 60 Hz tone on every channel, and one eye blink is far larger than the brain activity we wanted to classify. On this team project most of the work came before any model: a 60 Hz notch filter, a 1 to 50 Hz bandpass, and ICA, a method that separates mixed sources, to pull out eye artifacts.',
      'The final classifier, XGBoost on band-power features from 60 subjects, reached 64.3% on engaged vs low-attention states. With measured data, the cleaning decides what any model can find.'
    ]
  },
  {
    id: 'first-hackathon',
    date: 'March 2026',
    title: 'First hackathon, then the rebuild',
    project: 'accessisound',
    body: [
      'SoDA Hacks on March 7, 2026, was my first hackathon. In one day I built a sound-recognition assistant on an ESP32-S3-BOX-3 lent by CSUA, trained on basic recordings, online datasets and CSUA computing resources. Afterward I bought my own parts and rebuilt it with a custom enclosure, and later made a version for a friend whose family has hearing and vision impairments.',
      'Writing the pipeline up properly, I ran the same audio through the firmware’s feature code and the training script’s. They only partly agree, with a mean correlation of 0.78. The demo worked, but the pipeline was not consistent end to end, and that is the first thing to fix in the next revision.'
    ],
    fig: { src: 'assets/img/accessisound-v1-soda-hacks.jpg', cap: 'Presenting v1 at SoDA Hacks.' }
  },
  {
    id: 'signals-as-vectors',
    date: 'Fall 2025',
    title: 'EECS 16A: signals as vectors',
    body: [
      'Professor Babak Ayazifar’s lectures changed how I see signals. A recording of n samples is a point in n-dimensional space, so comparing two sounds becomes geometry, and all of linear algebra applies.',
      'The voice command lab used that directly. Aligned recordings become vectors, SVD finds the few directions where they differ most, and each new command is labeled by the nearest class center in that smaller space. It reached about 97% on live recordings of one speaker.',
      'The acoustic positioning lab was my favorite. Speakers play known tones, and cross-correlating each with the microphone signal gives a peak at the arrival delay. Delay times the speed of sound (343 m/s) gives a distance, and three distances give a position through a least-squares solve. It is the same idea as GPS, with sound instead of satellites.'
    ]
  },
  {
    id: 'first-research',
    date: 'Summer 2024',
    title: 'First research, and two scales of computing',
    body: [
      'My first research project was an NSF REU at UT Austin with the Texas Advanced Computing Center: fair task allocation for a team of disaster-response robots, posed as a linear program and paired with a fairness-weighted learning reward. It ended in a paper and a poster, presented at SCCUR and STARS in 2024.',
      'Running those experiments on an HPC cluster, and later writing firmware for an ESP32-S3 with 512 KB of RAM, showed me the same problem has different costs at each scale. On the cluster I cared about throughput. On the microcontroller I cared about memory and worst-case delay. The Drone-UGV project picks up where this one left off.'
    ]
  }
];
