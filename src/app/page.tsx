import Link from "next/link";

const features = [
  {
    title: "2–12 players",
    description:
      "Track a full Marriage table, from a quick two-player game to a big family round.",
  },
  {
    title: "Seen, unseen, doubles",
    description:
      "Log each round the way Marriage is actually played, including doubles and manual overrides when needed.",
  },
  {
    title: "Auto settlement",
    description:
      "MaalTrack calculates the row so every round totals zero, keeping the ledger balanced.",
  },
  {
    title: "Works offline",
    description:
      "Install it as a PWA and keep scoring even when the connection drops.",
  },
];

const steps = [
  {
    title: "Add players",
    description: "Enter everyone at the table before the first round starts.",
  },
  {
    title: "Log each round",
    description:
      "Pick the winner, mark seen/unseen or doubles, and enter maal points.",
  },
  {
    title: "Track the ledger",
    description:
      "Scores settle automatically so you can focus on the game, not the math.",
  },
];

const faqs = [
  {
    question: "What is MaalTrack?",
    answer:
      "MaalTrack is a free browser-based scorekeeper for Marriage, the Nepali card game. It helps you track rounds, players, and settled scores without paper.",
  },
  {
    question: "Do I need to install an app?",
    answer:
      "No. You can use MaalTrack directly in your browser. If you want quick access, you can also install it as a PWA.",
  },
  {
    question: "Does it work offline?",
    answer:
      "Yes. Once loaded, MaalTrack can work offline and keeps your game saved on your device.",
  },
  {
    question: "How many players can I track?",
    answer:
      "MaalTrack supports 2 to 12 players, with seen/unseen/doubles rounds and automatic settlement.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-16 pt-[calc(2rem+env(safe-area-inset-top))] sm:px-6 lg:px-8">
      <header className="border-b border-border pb-10">
        <p className="label-caps text-primary">Browser-first scorekeeper</p>
        <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          Track Marriage card game scores without the spreadsheet.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          MaalTrack is a free online scorekeeper for Marriage (Nepali card game).
          Add 2–12 players, log seen/unseen/doubles rounds, and let every row
          settle to zero automatically. No install required — works right in your
          browser, even offline.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/play"
            className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Play now
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex h-12 items-center justify-center rounded-md border border-border px-6 text-sm font-semibold text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            How it works
          </a>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Free to use. Your game data stays on your device.
        </p>
      </header>

      <section id="features" aria-labelledby="features-heading" className="py-12">
        <p className="label-caps text-muted-foreground">Features</p>
        <h2
          id="features-heading"
          className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          Built for real Marriage rounds
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="border border-border bg-card/40 p-5"
            >
              <h3 className="font-serif text-xl font-semibold tracking-tight">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="how-it-works"
        aria-labelledby="how-it-works-heading"
        className="border-y border-border py-12"
      >
        <p className="label-caps text-muted-foreground">How it works</p>
        <h2
          id="how-it-works-heading"
          className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          Three steps, zero manual math
        </h2>
        <ol className="mt-8 grid gap-6 sm:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="border border-border p-5">
              <span className="font-serif text-2xl text-primary tabular-nums">
                {index + 1}
              </span>
              <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section id="faq" aria-labelledby="faq-heading" className="py-12">
        <p className="label-caps text-muted-foreground">FAQ</p>
        <h2
          id="faq-heading"
          className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          Common questions
        </h2>
        <div className="mt-8 divide-y divide-border border-y border-border">
          {faqs.map((faq) => (
            <article key={faq.question} className="py-5">
              <h3 className="text-base font-semibold">{faq.question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="trust-heading"
        className="border-t border-border pt-12"
      >
        <p className="label-caps text-muted-foreground">Trust</p>
        <h2
          id="trust-heading"
          className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          Simple, private, and ready when you are
        </h2>
        <div className="mt-6 max-w-3xl space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
          <p>
            MaalTrack runs in the browser and stores game data locally on your
            device. There is no account required to keep score.
          </p>
          <p>
            Built for the Nepali card game Marriage, with support for the
            scoring details that matter: seen, unseen, doubles, manual
            overrides, and auto-settled totals.
          </p>
        </div>
        <div className="mt-8">
          <Link
            href="/play"
            className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Start a game
          </Link>
        </div>
      </section>

      <footer className="mt-16 border-t border-border pt-6 text-sm text-muted-foreground">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>MaalTrack — Marriage card game scorekeeper.</p>
          <a
            href="https://github.com/amodhakal/maaltrack"
            className="underline underline-offset-4 hover:text-foreground"
          >
            View on GitHub
          </a>
        </div>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </main>
  );
}
