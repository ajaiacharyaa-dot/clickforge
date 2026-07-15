import React from 'react'
import { Link } from 'wouter'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Home
        </Link>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last Updated: July 2026</p>

          <div className="prose max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-3">Overview</h2>
              <p className="text-gray-700">
                ClickForge is committed to protecting your privacy. This Privacy Policy explains how we
                collect, use, disclose, and safeguard your information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">1. Information We Collect</h2>
              <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>Email address (required for account creation)</li>
                <li>Password (hashed and encrypted)</li>
                <li>Account profile data (name, preferences)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">2. How We Use Your Information</h2>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>Provide and improve the service</li>
                <li>Process subscriptions and billing</li>
                <li>Send transactional emails (confirmations, receipts)</li>
                <li>Prevent fraud and abuse</li>
                <li>Comply with legal obligations</li>
                <li>NOT to sell or share with third parties for marketing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">3. Your Rights</h2>
              <p className="text-gray-700 mb-3">You can:</p>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>Access your data anytime in dashboard</li>
                <li>Download all your projects (JSON export)</li>
                <li>Delete your account and all associated data</li>
                <li>Opt-out of analytics</li>
              </ul>
              <p className="text-gray-700 mt-3">
                <strong>Requests processed within 30 days (GDPR compliant).</strong>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">4. Contact Us</h2>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>Privacy inquiries: privacy@clickforge.io</li>
                <li>Data requests: dpo@clickforge.io</li>
                <li>Complaints: contact@clickforge.io</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
