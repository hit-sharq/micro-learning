export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-5xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
        <p className="text-slate-600 mb-12">Last updated: October 2024</p>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
            <p className="text-slate-600 leading-relaxed">
              Microlearning Coach ("we", "us", "our", or "Company") operates the microlearningcoach.com website and
              mobile application (the "Service"). This page informs you of our policies regarding the collection, use,
              and disclosure of personal data when you use our Service and the choices you have associated with that
              data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Information Collection and Use</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We collect several different types of information for various purposes to provide and improve our Service
              to you.
            </p>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Types of Data Collected:</h3>
                <ul className="list-disc list-inside text-slate-600 space-y-2">
                  <li>Personal Data: Name, email address, phone number, profile information</li>
                  <li>Usage Data: Browser type, IP address, pages visited, time spent on pages</li>
                  <li>Learning Data: Lessons completed, scores, progress tracking</li>
                  <li>Device Data: Device type, operating system, unique device identifiers</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Use of Data</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Microlearning Coach uses the collected data for various purposes:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li>To provide and maintain our Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To allow you to participate in interactive features of our Service</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information so we can improve our Service</li>
              <li>To monitor the usage of our Service</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Security of Data</h2>
            <p className="text-slate-600 leading-relaxed">
              The security of your data is important to us but remember that no method of transmission over the Internet
              or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to
              protect your Personal Data, we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Changes to This Privacy Policy</h2>
            <p className="text-slate-600 leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Contact Us</h2>
            <p className="text-slate-600 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at: privacy@microlearningcoach.com
            </p>
          </section>
        </div>
      </section>
    </main>
  )
}
