import React from "react";
import {AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame} from "remotion";
import {Glass} from "./Glass";

export const C = {ink: "#07110c", green: "#0f7043", deep: "#0b5733", mint: "#9ad9b3", paper: "#f7f5ef"};
const out = Easing.bezier(0.16, 1, 0.3, 1);
const ip = (f: number, a: number[], b: number[], e = out) =>
  interpolate(f, a, b, {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e});
const big = (size: number, weight = 800, wd = 100): React.CSSProperties => ({
  fontFamily: "Archivo", fontSize: size, fontWeight: weight, fontStretch: `${wd}%`,
  lineHeight: 0.86, letterSpacing: "-.025em", color: C.paper, whiteSpace: "nowrap",
});
const imgs = ["wodeyars.jpg", "structo.jpg", "vexoprint.jpg"];
const cover: React.CSSProperties = {width: "100%", height: "100%", objectFit: "cover"};
const Center: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{alignItems: "center", justifyContent: "center"}}>{children}</AbsoluteFill>
);

const Scroll = () => {
  const f = useCurrentFrame();
  const y = ip(f, [0, 74], [0, 5200], Easing.bezier(0.5, 0, 0.85, 0.4));
  return (
    <AbsoluteFill style={{background: C.ink, overflow: "hidden"}}>
      {[0, 1, 2, 3].map((c) => (
        <div key={c} style={{position: "absolute", left: 60 + c * 460, top: 0, width: 420, transform: `translateY(${-(y * (1 + 0.18 * (c % 2))) - c * 170}px)`}}>
          {Array.from({length: 16}).map((_, i) => (
            <div key={i} style={{width: 420, height: 500, marginBottom: 40, overflow: "hidden", background: [C.deep, "#12201a", C.green, "#0d1812"][(i + c) % 4]}}>
              {(i + c) % 2 === 0 && <Img src={staticFile(imgs[(i + c * 2) % 3])} style={{...cover, opacity: 0.55}} />}
            </div>
          ))}
        </div>
      ))}
      <AbsoluteFill style={{background: "rgba(7,17,12,.45)"}} />
      <Center>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{...big(330), transform: `translateY(${ip(f, [i * 3, 18 + i * 3], [900, 0])}px)`, color: i === 1 ? C.paper : "rgba(154,217,179,.22)"}}>SCROLL.</div>
        ))}
      </Center>
    </AbsoluteFill>
  );
};

const Stop = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.green}}>
      <AbsoluteFill style={{clipPath: `inset(${ip(f, [14, 40], [22, 0])}% ${ip(f, [14, 40], [34, 0])}%)`}}>
        <Img src={staticFile(imgs[0])} style={{...cover, transform: `scale(${ip(f, [0, 45], [1.2, 1.04])})`, filter: "brightness(.62)"}} />
      </AbsoluteFill>
      <Center><div style={big(560, 900)}>STOP.</div></Center>
    </AbsoluteFill>
  );
};

const Scale = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.ink, overflow: "hidden"}}>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{position: "absolute", bottom: 0, left: 120 + i * 440, width: 360, height: ip(f, [i * 7, i * 7 + 34], [0, 250 + i * 230]), background: i === 3 ? C.green : C.deep}} />
      ))}
      <Center><div style={big(ip(f, [0, 70], [210, 385]), 850, ip(f, [0, 60], [62, 125]))}>SCALE.</div></Center>
    </AbsoluteFill>
  );
};

const LINES = [["Attention", "becomes interest."], ["Interest", "becomes action."], ["Action", "becomes growth."]];
const Attn = () => {
  const f = useCurrentFrame();
  const i = Math.min(2, Math.floor(f / 35));
  const g = f - i * 35;
  return (
    <AbsoluteFill style={{background: "#000"}}>
      <Glass w={1920} h={1080} period={150} offset={0.1} style={{position: "absolute", left: 400, top: 0}} />
      <div style={{position: "absolute", left: 110, bottom: 110}}>
        <div style={{...big(170, 800, ip(g, [0, 30], [80, 112])), opacity: ip(g, [0, 6], [0, 1]), transform: `translateY(${ip(g, [0, 16], [60, 0])}px)`}}>{LINES[i][0]}</div>
        <div style={{...big(84, 400), color: C.mint, marginTop: 26, opacity: ip(g, [5, 14], [0, 1])}}>{LINES[i][1]}</div>
      </div>
    </AbsoluteFill>
  );
};

const NAMES = ["Wodeyars Biriyani", "Structo Builders", "Vexoprint"];
const Work = () => {
  const f = useCurrentFrame();
  const i = Math.min(2, Math.floor(f / 30));
  const g = f - i * 30;
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <AbsoluteFill style={{clipPath: `inset(${ip(g, [0, 14], [100, 0])}% 0 0 0)`}}>
        <Img src={staticFile(imgs[i])} style={{...cover, transform: `scale(${ip(g, [0, 30], [1.18, 1.02])})`, filter: "brightness(.6)"}} />
        <div style={{position: "absolute", left: 110, bottom: 100, ...big(150, 800, 105), transform: `translateY(${ip(g, [4, 18], [200, 0])}px)`}}>{NAMES[i]}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const NUMS = [["10+", "clients"], ["10M+", "reach"], ["100+", "projects & shoots"]];
const Nums = () => {
  const f = useCurrentFrame();
  const i = Math.min(2, Math.floor(f / 20));
  const g = f - i * 20;
  return (
    <AbsoluteFill style={{background: i === 1 ? C.green : C.ink}}>
      <Center>
        <div style={big(ip(g, [0, 20], [430, 520]), 900, ip(g, [0, 14], [75, 115]))}>{NUMS[i][0]}</div>
        <div style={{...big(64, 500), marginTop: 44, color: i === 1 ? C.paper : C.mint}}>{NUMS[i][1]}</div>
      </Center>
    </AbsoluteFill>
  );
};

type MP = {p: number; a: number; size: number; color?: string};
export const Mark: React.FC<MP> = ({p, a, size, color = C.paper}) => (
  <svg viewBox="-2 0 124 128" width={size} height={size} fill={color}>
    {[[0, 32], [32, 42], [63, 70], [96, 95]].map(([x, h], i) => {
      const k = Math.max(0, Math.min(1, p * 4 - i));
      return <rect key={i} x={x} y={125 - h * k} width={21} height={h * k} rx={2.5} />;
    })}
    <path d="M7 74 C46 70 76 48 96 10" fill="none" stroke={color} strokeWidth={4.6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - a} />
    <path d="M80 19 L97 8 L100 28" fill="none" stroke={color} strokeWidth={4.6} strokeLinecap="round" strokeLinejoin="round" opacity={a > 0.9 ? 1 : 0} />
  </svg>
);

const End = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.deep}}>
      <Center>
        <div style={{display: "flex", alignItems: "center", gap: 50}}>
          <Mark p={ip(f, [0, 26], [0, 1])} a={ip(f, [18, 36], [0, 1])} size={270} />
          <div style={{width: 790, height: 200, overflow: "hidden", clipPath: `inset(0 ${ip(f, [20, 46], [100, 0])}% 0 0)`}}>
            <Img src={staticFile("scalae-logo.svg")} style={{width: 1200, marginLeft: -370, marginTop: -138, filter: "brightness(0) invert(1)"}} />
          </div>
        </div>
        <div style={{fontFamily: "Archivo", fontSize: 50, color: C.paper, marginTop: 70, opacity: ip(f, [38, 54], [0, 1])}}>We create brands people stop scrolling for.</div>
      </Center>
    </AbsoluteFill>
  );
};

const CUTS: [number, number, React.FC][] = [[0, 75, Scroll], [75, 45, Stop], [120, 75, Scale], [195, 105, Attn], [300, 90, Work], [390, 60, Nums], [450, 90, End]];
export const Film = () => (
  <AbsoluteFill style={{background: C.ink}}>
    <Audio src={staticFile("music.wav")} />
    {CUTS.map(([a, d, X]) => <Sequence key={a} from={a} durationInFrames={d}><X /></Sequence>)}
  </AbsoluteFill>
);
export const Orb = () => <AbsoluteFill style={{background: "#000"}}><Glass w={640} h={640} period={300} /></AbsoluteFill>;
export const Logo = () => <AbsoluteFill><Img src={staticFile("scalae-logo.svg")} style={{width: 1200, filter: "brightness(0) invert(1)"}} /></AbsoluteFill>;
export const Icon = () => <AbsoluteFill style={{background: C.deep, alignItems: "center", justifyContent: "center"}}><Mark p={1} a={1} size={330} /></AbsoluteFill>;
export const Og = () => (
  <AbsoluteFill style={{background: C.ink, overflow: "hidden"}}>
    <div style={{position: "absolute", right: -20, bottom: -20}}><Mark p={1} a={1} size={560} color={C.green} /></div>
    <div style={{position: "absolute", left: 70, top: 110, ...big(160, 850, 110)}}>SCROLL.<br />STOP.<br />SCALE.</div>
  </AbsoluteFill>
);
