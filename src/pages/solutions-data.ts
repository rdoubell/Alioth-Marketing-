import { LayoutTemplate, Compass, TrendingUp, Mail, Search, Palette, BarChart3, type LucideIcon } from 'lucide-react'

// Depth copy for the Solutions page specifically — Home's cards stay on the
// shorter SERVICES description (services-data.ts), this page goes deeper.
// Split into its own file (rather than living in Solutions.tsx) so that
// page keeps a component-only export, which react-refresh requires.
export interface SolutionDetail {
  tagline: string
  icon: LucideIcon
  paragraphs: string[]
}

export const SOLUTION_DETAILS: Record<string, SolutionDetail> = {
  'web-design-build': {
    tagline: "A website that's actually yours",
    icon: LayoutTemplate,
    paragraphs: [
      "We design every site to look like nobody else in your category — structure, layout, and interactions built around how your specific business actually sells, not a generic best-practice checklist dropped onto a stock template. Fast to load, built to convert, and easy for your team to update without calling us every time you need to change a headline.",
      'Every build starts with the same question we ask for every service: what does this page need to make someone act? From there we handle design, front-end development, copy structure, and the technical groundwork so the site is ready to do its job the day it goes live.',
    ],
  },
  strategy: {
    tagline: 'A roadmap, not guesswork',
    icon: Compass,
    paragraphs: [
      "Before we touch a single ad or write a single page of copy, we work out where you actually stand — who you're really competing with, what your customers are searching for and saying about you, and where the fastest, most credible path to growth actually is. That becomes a written roadmap with a clear sequence: what to do first, what to measure, and what success looks like in real numbers.",
      "We're not interested in a strategy deck that sits in a drawer. Every recommendation ties back to something we can execute — through our own other disciplines or yours — so the strategy phase ends with a plan you'll actually see through.",
    ],
  },
  'paid-media': {
    tagline: 'Ad spend that becomes pipeline',
    icon: TrendingUp,
    paragraphs: [
      'We run paid campaigns wherever your customers actually are — search, social, or otherwise — with one goal: turning ad spend into pipeline, not just impressions. That means proper audience research and targeting up front, creative built for the platform it runs on, and continuous optimisation based on what the data actually shows — not a campaign left to quietly burn budget.',
      "You get straightforward reporting on what's working, and campaigns get adjusted in response to real performance, not run on autopilot until the next quarterly check-in.",
    ],
  },
  'email-automation': {
    tagline: 'Always top of mind',
    icon: Mail,
    paragraphs: [
      'Most businesses lose customers and leads not because of a bad experience, but because they simply go quiet after the first purchase or enquiry. We build the email flows that keep that relationship alive — welcome sequences, follow-ups that nurture an enquiry toward a decision, re-engagement campaigns, and regular sends that actually give people a reason to open them.',
      "Everything runs automatically once it's built, so your audience gets the right message at the right moment without your team sending a single email by hand — but every flow is built around your actual customer journey, not a generic template.",
    ],
  },
  'seo-content': {
    tagline: 'Found by the people who matter',
    icon: Search,
    paragraphs: [
      "Paid traffic stops the moment you stop paying. Organic visibility keeps working long after you've published it — which is exactly why we treat SEO and content as one discipline, not two. We research how South African customers actually search, optimise your Google Business Profile and local listings so you show up in the searches that matter in your area, and build content around the real questions your customers are asking.",
      "The result compounds: content published today keeps bringing in visibility months and years later, instead of resetting to zero the moment a campaign ends.",
    ],
  },
  'design-creative': {
    tagline: 'A brand people recognize instantly',
    icon: Palette,
    paragraphs: [
      "Whether it's a full visual identity from scratch or creative for a single campaign, we design with one rule: it has to look like nobody else in your category, and it has to look like you everywhere it shows up — your website, your ads, your socials, your packaging.",
      'Where a project calls for more than our in-house team — photography, video, influencer content — we bring in specialists from our own network, briefed against the same strategy driving everything else we do for you, so nothing feels bolted on.',
    ],
  },
  'analytics-reporting': {
    tagline: 'Full transparency, always',
    icon: BarChart3,
    paragraphs: [
      "Marketing reporting has a bad reputation for a reason — vanity metrics dressed up to look like progress. We report on the numbers that actually matter to your business: leads, cost per acquisition, revenue influenced, not just impressions and reach. If something isn't working, you'll hear that from us directly, along with what we're changing about it.",
      "You get regular, plain-language updates — not a dashboard you're left to interpret alone — so you always know exactly where your marketing stands and why.",
    ],
  },
}
