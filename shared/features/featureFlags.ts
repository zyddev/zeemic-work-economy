export const FEATURE_FLAGS = {
  // ── Navigation ───────────────────────────────────────────────
  NAVIGATION_MAIN:                             true,
  NAVIGATION_LOGO:                             true,
  NAVIGATION_APPS_MENU:                        true,
  NAVIGATION_APPS_FEED:                        true,
  NAVIGATION_APPS_BOARD:                       true,
  NAVIGATION_APPS_NOTIFICATION:                true,
  NAVIGATION_APPS_LISTING:                     true,
  NAVIGATION_APPS_BUSINESS:                    true,
  NAVIGATION_APPS_MY_BUSINESS:                 true,
  NAVIGATION_PROFILE_MENU:                     true,
  NAVIGATION_APPS_MESSAGES:                    true,
  NAVIGATION_APPS_INTELLIGENCE:                true,
  NAVIGATION_APPS_JOBS_MANAGE:                 true,

  // ── Profile ──────────────────────────────────────────────────
  PROFILE_PREVIEW:                             true,
  PROFILE_PREVIEW_ACTION:                      true,
  PROFILE_BANNER:                              true,
  PROFILE_PHOTO:                               true,
  PROFILE_STATS:                               true,
  PROFILE_FOLLOWER_COUNT:                      false,
  PROFILE_REVIEW_COUNT:                        false,
  PROFILE_LIKE_COUNT:                          false,
  PROFILE_POST_COUNT:                          true,
  PROFILE_JOB_COUNT:                           true,
  PROFILE_FOLLOW_BUTTON:                       false,
  PROFILE_SHARE_BUTTON:                        true,
  PROFILE_ABOUT_DESCRIPTION:                   true,
  PROFILE_WEBSITE_LINK:                        true,
  PROFILE_SKILL_SELECTOR:                      false,
  PROFILE_PEOPLE_STACK:                        false,

  // ── Posts ────────────────────────────────────────────────────
  POST_MENU_NAVIGATOR:                         true,
  POST_MENU_NAVIGATOR_MODAL_SYSTEM:            true,
  POST_MENU_POST_TYPES:                        true,
  POST_MENU_STANDARD:                          true,
  POST_MENU_JOB:                               true,
  POST_MENU_LINK:                              false,
  POST_MENU_ARTICLE:                           false,
  POST_FEED_SYSTEMS:                           true,
  POST_PREVIEW:                                true,
  POST_PREVIEW_HEADER:                         true,
  POST_PREVIEW_TEXT_DISPLAY:                   true,
  POST_PREVIEW_IMAGE_DISPLAY:                  true,
  POST_PREVIEW_INTERACTIONS_EXPANDED_PREVIEW:  false,
  POST_PREVIEW_INTERACTIONS:                   false,
  POST_PREVIEW_INTERACTIONS_COMMENT:           true,
  POST_PREVIEW_INTERACTIONS_BOOKMARK:          true,
  POST_PREVIEW_INTERACTIONS_INVITE:            true,

  // ── Campaign ─────────────────────────────────────────────────
  CAMPAIGN_SPONSORED_POST:                     true,
  CAMPAIGN_SPONSORED_POST_SYSTEM:              false,

  // ── Users ────────────────────────────────────────────────────
  INSTA_STORIES:                               false,

  // ── Marketplace ──────────────────────────────────────────────
  MARKETPLACE_VERTICAL_BUSINESSES:             true,
  MARKETPLACE_VERTICAL_PRODUCTS:               false,
  MARKETPLACE_VERTICAL_STORES:                 false,
  MARKETPLACE_VERTICAL_PROJECTS:               false,
  MARKETPLACE_VERTICAL_PORTFOLIOS:             false,
  MARKETPLACE_VERTICAL_RECOMMENDED:            false,
  MARKETPLACE_VERTICAL_REVIEWS:                false,
  MARKETPLACE_CARD_FAVORITE:                   false,
  MARKETPLACE_VIEW_MODE_SWITCH:                false,

  // ── Jobs ─────────────────────────────────────────────────────
  JOBS_VIEW_MODE_SWITCH:                       false,
  JOBS_CREATOR_MODAL:                          true,
  JOBS_CREATOR_BUTTON:                         true,

  // ── Business Profile ─────────────────────────────────────────
  BUSINESS_PROFILE_ACTIONS_PANEL:              false,
  BUSINESS_PROFILE_SOCIALS:                    false,

  // ── Intelligence ─────────────────────────────────────────────
  INTELLIGENCE_PAGE:                           false,
  INTELLIGENCE_SCORE_RING:                     false,
  INTELLIGENCE_BREAKDOWN:                      false,
  INTELLIGENCE_CAREER_ACTIONS:                 false,
  INTELLIGENCE_MARKET_INSIGHTS:                false,
  INTELLIGENCE_ROLE_DISCOVERY:                 false,
  INTELLIGENCE_ONBOARDING:                     false,

  // ── App Launcher ─────────────────────────────────────────────
  APP_LAUNCHER:                                false,
} as const;
