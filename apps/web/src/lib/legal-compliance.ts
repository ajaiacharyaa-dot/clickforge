/**
 * Legal & Compliance Utilities
 * Handles GDPR, CCPA, and other regulatory requirements
 */

import { createClient } from './supabase-client'

/**
 * GDPR: User data export
 * Allows users to download all their data in portable format
 */
export const exportUserData = async (userId: string) => {
  const supabase = createClient()

  try {
    const { data: user } = await supabase.from('users').select('*').eq('id', userId).single()

    const dataExport = {
      exportDate: new Date().toISOString(),
      user: user,
    }

    return JSON.stringify(dataExport, null, 2)
  } catch (error) {
    console.error('Data export error:', error)
    throw new Error('Failed to export user data')
  }
}

/**
 * GDPR: Right to be forgotten
 * Permanently delete all user data
 */
export const deleteUserData = async (userId: string) => {
  const supabase = createClient()

  try {
    // Delete user record (cascade delete will handle related data)
    const { error } = await supabase.from('users').delete().eq('id', userId)

    if (error) throw error
    return { success: true, message: 'User data permanently deleted' }
  } catch (error) {
    console.error('Data deletion error:', error)
    throw new Error('Failed to delete user data')
  }
}

/**
 * CCPA: Consumer privacy rights
 * Allows users to opt-out of data sales (we don't sell data)
 */
export const updatePrivacyPreferences = async (
  userId: string,
  preferences: {
    analytics: boolean
    marketing: boolean
    thirdPartySharing: boolean
  }
) => {
  const supabase = createClient()

  try {
    const { error } = await supabase
      .from('users')
      .update({
        privacy_preferences: preferences,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Privacy preference update error:', error)
    throw new Error('Failed to update privacy preferences')
  }
}

/**
 * Log user activity for audit trail
 * Maintains compliance with data protection regulations
 */
export const logUserActivity = async (
  userId: string,
  action: string,
  details: Record<string, any>
) => {
  const supabase = createClient()

  try {
    await supabase.from('audit_logs').insert({
      user_id: userId,
      action,
      details,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Audit log error:', error)
    // Don't throw - logging shouldn't break the app
  }
}

/**
 * Consent management
 * Track user consent for cookies, marketing, analytics
 */
export const manageConsent = async (
  userId: string,
  consentType: 'analytics' | 'marketing' | 'essential',
  granted: boolean
) => {
  const supabase = createClient()

  try {
    const { error } = await supabase.from('consent_log').insert({
      user_id: userId,
      consent_type: consentType,
      granted,
      timestamp: new Date().toISOString(),
    })

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Consent management error:', error)
    throw new Error('Failed to update consent')
  }
}

/**
 * Check user's consent status
 */
export const hasConsent = async (
  userId: string,
  consentType: 'analytics' | 'marketing'
): Promise<boolean> => {
  const supabase = createClient()

  try {
    const { data } = await supabase
      .from('consent_log')
      .select('granted')
      .eq('user_id', userId)
      .eq('consent_type', consentType)
      .order('timestamp', { ascending: false })
      .limit(1)
      .single()

    return data?.granted || false
  } catch (error) {
    console.error('Consent check error:', error)
    return false
  }
}
