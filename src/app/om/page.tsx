import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRightIcon, InstagramIcon } from "../../components/icons";

export const metadata: Metadata = {
  title: "Om os",
  description:
    "Om AP Klar: en gratis øvelsesapp til Almen Sprogforståelse (AP) på STX og HHX, lavet af gymnasieelever til gymnasieelever.",
};

const INSTAGRAM_URL = "https://www.instagram.com/lindouweb?igsi=amN6MHJ3cHd3aHVs&utm_source=qr";

export default function OmPage() {
  return (
    <div className="min-h-screen bg-[#faf8ff] text-ink antialiased dark:bg-[#171225] dark:text-ink-dark">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1 rounded-full border-2 border-ink/10 bg-white px-3 py-1.5 text-xs font-bold text-ink hover:border-purple hover:text-purple"
        >
          ← Tilbage til appen
        </Link>

        <div className="mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-purple to-purple-dark p-6 text-white shadow-lg sm:p-8">
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Om AP Klar</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
            AP Klar er en gratis øvelsesapp til Almen Sprogforståelse (AP) på STX og HHX. Her træner du ordklasser,
            sætningsled, tempus, kasus, syntaks og latin; på HHX også kommunikation, semantik, pragmatik, genrer og
            sproghistorie. Din progression gemmes lokalt på din enhed: ingen login, ingen tracking.
          </p>
        </div>

        <div className="mt-6 grid gap-4">
          <section className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
            <h2 className="font-display text-lg font-extrabold text-ink">Lavet af gymnasieelever til gymnasieelever</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/60">
              AP Klar er bygget af gymnasieelever, der selv skal op til prøven. Vi kender pensum, og vi ved, hvordan det
              føles at skulle lære det hele fra bunden. Derfor starter hvert forløb med en rolig introduktion, før du
              bliver spurgt: Appen underviser dig først, så du kan lære uden at have en lærer ved siden af.
            </p>
          </section>

          <section className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
            <h2 className="font-display text-lg font-extrabold text-ink">Følg med og del dine tanker</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/60">
              Appen bliver hele tiden bedre. Du kan følge med i udviklingen og komme med forslag, rettelser og
              tilbagemeldinger på vores Instagram.
            </p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 via-rose-500 to-amber-500 px-4 py-2.5 text-sm font-bold text-white shadow-md"
            >
              <InstagramIcon className="h-4 w-4" />
              Følg os på Instagram
              <ArrowUpRightIcon className="h-4 w-4" />
            </a>
          </section>

          <section className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
            <h2 className="font-display text-lg font-extrabold text-ink">Prøv selv</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/60">
              Du kan uden videre gå i gang på forsiden: vælg STX eller HHX, og begynd at øve dig med det samme. Du kan
              også se mere om appen på siden her og følge vores Instagram for nyt.
            </p>
            <Link
              href="/"
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-purple px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-purple/30"
            >
              Gå til appen
              <ArrowUpRightIcon className="h-4 w-4" />
            </Link>
          </section>

          <p className="px-2 text-center text-xs text-ink/40">
            AP Klar: Almen Sprogforståelse for STX og HHX. Ingen login, ingen tredjepartscookies.
          </p>
        </div>
      </div>
    </div>
  );
}
