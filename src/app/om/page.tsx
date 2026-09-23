import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRightIcon, InstagramIcon } from "../../components/icons";

export const metadata: Metadata = {
  title: "Om os",
  description:
    "Om AP Klar: en gratis øvelsesapp til Almen Sprogforståelse (AP) på STX og HHX, lavet af gymnasieelever til gymnasieelever.",
};

const INSTAGRAM_URL = "https://www.instagram.com/lindouweb?igsi=amN6MHJ3cHd3aHVs&utm_source=qr";

// Om-siden: redaktionel tekstside i samme sprog som appen — masthead med
// accent-bjælke, hårfine skillelinjer og ingen gradienter eller glød.
export default function OmPage() {
  return (
    <div className="min-h-screen bg-paper text-ink antialiased">
      <div className="mx-auto max-w-2xl px-5 py-10 sm:px-8 sm:py-14">
        <Link
          href="/"
          className="btn btn-outline mb-8 inline-flex px-3 py-1.5 text-xs"
        >
          ← Tilbage til appen
        </Link>

        <header className="border-t-[3px] border-ink pt-5">
          <p className="eyebrow">Om appen</p>
          <h1 className="page-title mt-1">AP Klar</h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/65 sm:text-base">
            AP Klar er en gratis øvelsesapp til Almen Sprogforståelse (AP) på STX og HHX. Her træner du ordklasser,
            sætningsled, tempus, kasus, syntaks og latin; på HHX også kommunikation, semantik, pragmatik, genrer og
            sproghistorie. Din progression gemmes lokalt på din enhed: ingen login, ingen tracking.
          </p>
        </header>

        <div className="mt-10 space-y-8">
          <section className="border-t border-ink/15 pt-5">
            <h2 className="section-title">Lavet af gymnasieelever til gymnasieelever</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/60">
              AP Klar er bygget af gymnasieelever, der selv skal op til prøven. Vi kender pensum, og vi ved, hvordan det
              føles at skulle lære det hele fra bunden. Derfor starter hvert forløb med en rolig introduktion, før du
              bliver spurgt: Appen underviser dig først, så du kan lære uden at have en lærer ved siden af.
            </p>
          </section>

          <section className="border-t border-ink/15 pt-5">
            <h2 className="section-title">Følg med og del dine tanker</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/60">
              Appen bliver hele tiden bedre. Du kan følge med i udviklingen og komme med forslag, rettelser og
              tilbagemeldinger på vores Instagram.
            </p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline mt-3 inline-flex"
            >
              <InstagramIcon className="h-4 w-4" />
              Følg os på Instagram
              <ArrowUpRightIcon className="h-4 w-4" />
            </a>
          </section>

          <section className="border-t border-ink/15 pt-5">
            <h2 className="section-title">Prøv selv</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/60">
              Du kan uden videre gå i gang på forsiden: vælg STX eller HHX, og begynd at øve dig med det samme. Du kan
              også se mere om appen på siden her og følge vores Instagram for nyt.
            </p>
            <Link href="/" className="btn btn-primary mt-3 inline-flex">
              Gå til appen
              <ArrowUpRightIcon className="h-4 w-4" />
            </Link>
          </section>

          <p className="border-t border-ink/15 pt-4 text-center text-xs text-ink/45">
            AP Klar: Almen Sprogforståelse for STX og HHX. Ingen login, ingen tredjepartscookies.
          </p>
        </div>
      </div>
    </div>
  );
}
