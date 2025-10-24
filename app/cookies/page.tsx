import { Cookie, Settings, BarChart3, Shield, Eye, Mail, FileText } from "lucide-react"

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Cookie className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Cookie Policy
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Understanding how we use cookies to enhance your experience and protect your privacy.
            </p>
            <p className="text-slate-500 mt-4">Last updated: October 2024</p>
          </div>
        </div>
      </section>

      {/* Key Points Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Essential Cookies</h3>
              <p className="text-slate-600">Required for basic website functionality</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Analytics Cookies</h3>
              <p className="text-slate-600">Help us understand and improve your experience</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Your Control</h3>
              <p className="text-slate-600">You have full control over cookie preferences</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-200/50 space-y-12">
            <section className="group">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Cookie className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">What Are Cookies?</h2>
                  <p className="text-slate-600 leading-relaxed">
                    Cookies are small text files that are stored on your device when you visit our website. They help us
                    remember your preferences and understand how you use our Service. Cookies can be either "persistent"
                    cookies or "session" cookies.
                  </p>
                </div>
              </div>
            </section>

            <section className="group">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-purple-600 transition-colors">How We Use Cookies</h2>
                  <p className="text-slate-600 leading-relaxed mb-6">We use cookies for the following purposes:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { title: "Authentication", desc: "To keep you logged in to your account" },
                      { title: "Preferences", desc: "To remember your settings and preferences" },
                      { title: "Analytics", desc: "To understand how you use our Service" },
                      { title: "Security", desc: "To protect against fraud and unauthorized access" },
                      { title: "Performance", desc: "To optimize the performance of our Service" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <span className="font-semibold text-slate-900">{item.title}:</span>
                          <span className="text-slate-600 ml-1">{item.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="group">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-pink-600 transition-colors">Types of Cookies We Use</h2>
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <h3 className="font-bold text-slate-900">Essential Cookies</h3>
                      </div>
                      <p className="text-slate-700">
                        These cookies are necessary for the website to function properly. They enable core functionality such
                        as security, network management, and accessibility.
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <h3 className="font-bold text-slate-900">Performance Cookies</h3>
                      </div>
                      <p className="text-slate-700">
                        These cookies collect information about how you use our website, such as which pages you visit and if
                        you experience any errors.
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <h3 className="font-bold text-slate-900">Functional Cookies</h3>
                      </div>
                      <p className="text-slate-700">
                        These cookies allow us to remember choices you make and provide enhanced, more personalized features.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="group">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-red-600 transition-colors">Managing Cookies</h2>
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-200">
                    <p className="text-slate-700 leading-relaxed mb-4">
                      Most web browsers allow you to control cookies through their settings. You can typically find these
                      settings in the "Options" or "Preferences" menu of your browser.
                    </p>
                    <div className="bg-yellow-100 rounded-xl p-4 border border-yellow-300">
                      <p className="text-yellow-800 text-sm">
                        <strong>Note:</strong> However, please note that disabling cookies may affect the functionality of our Service.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="group">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-orange-600 transition-colors">Third-Party Cookies</h2>
                  <p className="text-slate-600 leading-relaxed">
                    We may allow third-party service providers to place cookies on your device for analytics and advertising
                    purposes. These third parties have their own privacy policies governing their use of cookies.
                  </p>
                </div>
              </div>
            </section>

            <section className="group">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-green-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-yellow-600 transition-colors">Changes to This Cookie Policy</h2>
                  <p className="text-slate-600 leading-relaxed">
                    We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new
                    Cookie Policy on this page.
                  </p>
                </div>
              </div>
            </section>

            <section className="group">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-green-600 transition-colors">Contact Us</h2>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    If you have any questions about this Cookie Policy, please contact us:
                  </p>
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-200">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-teal-600" />
                      <span className="text-slate-900 font-medium">privacy@microlearningcoach.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  )
}
