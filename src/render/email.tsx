import { render } from "@react-email/render";
import { Font, FontProps, Head, Html, Tailwind } from "@react-email/components";
import { RenderChaiBlocks } from "./index.ts";
import { ChaiBlock } from "../core/types/ChaiBlock.ts";
import defaultTheme from "tailwindcss/defaultTheme";
import { tailwindcssPaletteGenerator } from "@bobthered/tailwindcss-palette-generator";
import { get, set } from "lodash-es";

const generateTailwindConfig = (options: Record<string, any>, prefix: string = "c-") => {
  const primary = get(options, "primaryColor", "#000");
  const secondary = get(options, "secondaryColor", "#ccc");
  const bodyFont = get(options, "bodyFont", "Inter");
  const borderRadius = get(options, "roundedCorners", "0");
  const colors = tailwindcssPaletteGenerator({
    colors: [primary, secondary],
    names: ["primary", "secondary"],
  });
  set(colors, "primary.DEFAULT", primary);
  set(colors, "secondary.DEFAULT", secondary);
  return {
    theme: {
      fontFamily: {
        body: [bodyFont, ...defaultTheme.fontFamily.sans],
      },
      extend: {
        borderRadius: {
          global: `${!borderRadius ? "0" : borderRadius}px`,
        },
        colors,
      },
    },
    ...(prefix ? { prefix } : {}),
  };
};

const getFont = (font: string): FontProps => {
  return {
    fontFamily: font,
    fallbackFontFamily: "Verdana",
    webFont: {
      url: `https://fonts.googleapis.com/css2?family=${font}&display=swap`,
      format: "woff",
    },
    fontWeight: 400,
    fontStyle: "normal",
  };
};

export const generateEmailTemplate = (
  blocks: ChaiBlock[],
  brandingOptions: Record<string, any>,
  output: "plain" | "html" = "html",
): string => {
  const tailwindConfig = generateTailwindConfig(brandingOptions);
  return render(
    <Tailwind config={tailwindConfig}>
      <Html lang="en" dir="ltr">
        <Head>
          <Font {...getFont(get(brandingOptions, "bodyFont", "Verdana"))} />
        </Head>
        <body>
          <RenderChaiBlocks blocks={blocks} />
        </body>
      </Html>
    </Tailwind>,
    output === "html" ? { pretty: true } : { plainText: true },
  );
};
