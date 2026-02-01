# Pre-Launch To-Do List

## Backend Setup (Requires Lovable Cloud)
- [ ] **Enable Lovable Cloud**
  - Set up authentication system
  - Configure database
  - Enable file storage
  - **Persistent ad storage and management**
  - **Real-time ad analytics dashboard**
  - **Stripe payment processing for ad purchases**

## Authentication & User Management
- [ ] **User Authentication System**
  - Email/password login and signup
  - User profile management
  - Password reset functionality
  - User roles system (admin, moderator, user)
  - **Account type differentiation (Company vs User)**
    - Company accounts: Can place ads, access analytics dashboard, manage business profile
    - User accounts: Content consumption, video uploads, social features
    - Account type selection during signup
    - Role-specific UI and permissions

## Database Setup
- [ ] **Create Database Tables**
  - User profiles table
  - Videos table (with metadata, categories, etc.)
  - Ad bookings/purchases table
  - Business listings table
  - Events table
  - E-commerce items table
  - Posts/content table
  - User roles table (for admin access)

## File Storage
- [ ] **Configure Storage Buckets**
  - Video uploads storage
  - Ad images storage
  - User avatars storage
  - Business media storage
  - Proper RLS policies for secure access

## Admin Panel Features
- [ ] **Secure Admin Access**
  - Server-side admin role validation
  - Admin dashboard authentication
  - Video review system with database
  - Ad management with database
  - User management interface
  - Content moderation tools

## Payment Integration
- [ ] **Integrate Stripe for Ad Payments**
  - Set up Stripe account for Bahamas-based business
  - Create payment forms for ad booking
  - Implement different ad packages/pricing tiers
  - Add receipt generation
  - Set up payment tracking in admin panel
  - Store transaction records in database

## Testing & Quality Assurance
- [ ] **Comprehensive Testing**
  - Test on different mobile devices (iOS, Android)
  - Test on different browsers (Chrome, Safari, Firefox)
  - Test on tablets and desktop
  - Real-world testing with actual users
  - Bug tracking and fixing
  - Performance testing
  - Load testing for high traffic

## App Store Preparation
- [ ] **App Store Listings**
  - Write clear, compelling app description
  - Prepare high-quality screenshots for all device sizes
  - Create professional app icon
  - Prepare promotional graphics
  - Write privacy policy and terms of service
  - Set up app store developer accounts

## Payment & Backend Services
- [ ] **Final Integration Testing**
  - Test all Stripe payment flows end-to-end
  - Verify payment confirmation emails
  - Test refund and cancellation processes
  - Verify all backend services are production-ready
  - Test database backups and recovery
  - Monitor server performance and scaling

## Marketing & Launch Plan
- [ ] **Social Media Setup**
  - Create Facebook business page
  - Set up Instagram business account
  - Prepare launch content and posts
  - Design promotional graphics
  - Create teaser videos
  - Schedule launch announcement posts
- [ ] **Marketing Strategy**
  - Define target audience in Bahamas
  - Prepare launch campaign
  - Plan influencer outreach
  - Create email marketing campaigns
  - Set up analytics tracking (Google Analytics, etc.)
  - Prepare press releases for local media

## Additional Features
- [ ] Real-time notifications system
- [ ] Analytics and reporting
- [ ] Email notifications (using Resend)
- [ ] Content filtering and moderation
- [ ] **Customer-Facing Ad Analytics Dashboard**
  - Database persistence for ad performance data (impressions, clicks, CTR)
  - Link ads to customer accounts
  - Customer portal to view their ad analytics
  - Performance metrics over time (7-day, 30-day views)
  - Export analytics reports
- [ ] AI-powered chat support (ChatGPT/Lovable AI integration)
  - Floating chat widget or support page
  - Automated responses for common questions
  - Help with navigation and app features

---

## Fixes & Solutions Log

### Splash Ad Fix (2026-02-01)
**Issue:** Clicking on splash page ad images showed a black screen instead of the full-size ad preview.

**Root Cause:** The `DialogContent` component from shadcn/ui already includes its own `DialogPortal` and `DialogOverlay` internally. The code was manually wrapping these again, causing duplicate overlays. Additionally, the default `DialogContent` styles use `left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]` centering which conflicted with fullscreen display.

**Solution:** 
1. Removed manual `DialogPortal` and `DialogOverlay` wrappers
2. Applied `!important` CSS overrides to `DialogContent` for fullscreen behavior:
   ```jsx
   <DialogContent className="!fixed !inset-0 !left-0 !top-0 !translate-x-0 !translate-y-0 !max-w-none !w-screen !h-screen !p-0 !border-none !bg-black/95 !rounded-none flex items-center justify-center">
   ```

**File:** `src/components/AdSplash.tsx`

**Key Learning:** When using shadcn/ui Dialog components, `DialogContent` is self-contained and should not be wrapped in additional `DialogPortal` or `DialogOverlay` components.

---

### Mobile Menu Touch Fix (2026-02-01)
**Issue:** The mobile menu button required 3-4 taps before responding on mobile devices.

**Root Cause:** Multiple issues combined:
1. Button size was 40x40px, below the recommended 44x44px minimum touch target
2. Missing `touch-manipulation` CSS property which removes the 300ms mobile tap delay
3. Child elements (icon, notification badge) were intercepting touch events
4. No explicit z-index causing potential overlap issues

**Solution:** 
1. Increased touch target to 44x44px with `min-w-[44px] min-h-[44px] w-11 h-11`
2. Added `touch-manipulation` class to remove mobile tap delay
3. Added `pointer-events-none` to all child elements so clicks hit the button directly
4. Added `z-10` to ensure button stays above overlapping elements
5. Added `active:scale-95` for visual feedback on tap
6. Added explicit `type="button"` attribute

```jsx
<Button
  variant="ghost"
  size="icon"
  className="absolute right-0 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] w-11 h-11 rounded-lg hover:bg-accent active:bg-accent/80 active:scale-95 transition-all touch-manipulation z-10"
  onClick={toggleMobileSidebar}
  type="button"
>
  <Menu size={22} className="text-foreground pointer-events-none" />
</Button>
```

**File:** `src/components/Header.tsx`

**Key Learning:** For reliable mobile touch handling:
- Always use `touch-manipulation` on interactive elements
- Minimum touch target should be 44x44px
- Use `pointer-events-none` on child elements inside buttons
- Provide visual feedback with `active:` states
