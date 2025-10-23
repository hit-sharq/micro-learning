export default function AccessibilityPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-5xl font-bold text-slate-900 mb-4">Accessibility Statement</h1>
        <p className="text-slate-600 mb-12">Last updated: October 2024</p>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Commitment</h2>
            <p className="text-slate-600 leading-relaxed">
              Microlearning Coach is committed to ensuring digital accessibility for people with disabilities. We are
              continually improving the user experience for everyone and applying the relevant accessibility standards.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Accessibility Features</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Our website includes the following accessibility features:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li>Keyboard navigation support</li>
              <li>Screen reader compatibility</li>
              <li>High contrast mode support</li>
              <li>Adjustable text sizes</li>
              <li>Captions and transcripts for video content</li>
              <li>Alternative text for images</li>
              <li>Semantic HTML structure</li>
              <li>ARIA labels and landmarks</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Standards Compliance</h2>
            <p className="text-slate-600 leading-relaxed">
              We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. These
              guidelines explain how to make web content more accessible to people with disabilities.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Assistive Technology Support</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Our website is compatible with the following assistive technologies:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li>Screen readers (NVDA, JAWS, VoiceOver)</li>
              <li>Voice control software</li>
              <li>Magnification software</li>
              <li>Speech recognition software</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Known Issues</h2>
            <p className="text-slate-600 leading-relaxed">
              We are aware of the following accessibility issues and are working to resolve them:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li>Some embedded third-party content may not be fully accessible</li>
              <li>Certain interactive features may require additional keyboard support</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Feedback and Support</h2>
            <p className="text-slate-600 leading-relaxed">
              We welcome feedback on the accessibility of our website. If you encounter any accessibility barriers,
              please contact us at: accessibility@microlearningcoach.com
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Third-Party Content</h2>
            <p className="text-slate-600 leading-relaxed">
              While we strive to ensure all content on our website is accessible, some third-party content may not meet
              our accessibility standards. We encourage you to contact us if you encounter any accessibility issues with
              third-party content.
            </p>
          </section>
        </div>
      </section>
    </main>
  )
}
