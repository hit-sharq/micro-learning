import { FileText, AlertTriangle, Scale, Shield, Users, Gavel } from "lucide-react"

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Scale className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Terms of Service
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Clear guidelines for using our platform responsibly and effectively.
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
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Fair Usage</h3>
              <p className="text-slate-600">Use our platform responsibly and ethically</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">User Rights</h3>
              <p className="text-slate-600">Clear rights and responsibilities for all users</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Gavel className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Legal Framework</h3>
              <p className="text-slate-600">Governing laws and dispute resolution</p>
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
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">Agreement to Terms</h2>
                  <p className="text-slate-600 leading-relaxed">
                    By accessing and using Microlearning Coach, you accept and agree to be bound by the terms and provision of
                    this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                </div>
              </div>
            </section>

            <section className="group">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-purple-600 transition-colors">Use License</h2>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    Permission is granted to temporarily download one copy of the materials (information or software) on
                    Microlearning Coach for personal, non-commercial transitory viewing only. This is the grant of a license,
                    not a transfer of title, and under this license you may not:
                  </p>
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        "Modifying or copying the materials",
                        "Using the materials for any commercial purpose",
                        "Attempting to decompile or reverse engineer",
                        "Removing any copyright or proprietary notations",
                        "Transferring the materials to another person"
                      ].map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-slate-600 text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="group">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-pink-600 transition-colors">Disclaimer</h2>
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
                    <div className="flex items-start gap-3 mb-4">
                      <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-700 leading-relaxed">
                        <strong className="text-slate-900">Important:</strong> The materials on Microlearning Coach are provided on an 'as is' basis.
                      </p>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      Microlearning Coach makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without
                      limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or
                      non-infringement of intellectual property or other violation of rights.
                    </p>
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
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-red-600 transition-colors">Limitations</h2>
                  <p className="text-slate-600 leading-relaxed">
                    In no event shall Microlearning Coach or its suppliers be liable for any damages (including, without
                    limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or
                    inability to use the materials on Microlearning Coach.
                  </p>
                </div>
              </div>
            </section>

            <section className="group">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-orange-600 transition-colors">Accuracy of Materials</h2>
                  <p className="text-slate-600 leading-relaxed">
                    The materials appearing on Microlearning Coach could include technical, typographical, or photographic
                    errors. Microlearning Coach does not warrant that any of the materials on its website are accurate,
                    complete, or current. Microlearning Coach may make changes to the materials contained on its website at
                    any time without notice.
                  </p>
                </div>
              </div>
            </section>

            <section className="group">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-green-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-yellow-600 transition-colors">Links</h2>
                  <p className="text-slate-600 leading-relaxed">
                    Microlearning Coach has not reviewed all of the sites linked to its website and is not responsible for the
                    contents of any such linked site. The inclusion of any link does not imply endorsement by Microlearning
                    Coach of the site. Use of any such linked website is at the user's own risk.
                  </p>
                </div>
              </div>
            </section>

            <section className="group">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Gavel className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-green-600 transition-colors">Modifications</h2>
                  <p className="text-slate-600 leading-relaxed">
                    Microlearning Coach may revise these terms of service for its website at any time without notice. By using
                    this website, you are agreeing to be bound by the then current version of these terms of service.
                  </p>
                </div>
              </div>
            </section>

            <section className="group">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-teal-600 transition-colors">Governing Law</h2>
                  <p className="text-slate-600 leading-relaxed">
                    These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction
                    in which Microlearning Coach operates, and you irrevocably submit to the exclusive jurisdiction of the
                    courts in that location.
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
