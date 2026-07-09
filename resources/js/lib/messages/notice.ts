/**
 * Centralized toast messages for Notice-related operations
 */
export const NoticeMessages = {
    // Success messages
    CREATED: "Notice added successfully",
    UPDATED: "Notice updated successfully",
    DELETED: "Notice deleted successfully",
    STATUS_UPDATED: "Notice status updated",

    // Error messages
    CREATE_FAILED: "Failed to add notice",
    UPDATE_FAILED: "Failed to update notice",
    DELETE_FAILED: "Failed to delete notice",
    STATUS_UPDATE_FAILED: "Failed to update notice status",
} as const;
