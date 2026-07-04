# Security Policy

## Security First

ClickForge takes security seriously. This document outlines our security practices and how to report vulnerabilities.

## Security Measures

### Authentication & Authorization
- ✅ **Supabase Auth:** Industry-standard email/password authentication
- ✅ **Session Management:** Secure, httpOnly cookies
- ✅ **Rate Limiting:** API endpoints protected against brute-force attacks
- ✅ **Middleware Protection:** Route-level access control

### Data Protection
- ✅ **Encryption in Transit:** SSL/TLS for all connections
- ✅ **Encryption at Rest:** Supabase database encryption
- ✅ **Password Hashing:** Bcrypt with salt
- ✅ **No Plain-Text Storage:** Sensitive data encrypted

### Infrastructure
- ✅ **HTTPS Only:** All communication encrypted
- ✅ **Secure Headers:** CSP, X-Frame-Options, X-Content-Type-Options
- ✅ **CORS:** Strict cross-origin policy
- ✅ **DDoS Protection:** Cloudflare or equivalent

### API Security
- ✅ **Authentication Required:** Most endpoints protected
- ✅ **Rate Limiting:** 100 requests/minute per user
- ✅ **Input Validation:** All inputs sanitized
- ✅ **SQL Injection Protection:** Parameterized queries via Supabase ORM
- ✅ **CSRF Protection:** Token validation

## Vulnerability Disclosure

### Responsible Disclosure

If you discover a security vulnerability:
1. **DO NOT** post it publicly
2. **Email:** security@clickforge.io with full details

### Response Timeline
- **24 hours:** Initial acknowledgment
- **7 days:** Assessment and patch development
- **30 days:** Public disclosure (coordinated)

## Contact

**Security Issues:** security@clickforge.io
**Abuse Reports:** abuse@clickforge.io
