'use client'

import React from 'react'
import Link from 'next/link'

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
              <h2 className="text-2xl font-bold mb-3">1. Agreement to Terms</h2>
              <p className="text-gray-700">
                By accessing and using ClickForge ("Service"), you accept and agree to be bound by the
                terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">2. User Responsibilities</h2>
              <p className="text-gray-700 mb-3">You agree to:</p>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>Use the Service only for lawful purposes</li>
                <li>Not upload illegal, defamatory, or infringing content</li>
                <li>Not attempt to gain unauthorized access</li>
                <li>Not use automated tools to scrape or spam</li>
                <li>Respect intellectual property rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">3. Content You Create</h2>
              <p className="text-gray-700">
                Your content belongs to you. By using ClickForge, you grant us a limited license to
                store, process, and display your thumbnails.
              </p>
              <p className="text-gray-700 mt-2">
                <strong>You remain the copyright holder</strong> of all images and content you create.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">4. Limitation of Liability</h2>
              <p className="text-gray-700 font-semibold mb-2">DISCLAIMER:</p>
              <p className="text-gray-700">
                The materials on ClickForge are provided on an 'as is' basis. ClickForge makes no
                warranties, expressed or implied, and hereby disclaims all other warranties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">5. Contact Information</h2>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>Legal inquiries: legal@clickforge.io</li>
                <li>Support: support@clickforge.io</li>
                <li>Abuse reports: abuse@clickforge.io</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
