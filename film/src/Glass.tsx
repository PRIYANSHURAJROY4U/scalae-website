import React, {useLayoutEffect, useRef} from "react";
import {useCurrentFrame} from "remotion";

// Raymarched glass: a sphere that resolves into SCALAE's four rising bars and back.
const FS = `precision highp float;uniform vec2 R;uniform float T;
#define PI 3.14159265
float K;mat2 M1,M2;mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float box(vec3 p,vec3 b,float r){vec3 q=abs(p)-b+r;return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.)-r;}
float smin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
float map(vec3 p){p.yz=M2*p.yz;p.xz=M1*p.xz;
 float s=length(p)-.95+.05*sin(3.*p.x+T*2.*PI)*sin(3.*p.y)*sin(3.*p.z);
 float b=1e3;for(int i=0;i<4;i++){float f=float(i);float h=.24+.2*f;
  b=smin(b,box(p-vec3(-.84+.56*f,-.84+h,0.),vec3(.215,h,.215),.2),.06);}
 return mix(s,b,K);}
vec3 N(vec3 p){vec2 e=vec2(.002,0.);return normalize(vec3(map(p+e.xyy)-map(p-e.xyy),map(p+e.yxy)-map(p-e.yxy),map(p+e.yyx)-map(p-e.yyx)));}
vec3 env(vec3 d){vec3 c=vec3(.004,.012,.008);
 c+=vec3(1.)*1.7*smoothstep(.62,.8,d.y)*smoothstep(.5,.2,abs(d.x+.25));
 c+=vec3(.12,.9,.48)*1.5*smoothstep(.8,.93,d.x)*smoothstep(.7,.1,abs(d.y));
 c+=vec3(.75,1.,.85)*1.2*smoothstep(.87,.95,-d.x)*smoothstep(.8,.2,abs(d.y-.1));
 c+=vec3(.9,1.,.95)*smoothstep(.05,.0,abs(d.y+.52+.2*d.x))*smoothstep(.2,.7,abs(d.z))*.8;
 c+=vec3(.06,.6,.3)*smoothstep(.2,1.,-d.y)*.9;
 c+=vec3(.02,.2,.1)*pow(.5+.5*sin(d.x*9.+d.y*3.),3.)*.9;
 c+=vec3(.8,1.,.9)*smoothstep(.93,1.,sin(d.x*5.+1.4+d.y))*smoothstep(-.6,.6,d.y)*.8;
 return c;}
vec3 shade(vec2 fc){vec2 u=(fc*2.-R)/R.y;K=.5-.5*cos(T*2.*PI);K=smoothstep(.12,.88,K);
 M1=rot(.42-.6*sin(T*2.*PI));M2=rot(-.22+.12*sin(T*2.*PI));
 vec3 ro=vec3(0.,0.,4.1),rd=normalize(vec3(u,-2.75));float t=2.4;bool hit=false;
 for(int i=0;i<90;i++){float d=map(ro+rd*t);if(d<.0012){hit=true;break;}t+=d*.8;if(t>6.)break;}
 vec3 col=vec3(.0);
 if(hit){vec3 p=ro+rd*t,n=N(p);float F=.04+.96*pow(1.-max(0.,dot(n,-rd)),4.);
  vec3 tr=vec3(0.);
  for(int c=0;c<3;c++){float ior=1.26+.03*float(c);vec3 d=refract(rd,n,1./ior),q=p-n*.03;float s=0.;
   for(int j=0;j<50;j++){float m=-map(q+d*s);if(m<.002)break;s+=max(m*.8,.004);}
   q+=d*s;vec3 n2=N(q);vec3 o=refract(d,-n2,ior);if(dot(o,o)<.01)o=reflect(d,-n2);
   vec3 e=env(o)*exp(-s*vec3(.34,.08,.2));if(c==0)tr.r=e.r;else if(c==1)tr.g=e.g;else tr.b=e.b;}
  col=tr*(1.-F)*.8+env(reflect(rd,n))*F*1.1;}
 col=col/(1.+col*.35);col=pow(max(col,0.),vec3(.45));
 return col;}
void main(){vec3 col=vec3(0.);for(int a=0;a<2;a++)for(int b=0;b<2;b++)col+=shade(gl_FragCoord.xy+vec2(float(a),float(b))*.5-.25);
 gl_FragColor=vec4(col*.25,1.);}`;
const VS = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";

type P = {w: number; h: number; period: number; offset?: number; style?: React.CSSProperties};
export const Glass: React.FC<P> = ({w, h, period, offset = 0, style}) => {
  const f = useCurrentFrame();
  const ref = useRef<HTMLCanvasElement>(null);
  const st = useRef<{g: WebGLRenderingContext; prog: WebGLProgram} | null>(null);
  useLayoutEffect(() => {
    const c = ref.current!;
    if (!st.current) {
      const g = c.getContext("webgl", {preserveDrawingBuffer: true})!;
      const prog = g.createProgram()!;
      const compile = (type: number, src: string) => {
        const sh = g.createShader(type)!;
        g.shaderSource(sh, src);
        g.compileShader(sh);
        if (!g.getShaderParameter(sh, g.COMPILE_STATUS)) throw new Error(g.getShaderInfoLog(sh) || "shader");
        g.attachShader(prog, sh);
      };
      compile(g.VERTEX_SHADER, VS);
      compile(g.FRAGMENT_SHADER, FS);
      g.linkProgram(prog);
      g.useProgram(prog);
      g.bindBuffer(g.ARRAY_BUFFER, g.createBuffer());
      g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), g.STATIC_DRAW);
      const loc = g.getAttribLocation(prog, "p");
      g.enableVertexAttribArray(loc);
      g.vertexAttribPointer(loc, 2, g.FLOAT, false, 0, 0);
      st.current = {g, prog};
    }
    const {g, prog} = st.current;
    g.viewport(0, 0, w, h);
    g.uniform2f(g.getUniformLocation(prog, "R"), w, h);
    g.uniform1f(g.getUniformLocation(prog, "T"), (f / period + offset) % 1);
    g.drawArrays(g.TRIANGLES, 0, 3);
    g.finish();
  }, [f, w, h, period, offset]);
  return <canvas ref={ref} width={w} height={h} style={style} />;
};
