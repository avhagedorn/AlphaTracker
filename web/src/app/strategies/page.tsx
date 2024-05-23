"use client";

import ContentWrapper from "@/components/ContentWrapper";
import React from "react";

export default function Account() {
  return (
    <ContentWrapper userIsAuthenticated>
      <h1 className="text-4xl font-bold mb-4">Strategies</h1>
    </ContentWrapper>
  );
}
