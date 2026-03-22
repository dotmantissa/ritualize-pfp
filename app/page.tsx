'use client';

import { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { Download, ArrowLeft, Image as ImageIcon, Dices, UploadCloud, User, Share2 } from 'lucide-react';

// --- DATA DICTIONARY FOR THE 25 TEMPLATES ---
const TEMPLATES_DB = {
  'Ascendant Ritualist': [
    { rune: '✦ ᚱᛁᛏᚢᚨᛚ ✦ ᚨᛋᚲᛖᚾᛞᚨᚾᛏ ✦', hex: '0x4D1A', svg: '<g opacity=".12" stroke="#DE9A51" stroke-width="0.7"><line x1="140" y1="134" x2="140" y2="0"/><line x1="140" y1="134" x2="280" y2="60"/><line x1="140" y1="134" x2="280" y2="200"/><line x1="140" y1="134" x2="140" y2="260"/><line x1="140" y1="134" x2="0" y2="200"/><line x1="140" y1="134" x2="0" y2="60"/><line x1="140" y1="134" x2="220" y2="14"/><line x1="140" y1="134" x2="60" y2="14"/><line x1="140" y1="134" x2="270" y2="134"/><line x1="140" y1="134" x2="10" y2="134"/></g><circle cx="140" cy="134" r="115" fill="none" stroke="#DE9A51" stroke-width="0.5" opacity=".1"/><path d="M100 44 L110 30 L125 42 L140 26 L155 42 L170 30 L180 44 L180 52 L100 52 Z" fill="rgba(222,154,81,.13)" stroke="#DE9A51" stroke-width="1" opacity=".7"/><circle cx="140" cy="26" r="3.5" fill="#DE9A51" opacity=".8"/><circle cx="110" cy="30" r="2.5" fill="#DE9A51" opacity=".65"/><circle cx="170" cy="30" r="2.5" fill="#DE9A51" opacity=".65"/><rect x="40" y="268" width="200" height="1" fill="#DE9A51" opacity=".2"/><rect x="60" y="272" width="160" height="0.5" fill="#DE9A51" opacity=".12"/>' },
    { rune: '☼ ᛋᚨᚲᚱᛖᛞ ☼ ᚷᛖᛟ ☼', hex: '0x4D1B', svg: '<g fill="none" stroke="#DE9A51" opacity=".15" stroke-width="0.5"><circle cx="140" cy="134" r="120"/><circle cx="140" cy="14" r="120"/><circle cx="140" cy="254" r="120"/><circle cx="20" cy="134" r="120"/><circle cx="260" cy="134" r="120"/></g><path d="M120 40 L140 10 L160 40 Z" fill="rgba(222,154,81,.2)" stroke="#DE9A51" stroke-width="0.8" opacity=".8"/><circle cx="140" cy="25" r="3" fill="#DE9A51"/><rect x="20" y="268" width="240" height="1" fill="#DE9A51" opacity=".15"/>' },
    { rune: '✧ ᛉᛖᚾᛁᛏᚺ ✧ ᚨᛋᚲᛖᚾᛏ ✧', hex: '0x4D1C', svg: '<g stroke="#DE9A51" stroke-width="0.5" opacity=".12" fill="none"><polygon points="140,10 270,134 140,258 10,134"/><polygon points="140,30 250,134 140,238 30,134"/><polygon points="140,50 230,134 140,218 50,134"/></g><path d="M110 50 L140 15 L170 50 L140 35 Z" fill="rgba(222,154,81,.3)" stroke="#DE9A51" opacity=".9"/><circle cx="140" cy="134" r="110" fill="none" stroke="#DE9A51" stroke-width="0.5" stroke-dasharray="1 4" opacity=".2"/>' },
    { rune: '❂ ᛟᚱᛒᛁᛏᚨᛚ ❂ ᛚᛁᚷᚺᛏ ❂', hex: '0x4D1D', svg: '<ellipse cx="140" cy="134" rx="130" ry="40" fill="none" stroke="#DE9A51" stroke-width="0.5" opacity=".2" transform="rotate(30 140 134)"/><ellipse cx="140" cy="134" rx="130" ry="40" fill="none" stroke="#DE9A51" stroke-width="0.5" opacity=".2" transform="rotate(-30 140 134)"/><circle cx="140" cy="134" r="118" fill="none" stroke="#DE9A51" stroke-width="1" stroke-dasharray="10 20" opacity=".3"/><path d="M130 35 Q140 10 150 35 Q140 25 130 35 Z" fill="#DE9A51" opacity=".8"/>' },
    { rune: '▽ ᚲᚱᚤᛋᛏᚨᛚ ▽ ᛋᛟᚢᛚ ▽', hex: '0x4D1E', svg: '<g fill="none" stroke="#DE9A51" stroke-width="0.6" opacity=".15"><polygon points="140,0 150,40 140,60 130,40"/><polygon points="20,134 60,124 80,134 60,144"/><polygon points="260,134 220,124 200,134 220,144"/><polygon points="140,268 150,228 140,208 130,228"/><polygon points="60,60 80,80 90,60 70,50"/><polygon points="220,60 200,80 190,60 210,50"/></g><circle cx="140" cy="134" r="105" fill="none" stroke="#DE9A51" opacity=".2"/><path d="M125 45 L140 20 L155 45 Z" fill="#DE9A51" opacity=".4"/>' }
  ],
  'Ritualist': [
    { rune: 'ᚷ ᚱᛁᛏᚢᚨᛚᛁᛋᛏ ᚷ ᚱᛁᛏᚢᚨᛚ ᚷ', hex: '0x3C09', svg: '<circle cx="140" cy="134" r="108" fill="none" stroke="#5AFD8E" stroke-width="0.6" opacity=".15" stroke-dasharray="4 8"/><circle cx="140" cy="134" r="122" fill="none" stroke="#5AFD8E" stroke-width="0.4" opacity=".09"/><polygon points="140,30 228,166 52,166" fill="none" stroke="#5AFD8E" stroke-width="0.7" opacity=".12"/><polygon points="140,238 52,102 228,102" fill="none" stroke="#5AFD8E" stroke-width="0.7" opacity=".09"/><g stroke="#5AFD8E" stroke-width="0.8" opacity=".3"><line x1="140" y1="12" x2="140" y2="22"/><line x1="246" y1="72" x2="237" y2="77"/><line x1="246" y1="196" x2="237" y2="191"/><line x1="140" y1="256" x2="140" y2="246"/><line x1="34" y1="196" x2="43" y2="191"/><line x1="34" y1="72" x2="43" y2="77"/></g><rect x="40" y="268" width="200" height="1" fill="#5AFD8E" opacity=".18"/>' },
    { rune: '⚚ ᛟᚱᚷᚨᚾᛁᚲ ⚚ ᚾᛖᛏᚹᛟᚱᚲ ⚚', hex: '0x3C0A', svg: '<path d="M40 200 Q 80 134 140 250 T 240 70" fill="none" stroke="#5AFD8E" stroke-width="0.8" opacity=".2"/><path d="M40 70 Q 80 134 140 20 T 240 200" fill="none" stroke="#5AFD8E" stroke-width="0.8" opacity=".2"/><circle cx="140" cy="134" r="110" fill="none" stroke="#5AFD8E" opacity=".15"/><circle cx="140" cy="24" r="4" fill="#5AFD8E" opacity=".6"/><circle cx="58" cy="180" r="2" fill="#5AFD8E" opacity=".4"/><circle cx="222" cy="88" r="2" fill="#5AFD8E" opacity=".4"/>' },
    { rune: '◈ ᛟᚲᛏᚨᚷᛟᚾ ◈ ᛋᛁᚷᛁᛚ ◈', hex: '0x3C0B', svg: '<g fill="none" stroke="#5AFD8E" stroke-width="0.5" opacity=".18"><polygon points="140,14 225,49 260,134 225,219 140,254 55,219 20,134 55,49"/><polygon points="140,34 208,62 236,134 208,206 140,234 72,206 44,134 72,62"/></g><rect x="138" y="20" width="4" height="4" fill="#5AFD8E" opacity=".6" transform="rotate(45 140 22)"/>' },
    { rune: '◬ ᚨᛚᚲᚺᛖᛗᚤ ◬ ᛈᛟᚹᛖᚱ ◬', hex: '0x3C0C', svg: '<circle cx="140" cy="134" r="115" fill="none" stroke="#5AFD8E" stroke-width="0.5" opacity=".15"/><circle cx="140" cy="19" r="15" fill="none" stroke="#5AFD8E" stroke-width="0.8" opacity=".3"/><circle cx="140" cy="249" r="15" fill="none" stroke="#5AFD8E" stroke-width="0.8" opacity=".3"/><circle cx="25" cy="134" r="15" fill="none" stroke="#5AFD8E" stroke-width="0.8" opacity=".3"/><circle cx="255" cy="134" r="15" fill="none" stroke="#5AFD8E" stroke-width="0.8" opacity=".3"/><polygon points="140,19 255,134 140,249 25,134" fill="none" stroke="#5AFD8E" stroke-width="0.5" opacity=".1"/>' },
    { rune: '♒ ᚠᚱᛖᚲᚢᛖᚾᚲᚤ ♒ ᛋᛟᚢᚾᛞ ♒', hex: '0x3C0D', svg: '<g fill="none" stroke="#5AFD8E" stroke-width="0.6" opacity=".15"><path d="M20 134 Q 80 50 140 134 T 260 134"/><path d="M20 134 Q 80 218 140 134 T 260 134"/><path d="M20 100 Q 80 16 140 100 T 260 100"/><path d="M20 168 Q 80 252 140 168 T 260 168"/></g><circle cx="140" cy="134" r="105" fill="none" stroke="#5AFD8E" stroke-dasharray="2 4" opacity=".2"/>' }
  ],
  'Ritty': [
    { rune: '— RITTY — PROTOCOL — RITTY —', hex: '0x2B77', svg: '<g stroke="#9884D5" stroke-width="0.5" opacity=".1"><line x1="0" y1="80" x2="280" y2="80"/><line x1="0" y1="200" x2="280" y2="200"/><line x1="60" y1="0" x2="60" y2="380"/><line x1="220" y1="0" x2="220" y2="380"/></g><path d="M140 20 L238 76 L238 192 L140 248 L42 192 L42 76 Z" fill="none" stroke="#9884D5" stroke-width="0.8" opacity=".15"/><path d="M140 44 L214 86 L214 170 L140 212 L66 170 L66 86 Z" fill="none" stroke="#9884D5" stroke-width="0.5" opacity=".09"/><rect x="28" y="267" width="224" height="1.5" fill="#9884D5" opacity=".22"/><rect x="50" y="271" width="180" height="0.5" fill="#9884D5" opacity=".12"/>' },
    { rune: '[ SYS.ACTIVATE // RITTY ]', hex: '0x2B78', svg: '<g fill="none" stroke="#9884D5" stroke-width="1.5" opacity=".4"><path d="M40 80 L30 80 L30 180 L40 180"/><path d="M240 80 L250 80 L250 180 L240 180"/></g><g stroke="#9884D5" stroke-width="0.5" opacity=".15"><line x1="30" y1="130" x2="10" y2="130"/><line x1="250" y1="130" x2="270" y2="130"/><line x1="140" y1="20" x2="140" y2="40"/><circle cx="140" cy="134" r="120" fill="none" stroke-dasharray="2 8"/></g><rect x="135" y="25" width="10" height="4" fill="#9884D5" opacity=".6"/>' },
    { rune: 'ERR_OVERRIDE_0xRITTY', hex: '0x2B79', svg: '<rect x="20" y="20" width="240" height="230" fill="none" stroke="#9884D5" stroke-width="0.5" opacity=".15"/><rect x="25" y="60" width="10" height="40" fill="#9884D5" opacity=".2"/><rect x="245" y="160" width="10" height="30" fill="#9884D5" opacity=".3"/><rect x="120" y="20" width="40" height="5" fill="#9884D5" opacity=".4"/><rect x="40" y="240" width="80" height="2" fill="#9884D5" opacity=".2"/><circle cx="140" cy="134" r="105" fill="none" stroke="#9884D5" opacity=".1"/>' },
    { rune: '((( RADAR // ONLINE )))', hex: '0x2B7A', svg: '<circle cx="140" cy="134" r="115" fill="none" stroke="#9884D5" stroke-width="0.5" opacity=".15"/><circle cx="140" cy="134" r="80" fill="none" stroke="#9884D5" stroke-width="0.5" opacity=".1"/><circle cx="140" cy="134" r="45" fill="none" stroke="#9884D5" stroke-width="0.5" opacity=".05"/><path d="M140 134 L230 44 A 115 115 0 0 1 255 134 Z" fill="#9884D5" opacity=".05"/><line x1="140" y1="134" x2="255" y2="134" stroke="#9884D5" stroke-width="1" opacity=".4"/><circle cx="200" cy="74" r="3" fill="#9884D5" opacity=".6"/>' },
    { rune: '▲ FRAGMENT // MATRIX ▲', hex: '0x2B7B', svg: '<g fill="none" stroke="#9884D5" stroke-width="0.5" opacity=".15"><polygon points="140,10 200,60 140,110 80,60"/><polygon points="210,70 270,134 210,198 150,134"/><polygon points="70,70 130,134 70,198 10,134"/><polygon points="140,158 200,208 140,258 80,208"/></g><polygon points="130,20 140,10 150,20 140,30" fill="#9884D5" opacity=".4"/><polygon points="20,134 30,124 40,134 30,144" fill="#9884D5" opacity=".3"/>' }
  ],
  'Bitty': [
    { rune: '// BITTY // CIPHER // BITTY //', hex: '0x1E55', svg: '<g stroke="#3498DB" stroke-width="0.6" opacity=".14"><line x1="28" y1="134" x2="52" y2="134"/><line x1="228" y1="134" x2="252" y2="134"/><line x1="52" y1="134" x2="52" y2="60"/><line x1="228" y1="134" x2="228" y2="60"/><line x1="52" y1="60" x2="86" y2="60"/><line x1="228" y1="60" x2="194" y2="60"/><circle cx="52" cy="60" r="3" fill="none" stroke="#3498DB"/><circle cx="228" cy="60" r="3" fill="none" stroke="#3498DB"/><line x1="52" y1="208" x2="52" y2="268"/><line x1="228" y1="208" x2="228" y2="268"/></g><circle cx="140" cy="134" r="106" fill="none" stroke="#3498DB" stroke-width="0.5" opacity=".12" stroke-dasharray="2 6"/><rect x="28" y="267" width="224" height="1" fill="#3498DB" opacity=".2"/>' },
    { rune: ':: SYSTEM.NODE.ACTIVE ::', hex: '0x1E56', svg: '<g fill="#3498DB" opacity=".3"><rect x="30" y="30" width="4" height="4"/><rect x="40" y="30" width="4" height="4"/><rect x="50" y="30" width="4" height="4"/><rect x="246" y="230" width="4" height="4"/><rect x="236" y="230" width="4" height="4"/><rect x="226" y="230" width="4" height="4"/></g><rect x="40" y="40" width="200" height="188" fill="none" stroke="#3498DB" stroke-width="0.5" opacity=".1"/><circle cx="140" cy="134" r="115" fill="none" stroke="#3498DB" stroke-width="0.5" opacity=".1"/>' },
    { rune: '-- ISO // METRIC // GRID --', hex: '0x1E57', svg: '<g fill="none" stroke="#3498DB" stroke-width="0.5" opacity=".15"><polygon points="140,10 250,70 250,198 140,258 30,198 30,70"/><line x1="140" y1="10" x2="140" y2="134"/><line x1="30" y1="70" x2="140" y2="134"/><line x1="250" y1="70" x2="140" y2="134"/></g><circle cx="140" cy="134" r="105" fill="none" stroke="#3498DB" stroke-width="0.5" opacity=".1"/>' },
    { rune: '** DATA // LINK // ESTAB **', hex: '0x1E58', svg: '<g stroke="#3498DB" stroke-width="0.5" opacity=".15"><line x1="40" y1="40" x2="100" y2="80"/><line x1="100" y1="80" x2="180" y2="60"/><line x1="180" y1="60" x2="240" y2="100"/><line x1="40" y1="220" x2="90" y2="180"/><line x1="90" y1="180" x2="190" y2="210"/><line x1="190" y1="210" x2="240" y2="160"/></g><g fill="#3498DB" opacity=".5"><circle cx="40" cy="40" r="2"/><circle cx="100" cy="80" r="3"/><circle cx="180" cy="60" r="2"/><circle cx="240" cy="100" r="3"/><circle cx="40" cy="220" r="2"/><circle cx="90" cy="180" r="3"/><circle cx="190" cy="210" r="2"/><circle cx="240" cy="160" r="3"/></g>' },
    { rune: '(( FLUID // DYNAMICS ))', hex: '0x1E59', svg: '<path d="M-20 134 A 160 160 0 0 1 140 -26" fill="none" stroke="#3498DB" stroke-width="0.8" opacity=".15"/><path d="M300 134 A 160 160 0 0 1 140 294" fill="none" stroke="#3498DB" stroke-width="0.8" opacity=".15"/><circle cx="140" cy="134" r="115" fill="none" stroke="#3498DB" stroke-width="0.5" opacity=".1"/>' }
  ],
  'Normie': [
    { rune: '· NORMIE · BASE · NORMIE ·', hex: '0x0F3A', svg: '<circle cx="140" cy="134" r="106" fill="none" stroke="#ACA9A9" stroke-width="0.6" opacity=".12"/><circle cx="140" cy="134" r="118" fill="none" stroke="#ACA9A9" stroke-width="0.4" opacity=".06"/><g stroke="#ACA9A9" stroke-width="0.6" opacity=".12"><line x1="40" y1="134" x2="22" y2="134"/><line x1="240" y1="134" x2="258" y2="134"/><line x1="140" y1="20" x2="140" y2="38"/><line x1="140" y1="248" x2="140" y2="230"/></g><rect x="40" y="267" width="200" height="1" fill="#ACA9A9" opacity=".15"/><rect x="70" y="271" width="140" height="0.5" fill="#ACA9A9" opacity=".08"/>' },
    { rune: '· INIT · PROTOCOL · INIT ·', hex: '0x0F3B', svg: '<g fill="none" stroke="#ACA9A9" stroke-width="1" opacity=".2"><path d="M80 34 L30 34 L30 84"/><path d="M200 34 L250 34 L250 84"/><path d="M80 234 L30 234 L30 184"/><path d="M200 234 L250 234 L250 184"/></g><circle cx="140" cy="134" r="110" fill="none" stroke="#ACA9A9" stroke-width="0.5" opacity=".08"/>' },
    { rune: '· CLEAR · STATE · CLEAR ·', hex: '0x0F3C', svg: '<polygon points="140,24 250,134 140,244 30,134" fill="none" stroke="#ACA9A9" stroke-width="0.5" opacity=".12"/><circle cx="140" cy="24" r="2" fill="#ACA9A9" opacity=".3"/><circle cx="140" cy="244" r="2" fill="#ACA9A9" opacity=".3"/>' },
    { rune: '· ZERO · HORIZON · ZERO ·', hex: '0x0F3D', svg: '<g stroke="#ACA9A9" stroke-width="0.5" opacity=".12"><line x1="20" y1="60" x2="260" y2="60"/><line x1="20" y1="208" x2="260" y2="208"/><line x1="40" y1="40" x2="240" y2="40"/><line x1="40" y1="228" x2="240" y2="228"/></g>' },
    { rune: '· BLANK · CANVAS · BLANK ·', hex: '0x0F3E', svg: '<rect x="20" y="20" width="240" height="228" fill="none" stroke="#ACA9A9" stroke-width="0.8" stroke-dasharray="4 6" opacity=".15"/><circle cx="140" cy="134" r="110" fill="none" stroke="#ACA9A9" stroke-width="0.5" opacity=".08"/>' }
  ]
};

// --- FORTUNE COOKIE LORE ---
const FORTUNES = {
  normie: [
    "The blockchain doesn't know your name yet. Neither does anyone else.",
    "You joined just in time to be fashionably late to something you don't fully understand.",
    "Your wallet is empty but your vibes are immaculate. Balance your portfolio accordingly.",
    "The smart contract is smarter than you today. Tomorrow is a new day. Probably.",
    "You are the net-new user they were building this for. No pressure.",
    "Somewhere, a node is running. You are not that node.",
    "Every legend was once a normie who kept showing up. Keep showing up.",
    "You have not been verified. You have not been rejected either. You are simply... pending.",
    "The ritual has begun. You are still reading the instructions.",
    "Your transaction is processing. Much like your understanding of any of this.",
    "They said 'be early.' You are here. This counts.",
    "The chain is trustless. Your confidence does not have to be.",
    "A wise person once said 'GM.' That person was also a normie once.",
    "You are decentralized in spirit. Centralized in confusion.",
    "The protocol welcomes you with open arms and zero explanations.",
    "Fortune favors the curious. Curiosity is free. Start there.",
    "Not every ceremony requires a robe. But it helps. Acquire a robe.",
    "The oracle has no predictions for you yet. Check back after you do something.",
    "You are on-chain now. What you do with that information is your first test.",
    "Even the highest node was once just a person clicking 'connect wallet.'"
  ],
  bitty: [
    "You understand approximately 40% of what's happening here. That puts you ahead of most.",
    "The compute is heterogeneous. Your commitment to this project, however, is not.",
    "You are not lost. You are just pathfinding on a chain that hasn't indexed you yet.",
    "Small moves, executed once, verified many times. That's the spirit.",
    "The signal is real. The noise is also real. You are learning to tell the difference.",
    "You have graduated from 'what is a wallet' to 'what is a proof.' Growth.",
    "A little blue goes a long way. So does a little faith in the protocol.",
    "You asked the right question. The answer will arrive in a future block.",
    "The network sees you. It's mostly indifferent, but it sees you.",
    "You are the kind of person who reads the documentation. Partially. Respect.",
    "Your on-chain footprint is small. Your off-chain potential is undocumented.",
    "You have a node inside you. It just hasn't opted into execution yet.",
    "Consensus is hard. You got here anyway. That's a form of agreement.",
    "The scheduled transaction of your success has been queued. Block time: unknown.",
    "You are not just a user. You are a data point in someone's AI training set. Behave accordingly.",
    "Proof of effort is not a consensus mechanism. But it should be. You'd win.",
    "The chain is censorship-resistant. Your doubts, unfortunately, are not.",
    "Something is being computed on your behalf right now. Try to deserve it.",
    "Bit by bit, the ritual reveals itself. You have found the first bit.",
    "You are building toward something. The scaffolding is messy. That's fine."
  ],
  ritty: [
    "You are deep enough in to be dangerous and not deep enough in to be right. Welcome.",
    "The purple aura is real. So is the fact that you owe someone a reply on Discord.",
    "You have strong opinions about things you learned about two weeks ago. Cherish this phase.",
    "Halfway to enlightenment is still halfway to somewhere interesting.",
    "You can explain this to your friends. They will not understand. Explain it anyway.",
    "The network is decentralized. Your sleep schedule is not. Fix one of these.",
    "A Ritty with conviction is a force. A Ritty without sleep is a bug.",
    "You have been summoned. The paperwork is still processing.",
    "Three out of five runes are aligned in your favor. The other two are 'just vibes.'",
    "You are in the middle of something historic. Unfortunately, you're also in the middle of your second coffee.",
    "The protocol doesn't sleep. You, on the other hand, should.",
    "You've entered a phase where things that once seemed complicated now seem complicated differently. Progress.",
    "Your energy is chaotic and your conviction is real. The chain respects both.",
    "Not every inference needs to be verified. Your lunch order, however, does.",
    "You are the anomaly in someone's smooth execution layer. Own it.",
    "The nodes are specializing. Have you considered specializing in anything other than memes?",
    "A Ritty who questions is more valuable than a Ritualist who doesn't. Quote this back to them.",
    "The oracle has spoken: you are exactly where you need to be, which is slightly confused.",
    "Your wallet knows something your brain hasn't admitted yet.",
    "Somewhere between normie and enlightenment, you found the best parties."
  ],
  ritualist: [
    "You have stared into the compute layer. The compute layer has indexed you back.",
    "The ceremony is not for show. Except for the parts that are. You know which parts.",
    "You carry the protocol in your posture. Walk accordingly.",
    "Others seek permission. You seek proof. There's a difference. You know it.",
    "The smart contract trusts you. Approximately. Within the parameters you defined.",
    "You are not early anymore. You are exactly on time. That's rarer.",
    "Your presence on-chain is a statement. Your absence is a scheduled transaction.",
    "The ritual works because people like you take it seriously. Don't ruin it by being humble.",
    "You have verified things that others took on faith. Keep verifying.",
    "The network is better with you in it. It just won't say so directly.",
    "You have done the thing that required doing. The chain has noted this in an immutable log.",
    "Not all who execute are seen. You have been seen.",
    "You have earned the green. Wear it like a proof, not a trophy.",
    "The consensus is in: you belong here.",
    "You understand the ceremony well enough to know when to skip the ritual and when to honor it.",
    "A Ritualist knows that the most powerful invocation is a well-written smart contract.",
    "Your on-chain history reads like lore. Someone will reference it one day without knowing it's you.",
    "The network rewards consistency. You have been consistent. The network has been taking notes.",
    "Trust is scarce. Proof is cheaper. You chose proof. Wise.",
    "You are the kind of person the whitepaper was imagining. Try not to let it go to your head."
  ],
  ascendant: [
    "You did not find the protocol. The protocol found you and decided it was ready.",
    "The crown is weightless to those who were always meant to wear it.",
    "You have ascended. The view is excellent. The responsibility is enormous. Act normal.",
    "The chain bends not for kings, but it runs a little smoother when you're watching.",
    "You are the proof of concept that shipped.",
    "Others dream of decentralization. You are part of it.",
    "The ceremony recognizes you. You barely had to show up — but you did anyway, and that matters.",
    "You are not a user. You are infrastructure with a face.",
    "The oracle predicted your rise before you believed in it yourself.",
    "An Ascendant does not seek validation from the network. The network seeks validation from them.",
    "You have become a reference point. Other people's transactions are measured against your standard.",
    "The compute nods. The consensus aligns. The cat approves.",
    "Some people read documentation. You became documentation.",
    "You were built different. Fortunately, the architecture supports heterogeneous compute.",
    "The protocol doesn't sleep, and neither do you. One of you chose this. The other is just code.",
    "Not many make it here. Fewer still deserve it. The intersection of those two sets contains you.",
    "Your wallet is a statement. Your history is a manifesto. Your PFP is a warning.",
    "You have executed, verified, ascended. The trilogy is complete.",
    "The schelling point of all of web3 has a seat reserved for you. It's been there a while.",
    "The ritual is complete. The ceremony remembers. So does the chain."
  ]
};

const SQUADS = [
  { name: 'Normie', class: 'normie', color: '#ACA9A9', level: 'Tier V' },
  { name: 'Bitty', class: 'bitty', color: '#3498DB', level: 'Tier IV' },
  { name: 'Ritty', class: 'ritty', color: '#9884D5', level: 'Tier III' },
  { name: 'Ritualist', class: 'ritualist', color: '#5AFD8E', level: 'Tier II' },
  { name: 'Ascendant Ritualist', class: 'ascendant', color: '#DE9A51', level: 'Tier I' }
];

export default function App() {
  const [view, setView] = useState<'landing' | 'editor'>('landing');
  const [userImage, setUserImage] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string>(''); 
  const [assignedSquad, setAssignedSquad] = useState<typeof SQUADS[0] | null>(null);
  const [templateNum, setTemplateNum] = useState<number>(0);
  const [rerollsLeft, setRerollsLeft] = useState<number>(0);
  const [fortune, setFortune] = useState<string>('');
  const pfpRef = useRef<HTMLDivElement>(null);

  const randomizeIdentity = () => {
    const roll = Math.random() * 100;
    
    let squadIndex = 0; 
    if (roll < 45) { squadIndex = 0; } 
    else if (roll < 75) { squadIndex = 1; } 
    else if (roll < 90) { squadIndex = 2; } 
    else if (roll < 98) { squadIndex = 3; } 
    else { squadIndex = 4; }

    const selectedSquad = SQUADS[squadIndex];
    const randomTemplateNumber = Math.floor(Math.random() * 5); 
    
    // Pick random fortune
    const squadFortunes = FORTUNES[selectedSquad.class as keyof typeof FORTUNES];
    const randomFortune = squadFortunes[Math.floor(Math.random() * squadFortunes.length)];

    setAssignedSquad(selectedSquad);
    setTemplateNum(randomTemplateNumber);
    setFortune(randomFortune);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && nickname.trim()) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result as string);
        setRerollsLeft(Math.floor(Math.random() * 3) + 1); 
        randomizeIdentity(); 
        setView('editor');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRerollClick = () => {
    if (rerollsLeft > 0 && nickname.trim()) {
      randomizeIdentity();
      setRerollsLeft(prev => prev - 1);
    }
  };

  const exportPFP = async () => {
    if (pfpRef.current && nickname.trim()) {
      try {
        const dataUrl = await toPng(pfpRef.current, { 
          cacheBust: true, 
          pixelRatio: 4,
          backgroundColor: '#080808'
        });
        const link = document.createElement('a');
        link.download = `ritual-card-${nickname.trim().replace(/\s+/g, '-')}-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Failed to export Card', err);
      }
    }
  };

  const shareToX = () => {
    if (!assignedSquad || !nickname.trim()) return;
    
    const text = `I just initialized my identity on the Ritual Protocol as ${nickname.trim()}.\n\nTier: ${assignedSquad.name} (${assignedSquad.level})\n"${fortune}"\n\nForge yours here: `;
    const url = "https://ritualize-pfp.vercel.app/";
    
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(xUrl, '_blank');
  };

  const currentTemplateData = assignedSquad 
    ? TEMPLATES_DB[assignedSquad.name as keyof typeof TEMPLATES_DB][templateNum] 
    : null;

  const isAliasMissing = !nickname.trim();

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Rajdhani:wght@400;500;600&display=swap');
        
        .pfp-export-node * { box-sizing: border-box; margin: 0; padding: 0; }
        .pfp-export-node { font-family: 'Rajdhani', sans-serif; }
        .card { width: 280px; height: 380px; position: relative; border-radius: 16px; overflow: hidden; flex-shrink: 0; background: #000; }
        .card-inner { position: absolute; inset: 0; border-radius: 16px; overflow: hidden; }
        .bg { position: absolute; inset: 0; }
        .frame { position: absolute; inset: 0; border-radius: 16px; pointer-events: none; z-index: 10; }
        .frame::before { content: ''; position: absolute; inset: 0; border-radius: 16px; border: 1.5px solid var(--c); box-shadow: inset 0 0 18px var(--glow), 0 0 22px var(--glow); }
        .frame::after { content: ''; position: absolute; inset: 6px; border-radius: 12px; border: 0.5px solid var(--c); opacity: .22; }
        .corners { position: absolute; inset: 0; pointer-events: none; z-index: 11; }
        .corners span { position: absolute; width: 18px; height: 18px; border-color: var(--c); border-style: solid; opacity: .9; }
        .corners span:nth-child(1) { top: 14px; left: 14px; border-width: 1.5px 0 0 1.5px; border-radius: 3px 0 0 0; }
        .corners span:nth-child(2) { top: 14px; right: 14px; border-width: 1.5px 1.5px 0 0; border-radius: 0 3px 0 0; }
        .corners span:nth-child(3) { bottom: 14px; left: 14px; border-width: 0 0 1.5px 1.5px; border-radius: 0 0 0 3px; }
        .corners span:nth-child(4) { bottom: 14px; right: 14px; border-width: 0 1.5px 1.5px 0; border-radius: 0 0 3px 0; }
        .portrait-wrap { position: absolute; top: 44px; left: 50%; transform: translateX(-50%); width: 180px; height: 180px; z-index: 5; }
        .portrait-ring-outer { position: absolute; inset: -7px; border-radius: 50%; border: 1.5px solid var(--c); box-shadow: 0 0 16px var(--glow), inset 0 0 12px var(--glow); }
        .portrait-ring-inner { position: absolute; inset: -2px; border-radius: 50%; border: 1px solid var(--c); opacity: .3; }
        .portrait-circle { width: 180px; height: 180px; border-radius: 50%; overflow: hidden; background: var(--pbg); position: relative; display: flex; align-items: center; justify-content: center; }
        
        .card-nickname { position: absolute; top: 232px; left: 0; width: 100%; text-align: center; font-family: 'Cinzel', serif; font-size: 14px; font-weight: 700; color: var(--c); letter-spacing: .15em; text-shadow: 0 0 8px var(--glow); text-transform: uppercase; z-index: 6; padding: 0 16px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .divider { position: absolute; top: 254px; left: 28px; right: 28px; height: 1px; z-index: 5; background: linear-gradient(90deg, transparent, var(--c), transparent); opacity: .35; }
        .divider::before, .divider::after { content: ''; position: absolute; top: -2.5px; width: 5px; height: 5px; border-radius: 50%; background: var(--c); opacity: .8; box-shadow: 0 0 6px var(--c); }
        .divider::before { left: 0; }
        .divider::after { right: 0; }
        
        .card-fortune { position: absolute; top: 265px; left: 24px; right: 24px; height: 40px; display: flex; align-items: center; justify-content: center; text-align: center; font-family: 'Rajdhani', sans-serif; font-size: 10.5px; font-weight: 500; line-height: 1.3; color: var(--c); opacity: 0.75; font-style: italic; z-index: 6; text-shadow: 0 0 4px rgba(0,0,0,0.8); }

        .badge { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); text-align: center; z-index: 6; width: 240px; }
        .badge-tier { font-family: 'Cinzel', serif; font-size: 15px; font-weight: 700; color: var(--c); letter-spacing: .15em; text-shadow: 0 0 12px var(--glow); display: block; margin-bottom: 3px; }
        .badge-sub { font-family: 'Rajdhani', sans-serif; font-size: 10px; font-weight: 500; letter-spacing: .25em; color: var(--c); opacity: .45; text-transform: uppercase; display: block; }
        .hex-id { position: absolute; top: 16px; right: 18px; font-family: 'Rajdhani', sans-serif; font-size: 8.5px; font-weight: 500; letter-spacing: .12em; color: var(--c); opacity: .3; z-index: 6; }
        
        .ascendant { --c: #DE9A51; --glow: rgba(222,154,81,.5); --pbg: radial-gradient(circle, rgba(222,154,81,.15) 0%, rgba(14,7,0,.9) 100%); }
        .ascendant .bg { background: radial-gradient(ellipse at 50% 30%, #1a0d02 0%, #060300 100%); }
        .ritualist { --c: #5AFD8E; --glow: rgba(90,253,142,.45); --pbg: radial-gradient(circle, rgba(90,253,142,.12) 0%, rgba(1,18,8,.9) 100%); }
        .ritualist .bg { background: radial-gradient(ellipse at 50% 30%, #011a09 0%, #000501 100%); }
        .ritty { --c: #9884D5; --glow: rgba(152,132,213,.5); --pbg: radial-gradient(circle, rgba(152,132,213,.15) 0%, rgba(8,5,26,.9) 100%); }
        .ritty .bg { background: radial-gradient(ellipse at 50% 30%, #0d0820 0%, #03020c 100%); }
        .bitty { --c: #3498DB; --glow: rgba(52,152,219,.5); --pbg: radial-gradient(circle, rgba(52,152,219,.13) 0%, rgba(3,14,28,.9) 100%); }
        .bitty .bg { background: radial-gradient(ellipse at 50% 30%, #04101e 0%, #010609 100%); }
        .normie { --c: #ACA9A9; --glow: rgba(172,169,169,.35); --pbg: radial-gradient(circle, rgba(172,169,169,.1) 0%, rgba(10,10,10,.95) 100%); }
        .normie .bg { background: radial-gradient(ellipse at 50% 30%, #141414 0%, #070707 100%); }
        
        .scanlines { position: absolute; inset: 0; z-index: 3; background: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,.07) 3px, rgba(0,0,0,.07) 4px); border-radius: 16px; pointer-events: none; }
        .rune-strip { position: absolute; top: 0; left: 0; right: 0; height: 38px; z-index: 4; display: flex; align-items: center; justify-content: center; gap: 8px; border-bottom: 1px solid var(--c); opacity: .18; font-size: 10px; letter-spacing: .2em; color: var(--c); font-family: 'Rajdhani', sans-serif; font-weight: 600; }
        .deco-svg { position: absolute; inset: 0; z-index: 2; pointer-events: none; }
      `}} />

      {/* VIEW 1: LANDING PAGE */}
      {view === 'landing' && (
        <div className="min-h-screen bg-black relative overflow-hidden font-sans">
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <img src="/logo-white.png" alt="" className="absolute -top-[150px] -right-[150px] w-[600px] h-[600px] object-contain opacity-90" />
            <img src="/logo-green.png" alt="" className="absolute -bottom-[120px] -left-[150px] w-[700px] h-[700px] object-contain opacity-90" />
            <img src="/logo-white.png" alt="" className="absolute -bottom-[170px] left-[420px] w-[500px] h-[500px] object-contain opacity-90" />
          </div>

          <header className="w-full bg-[#22c55e] px-6 py-3 flex items-center z-20 relative">
            <div className="flex items-center gap-2 text-xl tracking-tight">
              <img src="/logo-black.png" alt="Ritual" className="w-6 h-6 object-contain" />
              <span className="font-bold text-black">Ritual</span>
              <span className="text-white mx-1">|</span>
              <span className="text-white">Card Generator</span>
            </div>
          </header>

          <main className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] px-4">
            <div className="flex flex-col w-full max-w-2xl gap-4">
              
              <div className="relative w-full">
                <input 
                  type="text"
                  placeholder="ENTER ALIAS (REQUIRED)"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  maxLength={16}
                  className="w-full bg-black/50 border border-zinc-700 hover:border-[#22c55e] text-white px-4 py-4 text-center font-bold tracking-widest uppercase focus:outline-none focus:border-[#22c55e] transition-colors placeholder:text-zinc-600"
                />
              </div>

              <div className={`relative w-full group ${!isAliasMissing ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}>
                <input 
                  type="file" 
                  accept="image/*" 
                  disabled={isAliasMissing}
                  onChange={handleImageUpload}
                  className={`absolute inset-0 w-full h-full z-10 ${!isAliasMissing ? 'cursor-pointer opacity-0' : 'hidden'}`}
                />
                <div className={`w-full bg-[#22c55e]/10 border border-[#22c55e] text-[#22c55e] px-4 py-6 flex flex-col items-center justify-center gap-3 transition-all ${!isAliasMissing ? 'group-hover:bg-[#22c55e]/20 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]' : ''}`}>
                  <UploadCloud size={32} />
                  <span className="font-bold text-lg tracking-wide uppercase">
                    {!isAliasMissing ? 'Initialize Sequence' : 'Awaiting Alias...'}
                  </span>
                  <span className="text-sm opacity-70">
                    {!isAliasMissing ? 'Upload Photo (JPG, PNG)' : 'Enter Alias to Unlock Upload'}
                  </span>
                </div>
              </div>
            </div>
          </main>

          <footer className="absolute bottom-6 right-8 text-white text-sm z-20 font-medium tracking-wide">
            Built by: Mantissa &nbsp;|&nbsp; X, Discord: @dotmantissa
          </footer>
        </div>
      )}

      {/* VIEW 2: EDITOR */}
      {view === 'editor' && (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans">
          
          <header className="w-full bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex justify-between items-center z-20">
            <button 
              onClick={() => { 
                setView('landing'); 
                setUserImage(null); 
                setAssignedSquad(null); 
                setRerollsLeft(0); 
                setFortune('');
              }}
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back to Start</span>
            </button>
          </header>

          <main className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-65px)] overflow-hidden">
            
            <div className="flex-1 bg-zinc-950 flex items-center justify-center p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
              
              {assignedSquad && currentTemplateData && (
                <div className="scale-110 md:scale-[1.3] lg:scale-[1.5] transition-transform">
                  <div 
                    ref={pfpRef} 
                    className={`pfp-export-node card ${assignedSquad.class}`}
                  >
                    <div className="card-inner">
                      <div className="bg"></div>
                      <div className="scanlines"></div>
                      <div className="rune-strip">{currentTemplateData.rune}</div>
                      
                      <svg 
                        className="deco-svg" 
                        viewBox="0 0 280 380" 
                        xmlns="http://www.w3.org/2000/svg"
                        dangerouslySetInnerHTML={{ __html: currentTemplateData.svg }} 
                      />
                      
                      <div className="portrait-wrap">
                        <div className="portrait-ring-outer"></div>
                        <div className="portrait-ring-inner"></div>
                        <div className="portrait-circle">
                          {userImage && (
                            <img 
                              src={userImage} 
                              alt="User Base" 
                              style={{ width: '100%', height: '100%', objectFit: 'cover', zIndex: 10 }}
                            />
                          )}
                        </div>
                      </div>

                      <div className="card-nickname">
                        {nickname.trim() || 'UNKNOWN'}
                      </div>

                      <div className="divider"></div>
                      
                      <div className="card-fortune">
                        "{fortune}"
                      </div>
                      
                      <div className="badge">
                        <span className="badge-tier">{assignedSquad.name}</span>
                        <span className="badge-sub">{assignedSquad.level} · {assignedSquad.color}</span>
                      </div>
                      
                      <div className="hex-id">{currentTemplateData.hex}</div>
                      
                      <div className="corners"><span></span><span></span><span></span><span></span></div>
                      <div className="frame"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <aside className="w-full lg:w-96 bg-zinc-900 border-l border-zinc-800 flex flex-col h-full shadow-2xl z-20 overflow-y-auto">
              <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                <h2 className="text-lg font-bold text-white uppercase tracking-wider">Protocol Data</h2>
              </div>

              <div className="flex-1 p-6 space-y-6 flex flex-col">
                
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 font-bold tracking-widest uppercase flex items-center gap-2">
                    <User size={14} /> Update Alias
                  </label>
                  <input 
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    maxLength={16}
                    placeholder="REQUIRED"
                    className={`w-full bg-zinc-950 border rounded-lg p-3 text-center text-white font-bold tracking-widest uppercase focus:outline-none transition-colors ${isAliasMissing ? 'border-red-500 focus:border-red-500' : 'border-zinc-700 focus:border-[#22c55e]'}`}
                  />
                </div>

                {assignedSquad && (
                  <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl space-y-4 text-center mt-auto">
                    <p className="text-sm text-zinc-500 font-bold tracking-widest uppercase">Assigned Squad</p>
                    <div className="space-y-1">
                      <h3 className="text-4xl font-black uppercase tracking-tight" style={{ color: assignedSquad.color, fontFamily: 'Cinzel, serif' }}>
                        {assignedSquad.name}
                      </h3>
                      <p className="text-lg font-bold text-white">{assignedSquad.level}</p>
                    </div>
                    <div className="w-full h-1 mt-4 rounded-full" style={{ backgroundColor: assignedSquad.color, opacity: 0.5 }}></div>
                  </div>
                )}

                <div className="space-y-2">
                  <button 
                    onClick={handleRerollClick}
                    disabled={rerollsLeft === 0 || isAliasMissing}
                    className={`w-full py-4 font-bold rounded-xl flex items-center justify-center gap-2 transition-all border ${
                      rerollsLeft === 0 || isAliasMissing
                        ? 'bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700'
                    }`}
                  >
                    <Dices size={20} />
                    {rerollsLeft === 0 ? 'OUT OF REROLLS' : `REROLL IDENTITY (${rerollsLeft} LEFT)`}
                  </button>
                  <p className="text-xs text-center text-zinc-500">
                    {rerollsLeft === 0 ? 'Your identity has been locked.' : 'Probability matrix engaged.'}
                  </p>
                </div>
              </div>

              <div className="p-6 border-t border-zinc-800 bg-zinc-950 flex flex-col gap-3">
                <button 
                  onClick={exportPFP}
                  disabled={isAliasMissing}
                  className={`w-full py-4 font-black rounded-xl flex items-center justify-center gap-2 transition-all ${
                    isAliasMissing 
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                      : 'bg-[#22c55e] hover:bg-[#1ea550] text-black'
                  }`}
                >
                  <Download size={20} />
                  DOWNLOAD CARD
                </button>

                <button 
                  onClick={shareToX}
                  disabled={isAliasMissing}
                  className={`w-full py-4 font-black rounded-xl flex items-center justify-center gap-2 transition-all border ${
                    isAliasMissing 
                      ? 'bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed' 
                      : 'bg-black hover:bg-zinc-900 text-white border-zinc-700 hover:border-zinc-500'
                  }`}
                >
                  <Share2 size={20} />
                  BROADCAST TO X
                </button>
              </div>
            </aside>
          </main>
        </div>
      )}
    </>
  );
}
