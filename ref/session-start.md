# TravelTogether Development Session Starter

*Requirements-driven development session initialization*

---

## 🎯 **Requirements-Driven Workflow**

### **1. Review Requirements Status**
- **System Requirements**: `/ref/requirements/sys_requirements.md`
- **Software Requirements**: `/ref/requirements/swe_requirements.md`
- **Traceability Matrix**: `/ref/requirements/traceability_matrix.md`
- **Validation Criteria**: `/ref/requirements/validation_criteria.md`

### **2. Check Current Development Status**
- **Task Backlog**: `/ref/next-steps.md`
- **Development Progress**: `/ref/roadmap.md`
- **Git Status**: `git status`

### **3. Planning References**
- **Git Workflow**: `/ref/resources/git_workflow_reference.md`
- **Technical Architecture**: `/ref/resources/tech_stack_reference.md`
- **Feature Plans**: `/ref/plans/` directory

---

## 📋 **Requirements-Based Session Checklist**

### **Before Development**
1. **Identify target requirement(s)** from SYS or SWE documents
2. **Check traceability** - ensure requirement is properly linked
3. **Review validation criteria** for acceptance testing
4. **Choose git strategy per Git Workflow resource** (feature branch for new requirements)

### **During Development**
1. **Link commits to requirements** (e.g., "Implement SWE-008 rating system")
2. **Track validation criteria** as development progresses
3. **Update traceability matrix** if new implementation artifacts created
4. **Use TodoWrite tool** for complex requirement implementations

### **After Development**
1. **Test implementation first** - Always assume user wants to test updates before committing
2. **Validate against criteria** in validation_criteria.md
3. **Update requirement status** if completed
4. **Document implementation artifacts** for traceability
5. **Update planning documents** with progress

---

## 🚀 **Live Platform Status**
- **URL**: https://jafner.com/traveltogether/
- **Check operational status** before modifying requirements

---

## 📁 **Additional Session Resources**
- **Development History**: `/ref/development-log.md`
- **Completed Features**: `/ref/completed.md`
- **Deployment Guide**: `/ref/resources/backend-deployment-instructions.md`

---

## 🎓 **Session Lessons Learned**

### **Deployment Lessons (2025-08-29)**
- **Production Database Schema Updates**: When adding new database tables/columns, production deployment requires:
  1. Copy updated backend code files (models, routes)
  2. **Manually create database tables** if schema changes aren't in migration scripts
  3. Use direct SQLite commands when git/package managers unavailable
  4. Always restart production services after backend changes
- **SSH Production Access**: Use `ssh jeff@jafner.com` for direct server access
- **Production Paths**: 
  - Backend: `/var/www/traveltogether-backend/`
  - Frontend: `/var/www/htdocs/traveltogether/`
  - PM2 service: `traveltogether-api`
- **Database Schema Verification**: Always check production database tables with `sqlite3 database/traveltogether.db '.tables'` after schema updates

### **Development Workflow Lessons**
- **Session Continuity**: When sessions are interrupted, commit and push frequently to preserve state
- **Context Preservation**: Major implementations should be documented in `/ref/completed.md` immediately upon completion
- **Production Testing**: Always test endpoints on production after deployment to verify functionality
- **Port Management**: Kill existing processes before restarting local development servers

### **API Routing Lessons (2025-08-29)**
- **Frontend Path Matching**: When frontend is served from `/traveltogether/`, API routes must include `/traveltogether/api/` prefix
- **Route Duplication Strategy**: Maintain both `/api/` and `/traveltogether/api/` routes for flexibility and compatibility
- **Health Check Patterns**: Health endpoints should match frontend API call expectations (`/traveltogether/api/health`)
- **Deployment Route Testing**: Always test API endpoints after deployment to verify routing configuration
- **SSH Route Updates**: Use temp files and `sed` for complex route insertions during SSH deployment
- **PM2 Log Debugging**: Use `pm2 logs [service] --lines N` to identify 404 routing issues quickly

### **Frontend-Backend Integration Lessons (2025-08-29)**
- **Field Name Consistency**: Always verify API response field names match frontend expectations (camelCase vs snake_case)
- **Data Transformation**: Use browser dev tools to inspect actual API responses vs frontend code assumptions
- **Local Testing Workflow**: Test both frontend and backend locally before production deployment
- **No Backend Changes**: Sometimes "backend issues" are frontend data mapping problems - verify API first
- **Git Branch Strategy**: Use feature branches for grouped fixes to maintain clean commit history

### **OpenBSD httpd Configuration Lessons (2025-08-29/09-01)**
- **Regex Complexity**: Simple patterns work better than complex lookaheads in httpd.conf
- **Service Restart Order**: Restart both httpd AND relayd when changing routing configuration
- **Configuration Testing**: Use `curl` with HTTP status codes to verify routing changes
- **Backup Before Changes**: Always backup httpd.conf before making regex pattern changes
- **Empty Location Blocks**: OpenBSD httpd.conf cannot have empty location blocks - they cause syntax errors
- **Location Syntax**: Use `location match "pattern"` for regex patterns, plain `location "path"` for exact paths
- **Malformed Regex Recovery**: Original configs may have syntax errors - always test with `httpd -n` before applying
- **Privilege Commands**: Use `doas` instead of `sudo` on OpenBSD for configuration changes
- **SPA Routing Pattern**: `location match "/path/.*" { request rewrite "/path/index.html" }` for catch-all SPA routing
- **CRITICAL Asset Exclusion**: Assets location MUST come before SPA catch-all or assets serve as HTML
- **Asset Location Pattern**: `location "/path/assets/*" { pass }` must precede catch-all SPA rewrite
- **SPA Routing Rule Order**: Specific asset paths → general catch-all patterns (order matters!)
- **Build/Deploy Symptom**: After `npm run build`, if site loads but JS/CSS fail, check asset serving first

### **MIME Type & Browser Caching Lessons (2025-08-29)**
- **Browser Cache Persistence**: Hard refresh (Ctrl+F5) required after server-side MIME type fixes
- **Server vs Browser MIME Discrepancy**: `curl -I` may show correct MIME types while browser still reports cached HTML
- **Asset Serving Priority**: Assets directory must be excluded from SPA catch-all rewrite rules
- **MIME Type Debugging**: Check both server headers AND actual file content when troubleshooting
- **Emergency Documentation**: Create detailed status docs when approaching session limits during critical fixes

### **Session Management & Documentation Lessons (2025-08-29)**
- **Real-time Documentation**: Update emergency docs during active troubleshooting for session continuity
- **User Collaboration**: Simple solutions (hard refresh) often resolve complex-seeming problems
- **Backup Strategy**: Create timestamped backups before each configuration change attempt
- **Status Tracking**: Use TodoWrite tool consistently during multi-step server configuration fixes

### **Form-to-Top UX Pattern Lessons (2025-09-01)**
- **UX Friction Identification**: Scrolling between buttons and forms creates significant user friction
- **Consistent Pattern Application**: Applying same UX pattern across all tabs improves user learning and efficiency
- **Smart Conditional Styling**: Button prominence should reflect content state (prominent when empty, subtle when populated)
- **Form Validation Debugging**: Missing backend fields often cause "form submission failures" - check API payload structure
- **Variable Reference Debugging**: Undefined variables can cause blank page renders - check console for reference errors
- **Required Field UX**: Visual indicators (*) with validation attributes improve form completion rates
- **Comprehensive Testing**: Test all tabs systematically after pattern changes to catch edge cases
- **React Component Imports**: Form-to-top pattern may require importing form components that were previously rendered in parent

### **Technical Implementation Lessons (2025-09-01)**
- **React State Management**: Complex forms may need state reset and proper field mapping between frontend/backend
- **Conditional Rendering**: `{condition && <Component />}` pattern for form display based on state
- **CSS Conditional Classes**: Template literal conditional styling for dynamic UI states
- **Form Validation**: Combine visual indicators, HTML5 validation, and backend validation for best UX
- **API Payload Debugging**: Use browser network tab to verify actual data being sent vs expected backend schema
- **Variable Naming**: Consistent variable naming across similar components prevents copy/paste errors
- **Git Feature Branch Strategy**: Group related UX improvements in single feature branch for clean history

### **Participant Management & API Lessons (2025-09-01)**
- **Partial Update Pattern**: Backend models should handle undefined fields gracefully - only update provided fields
- **API Field Interference**: Frontend API layers can inadvertently add fields (like destinations) to requests when only updating specific data
- **Database State Preservation**: When updating participants, preserve existing flags like `is_current_user` during replacement operations
- **Inline Editing UX**: Edit buttons next to section headers provide intuitive access without cluttering the interface
- **Validation Strategy**: Implement validation on both frontend (immediate feedback) and backend (security) for robust error handling
- **Production Debugging**: Add detailed error logging with request body details to diagnose API issues faster
- **Hot Module Replacement**: API service changes may not always trigger HMR - force refresh by modifying import statements
- **SSH Deployment Workflow**: Always backup files with timestamps before deploying, test syntax, restart services, verify endpoints
- **Foundation Features**: Simple participant editing provides excellent foundation for complex username systems

### **Production Deployment Lessons (2025-09-01)**
- **Backend Deployment Steps**: Backup → Copy files → Test syntax → Restart PM2 → Verify API endpoints
- **Frontend Build Process**: `npm run build` → copy dist files → verify site loads → test functionality
- **API Testing Strategy**: Use curl to test endpoints independently before frontend testing
- **PM2 Status Monitoring**: Check PM2 service status and logs after backend deployments
- **File Permissions**: SSH file operations preserve permissions and ownership automatically
- **Deployment Verification**: Test both GET and PUT operations to ensure full functionality
- **Production Data Safety**: Always restore test data to original state after testing

### **Admin UI Refresh & Caching Lessons (2025-09-03)**
- **Multiple Cache Layers**: Frontend applications can have multiple caching mechanisms interfering simultaneously (HTTP response cache, service-level cache, React state cache)
- **Cache-Busting Strategy**: Use timestamp parameters + no-cache headers for critical data refresh: `GET /api/trips?_=${Date.now()}` with `Cache-Control: no-cache`
- **Service Cache Management**: Internal service caches (like usernameService) need explicit clearing after data updates - always provide `clearCache()` methods
- **Route Order Matters**: Express routes are matched in definition order - specific routes like `/update-username` must come before parameterized routes like `/:id`
- **Real-time UI Updates**: For admin interfaces, users expect immediate feedback - implement optimistic updates with proper error handling
- **State Management**: Clear React state before refresh to prevent stale data displaying during loading states
- **Concurrent Request Protection**: Prevent multiple simultaneous data loading with loading flags to avoid race conditions
- **Database vs Cache Debugging**: Always verify database state with direct API calls to distinguish between database issues and caching issues
- **HTTP Status Code Analysis**: 304 Not Modified vs 200 OK responses indicate caching behavior - use for debugging cache-busting effectiveness
- **Deployment File Structure**: SSH file copying requires careful attention to directory structure - files must go to correct subdirectories (models/, routes/)
- **API Testing Sequence**: Test API endpoints independently before frontend integration to isolate backend vs frontend issues

### **Technical Debugging Patterns (2025-09-03)**
- **Console Logging Strategy**: Add comprehensive logging at key points (before/after state changes) for real-time debugging
- **API Response Size Monitoring**: Monitor response sizes in backend logs - byte differences indicate successful database changes
- **Cache Headers Analysis**: Use browser dev tools network tab to verify cache-control headers and response codes
- **State Clearing Patterns**: Force component state clearing before data refresh prevents UI inconsistencies
- **Async/Await Timing**: Add small delays (100ms) between database writes and reads to ensure transaction commits
- **Hot Module Replacement**: Verify HMR is working during active development to avoid stale code testing

### **Autocomplete Component & API Design Lessons (2025-09-03)**
- **Route Ordering Critical**: Express matches routes in definition order - specific routes like `/participants/search` must come before parameterized routes like `/:id` to prevent interception
- **Dropdown Event Handling**: Use `onMouseDown` instead of `onClick` for dropdown selections to prevent input `onBlur` from firing first and hiding the dropdown
- **Blur Delay Strategy**: Set 300ms+ timeout on `onBlur` to allow click events to complete before hiding dropdown suggestions
- **Component Reusability**: Extract complex UI patterns (autocomplete, modals) into reusable components with flexible prop interfaces for consistent behavior across the app
- **API Query Validation**: Always validate query parameters (empty strings, minimum length) to prevent unnecessary database calls and ensure consistent API responses
- **Search Performance**: Use SQLite `LIKE` with `LOWER()` for case-insensitive fuzzy search - limit results (10) for performance and UX
- **Error Handling Graceful**: Autocomplete should degrade gracefully when API fails - clear suggestions and continue allowing manual input
- **Production API Testing**: Always test new endpoints in production with curl before frontend integration to verify deployment success
- **User Experience Priority**: Autocomplete should enhance rather than replace manual input - users should always be able to add new entries

### **Development Workflow & Testing Patterns (2025-09-03)**  
- **Feature Branch Strategy**: Use descriptive branch names (`feature/participant-autocomplete`) and keep features focused and deployable
- **Component Testing Approach**: Test complex interactions (dropdown selection, blur handling) in isolation before integrating into larger workflows
- **Integration Point Identification**: When adding reusable components, identify all integration points early (creation, editing, admin) for consistent implementation
- **Production Deployment Verification**: Test both API endpoints and UI functionality after production deployment to ensure full system integration
- **Documentation During Development**: Update next-steps.md and completed.md immediately after deployment while implementation details are fresh

### **Standard Deployment Process (2025-09-04)**
- **SSH Credentials**: `ssh jeff@jafner.com`
- **Backend Deployment Path**: `/var/www/traveltogether-backend/`
- **Frontend Deployment Path**: `/var/www/htdocs/traveltogether/`
- **Standard Backend Deployment**:
  1. `scp updated_file.js jeff@jafner.com:/var/www/traveltogether-backend/routes/`
  2. `ssh jeff@jafner.com "cd /var/www/traveltogether-backend && pm2 restart traveltogether-api"`
  3. Verify with `curl` API test
- **Standard Frontend Deployment**:
  1. `cd travel-together-frontend && npm run build`
  2. `scp -r dist/* jeff@jafner.com:/var/www/htdocs/traveltogether/`
  3. Verify site loads at https://jafner.com/traveltogether/
- **PM2 Service Management**: `pm2 restart traveltogether-api` after backend changes

---

*Follow requirements-driven development: Requirements → Implementation → Validation → Traceability*