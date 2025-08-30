# TravelTogether - Development Backlog

*Updated: 2025-08-29*  
*Format: Task backlog with detailed implementation plans in /ref/plans/*

## 🚨 **Priority Tasks**

### 1. **SPA Direct URL Routing** - LOW PRIORITY  
**Problem**: Direct URLs like bookmarks return 404 (normal navigation works fine)  
**Status**: httpd.conf needs proper two-rule setup for assets vs SPA routing  
**Estimated Effort**: 15-30 minutes  
**Action**: Configure separate location blocks for `/assets/` and catch-all rewrite

### 2. **Home Dashboard Enhancement** - MEDIUM PRIORITY  
**Problem**: Dashboard functionality can be enhanced beyond current MVP  
**Plan**: See `/ref/plans/dashboard/TravelTogether_Dashboard_MVP_Summary.md` for additional features  
**Estimated Effort**: 1-2 sessions  
**Key Features**: Enhanced archetype toggles, advanced social feed, improved map/calendar integration

## 🔄 **Medium Priority Features**

### 3. **Itinerary Tab/Function Implementation**
**Problem**: Need a comprehensive itinerary view that combines activities, restaurants, and travel into a timeline  
**Plan**: TBD - create plan in `/ref/plans/itinerary_tab.md`  
**Estimated Effort**: 2-3 sessions  
**Key Features**: Day-by-day timeline, drag-and-drop scheduling, integration with existing activities/restaurants, time conflict detection, export functionality

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

### 6. **Trip Deletion URL Routing Fix**
**Problem**: When deleting a trip, redirect goes to `/trips` instead of `/traveltogether/trips`  
**Plan**: TBD - create plan in `/ref/plans/trip_deletion_routing.md`  
**Estimated Effort**: 30 minutes  
**Key Features**: Proper URL routing for trip deletion, consistent with SPA base path

### 7. **Trip User Management**
**Problem**: Need ability to edit user names on trips (as foundation for future user database)  
**Plan**: TBD - create plan in `/ref/plans/trip_user_editing.md`  
**Estimated Effort**: 1 session  
**Key Features**: Edit participant names, add/remove participants, prepare for future user system

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

## 📋 **Future Enhancements**
- Real-time notifications system
- Advanced trip sharing and permissions
- Travel expense tracking and splitting
- Integration with external booking platforms
- Mobile app development

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