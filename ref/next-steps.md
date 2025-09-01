# TravelTogether - Development Backlog

*Updated: 2025-08-29*  
*Format: Task backlog with detailed implementation plans in /ref/plans/*

## 🚨 **Priority Tasks**

### 1. **SPA Direct URL Routing** - ✅ COMPLETED (2025-08-29)
**Problem**: Direct URLs like bookmarks return 404 (normal navigation works fine)  
**Solution**: Fixed httpd.conf with proper asset exclusion and SPA catch-all routing pattern  
**Status**: ✅ Working - assets serve correctly, SPA routing functional, MIME types resolved

### 2. **Home Dashboard Enhancement** - MEDIUM PRIORITY  
**Problem**: Dashboard functionality can be enhanced beyond current MVP  
**Plan**: See `/ref/plans/dashboard/TravelTogether_Dashboard_MVP_Summary.md` for additional features  
**Estimated Effort**: 1-2 sessions  
**Key Features**: Enhanced archetype toggles, advanced social feed, improved map/calendar integration

## 🔄 **Medium Priority Features**

### 3. **Itinerary Tab/Function Implementation** - ✅ COMPLETED (2025-09-01)
**Problem**: Need a comprehensive itinerary view that combines activities, restaurants, and travel into a timeline  
**Solution**: Implemented comprehensive itinerary tab with timeline view, schedule item management, and form-to-top UX  
**Key Features**: Day-by-day timeline, time-based scheduling, activity types (activity, meal, travel, lodging, logistics, free time), notes and duration tracking  
**Status**: ✅ Fully functional with add/edit/display capabilities and consistent UX pattern

### 4. **Interactive Trip Map Integration**
**Problem**: Need visual itinerary with map overlay showing activities/restaurants  
**Plan**: TBD - create plan in `/ref/plans/map_integration.md`  
**Estimated Effort**: 1-2 sessions  
**Key Features**: Mapbox integration, activity markers, route visualization

### 4. **Trip Details Backend Sync**
**Problem**: Trip modifications (participants, dates, details) don't sync to backend  
**Plan**: TBD - create plan in `/ref/plans/trip_sync_backend.md`  
**Estimated Effort**: 1-2 sessions  
**Key Features**: Full CRUD operations, real-time updates, conflict resolution

### 5. **Sample Social Feed Population**
**Problem**: Need populated social feed for demo and testing purposes  
**Plan**: TBD - create plan in `/ref/plans/social_feed_demo.md`  
**Estimated Effort**: 1 session  
**Key Features**: Sample posts, photos, interactions, realistic timeline

### 6. **Trip Deletion URL Routing Fix** - ✅ COMPLETED (2025-09-01)
**Problem**: When deleting a trip, redirect goes to `/trips` instead of `/traveltogether/trips`  
**Solution**: Fixed redirect URL in TripDetail.jsx from `'/trips'` to `'/traveltogether/trips'`  
**Status**: ✅ Fixed and merged to main as part of form-to-top improvements

### 7. **Trip User Management** - MEDIUM PRIORITY
**Problem**: Need ability to edit user names on trips (as foundation for future user database)  
**Plan**: TBD - create plan in `/ref/plans/trip_user_editing.md`  
**Estimated Effort**: 1 session  
**Key Features**: Edit participant names, add/remove participants, prepare for future user system
**Note**: Discussed in earlier sessions but not implemented yet - still needed for trip management

### 8. **Activity & Restaurant Card Compactness** - ✅ COMPLETED (2025-08-30)
**Problem**: Cards show full rating scales for every person, making them too verbose and cluttered  
**Solution**: Implemented compact grid layout for other participants with rating scale reference headers  
**Key Features**: Show only final rating values per person, single rating scale reference at page top, more compact card layout  
**Status**: ✅ Merged to main, deployed to production

### 9. **Dashboard Personalize View (Archetype Toggles)**
**Problem**: Need user role-based dashboard customization (Organizer, Casual Traveler, Social Sharer)  
**Previous Implementation**: Archetype toggles that show/hide sections and badges based on user role  
**Status**: Feature removed from dashboard until design direction is finalized  
**Plan**: TBD - decide on implementation approach (user profiles, preferences, or contextual switching)  
**Estimated Effort**: 1-2 sessions  
**Key Features**: Role-based filtering, section visibility, personalized badge display

### 10. **Form-to-Top UX Pattern Implementation** - ✅ COMPLETED (2025-09-01)
**Problem**: Users had to scroll between form buttons and actual forms, creating UX friction especially with long lists  
**Solution**: Implemented consistent form-to-top pattern across all 6 tabs with smart conditional styling  
**Key Features**: Forms positioned at top after tab header, conditional button styling (prominent when empty, subtle when populated), consistent UX across Activities, Restaurants, Travel, Lodging, Logistics, and Itinerary tabs  
**Technical Improvements**: Fixed lodging form validation, corrected itinerary tab variable references, added required field indicators  
**Status**: ✅ All tabs updated with consistent pattern, improved user experience, no more scrolling friction

### 11. **Tab Interface Simplification** - MEDIUM PRIORITY
**Problem**: Current tab interface may be overwhelming with 6 tabs (Activities, Restaurants, Travel, Lodging, Logistics, Itinerary)  
**Plan**: TBD - evaluate tab grouping/consolidation options  
**Estimated Effort**: 1 session  
**Key Features**: Possibly combine related tabs (Travel + Lodging?), or implement tab grouping/collapsing  
**Note**: Discussed in earlier sessions but deferred - current 6-tab structure working well

### 12. **Global Username System** - HIGH PRIORITY
**Problem**: Need user identity system for collaborative trip planning with existing sample trip participants  
**Plan**: See `/ref/plans/username_system_implementation.md` for complete implementation guide  
**Estimated Effort**: 4-5 hours (5 phases)  
**Key Features**: Username registry from existing participants, duplicate prevention, login system, user context, username editing, data preservation  
**Technical Scope**: Extract existing participant names (Orlando/Vegas/Paris/Aspen trips), React Context for user management, localStorage persistence, rating system integration  
**Critical Success Factor**: Friends can immediately resume collaborative testing with realistic user identity system

### 13. **Trip Export System** - MEDIUM PRIORITY  
**Problem**: Users need data portability and backup capabilities for trip planning data  
**Plan**: See `/ref/plans/trip_export_implementation.md` for complete implementation guide  
**Estimated Effort**: 4-6 hours (3 phases)  
**Key Features**: JSON/CSV/PDF export formats, all tab data included, individual user ratings preserved, single-click export  
**Technical Scope**: Backend export API endpoint, frontend processing with format generation, file download system  
**File Naming**: `{TripName}-Export-{YYYY-MM-DD}.{format}` (e.g., `Paris-Adventure-Export-2025-08-25.json`)  
**Export Scope**: Complete trip data (activities, restaurants, travel, lodging, logistics, itinerary) with user ratings and trip metadata

## 📋 **Future Enhancements**
- Real-time notifications system
- Advanced trip sharing and permissions
- Travel expense tracking and splitting
- Integration with external booking platforms
- Mobile app development
- Drag-and-drop scheduling for itinerary items
- Integration between itinerary and activities/restaurants tabs
- Time conflict detection and warnings

---

## ✅ **Current System Status**
- **Production**: https://jafner.com/traveltogether/ - ✅ FULLY FUNCTIONAL (2025-08-29)
- **Core Features**: Trip creation, collaborative rating, tabbed interface, mobile responsive
- **Backend**: Node.js/Express API with SQLite, PM2 managed - ✅ STABLE
- **Frontend**: React SPA with Tailwind CSS, fully responsive design - ✅ DASHBOARD LIVE
- **API Routes**: Both `/api/` and `/traveltogether/api/` endpoints fully functional
- **MIME Types**: JavaScript/CSS assets serve with correct MIME types (resolved browser caching issue)
- **Dashboard**: Trip cards display actual dates and proper calculations ✅ WORKING
- **SPA Routing**: Minor issue with direct URLs (httpd.conf needs final tweak for bookmarks)
- **Documentation**: Complete deployment and development workflow documented

---

*This backlog is reviewed and updated after each development session. Detailed implementation plans are maintained in /ref/plans/ directory.*