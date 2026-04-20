"use client";

import React from "react";
import { PageLayout } from "@/shared/ui/layout/PageLayout";
import { MetaAgentSettingsForm } from "@/modules/system/ui/MetaAgentSettingsForm";

const MetaAgentPage = () => {
    return (
        <PageLayout
            title="Meta Agent"
            description="Configure the Meta Agent prompts, behavior and reasoning capabilities."
            breadcrumbs={[]}
        >
            <MetaAgentSettingsForm />
        </PageLayout>
    );
};

export default MetaAgentPage;
