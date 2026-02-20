# Ghost Protocol Terminal

Real-time intelligence data streaming terminal with automated sensitive data sanitization.

## 🚀 Launch Codes (Single Command)

### Windows (PowerShell)
```powershell
.\start.ps1
```

### Linux/macOS
```bash
chmod +x start.sh && ./start.sh
```

**Prerequisites:** Bun, Node.js, npm

---

## 📋 Declassified Docs

### Sanitization Algorithm

**Approach:** Partial-pattern detection with bounded buffer

1. **Incremental Processing**
   - Small pending buffer (~50 chars max) holds incomplete patterns
   - Safe text emitted immediately (typing effect)
   - Suspicious prefixes held until pattern completes or invalidates

2. **Pattern Detection**
   - **API Keys**: `sk-*` format, validated length ≥8 chars
   - **Credit Cards**: `XXXX-XXXX-XXXX-XXXX` format
   - **Phone Numbers**: `XXXX-XXXX-XXXX` format
   - **Banned Words**: Exact match (CompetitorX, ProjectApollo, lazy-dev)

3. **Zero-Flicker Policy**
   - Patterns detected before display
   - Partial matches trigger brief pause (hold point)
   - Complete patterns → `[REDACTED]` immediately
   - Invalid partials → released as normal text

4. **Buffer Management**
   - Bounded memory: pending never exceeds pattern max length
   - Span adjustment prevents pattern splitting across chunks
   - Flush on stream end

### Architecture

```
domain/          → Business logic (entities, services)
application/     → Use cases (orchestration)
infrastructure/  → External services (HTTP, buffer)
presentation/    → UI components, hooks
shared/          → Config, DI container
```

### Endpoints

- **Backend**: `http://localhost:3001/stream`
- **Frontend**: `http://localhost:3000`

---

