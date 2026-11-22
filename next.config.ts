import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      { source: "/profile.html", destination: "/about", permanent: true },
      { source: "/activities.html", destination: "/about#clientele", permanent: true },
      { source: "/our-projects.html", destination: "/projects", permanent: true },
      {
        source: "/highway-constructions.html",
        destination: "/projects?sector=highway",
        permanent: true,
      },
      {
        source: "/water-projects.html",
        destination: "/projects?sector=water",
        permanent: true,
      },
      {
        source: "/power-sector.html",
        destination: "/projects?sector=industrial",
        permanent: true,
      },
      {
        source: "/bridge-construction.html",
        destination: "/projects",
        permanent: true,
      },
      { source: "/financials.html", destination: "/investors", permanent: true },
      { source: "/career.html", destination: "/careers", permanent: true },
      { source: "/career-form.html", destination: "/careers", permanent: true },
      { source: "/enquiry.html", destination: "/contact", permanent: true },
      { source: "/company-video.html", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
