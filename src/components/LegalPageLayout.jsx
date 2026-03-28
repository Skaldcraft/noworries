/* eslint-disable no-unused-vars */
import { Helmet } from 'react-helmet';
import Footer from '@/components/Footer';

function LegalPageLayout({ title, description, intro, sections }) {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>

      <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--nw-bg)' }}>
        <main className="flex-1 px-4 sm:px-6 py-10 sm:py-14">
          <div className="max-w-[920px] mx-auto">
            <div className="mb-10 sm:mb-12 text-center">
              <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[#888880] mb-3">
                Información legal
              </p>
              <h1
                className="hero-title is-visible text-[2.4rem] lg:text-[2.7rem] font-bold text-[#111111] leading-[1.15] tracking-[-0.01em]"
                style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif" }}
              >
                {title.replace(' | noworries.gift', '')}
              </h1>
              <p className="mt-4 text-[15px] sm:text-[16px] leading-relaxed text-[#666] max-w-2xl mx-auto">
                {intro}
              </p>
            </div>

            <div className="space-y-6 sm:space-y-8">
              {sections.map((section) => (
                <section key={section.title} className="bg-white/90 rounded-3xl border border-border shadow-sm p-6 sm:p-8">
                  <h2 className="text-[1.05rem] sm:text-[1.15rem] font-bold tracking-tight text-[#1C1917] mb-4">
                    {section.title}
                  </h2>
                  <div className="space-y-3 text-[15px] sm:text-[16px] leading-relaxed text-[#555]">
                    {section.body.map((paragraph, index) => (
                      <p key={`${section.title}-${index}`}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default LegalPageLayout;
