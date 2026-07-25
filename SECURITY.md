# Security Guidelines

## Environment Variables
- Never commit `.env` files with real credentials
- Use `.env.example` as a template
- All sensitive data must be stored in environment variables

## API Keys and Secrets
- Firebase API keys should be stored in environment variables
- Sentry DSN should be stored in environment variables
- Never hardcode any credentials in the codebase

## Data Protection
- All user data is stored locally using AsyncStorage
- No sensitive data is transmitted without encryption
- Implement proper data sanitization before storage

## Dependencies
- Regularly update dependencies to patch security vulnerabilities
- Run `npm audit` to check for vulnerabilities
- Use `npm audit fix` to automatically fix vulnerabilities

## Code Security
- Implement proper input validation
- Sanitize all user inputs
- Use TypeScript for type safety
- Enable ESLint with security rules

## Network Security
- Use HTTPS for all API calls
- Implement certificate pinning for critical APIs
- Validate SSL certificates

## Authentication & Authorization
- Implement proper authentication if needed
- Use secure token storage
- Implement session management

## Logging & Monitoring
- Use Sentry for error tracking
- Implement proper logging without exposing sensitive data
- Monitor for suspicious activities

## Testing
- Include security tests in the test suite
- Test for common vulnerabilities (OWASP Top 10)
- Regular penetration testing

## Build Security
- Sign releases
- Use code obfuscation for production builds
- Enable ProGuard/R8 for Android
- Enable bitcode for iOS
