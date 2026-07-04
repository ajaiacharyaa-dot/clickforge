'use client'

import Link from 'next/link'

export const LegalFooter = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/legal/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a href="/SECURITY.md" className="hover:text-white transition">
                  Security Policy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:support@clickforge.io" className="hover:text-white transition">
                  support@clickforge.io
                </a>
              </li>
              <li>
                <a href="mailto:abuse@clickforge.io" className="hover:text-white transition">
                  Report Abuse
                </a>
              </li>
              <li>
                <a href="mailto:security@clickforge.io" className="hover:text-white transition">
                  Security Issues
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Status
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center text-sm">
          <p>&copy; 2026 ClickForge. All rights reserved.</p>
          <p className="mt-2 text-xs text-gray-500">
            ClickForge complies with GDPR, CCPA, and standard data protection regulations.
          </p>
        </div>
      </div>
    </footer>
  )
}
