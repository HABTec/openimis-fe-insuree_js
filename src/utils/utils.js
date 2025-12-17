import _ from "lodash";
import { INSUREE_ACTIVE_STRING } from "../constants";

export function insureeLabel(insuree) {
  if (!insuree) return "";
  return `${_.compact([insuree.otherNames ,insuree?.middleName, insuree.lastName]).join(" ")}${
    !!insuree.chfId ? ` (${insuree.chfId})` : ""
  }`;
}

export function familyLabel(family) {
  return !!family && !!family.headInsuree ? insureeLabel(family.headInsuree) : "";
}

export const isValidInsuree = (insuree, modulesManager) => {
  const isInsureeFirstServicePointRequired = modulesManager.getConf(
    "fe-insuree",
    "insureeForm.isInsureeFirstServicePointRequired",
    false,
  );

  const isInsureePhotoRequired = modulesManager.getConf(
    "fe-insuree",
    "insureeForm.isInsureePhotoRequired",
    false,
  );
  const isInsureeStatusRequired = modulesManager.getConf("fe-insuree", "insureeForm.isInsureeStatusRequired", false);
  if (isInsureeFirstServicePointRequired && !insuree.healthFacility) return false;
  if (insuree.validityTo) return false;
  if (insuree.family && !insuree.head && !insuree.relationship) return false;
  if (!insuree.lastName) return false;
  if (!insuree.middleName) return false;
  if (!insuree.otherNames) return false;
  if (!insuree.dob) return false;
  if (!insuree.gender || !insuree.gender?.code) return false;
  if (isInsureeStatusRequired && !insuree.status) return false;
  if (isInsureePhotoRequired && !insuree.photo) return false;

  return true;
};

export const formatLocationString = (family) => {
  const { location, address } = family;
  return [
    location?.parent?.parent?.parent?.name,
    location?.parent?.parent?.name,
    location?.parent?.name,
    location?.name,
    address,
  ]
    .filter(Boolean)
    .join(", ");
};
