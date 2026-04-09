import type { GetTaskPreviewResponseDto, SectionType } from "@board/shared";
import type { MODAL_TYPE } from "../constants/modal.constant";

export type ModalType = (typeof MODAL_TYPE)[keyof typeof MODAL_TYPE];

export type ModalState =
  | { open: false }
  | { open: true; mode: typeof MODAL_TYPE.CREATE; defaultSection: SectionType }
  | { open: true; mode: typeof MODAL_TYPE.PREVIEW | typeof MODAL_TYPE.EDIT; task: GetTaskPreviewResponseDto };
