# TravelTogether - Development Backlog

*Updated: 2025-09-02*  
*Format: Task backlog with detailed implementation plans in /ref/plans/*

## 🚨 **Priority Tasks**

### 1. **User-Contextualized Trip Experience** - HIGH PRIORITY  
**Problem**: Username system is identity-only - need to make UserContext meaningful for trip access and personalization  
**Dependencies**: ✅ Global Username System (implemented, pending merge)  
**Estimated Effort**: 2-3 sessions  
**Key Features**: Filter trips by user participation, user-specific ratings, permission restrictions (only edit your trips), personalized dashboard  
**Technical Scope**: Integrate `username` with trip filtering, rating system updates, permission middleware, user-specific data views  
**Critical Next Step**: This transforms the username system from identity-only to fully functional user experience

### 2. **Home Dashboard Enhancement** - MEDIUM PRIORITY  
**Problem**: Dashboard functionality can be enhanced beyond current MVP  
**Plan**: See `/ref/plans/dashboard/TravelTogether_Dashboard_MVP_Summary.md` for additional features  
**Estimated Effort**: 1-2 sessions  
**Key Features**: Enhanced archetype toggles, advanced social feed, improved map/calendar integration

## 🔄 **Medium Priority Features**

### 2. **Interactive Trip Map Integration**
**Problem**: Need visual itinerary with map overlay showing activities/restaurants  
**Plan**: TBD - create plan in `/ref/plans/map_integration.md`  
**Estimated Effort**: 1-2 sessions  
**Key Features**: Mapbox integration, activity markers, route visualization

### 3. **Sample Social Feed Population**
**Problem**: Need populated social feed for demo and testing purposes  
**Plan**: TBD - create plan in `/ref/plans/social_feed_demo.md`  
**Estimated Effort**: 1 session  
**Key Features**: Sample posts, photos, interactions, realistic timeline

### 4. **Dashboard Personalize View (Archetype Toggles)**
**Problem**: Need user role-based dashboard customization (Organizer, Casual Traveler, Social Sharer)  
**Previous Implementation**: Archetype toggles that show/hide sections and badges based on user role  
**Status**: Feature removed from dashboard until design direction is finalized  
**Plan**: TBD - decide on implementation approach (user profiles, preferences, or contextual switching)  
**Estimated Effort**: 1-2 sessions  
**Key Features**: Role-based filtering, section visibility, personalized badge display

### ⚠️ **Global Username System** - IMPLEMENTED, PENDING MERGE
**Status**: ✅ **FULLY IMPLEMENTED** on feature branch `feature/global-username-system` - **🔥 READY TO MERGE** 🔥  
**⚠️ IMPORTANT**: Branch needs to be merged to main - do not forget!  
**Implementation**: See `/ref/completed.md` for comprehensive documentation  
**Key Features Delivered**: 27 production participants preserved, login system, username editing with reclaim, admin panel at `/admin/users`, duplicate prevention, localStorage persistence  
**Current Scope**: Identity layer only - no operational changes to trip access/permissions yet  
**Ready for Production**: All phases complete, extensively tested, production-ready  
**Next Phase Ready**: Foundation for user-specific features (trip filtering, contextualized ratings, permissions)  
**Branch Status**: `feature/global-username-system` - 3 comprehensive commits ready for merge

### 6. **Trip Export System** - MEDIUM PRIORITY  
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