export const INSUREE_MARITAL_STATUS = ["N", "W", "S", "D", "M"];
export const FAMILY_POVERTY_STATUS = [true, false];
export const PHOTO_STATUS = ["with", "without"];
export const FAMILY_STATUS = ["with", "without"];
export const disabilityStatusOptions = [
    "no_disability",
    "physical_disability",
    "visual_impairment",
    "hearing_impairment",
    "speech_disability",
    "intellectual_disability",
    "mental_disorder",
    "autism_spectrum_disorder",
    "cerebral_palsy",
    "multiple_sclerosis",
    "parkinsons_disease",
    "spinal_cord_injury",
    "amputation",
    "chronic_neurological_condition",
    "other_disability",
];
export const EMPTY_STRING = "";
export const MODULE_NAME = "insuree";

export const INSUREE_ACTIVE_STRING = "AC";
export const INSUREE_INACTIVE_STRING = "IN";
export const INSUREE_DEAD_STRING = "DE";
export const INSUREE_NUMBER_MAX_LENGTH = 50;
export const INSUREE_STATUS = [INSUREE_ACTIVE_STRING, INSUREE_INACTIVE_STRING, INSUREE_DEAD_STRING];
export const HYPHEN = "-";

export const RIGHT_FAMILY = 101001; //101000 in doc ... but in practice...
export const RIGHT_FAMILY_SEARCH = 101001;
export const RIGHT_FAMILY_ADD = 101002;
export const RIGHT_FAMILY_EDIT = 101003;
export const RIGHT_FAMILY_DELETE = 101004;
export const RIGHT_INSUREE = 101101; //101100 in doc ... but in practice...
export const RIGHT_SEARCH = 101101;
export const RIGHT_INSUREE_ADD = 101102;
export const RIGHT_INSUREE_EDIT = 101103;
export const RIGHT_INSUREE_DELETE = 101104;
export const RIGHT_INSUREE_ENQUIRE = 101105;

export const DEFAULT = {
  SHOW_INSUREE_PROFILE: false,
  SHOW_INSUREE_SUMMARY_ADDRESS: false,
  IS_WORKER: false,
  RENDER_LAST_NAME_FIRST: true,
  GENERIC_VOUCHER_ENABLED: false,
};

export const WITHOUT_STR = "without";
