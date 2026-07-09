/**
 * Landing config barrel export.
 *
 * Import from `@/constants/landing` to access all landing system configs.
 */

// Types
export type {
    InstitutionType,
    PublicNavItem,
    FooterSection,
    LandingSectionConfig,
    PageType,
    LayoutContext,
} from "./types";

// Navigation (public website)
export { PUBLIC_NAV, PUBLIC_FOOTER } from "./navigation";

// Section registry (landing page composition)
export type { SectionMeta } from "./sections";
export { LANDING_SECTIONS } from "./sections";

// Label & theme overrides
export {
    GROUP_LABEL_OVERRIDES,
    HEAD_LABEL,
    HEAD_DESK_LABEL,
    DEFAULT_THEME,
    DEFAULT_FONT,
    PRIMARY_CTA_LABEL,
} from "./overrides";

// Audience card shine config
export type { AudienceShineConfig } from "./audience";
export { AUDIENCE_CARD_SHINE } from "./audience";

// Feature card beam config
export type { FeatureBeamConfig } from "./features";
export { FEATURES_BEAM_CONFIG } from "./features";

// Social proof beam config
export type { SocialProofBeamConfig } from "./socialProof";
export { STAT_BEAM_CONFIG, TESTIMONIAL_BEAM_CONFIG } from "./socialProof";

// Results beam config
export type { ResultBeamConfig } from "./results";
export { RESULTS_BEAM_CONFIG } from "./results";

// Pricing beam config
export type { PricingBeamConfig } from "./pricing";
export { PRICING_BEAM_CONFIG } from "./pricing";
