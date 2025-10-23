export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-5xl font-bold text-slate-900 mb-4">Cookie Policy</h1>
        <p className="text-slate-600 mb-12">Last updated: October 2024</p>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. What Are Cookies?</h2>
            <p className="text-slate-600 leading-relaxed">
              Cookies are small text files that are stored on your device when you visit our website. They help us
              remember your preferences and understand how you use our Service. Cookies can be either "persistent"
              cookies or "session" cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. How We Use Cookies</h2>
            <p className="text-slate-600 leading-relaxed mb-4">We use cookies for the following purposes:</p>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li>
                <strong>Authentication:</strong> To keep you logged in to your account
              </li>
              <li>
                <strong>Preferences:</strong> To remember your settings and preferences
              </li>
              <li>
                <strong>Analytics:</strong> To understand how you use our Service
              </li>
              <li>
                <strong>Security:</strong> To protect against fraud and unauthorized access
              </li>
              <li>
                <strong>Performance:</strong> To optimize the performance of our Service
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Types of Cookies We Use</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Essential Cookies</h3>
                <p className="text-slate-600">
                  These cookies are necessary for the website to function properly. They enable core functionality such
                  as security, network management, and accessibility.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Performance Cookies</h3>
                <p className="text-slate-600">
                  These cookies collect information about how you use our website, such as which pages you visit and if
                  you experience any errors.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Functional Cookies</h3>
                <p className="text-slate-600">
                  These cookies allow us to remember choices you make and provide enhanced, more personalized features.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Managing Cookies</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Most web browsers allow you to control cookies through their settings. You can typically find these
              settings in the "Options" or "Preferences" menu of your browser. However, please note that disabling
              cookies may affect the functionality of our Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Third-Party Cookies</h2>
            <p className="text-slate-600 leading-relaxed">
              We may allow third-party service providers to place cookies on your device for analytics and advertising
              purposes. These third parties have their own privacy policies governing their use of cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Changes to This Cookie Policy</h2>
            <p className="text-slate-600 leading-relaxed">
              We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new
              Cookie Policy on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Contact Us</h2>
            <p className="text-slate-600 leading-relaxed">
              If you have any questions about this Cookie Policy, please contact us at: privacy@microlearningcoach.com
            </p>
          </section>
        </div>
      </section>
    </main>
  )
}
