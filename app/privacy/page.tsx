import { Shield, Eye, Lock, FileText, AlertTriangle, Mail } from "lucide-react"

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Your privacy is our priority. Learn how we protect and handle your personal information.
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
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Data Security</h3>
              <p className="text-slate-600">Your information is encrypted and securely stored</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Transparency</h3>
              <p className="text-slate-600">Clear information about what data we collect and why</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Your Rights</h3>
              <p className="text-slate-600">Full control over your personal data and preferences</p>
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
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">Introduction</h2>
                  <p className="text-slate-600 leading-relaxed">
                    Microlearning Coach ("we", "us", "our", or "Company") operates the microlearningcoach.com website and
                    mobile application (the "Service"). This page informs you of our policies regarding the collection, use,
                    and disclosure of personal data when you use our Service and the choices you have associated with that
                    data.
                  </p>
                </div>
              </div>
            </section>

            <section className="group">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-purple-600 transition-colors">Information Collection and Use</h2>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    We collect several different types of information for various purposes to provide and improve our Service
                    to you.
                  </p>
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-slate-600" />
                      Types of Data Collected:
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-slate-600"><strong className="text-slate-900">Personal Data:</strong> Name, email address, phone number, profile information</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-slate-600"><strong className="text-slate-900">Usage Data:</strong> Browser type, IP address, pages visited, time spent on pages</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-slate-600"><strong className="text-slate-900">Learning Data:</strong> Lessons completed, scores, progress tracking</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-slate-600"><strong className="text-slate-900">Device Data:</strong> Device type, operating system, unique device identifiers</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="group">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-pink-600 transition-colors">Use of Data</h2>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    Microlearning Coach uses the collected data for various purposes:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "To provide and maintain our Service",
                      "To notify you about changes to our Service",
                      "To allow you to participate in interactive features",
                      "To provide customer support",
                      "To gather analysis for service improvement",
                      "To monitor the usage of our Service",
                      "To detect, prevent and address technical issues"
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-slate-600 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="group">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-red-600 transition-colors">Security of Data</h2>
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-200">
                    <div className="flex items-start gap-3 mb-4">
                      <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-700 leading-relaxed">
                        <strong className="text-slate-900">Important:</strong> The security of your data is important to us but remember that no method of transmission over the Internet
                        or method of electronic storage is 100% secure.
                      </p>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="group">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-orange-600 transition-colors">Changes to This Privacy Policy</h2>
                  <p className="text-slate-600 leading-relaxed">
                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
                    Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
                  </p>
                </div>
              </div>
            </section>

            <section className="group">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-green-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-green-600 transition-colors">Contact Us</h2>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    If you have any questions about this Privacy Policy, please contact us:
                  </p>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-green-600" />
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
