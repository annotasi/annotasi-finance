export const foundationPageCopy = {
  eyebrow: "Fondasi teknis",
  heading: "Annotasi Finance siap dibangun.",
  message:
    "Kerangka aplikasi web berjalan. Fitur keuangan belum dimulai pada tahap ini.",
  statusLabel: "Status sistem",
  statusValue: "Siap",
} as const;

export default function HomePage() {
  return (
    <main>
      <section aria-labelledby="foundation-heading">
        <p className="eyebrow">{foundationPageCopy.eyebrow}</p>
        <h1 id="foundation-heading">{foundationPageCopy.heading}</h1>
        <p className="message">{foundationPageCopy.message}</p>
        <dl>
          <div>
            <dt>{foundationPageCopy.statusLabel}</dt>
            <dd>{foundationPageCopy.statusValue}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
