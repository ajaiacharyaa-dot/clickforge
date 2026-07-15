import React from 'react'
import { Link } from 'wouter'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Home
        </Link>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Effective Date: July 2026</p>

          <div className="prose max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-700">
                By accessing or using ClickForge, you agree to be bound by these Terms. If you disagree
                with any part of these terms, do not use the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">2. Use of Service</h2>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>You must be 13+ years old to use this service</li>
                <li>You are responsible for maintaining account security</li>
                <li>Do not use the service for illegal content or copyright infringement</li>
                <li>Do not attempt to reverse-engineer or scrape the service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">3. Content & IP</h2>
              <p className="text-gray-700">
                You retain ownership of images you upload. By uploading, you grant ClickForge a limited
                license to process and display your content to provide the service. Generated thumbnails
                are yours to use commercially.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">4. Limitation of Liability</h2>
              <p className="text-gray-700">
                ClickForge is provided "as is" without warranties of any kind. We are not liable for
                indirect, incidental, or consequential damages arising from your use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">5. Contact</h2>
              <p className="text-gray-700">
                Questions about these Terms? Contact us at legal@clickforge.io
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
