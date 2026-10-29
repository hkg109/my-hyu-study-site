import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  devIndicators: false,
  async redirects() {
    return [
      {
        source: "/lectures/grade-01/semester-muheifg4/subject-muhy9cpw/:document",
        destination: "/lectures/grade-01/semester-muheifg4/subject-muhz2xir/:document",
        permanent: true,
      },
      {
        source: "/practice/grade-01/semester-muheifg4/subject-muhy9cpw/:document",
        destination: "/practice/grade-01/semester-muheifg4/subject-muhz2xir/:document",
        permanent: true,
      },
      {
        source: "/lectures/grade-01/semester-01/subject-adsp/:document",
        destination: "/lectures/grade-mukhnzii/semester-certificate/subject-adsp/:document",
        permanent: true,
      },
      {
        source: "/practice/grade-01/semester-01/subject-adsp/:document",
        destination: "/practice/grade-mukhnzii/semester-certificate/subject-adsp/:document",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [{
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ],
    }];
  },
};

export default nextConfig;
