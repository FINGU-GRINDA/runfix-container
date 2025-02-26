import { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";
import fetch from "node-fetch";
import * as cheerio from "cheerio";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { url } = req.query;
    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "Missing or invalid URL" });
    }

    const isLikelyHTML = looksLikeHTML(url);

    if (!isLikelyHTML) {
      // === NON-HTML path (images, scripts, CSS, etc.) ===
      // Just fetch & stream the response
      const upstreamResp = await fetch(url);
      if (!upstreamResp.ok) {
        return res
          .status(upstreamResp.status)
          .send(`Upstream error: ${upstreamResp.statusText}`);
      }
      // Copy headers (be mindful of which ones are safe)
      res.setHeader(
        "Content-Type",
        upstreamResp.headers.get("content-type") || "application/octet-stream"
      );
      // If you need content-length or other headers, set them too
      res.setHeader(
        "Cache-Control",
        upstreamResp.headers.get("cache-control") || "public, max-age=3600"
      );

      // Pipe the body back
      upstreamResp.body.pipe(res);
      return;
    } else {
      // === HTML path (the main page) ===
      const browser = await puppeteer.launch({
        headless: true,
        args: [
          /*...*/
        ],
      });
      const page = await browser.newPage();

      // Optional: set user agent
      await page.setUserAgent("Mozilla/5.0 ...");

      await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
      // Wait for body to be loaded
      await page.waitForSelector("body", { visible: true });

      const html = await page.content();
      await browser.close();

      // Load into Cheerio
      const $ = cheerio.load(html);

      // Rewriting links to keep them in-proxy
      $("[href]").each((_, el) => {
        const originalHref = $(el).attr("href");
        if (!originalHref) return;

        // Skip anchors/mailto
        if (originalHref.startsWith("#") || originalHref.startsWith("mailto:"))
          return;

        const absoluteHref = new URL(originalHref, url).href;
        const proxiedHref = `/api/proxy?url=${encodeURIComponent(
          absoluteHref
        )}`;
        $(el).attr("href", proxiedHref);
      });

      // Rewriting src to proxy
      $("[src]").each((_, el) => {
        const originalSrc = $(el).attr("src");
        if (!originalSrc) return;
        if (originalSrc.startsWith("data:")) return; // skip data urls
        const absoluteSrc = new URL(originalSrc, url).href;
        const proxiedSrc = `/api/proxy?url=${encodeURIComponent(absoluteSrc)}`;
        $(el).attr("src", proxiedSrc);
      });

      // You might also rewrite inline CSS "url(/foo.png)" references if needed...
      // then return final HTML
      const finalHTML = $.html();

      res.setHeader("Content-Type", "text/html");
      return res.status(200).send(finalHTML);
    }
  } catch (error) {
    console.error("Proxy error:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch or rewrite content" });
  }
}

// Example naive helper
function looksLikeHTML(urlStr: string) {
  // If there's no file extension or it ends with .html, treat as HTML
  const lower = urlStr.toLowerCase();
  if (lower.endsWith(".html") || !/\.\w{2,4}($|\?)/.test(lower)) {
    return true;
  }
  return false;
}
