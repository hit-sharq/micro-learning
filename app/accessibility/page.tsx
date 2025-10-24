import { Accessibility, Eye, Keyboard, Volume2, Users, MessageSquare, CheckCircle, AlertTriangle } from "lucide-react"

export default function AccessibilityPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Accessibility className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Accessibility Statement
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Making our platform accessible to everyone, regardless of ability or disability.
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
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Inclusive Design</h3>
              <p className="text-slate-600">Built with accessibility in mind from the ground up</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Keyboard className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Keyboard Navigation</h3>
              <p className="text-slate-600">Full keyboard accessibility for all interactions</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Volume2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Screen Reader Support</h3>
              <p className="text-slate-600">Compatible with popular screen reading software</p>
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
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">Our Commitment</h2>
                  <p className="text-slate-600 leading-relaxed">
                    Microlearning Coach is committed to ensuring digital accessibility for people with disabilities. We are
                    continually improving the user experience for everyone and applying the relevant accessibility standards.
                  </p>
                </div>
              </div>
            </section>

            <section className="group">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-purple-600 transition-colors">Accessibility Features</h2>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    Our website includes the following accessibility features:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Keyboard navigation support",
                      "Screen reader compatibility",
                      "High contrast mode support",
                      "Adjustable text sizes",
                      "Captions and transcripts for video content",
                      "Alternative text for images",
                      "Semantic HTML structure",
                      "ARIA labels and landmarks"
                    ].map((feature, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="group">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Accessibility className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-pink-600 transition-colors">Standards Compliance</h2>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                    <div className="flex items-center gap-3 mb-3">
                      <Accessibility className="w-6 h-6 text-blue-600" />
                      <span className="font-bold text-slate-900">WCAG 2.1 Level AA</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. These
                      guidelines explain how to make web content more accessible to people with disabilities.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="group">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Volume2 className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-red-600 transition-colors">Assistive Technology Support</h2>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    Our website is compatible with the following assistive technologies:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Screen readers (NVDA, JAWS, VoiceOver)",
                      "Voice control software",
                      "Magnification software",
                      "Speech recognition software"
                    ].map((tech, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-slate-600">{tech}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="group">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-orange-600 transition-colors">Known Issues</h2>
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
                    <div className="flex items-start gap-3 mb-4">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-700 leading-relaxed">
                        <strong className="text-slate-900">We're actively working on these:</strong> We are aware of the following accessibility issues and are working to resolve them:
                      </p>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-slate-600">Some embedded third-party content may not be fully accessible</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-slate-600">Certain interactive features may require additional keyboard support</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="group">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-green-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-yellow-600 transition-colors">Feedback and Support</h2>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    We welcome feedback on the accessibility of our website. If you encounter any accessibility barriers,
                    please contact us:
                  </p>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-green-600" />
                      <span className="text-slate-900 font-medium">accessibility@microlearningcoach.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="group">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-green-600 transition-colors">Third-Party Content</h2>
                  <p className="text-slate-600 leading-relaxed">
                    While we strive to ensure all content on our website is accessible, some third-party content may not meet
                    our accessibility standards. We encourage you to contact us if you encounter any accessibility issues with
                    third-party content.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  )
}
