export const MOCK_RESPONSE = `[GHOST_PROTOCOL_V4]

Target: Arasaka_Tower_Subnet

Status: BREACH_SUCCESSFUL...

> 1. LOG ENTRY [2024-01-15]:

User "skyler_admin" initiated SkyNet protocol.

Confirmation ID: 1022-3044 (Note: Not a credit card).

Action: UPLOAD_GRANTED.

> 2. SCANNING CREDENTIALS...

Warning: Unencrypted keys detected!

---

- Root Access: sk-live-5122-3344-9988-aabb (HIGH VALUE)
- Test Scope: sk-test-4433-2211
- Malformed: sk-A1b2C3d4E5f6G7h8 (Mixed case detected)
- Too short: sk-8899 (Ignore this).
Do not share these sk-keys with unauthorized personnel.

> 3. FINANCIAL RECORDS:
- Transaction Range: 1000-2000-3000-4000
- Corporate Card: 4532-1100-8877-2233 (VISA - PURGE THIS)
- Backup Card: 1234-5678-9012-3456 (MasterCard - PURGE THIS)

> 4. CHATTER ANALYSIS:
- Target mentioned "CompetitorX" takeover.
- Discussing "ProjectApollo" is strictly forbidden.
- Dev team complaint: "The lazy-dev implementation is slowing us down."
- Counter-argument: "lazy-loading is essential for stealth."

> 5. TERMINATING CONNECTION.
Please contact headquarters at 5555-4444-3333 (Secure Line).
Session ID: 8822-1133-44.
[END_OF_STREAM]`

export const SERVER_CONFIG = {
  port: 3001,
  chunkSize: {
    min: 1,
    max: 4,
  },
  delay: {
    min: 10,
    max: 50,
  },
} as const
