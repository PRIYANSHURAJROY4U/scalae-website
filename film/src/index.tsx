import React from "react";
import {Composition, continueRender, delayRender, registerRoot, staticFile} from "remotion";
import {Film, Icon, Logo, Og, Orb} from "./Film";

const handle = delayRender("font");
new FontFace("Archivo", `url(${staticFile("archivo.woff2")})`, {weight: "400 900", stretch: "62% 125%"})
  .load()
  .then((face) => {
    document.fonts.add(face);
    continueRender(handle);
  });

registerRoot(() => (
  <>
    <Composition id="Film" component={Film} durationInFrames={540} fps={30} width={1920} height={1080} />
    <Composition id="Orb" component={Orb} durationInFrames={300} fps={30} width={640} height={640} />
    <Composition id="Logo" component={Logo} durationInFrames={1} fps={30} width={1200} height={420} />
    <Composition id="Icon" component={Icon} durationInFrames={1} fps={30} width={512} height={512} />
    <Composition id="Og" component={Og} durationInFrames={1} fps={30} width={1200} height={630} />
  </>
));
