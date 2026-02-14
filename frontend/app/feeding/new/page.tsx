'use client';

import { FormPageFrame, FormRow } from "@/shared";
import { FeatureTheme } from "@/lib/theme";

export default function NewFeedingPage() {
    return (
        <FormPageFrame 
            title="Add Feeding" 
            themeColor={FeatureTheme.feeding.primary}
            onBack={() => {}}
            onSave={() => {}}
            saveLabel="Save"
            isSaving={false}
        >
        </FormPageFrame>
    );
}