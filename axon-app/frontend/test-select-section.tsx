import React from "react";
import { Select, SelectItem, SelectSection } from "@heroui/react";

export function Test() {
  return (
    <Select label="Test">
      <SelectSection title="Recently Used">
        <SelectItem key="1">1</SelectItem>
      </SelectSection>
    </Select>
  );
}
