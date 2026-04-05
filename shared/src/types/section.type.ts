import { SECTION_TYPE } from "../constants/section.constant";

export type SectionType = (typeof SECTION_TYPE)[keyof typeof SECTION_TYPE];
