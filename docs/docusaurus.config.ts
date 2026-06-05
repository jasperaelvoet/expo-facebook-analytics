import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";

const config: Config = {
  title: "expo-facebook-analytics",
  tagline: "High-performance Facebook Analytics for React Native via Nitro Modules",

  url: "https://jasperaelvoet.github.io",
  baseUrl: "/expo-facebook-analytics/",

  organizationName: "jasperaelvoet",
  projectName: "expo-facebook-analytics",
  trailingSlash: false,

  onBrokenLinks: "throw",

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.ts",
          editUrl:
            "https://github.com/jasperaelvoet/expo-facebook-analytics/tree/main/docs/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: [
    [
      "@easyops-cn/docusaurus-search-local",
      {
        hashed: true,
        indexBlog: false,
        docsRouteBasePath: "/",
      },
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: "dark",
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "expo-facebook-analytics",
      items: [
        {
          type: "docSidebar",
          sidebarId: "docsSidebar",
          position: "left",
          label: "Docs",
        },
        {
          href: "https://www.npmjs.com/package/expo-facebook-analytics",
          label: "npm",
          position: "right",
        },
        {
          href: "https://github.com/jasperaelvoet/expo-facebook-analytics",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            { label: "Getting Started", to: "/" },
            { label: "API Reference", to: "/api-reference" },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/jasperaelvoet/expo-facebook-analytics",
            },
            {
              label: "npm",
              href: "https://www.npmjs.com/package/expo-facebook-analytics",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} expo-facebook-analytics. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["bash", "json"],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
